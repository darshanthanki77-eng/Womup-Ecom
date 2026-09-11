import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

dotenv.config();

async function checkSavedUsers() {
  console.log("===============================================================");
  console.log("   LIVE MONGODB ATLAS DATABASE INSPECTION (Users Collection)   ");
  console.log("===============================================================");

  try {
    await connectDB();
    console.log("✔ Connected to MongoDB Atlas successfully.\n");

    const totalUsers = await User.countDocuments();
    console.log(`📊 Total Registered Users in Database: ${totalUsers}\n`);

    const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    console.log("📋 5 Most Recently Created Users in Database:");
    console.log("---------------------------------------------------------------");
    latestUsers.forEach((u, i) => {
      console.log(`[#${i + 1}] Name:          ${u.name}`);
      console.log(`     Email:         ${u.email || "N/A"}`);
      console.log(`     Referral Code: ${u.referralCode}`);
      console.log(`     Sponsor:       ${u.referredBy}`);
      console.log(`     Wallet:        ${u.walletAddress}`);
      console.log(`     Status:        ${u.status} | KYC: ${u.kycStatus}`);
      console.log(`     Created At:    ${u.createdAt || u.registeredDate}`);
      console.log("---------------------------------------------------------------");
    });

    console.log("\n✔ All records above are physically stored in MongoDB Atlas.");
    console.log("===============================================================");
    process.exit(0);
  } catch (err) {
    console.error("❌ Database inspection failed:", err);
    process.exit(1);
  }
}

checkSavedUsers();
