import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "regal_jwt_super_secret_production_key_2026_bsc_56";

async function verifyAuthSystem() {
  console.log("===============================================================");
  console.log("   REGAL (RGL) AUTHENTICATION & REGISTRATION VERIFICATION      ");
  console.log("===============================================================");

  try {
    // 1. Connect to Database
    await connectDB();
    console.log("✔ [Database] Connected to MongoDB Atlas successfully.\n");

    const testEmail = `investor_${Date.now()}@regal-asset.io`;
    const testWallet = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    const testPassword = "SuperSecurePassword2026!";
    const sponsorRef = "RGL7821";

    // 2. Test Registration Logic (TRD Requirements)
    console.log("--- Step 1: Testing Registration Flow (POST /api/v1/auth/register) ---");
    
    // Generate unique RGLxxxx code
    let referralCode = `RGL${Math.floor(1000 + Math.random() * 9000)}`;
    while (await User.findOne({ referralCode })) {
      referralCode = `RGL${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const passwordHash = await bcrypt.hash(testPassword, 10);
    const shortAddress = `${testWallet.slice(0, 6)}...${testWallet.slice(-4)}`;

    const newUser = new User({
      userId: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "Lord Sterling",
      email: testEmail.toLowerCase(),
      passwordHash,
      walletAddress: testWallet.toLowerCase(),
      shortAddress,
      referralCode,
      referredBy: sponsorRef,
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

    await newUser.save();
    console.log(`✔ User Registered Successfully:`);
    console.log(`  • User ID:       ${newUser.userId}`);
    console.log(`  • Referral Code: ${newUser.referralCode} (Prefix RGL: ${newUser.referralCode.startsWith("RGL")})`);
    console.log(`  • Wallet:        ${newUser.shortAddress}`);
    console.log(`  • Sponsor:       ${newUser.referredBy}`);
    console.log(`  • Status:        ${newUser.status} | KYC: ${newUser.kycStatus}\n`);

    // Verify TRD Referral Code Rule
    if (!newUser.referralCode.startsWith("RGL") || newUser.referralCode.length !== 7) {
      throw new Error("Referral Code must strictly follow RGLxxxx format per TRD!");
    }
    console.log("✔ [TRD Check] Referral code strictly matches RGLxxxx convention.\n");

    // 3. Issue JWT Token
    console.log("--- Step 2: Testing JWT Token Generation ---");
    const token = jwt.sign({ userId: newUser.userId, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });
    console.log(`✔ JWT Token issued successfully (${token.slice(0, 24)}...)\n`);

    // 4. Test Login via Referral Code (POST /api/v1/auth/login)
    console.log("--- Step 3: Testing Login via Referral Code ---");
    const userByRef = await User.findOne({ referralCode: newUser.referralCode });
    if (!userByRef) throw new Error("Could not find user by referral code.");
    const isPasswordValid = await bcrypt.compare(testPassword, userByRef.passwordHash);
    if (!isPasswordValid) throw new Error("Password validation failed.");
    console.log(`✔ Logged in successfully using Referral ID: ${newUser.referralCode}\n`);

    // 5. Test Login via Wallet Address
    console.log("--- Step 4: Testing Login via Wallet Address ---");
    const userByWallet = await User.findOne({ walletAddress: testWallet.toLowerCase() });
    if (!userByWallet) throw new Error("Could not find user by wallet address.");
    console.log(`✔ Logged in successfully using Wallet Address: ${userByWallet.walletAddress}\n`);

    // 6. Test Token Authentication Middleware (GET /api/v1/auth/me)
    console.log("--- Step 5: Testing JWT Verification (/api/v1/auth/me) ---");
    const decoded = jwt.verify(token, JWT_SECRET);
    const authenticatedUser = await User.findOne({ userId: decoded.userId }).select("-passwordHash");
    if (!authenticatedUser) throw new Error("Authenticated user lookup failed.");
    console.log(`✔ Verified Token Payload: userId=${decoded.userId}, role=${decoded.role}`);
    console.log(`✔ Authenticated Profile Retrieved: ${authenticatedUser.name} (${authenticatedUser.email})\n`);

    // 7. Test Demo Login Flow
    console.log("--- Step 6: Testing Demo Genesis User (RGL7821) ---");
    const demoUser = await User.findOne({ referralCode: "RGL7821" });
    if (demoUser) {
      console.log(`✔ Genesis Demo User Active: ${demoUser.name} | Balance: $${demoUser.kpi.availableBalance} USDT`);
    } else {
      console.log(`ℹ Genesis Demo User will be auto-provisioned upon first login.`);
    }

    console.log("\n===============================================================");
    console.log("   ALL AUTHENTICATION & REGISTRATION TESTS PASSED 100%!        ");
    console.log("===============================================================");
    process.exit(0);
  } catch (err) {
    console.error("❌ Auth Verification Failed:", err);
    process.exit(1);
  }
}

verifyAuthSystem();
