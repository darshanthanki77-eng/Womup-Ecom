import express from "express";
import { authenticateAdmin } from "../middleware/adminAuth.js";
import { Package } from "../models/Package.js";
import { auditService } from "../services/auditService.js";

const router = express.Router();

// GET /api/v1/packages
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find().sort({ minAmount: 1 });
    res.json({ success: true, count: packages.length, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/packages/:id
router.get("/:id", async (req, res) => {
  try {
    const pkg = await Package.findOne({
      $or: [{ packageId: req.params.id }, { _id: req.params.id }]
    });
    if (!pkg) return res.status(404).json({ success: false, error: "Package not found" });
    res.json({ success: true, data: pkg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/packages/:id (Admin only)
router.patch("/:id", authenticateAdmin, async (req, res) => {
  try {
    const pkg = await Package.findOne({
      $or: [{ packageId: req.params.id }, { _id: req.params.id }]
    });
    if (!pkg) return res.status(404).json({ success: false, error: "Package not found" });

    const oldValues = `Min: $${pkg.minAmount}, Max: $${pkg.maxAmount}, Ref: ${pkg.referralPercent}%`;

    if (req.body.minAmount !== undefined) pkg.minAmount = req.body.minAmount;
    if (req.body.maxAmount !== undefined) pkg.maxAmount = req.body.maxAmount;
    if (req.body.referralPercent !== undefined) pkg.referralPercent = req.body.referralPercent;
    if (req.body.status !== undefined) pkg.status = req.body.status;
    pkg.version = (pkg.version || 1) + 1;

    await pkg.save();

    const newValues = `Min: $${pkg.minAmount}, Max: $${pkg.maxAmount}, Ref: ${pkg.referralPercent}%`;
    await auditService.logAction({
      admin: req.admin?.email || "admin@regal.io",
      action: "Updated Package Limits",
      module: "Packages",
      oldValue: oldValues,
      newValue: newValues,
      result: "SUCCESS"
    });

    res.json({ success: true, message: `Package ${pkg.name} updated successfully`, data: pkg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
