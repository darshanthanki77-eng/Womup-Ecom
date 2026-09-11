import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { authenticateToken } from "../middleware/auth.js";
import { RoiLedger } from "../models/RoiLedger.js";
import { auditService } from "../services/auditService.js";
import { roiEngine } from "../services/roiEngine.js";

const router = express.Router();

// GET /api/v1/roi/history
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.user.userId };
    if (status && status !== "All") {
      query.status = status;
    }

    const records = await RoiLedger.find(query).sort({ businessDate: -1, createdAt: -1 });
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/roi/all (Admin)
router.get("/all", authenticateAdmin, async (req, res) => {
  try {
    const records = await RoiLedger.find().sort({ businessDate: -1, createdAt: -1 });
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/roi/run (Admin trigger)
router.post("/run", authenticateAdmin, async (req, res) => {
  try {
    const { targetDate } = req.body;
    const results = await roiEngine.executeDailyRoiRun(targetDate);

    await auditService.logAction({
      admin: req.admin?.email || "admin@regal.io",
      action: "Daily ROI Calculation Run",
      module: "ROI Engine",
      oldValue: "Prior Ledger",
      newValue: `${results.processed} Contracts Credited (+$${results.totalCreditedUsdt} USDT)`,
      result: "SUCCESS"
    });

    res.json({
      success: true,
      message: `Daily ROI calculation executed. ${results.processed} contracts credited.`,
      data: results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
