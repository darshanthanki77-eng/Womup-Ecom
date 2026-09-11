import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { AuditLog } from "../models/AuditLog.js";
import { Investment } from "../models/Investment.js";
import { Referral } from "../models/Referral.js";
import { RoiLedger } from "../models/RoiLedger.js";
import { SystemSetting } from "../models/SystemSetting.js";
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";
import { Withdrawal } from "../models/Withdrawal.js";
import { auditService } from "../services/auditService.js";

const router = express.Router();

// GET /api/v1/admin/dashboard
router.get("/dashboard", authenticateAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "Active" });
    const totalInvestments = await Investment.countDocuments();
    const activeInvestments = await Investment.countDocuments({ status: "Active" });

    const allInvestments = await Investment.find();
    const totalInvested = allInvestments.reduce((sum, inv) => sum + inv.amount, 0);

    const allRoi = await RoiLedger.find();
    const roiAccrued = allRoi.reduce((sum, r) => sum + r.accruedAmount, 0);

    const allReferrals = await Referral.find();
    const referralCommissions = allReferrals.reduce((sum, r) => sum + r.commission, 0);

    const pendingWithdrawalsDocs = await Withdrawal.find({ status: "Pending" });
    const pendingWithdrawals = pendingWithdrawalsDocs.reduce((sum, w) => sum + w.amount, 0);

    const completedWithdrawalsDocs = await Withdrawal.find({ status: "Completed" });
    const completedWithdrawals = completedWithdrawalsDocs.reduce((sum, w) => sum + w.amount, 0);

    const maturedDocs = await Investment.find({ principalStatus: { $in: ["Eligible", "Returned"] } });
    const principalReturned = maturedDocs.reduce((sum, inv) => sum + inv.amount, 0);

    // Package Tier Distribution
    const silverCount = allInvestments.filter((inv) => inv.amount >= 100 && inv.amount < 1000).length;
    const goldCount = allInvestments.filter((inv) => inv.amount >= 1000 && inv.amount < 3000).length;
    const blackCount = allInvestments.filter((inv) => inv.amount >= 3000).length;

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalInvestments,
        activeInvestments,
        totalInvested,
        roiAccrued: Number(roiAccrued.toFixed(2)),
        referralCommissions: Number(referralCommissions.toFixed(2)),
        pendingWithdrawals: Number(pendingWithdrawals.toFixed(2)),
        completedWithdrawals: Number(completedWithdrawals.toFixed(2)),
        principalReturned,
        packageDistribution: { silver: silverCount, gold: goldCount, black: blackCount }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/admin/users
router.get("/users", authenticateAdmin, async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (status && status !== "All") query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { referralCode: { $regex: search, $options: "i" } },
        { walletAddress: { $regex: search, $options: "i" } },
        { userId: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/admin/users/:id (User 360 Profile)
router.get("/users/:id", authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ userId: req.params.id }, { referralCode: req.params.id.toUpperCase() }, { _id: req.params.id }]
    });

    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const investments = await Investment.find({ userId: user.userId });
    const referrals = await Referral.find({ referrerId: user.referralCode });
    const transactions = await Transaction.find({ userId: user.userId });
    const withdrawals = await Withdrawal.find({ userId: user.userId });

    res.json({
      success: true,
      data: {
        user,
        investments,
        referrals,
        transactions,
        withdrawals
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/admin/users/:id/status
router.patch("/users/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findOne({
      $or: [{ userId: req.params.id }, { referralCode: req.params.id.toUpperCase() }]
    });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const oldStatus = user.status;
    user.status = status;
    await user.save();

    await auditService.logAction({
      admin: req.admin?.email || "admin@regal.io",
      action: "Updated User Status",
      user: user.userId,
      module: "Users",
      oldValue: oldStatus,
      newValue: status,
      result: "SUCCESS"
    });

    res.json({ success: true, message: `User status changed to ${status}`, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/admin/audit-logs
router.get("/audit-logs", authenticateAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/admin/settings
router.get("/settings", authenticateAdmin, async (req, res) => {
  try {
    const settings = await SystemSetting.find();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/admin/settings
router.patch("/settings", authenticateAdmin, async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await SystemSetting.findOneAndUpdate(
      { key },
      { value, updatedBy: req.admin?.email || "SUPER_ADMIN" },
      { upsert: true, new: true }
    );

    await auditService.logAction({
      admin: req.admin?.email || "admin@regal.io",
      action: "Updated System Settings",
      module: "Settings",
      oldValue: key,
      newValue: JSON.stringify(value),
      result: "SUCCESS"
    });

    res.json({ success: true, message: `Setting "${key}" updated successfully`, data: setting });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
