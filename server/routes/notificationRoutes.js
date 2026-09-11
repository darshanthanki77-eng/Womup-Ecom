import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { authenticateToken } from "../middleware/auth.js";
import { Notification } from "../models/Notification.js";

const router = express.Router();

// GET /api/v1/notifications/my
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ userId: req.user.userId }, { isBroadcast: true }]
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/notifications/:id/read
router.post("/:id/read", authenticateToken, async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { notificationId: req.params.id },
      { read: true },
      { new: true }
    );
    res.json({ success: true, data: notif });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/notifications/read-all
router.post("/read-all", authenticateToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { $or: [{ userId: req.user.userId }, { isBroadcast: true }] },
      { read: true }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/notifications/broadcast (Admin)
router.post("/broadcast", authenticateAdmin, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const notif = new Notification({
      notificationId: `NOTIF-BCAST-${Date.now()}`,
      isBroadcast: true,
      type: type || "System Announcement",
      title: title || "Important System Announcement",
      message: message || "Protocol maintenance scheduled."
    });
    await notif.save();

    res.status(201).json({ success: true, message: "Broadcast dispatched to all users", data: notif });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/notifications/broadcasts (Admin)
router.get("/broadcasts", authenticateAdmin, async (req, res) => {
  try {
    const broadcasts = await Notification.find({ isBroadcast: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: broadcasts.length, data: broadcasts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
