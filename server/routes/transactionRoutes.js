import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { authenticateToken } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";

const router = express.Router();

// GET /api/v1/transactions/my
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;
    const query = { userId: req.user.userId };
    if (type && type !== "All") {
      query.type = type;
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/transactions/all (Admin)
router.get("/all", authenticateAdmin, async (req, res) => {
  try {
    const { type, search } = req.query;
    const query = {};
    if (type && type !== "All") query.type = type;
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: "i" } },
        { walletAddress: { $regex: search, $options: "i" } },
        { txHash: { $regex: search, $options: "i" } }
      ];
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
