import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { authenticateToken } from "../middleware/auth.js";
import { SupportTicket } from "../models/SupportTicket.js";

const router = express.Router();

// GET /api/v1/support/tickets
router.get("/tickets", authenticateToken, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/support/tickets
router.post("/tickets", authenticateToken, async (req, res) => {
  try {
    const { category, subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, error: "Subject and message are required" });
    }

    const ticket = new SupportTicket({
      ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: req.user.userId,
      name: req.user.name,
      email: req.user.email || "investor@regal.io",
      category: category || "General",
      subject,
      status: "OPEN",
      messages: [
        {
          sender: "User",
          text: message,
          time: new Date().toISOString().replace("T", " ").slice(0, 16)
        }
      ],
      created: new Date().toISOString().slice(0, 10),
      lastUpdate: "Just now"
    });

    await ticket.save();
    res.status(201).json({ success: true, message: "Support ticket created successfully", data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/support/tickets/:id/reply
router.post("/tickets/:id/reply", authenticateToken, async (req, res) => {
  try {
    const { text, sender } = req.body;
    if (!text) return res.status(400).json({ success: false, error: "Message text required" });

    const ticket = await SupportTicket.findOne({ ticketId: req.params.id });
    if (!ticket) return res.status(404).json({ success: false, error: "Ticket not found" });

    ticket.messages.push({
      sender: sender || (req.user.role === "ADMIN" ? "Concierge" : "User"),
      text,
      time: new Date().toISOString().replace("T", " ").slice(0, 16)
    });
    ticket.lastUpdate = "Just now";
    await ticket.save();

    res.json({ success: true, message: "Reply sent", data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/support/admin/all (Admin)
router.get("/admin/all", authenticateAdmin, async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
