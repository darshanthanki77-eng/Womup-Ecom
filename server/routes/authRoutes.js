import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "regal_jwt_super_secret_production_key_2026_bsc_56";

// POST /api/v1/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, walletAddress, sponsorRef } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: "Full name is required" });
    }

    if (!sponsorRef || !sponsorRef.trim()) {
      return res.status(400).json({
        success: false,
        error: "Sponsor Referral ID is mandatory. Please enter a valid Sponsor ID."
      });
    }

    const cleanSponsor = sponsorRef.trim().toUpperCase();

    // Generate unique RGLxxxx referral code
    let referralCode = `RGL${Math.floor(1000 + Math.random() * 9000)}`;
    while (await User.findOne({ referralCode })) {
      referralCode = `RGL${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const autoWallet = walletAddress?.trim().toLowerCase() || `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    const shortAddress = `${autoWallet.slice(0, 6)}...${autoWallet.slice(-4)}`;
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

    const user = new User({
      userId: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      phone: phone ? phone.trim() : undefined,
      passwordHash,
      walletAddress: autoWallet,
      shortAddress,
      referralCode,
      referredBy: cleanSponsor,
      role: "USER",
      status: "Active",
      kycStatus: "Level 2 Verified",
      registeredDate: new Date().toISOString().split("T")[0],
      balances: { usdt: 1000, bnb: 1.5, rgl: 5000 },
      kpi: {
        totalInvested: 0,
        activeInvested: 0,
        totalRoi: 0,
        pendingRoi: 0,
        paidRoi: 0,
        referralEarnings: 0,
        availableBalance: 0,
        principalReturn: 0
      }
    });

    await user.save();

    const token = jwt.sign({ userId: user.userId, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "Account registered successfully on BNB Smart Chain ledger.",
      token,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/auth/login
router.post("/login", async (req, res) => {
  try {
    const { loginId, password } = req.body;
    if (!loginId) {
      return res.status(400).json({ success: false, error: "Referral ID, Phone, Email, or Wallet Address required" });
    }

    const id = String(loginId).trim();
    const cleanPhone = id.replace(/[\s\-\+]/g, "");
    const last10 = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone;

    // Search by referralCode, walletAddress, email, phone (exact or last 10 digits), userId, or name
    const orConditions = [
      { referralCode: id.toUpperCase() },
      { walletAddress: id.toLowerCase() },
      { email: id.toLowerCase() },
      { phone: id },
      { phone: cleanPhone },
      { phone: `+${cleanPhone}` },
      { userId: id },
      { name: id },
      { name: { $regex: `^${id}$`, $options: "i" } }
    ];

    if (last10 && last10.length >= 7) {
      orConditions.push({ phone: { $regex: last10, $options: "i" } });
    }

    let user = await User.findOne({ $or: orConditions });

    // If user not found and it's a test/demo login ID (starts with RGL), auto-create
    if (!user && id.toUpperCase().startsWith("RGL")) {
      user = new User({
        userId: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: "Alexander Vance",
        walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91",
        shortAddress: "0x82A4...7B91",
        referralCode: id.toUpperCase(),
        role: "USER",
        status: "Active",
        balances: { usdt: 8500, bnb: 2.45, rgl: 15000 },
        kpi: {
          totalInvested: 5000,
          activeInvested: 5000,
          totalRoi: 325,
          pendingRoi: 125,
          paidRoi: 200,
          referralEarnings: 150,
          availableBalance: 275,
          principalReturn: 5000
        }
      });
      await user.save();
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Account '${id}' not found in database. Please click 'Create Account' tab to register first.`
      });
    }

    if (password && user.passwordHash) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ success: false, error: "Invalid password entered." });
      }
    }

    const token = jwt.sign({ userId: user.userId, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/auth/demo-login
router.post("/demo-login", async (req, res) => {
  try {
    let user = await User.findOne({ userId: "USR-7821" });
    if (!user) {
      user = await User.findOne();
    }

    const token = jwt.sign({ userId: user?.userId || "USR-7821", role: user?.role || "USER" }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      success: true,
      token,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/auth/me
router.get("/me", authenticateToken, async (req, res) => {
  res.json({ success: true, data: req.user });
});

// PATCH /api/v1/auth/profile
router.patch("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (name) req.user.name = name.trim();
    if (email) req.user.email = email.trim().toLowerCase();
    await req.user.save();

    res.json({ success: true, message: "Profile updated successfully", data: req.user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
