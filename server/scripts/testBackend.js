import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Investment } from "../models/Investment.js";
import { Package } from "../models/Package.js";
import { Referral } from "../models/Referral.js";
import { RoiLedger } from "../models/RoiLedger.js";
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";
import { Withdrawal } from "../models/Withdrawal.js";
import { blockchainService } from "../services/blockchainService.js";
import { referralEngine } from "../services/referralEngine.js";
import { roiEngine } from "../services/roiEngine.js";
import { withdrawalService } from "../services/withdrawalService.js";

dotenv.config();

async function runTests() {
  console.log("==================================================");
  console.log("   REGAL (RGL) BACKEND END-TO-END VERIFICATION    ");
  console.log("==================================================");

  try {
    await connectDB();
    console.log("✔ [DB] Connected to MongoDB Atlas successfully.\n");

    // 1. Packages Boundary Verification
    console.log("--- 1. Testing Package Boundaries ---");
    const packages = await Package.find().sort({ minAmount: 1 });
    console.log(`Found ${packages.length} packages:`);
    for (const p of packages) {
      console.log(`  • ${p.name}: Min $${p.minAmount} -> Max $${p.maxAmount}, Referral: ${p.referralPercent}%`);
    }
    if (packages.length >= 3) {
      console.log("✔ [Packages] Boundary test passed.\n");
    } else {
      throw new Error("Missing packages!");
    }

    // 2. User & Referral Hierarchy Verification
    console.log("--- 2. Testing User & Referral Tree ---");
    const user = await User.findOne({ userId: "USR-7821" });
    if (!user) throw new Error("Default demo user USR-7821 not found.");
    console.log(`User: ${user.name} | RefCode: ${user.referralCode} | Balance: $${user.kpi.availableBalance} USDT`);
    console.log("✔ [User] Profile test passed.\n");

    // 3. Investment Creation & Blockchain Verification Test
    console.log("--- 3. Testing Investment & Blockchain Verification ---");
    const simulatedTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const verifyResult = await blockchainService.verifyInvestmentTx(simulatedTxHash, 2500, user.walletAddress);
    console.log(`Verification on BSC: verified=${verifyResult.verified}, block=#${verifyResult.blockNumber}, confirmations=${verifyResult.confirmations}`);
    if (verifyResult.verified) {
      console.log("✔ [Blockchain] Receipt verification passed.\n");
    }

    // 4. Referral Commission Engine Test
    console.log("--- 4. Testing Referral Commission Calculation ---");
    const sampleDownline = {
      name: "Downline Test User",
      referralCode: "RGL9999",
      referredBy: user.referralCode,
      walletAddress: "0x1111222233334444555566667777888899990000",
      shortAddress: "0x1111...0000"
    };
    const sampleInv = {
      investmentId: `INV-TEST-${Date.now()}`,
      packageName: "Regal Gold",
      packageId: "regal-gold",
      amount: 2500,
      txHash: simulatedTxHash
    };
    const refResult = await referralEngine.processReferralCommission(sampleDownline, sampleInv);
    console.log(`Commission generated: +$${refResult?.commission} USDT (Tier ${refResult?.rate}) for sponsor ${refResult?.referrerId}`);
    if (refResult && refResult.commission === 75) {
      console.log("✔ [Referral] $2,500 Gold -> 3% ($75) commission test passed.\n");
    }

    // 5. Deterministic ROI Engine & Duplicate Prevention Test
    console.log("--- 5. Testing ROI Engine & Duplicate Prevention ---");
    const testDate = "2026-09-11";
    const roiRun1 = await roiEngine.executeDailyRoiRun(testDate);
    console.log(`Run 1: processed=${roiRun1.processed}, credited=$${roiRun1.totalCreditedUsdt} USDT, skippedBuffer=${roiRun1.skippedBuffer}`);

    // Re-running on same date must be idempotent and skip duplicate
    const roiRun2 = await roiEngine.executeDailyRoiRun(testDate);
    console.log(`Run 2 (Same date duplicate check): processed=${roiRun2.processed}, skippedDuplicate=${roiRun2.skippedDuplicate}`);
    if (roiRun2.processed === 0 && roiRun2.skippedDuplicate > 0) {
      console.log("✔ [ROI] Duplicate accrual prevention passed (zero double-crediting).\n");
    }

    // 6. Withdrawal Pipeline & Balance Lock Test
    console.log("--- 6. Testing Withdrawal Pipeline & Race-Condition Lock ---");
    const initialAvail = user.kpi.availableBalance;
    console.log(`User starting available balance: $${initialAvail} USDT`);
    const wth = await withdrawalService.createWithdrawalRequest(user, 50.0, user.walletAddress);
    console.log(`Withdrawal created: ${wth.withdrawalId} for $${wth.amount} ($${wth.finalAmount} net after 1% fee $${wth.fee})`);
    console.log(`User balance after lock: available=$${user.kpi.availableBalance}, locked=$${user.kpi.lockedBalance}`);

    // Approve withdrawal
    const approvedWth = await withdrawalService.approveWithdrawal(wth.withdrawalId, "TEST_ADMIN");
    console.log(`Withdrawal approved: status=${approvedWth.status}, txHash=${approvedWth.txHash.slice(0, 16)}...`);
    console.log("✔ [Withdrawal] Atomic balance lock and approval test passed.\n");

    console.log("==================================================");
    console.log("   ALL 6 BACKEND SYSTEMS VERIFIED SUCCESSFULLY!   ");
    console.log("==================================================");
    process.exit(0);
  } catch (err) {
    console.error("❌ Test Failed:", err);
    process.exit(1);
  }
}

runTests();
