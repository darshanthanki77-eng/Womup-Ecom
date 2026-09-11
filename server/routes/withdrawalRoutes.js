import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { authenticateToken } from "../middleware/auth.js";
import { Withdrawal } from "../models/Withdrawal.js";
import { auditService } from "../services/auditService.js";
import { withdrawalService } from "../services/withdrawalService.js";

const router = express.Router();

// POST /api/v1/withdrawals/request
router.post("/request", authenticateToken, async (req, res) => {
  try {
    const { amount, destination } = req.body;
    const user = req.user;

    const record = await withdrawalService.createWithdrawalRequest(
      user,
      amount,
      destination
    );

    res.status(201).json({
      success: true,
      message: `Withdrawal request for $${record.amount.toFixed(2)} USDT submitted successfully.`,
      data: record
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/v1/withdrawals/my
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: withdrawals.length, data: withdrawals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/withdrawals/all (Admin)
router.get("/all", authenticateAdmin, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find().sort({ createdAt: -1 });
    res.json({ success: true, count: withdrawals.length, data: withdrawals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/withdrawals/:id/approve (Admin)
router.post("/:id/approve", authenticateAdmin, async (req, res) => {
  try {
    const withdrawal = await withdrawalService.approveWithdrawal(
      req.params.id,
      req.admin?.email || "SUPER_ADMIN"
    );

    await auditService.logAction({
      admin: req.admin?.email || "finance@regal.io",
      action: "Approved Withdrawal",
      module: "Withdrawals",
      oldValue: `Pending ($${withdrawal.amount})`,
      newValue: `Approved & Broadcasted (${withdrawal.txHash.slice(0, 12)}...)`,
      result: "SUCCESS"
    });

    res.json({
      success: true,
      message: `Withdrawal ${withdrawal.withdrawalId} approved & broadcasted on BNB Smart Chain.`,
      data: withdrawal
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/v1/withdrawals/:id/reject (Admin)
router.post("/:id/reject", authenticateAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const withdrawal = await withdrawalService.rejectWithdrawal(
      req.params.id,
      reason,
      req.admin?.email || "SUPER_ADMIN"
    );

    await auditService.logAction({
      admin: req.admin?.email || "finance@regal.io",
      action: "Rejected Withdrawal",
      module: "Withdrawals",
      oldValue: `Pending ($${withdrawal.amount})`,
      newValue: `Rejected (${reason || "Compliance check failed"})`,
      result: "SUCCESS"
    });

    res.json({
      success: true,
      message: `Withdrawal ${withdrawal.withdrawalId} rejected and funds refunded to user available balance.`,
      data: withdrawal
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
