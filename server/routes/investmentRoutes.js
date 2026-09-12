import express from "express";
import { BLOCKCHAIN_CONFIG } from "../config/blockchain.js";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { authenticateToken } from "../middleware/auth.js";
import { Investment } from "../models/Investment.js";
import { Notification } from "../models/Notification.js";
import { Package } from "../models/Package.js";
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";
import { blockchainService } from "../services/blockchainService.js";
import { referralEngine } from "../services/referralEngine.js";

const router = express.Router();

// Store active prepared investment requests in memory (with automatic expiration)
const activeInvestmentRequests = new Map();

// POST /api/v1/investments/prepare
// Validates parameters and issues an authorized investment request token
router.post("/prepare", async (req, res) => {
  try {
    const { packageId, amount, walletAddress, asset } = req.body;
    const cleanId = (packageId || "").toLowerCase().replace(/^regal-/, "");
    const pkg = await Package.findOne({
      $or: [
        { packageId },
        { packageId: `regal-${cleanId}` },
        { packageId: cleanId },
        { name: new RegExp(cleanId, "i") }
      ]
    });

    if (!pkg) {
      return res.status(404).json({ success: false, error: "Investment package not found." });
    }

    if (pkg.status && pkg.status.toLowerCase() !== "active") {
      return res.status(400).json({ success: false, error: "This package is currently inactive." });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < pkg.minAmount || (pkg.maxAmount < 1000000 && numAmount > pkg.maxAmount)) {
      return res.status(400).json({
        success: false,
        error: `Amount must be between $${pkg.minAmount.toLocaleString()} and $${pkg.maxAmount.toLocaleString()} USDT.`
      });
    }

    const investmentAsset = (asset || BLOCKCHAIN_CONFIG.INVESTMENT.PRIMARY_ASSET).toUpperCase();
    const assetContract =
      investmentAsset === "RGL"
        ? BLOCKCHAIN_CONFIG.CONTRACTS.RGL
        : investmentAsset === "USDT"
        ? BLOCKCHAIN_CONFIG.CONTRACTS.USDT
        : "NATIVE_BNB";

    const investmentRequestId = `REQ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + BLOCKCHAIN_CONFIG.INVESTMENT.REQUEST_EXPIRY_MINUTES * 60 * 1000);

    activeInvestmentRequests.set(investmentRequestId, {
      packageId: pkg.packageId,
      packageName: pkg.name,
      amount: numAmount,
      asset: investmentAsset,
      walletAddress: walletAddress ? walletAddress.toLowerCase() : null,
      expiresAt
    });

    // Cleanup expired entries
    if (activeInvestmentRequests.size > 1000) {
      const now = Date.now();
      for (const [k, v] of activeInvestmentRequests.entries()) {
        if (v.expiresAt.getTime() < now) activeInvestmentRequests.delete(k);
      }
    }

    res.json({
      success: true,
      data: {
        investmentRequestId,
        package: pkg,
        amount: numAmount,
        asset: investmentAsset,
        assetContract,
        treasuryAddress: BLOCKCHAIN_CONFIG.CONTRACTS.TREASURY,
        chainId: BLOCKCHAIN_CONFIG.NETWORK.CHAIN_ID,
        network: BLOCKCHAIN_CONFIG.NETWORK.NAME,
        expiresAt: expiresAt.toISOString(),
        estimatedGas: "0.00045 BNB"
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/investments/verify & /submit
// Authenticated submission with cryptographic BSC verification and anti-replay protection
router.post(["/verify", "/submit"], authenticateToken, async (req, res) => {
  try {
    const { packageId, amount, txHash, walletAddress, investmentRequestId, asset } = req.body;
    const user = req.user;

    if (!txHash || !txHash.startsWith("0x")) {
      return res.status(400).json({
        success: false,
        error: "Valid blockchain transaction hash (0x...) is required."
      });
    }

    const cleanTxHash = txHash.trim();

    // 1. Anti-Replay Protection: Ensure txHash has never been registered
    const existingInvestment = await Investment.findOne({ txHash: cleanTxHash });
    if (existingInvestment) {
      return res.status(409).json({
        success: false,
        error: `Anti-replay reject: Transaction ${cleanTxHash} has already been registered for investment ${existingInvestment.investmentId}.`
      });
    }

    const existingTx = await Transaction.findOne({ txHash: cleanTxHash });
    if (existingTx && existingTx.type === "Investment Deposit") {
      return res.status(409).json({
        success: false,
        error: `Anti-replay reject: Transaction ${cleanTxHash} was already processed.`
      });
    }

    // 2. Validate package
    const pkg = (await Package.findOne({ packageId })) || (await Package.findOne({ packageId: "regal-gold" }));
    if (!pkg) {
      return res.status(400).json({ success: false, error: "Invalid investment package specified." });
    }

    const numericAmount = parseFloat(amount) || pkg.minAmount;
    if (numericAmount < pkg.minAmount) {
      return res.status(400).json({
        success: false,
        error: `Minimum investment for ${pkg.name} is $${pkg.minAmount.toLocaleString()} USDT.`
      });
    }

    const investmentAsset = (asset || BLOCKCHAIN_CONFIG.INVESTMENT.PRIMARY_ASSET).toUpperCase();

    // 3. Cryptographic BSC Blockchain Verification
    const verifiedTx = await blockchainService.verifyInvestmentTx(
      cleanTxHash,
      numericAmount,
      user.walletAddress || walletAddress,
      investmentAsset
    );

    if (!verifiedTx || !verifiedTx.verified) {
      return res.status(400).json({
        success: false,
        status: verifiedTx?.status || "VERIFICATION_FAILED",
        error: verifiedTx?.message || "Transaction could not be verified on BNB Smart Chain."
      });
    }

    // 4. Calculate Cycle Timelines (60-day Buffer, Phase 1, Phase 2, Maturity)
    const now = new Date();
    const waitingEndDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const phase1EndDate = new Date(now.getTime() + 150 * 24 * 60 * 60 * 1000);
    const cycleEndDate = new Date(now.getTime() + 240 * 24 * 60 * 60 * 1000);

    // 5. Create authoritative Investment Record
    const investment = new Investment({
      investmentId: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user.userId,
      walletAddress: user.walletAddress || verifiedTx.from,
      packageId: pkg.packageId,
      packageName: pkg.name,
      amount: numericAmount,
      asset: investmentAsset,
      network: BLOCKCHAIN_CONFIG.NETWORK.NAME,
      txHash: verifiedTx.txHash,
      blockNumber: verifiedTx.blockNumber,
      startDate: now,
      waitingEndDate,
      phase1EndDate,
      cycleEndDate,
      cycleDay: 1,
      totalCycleDays: 240,
      currentPhase: "Day 1–60",
      currentRoiRate: "0.00%",
      todayRoi: 0,
      accruedRoi: 0,
      paidRoi: 0,
      referralTier: `${pkg.referralPercent}%`,
      principalStatus: "Locked",
      status: "Active"
    });

    await investment.save();

    // 6. Update User Financial KPIs
    user.kpi.totalInvested = Number((user.kpi.totalInvested + numericAmount).toFixed(2));
    user.kpi.activeInvested = Number((user.kpi.activeInvested + numericAmount).toFixed(2));
    await user.save();

    // 7. Record in Master Financial Ledger
    const tx = new Transaction({
      transactionId: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user.userId,
      walletAddress: user.walletAddress || verifiedTx.from,
      type: "Investment Deposit",
      amount: `$${numericAmount.toLocaleString()}.00`,
      numericAmount,
      asset: investmentAsset,
      txHash: verifiedTx.txHash,
      blockNumber: verifiedTx.blockNumber,
      date: now.toISOString().replace("T", " ").slice(0, 16),
      status: "Confirmed"
    });
    await tx.save();

    // 8. User Notification
    const notif = new Notification({
      notificationId: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.userId,
      type: "Investment Confirmed",
      title: "Investment Verified on BNB Smart Chain",
      message: `Your $${numericAmount.toLocaleString()} ${investmentAsset} deposit for ${pkg.name} (${investment.investmentId}) verified at block #${verifiedTx.blockNumber}.`,
      referenceId: investment.investmentId
    });
    await notif.save();

    // 9. Process Downline Referral Commission for Sponsor
    await referralEngine.processReferralCommission(user, investment);

    res.status(201).json({
      success: true,
      message: "Investment verified on BNB Smart Chain and activated successfully.",
      data: investment
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/investments/my
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: investments.length, data: investments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/investments/all (Admin)
router.get("/all", authenticateAdmin, async (req, res) => {
  try {
    const investments = await Investment.find().sort({ createdAt: -1 });
    res.json({ success: true, count: investments.length, data: investments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/investments/:id/status
router.get("/:id/status", async (req, res) => {
  try {
    const inv = await Investment.findOne({
      $or: [{ investmentId: req.params.id }, { _id: req.params.id }, { txHash: req.params.id }]
    });
    if (!inv) return res.status(404).json({ success: false, error: "Investment contract not found" });

    res.json({
      success: true,
      data: {
        investmentId: inv.investmentId,
        status: inv.status,
        txHash: inv.txHash,
        blockNumber: inv.blockNumber,
        currentPhase: inv.currentPhase,
        cycleDay: inv.cycleDay,
        totalCycleDays: inv.totalCycleDays,
        todayRoi: inv.todayRoi,
        accruedRoi: inv.accruedRoi
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/investments/:id
router.get("/:id", async (req, res) => {
  try {
    const inv = await Investment.findOne({
      $or: [{ investmentId: req.params.id }, { _id: req.params.id }]
    });
    if (!inv) return res.status(404).json({ success: false, error: "Investment contract not found" });
    res.json({ success: true, data: inv });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
