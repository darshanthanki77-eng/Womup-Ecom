import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { authenticateToken } from "../middleware/auth.js";
import { Referral } from "../models/Referral.js";

const router = express.Router();

// GET /api/v1/referrals/my
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const referrals = await Referral.find({
      referrerId: user.referralCode
    }).sort({ createdAt: -1 });

    const totalCommissions = referrals.reduce((sum, r) => sum + r.commission, 0);

    res.json({
      success: true,
      referralCode: user.referralCode,
      referralUrl: `https://regal-asset.io/?ref=${user.referralCode}`,
      totalReferrals: referrals.length,
      totalCommissions: Number(totalCommissions.toFixed(2)),
      data: referrals
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/referrals/all (Admin)
router.get("/all", authenticateAdmin, async (req, res) => {
  try {
    const referrals = await Referral.find().sort({ createdAt: -1 });
    const totalCommissions = referrals.reduce((sum, r) => sum + r.commission, 0);

    res.json({
      success: true,
      count: referrals.length,
      totalCommissions: Number(totalCommissions.toFixed(2)),
      data: referrals
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
