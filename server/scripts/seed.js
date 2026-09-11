import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { SYSTEM_DEFAULTS } from "../config/constants.js";
import { connectDB } from "../config/db.js";
import {
    docsData,
    faqData,
    roadmapData
} from "../data/protocolData.js";
import { AuditLog } from "../models/AuditLog.js";
import { CmsContent } from "../models/CmsContent.js";
import { Investment } from "../models/Investment.js";
import { Notification } from "../models/Notification.js";
import { Package } from "../models/Package.js";
import { Referral } from "../models/Referral.js";
import { RoiLedger } from "../models/RoiLedger.js";
import { SupportTicket } from "../models/SupportTicket.js";
import { SystemSetting } from "../models/SystemSetting.js";
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";
import { Withdrawal } from "../models/Withdrawal.js";

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log("[Seed] Connecting to MongoDB...");
    await connectDB();

    console.log("[Seed] Checking existing packages...");
    const existingPkgs = await Package.countDocuments();
    if (existingPkgs === 0) {
      console.log("[Seed] Seeding investment packages...");
      await Package.insertMany(
        SYSTEM_DEFAULTS.PACKAGES.map(p => ({
          packageId: p.id,
          name: p.name,
          minAmount: p.minAmount,
          maxAmount: p.maxAmount,
          referralPercent: p.referralPercent,
          cycleDurationDays: p.cycleDurationDays,
          maturityDays: p.maturityDays,
          phase1Rate: p.phase1Rate,
          phase2Rate: p.phase2Rate,
          status: p.status
        }))
      );
    }

    console.log("[Seed] Checking existing users...");
    const existingUsers = await User.countDocuments();
    if (existingUsers === 0) {
      console.log("[Seed] Seeding initial users...");
      const hashedPassword = await bcrypt.hash("regal2026", 10);

      const usersToSeed = [
        {
          userId: "USR-000",
          name: "Super Admin",
          email: "admin@regal.io",
          passwordHash: hashedPassword,
          walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
          shortAddress: "0x1A2B...9A0B",
          referralCode: "RGL0000",
          role: "SUPER_ADMIN",
          status: "Active",
          registeredDate: "2026-01-01"
        },
        {
          userId: "USR-7821",
          name: "Alexander Vance",
          email: "alexander.vance@regal-asset.io",
          passwordHash: hashedPassword,
          walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91",
          shortAddress: "0x82A4...7B91",
          referralCode: "RGL7821",
          referredBy: "RGL9901",
          role: "USER",
          status: "Active",
          registeredDate: "2026-06-15",
          balances: { usdt: 8500, bnb: 2.45, rgl: 15000 },
          kpi: {
            totalInvested: 5000,
            activeInvested: 5000,
            totalRoi: 325,
            pendingRoi: 125,
            paidRoi: 200,
            referralEarnings: 150,
            availableBalance: 275,
            lockedBalance: 0,
            principalReturn: 5000
          }
        },
        {
          userId: "USR-002",
          name: "Elena Rostova",
          email: "elena@crypto.ch",
          passwordHash: hashedPassword,
          walletAddress: "0x33a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e27e4b",
          shortAddress: "0x33A8...7E4B",
          referralCode: "RGL3301",
          referredBy: "RGL7821",
          role: "USER",
          status: "Active",
          registeredDate: "2026-06-20",
          balances: { usdt: 12000, bnb: 3.5, rgl: 25000 },
          kpi: {
            totalInvested: 12000,
            activeInvested: 12000,
            totalRoi: 890,
            pendingRoi: 180,
            paidRoi: 710,
            referralEarnings: 420,
            availableBalance: 850,
            principalReturn: 12000
          }
        },
        {
          userId: "USR-003",
          name: "Viktor Petrov",
          email: "viktor@nordic.se",
          passwordHash: hashedPassword,
          walletAddress: "0x91f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d84c19",
          shortAddress: "0x91F2...4C19",
          referralCode: "RGL9102",
          referredBy: "RGL7821",
          role: "USER",
          status: "Active",
          registeredDate: "2026-07-02",
          balances: { usdt: 2000, bnb: 1.2, rgl: 5000 },
          kpi: {
            totalInvested: 2000,
            activeInvested: 2000,
            totalRoi: 140,
            pendingRoi: 40,
            paidRoi: 100,
            referralEarnings: 60,
            availableBalance: 120,
            principalReturn: 2000
          }
        }
      ];

      await User.insertMany(usersToSeed);
    }

    console.log("[Seed] Checking existing investments...");
    const existingInvs = await Investment.countDocuments();
    if (existingInvs === 0) {
      console.log("[Seed] Seeding initial investments...");
      const invs = [
        {
          investmentId: "INV-9021",
          userId: "USR-7821",
          walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91",
          packageId: "regal-gold",
          packageName: "Regal Gold",
          amount: 2500,
          asset: "USDT",
          network: "BNB Smart Chain",
          txHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
          blockNumber: 38942104,
          startDate: new Date("2026-06-15"),
          waitingEndDate: new Date("2026-08-14"),
          phase1EndDate: new Date("2026-11-12"),
          cycleEndDate: new Date("2027-02-15"),
          cycleDay: 96,
          totalCycleDays: 240,
          currentPhase: "Month 3–5",
          currentRoiRate: "0.15%",
          todayRoi: 3.75,
          accruedRoi: 135.00,
          paidRoi: 80.00,
          referralTier: "3.0%",
          principalStatus: "Locked",
          status: "Active"
        },
        {
          investmentId: "INV-8910",
          userId: "USR-7821",
          walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91",
          packageId: "regal-gold",
          packageName: "Regal Gold",
          amount: 2500,
          asset: "USDT",
          network: "BNB Smart Chain",
          txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
          blockNumber: 38992015,
          startDate: new Date("2026-07-01"),
          waitingEndDate: new Date("2026-08-30"),
          phase1EndDate: new Date("2026-11-28"),
          cycleEndDate: new Date("2027-03-01"),
          cycleDay: 80,
          totalCycleDays: 240,
          currentPhase: "Month 3–5",
          currentRoiRate: "0.15%",
          todayRoi: 3.75,
          accruedRoi: 75.00,
          paidRoi: 50.00,
          referralTier: "3.0%",
          principalStatus: "Locked",
          status: "Active"
        }
      ];
      await Investment.insertMany(invs);
    }

    console.log("[Seed] Checking existing referrals...");
    const existingRefs = await Referral.countDocuments();
    if (existingRefs === 0) {
      console.log("[Seed] Seeding initial referrals...");
      await Referral.insertMany([
        {
          referralId: "REF-01",
          referrerId: "RGL7821",
          referredId: "RGL9102",
          referredWallet: "0x91F2...4C19",
          referredUser: "Viktor Petrov",
          investmentId: "INV-7701",
          packageId: "regal-gold",
          packageName: "Regal Gold",
          investmentAmount: 2000,
          rate: "3.0%",
          commission: 60.00,
          status: "Paid",
          date: "2026-08-12"
        },
        {
          referralId: "REF-02",
          referrerId: "RGL7821",
          referredId: "RGL3301",
          referredWallet: "0x33A8...7E4B",
          referredUser: "Elena Rostova",
          investmentId: "INV-7702",
          packageId: "regal-black",
          packageName: "Regal Black",
          investmentAmount: 3000,
          rate: "5.0%",
          commission: 150.00,
          status: "Paid",
          date: "2026-08-20"
        }
      ]);
    }

    console.log("[Seed] Checking existing withdrawals...");
    const existingWiths = await Withdrawal.countDocuments();
    if (existingWiths === 0) {
      console.log("[Seed] Seeding initial withdrawals...");
      await Withdrawal.insertMany([
        {
          withdrawalId: "WTH-5501",
          userId: "USR-7821",
          walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91",
          amount: 200.00,
          asset: "USDT",
          fee: 2.00,
          finalAmount: 198.00,
          destination: "0x82A4...7B91",
          txHash: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
          status: "Completed",
          date: "2026-09-05"
        },
        {
          withdrawalId: "WTH-5502",
          userId: "USR-7821",
          walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91",
          amount: 75.00,
          asset: "USDT",
          fee: 1.50,
          finalAmount: 73.50,
          destination: "0x82A4...7B91",
          txHash: "Pending Blockchain Mining",
          status: "Pending",
          date: "2026-09-08"
        }
      ]);
    }

    console.log("[Seed] Checking existing transactions...");
    const existingTxs = await Transaction.countDocuments();
    if (existingTxs === 0) {
      console.log("[Seed] Seeding initial transactions...");
      await Transaction.insertMany([
        { transactionId: "TX-8912", userId: "USR-7821", walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91", type: "ROI Accrual", amount: "+$3.75", numericAmount: 3.75, asset: "USDT", date: "2026-09-10 10:14", status: "Confirmed", txHash: "0x7a8b9c...4f5a", blockNumber: 38942104 },
        { transactionId: "TX-8911", userId: "USR-7821", walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91", type: "Withdrawal", amount: "-$75.00", numericAmount: -75.0, asset: "USDT", date: "2026-09-08 14:22", status: "Pending", txHash: "0x6f5e4d...3b2a", blockNumber: 38931200 },
        { transactionId: "TX-8910", userId: "USR-7821", walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91", type: "Withdrawal", amount: "-$200.00", numericAmount: -200.0, asset: "USDT", date: "2026-09-05 09:18", status: "Confirmed", txHash: "0x9a8b7c...1e0f", blockNumber: 38914002 },
        { transactionId: "TX-8909", userId: "USR-7821", walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91", type: "Referral Commission", amount: "+$150.00", numericAmount: 150.0, asset: "USDT", date: "2026-08-20 18:30", status: "Confirmed", txHash: "0x4b3c2d...9a8b", blockNumber: 38851092 },
        { transactionId: "TX-8908", userId: "USR-7821", walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91", type: "Investment Deposit", amount: "$2,500.00", numericAmount: 2500.0, asset: "USDT", date: "2026-07-01 11:05", status: "Confirmed", txHash: "0x3c4d5e...2b3c", blockNumber: 38710920 },
        { transactionId: "TX-8907", userId: "USR-7821", walletAddress: "0x82a4f19c8d3e4b7c8d9e0f1a2b3c4d5e7b91", type: "Investment Deposit", amount: "$2,500.00", numericAmount: 2500.0, asset: "USDT", date: "2026-06-15 08:40", status: "Confirmed", txHash: "0x7a8b9c...6f7a", blockNumber: 38590114 }
      ]);
    }

    console.log("[Seed] Checking existing audit logs...");
    const existingLogs = await AuditLog.countDocuments();
    if (existingLogs === 0) {
      console.log("[Seed] Seeding initial audit logs...");
      await AuditLog.insertMany([
        { timestamp: "2026-09-10 11:20:14", admin: "admin@regal.io", action: "Updated Package Limits", user: "SYSTEM", module: "Packages", oldValue: "Gold Min: $1000", newValue: "Gold Min: $1000 (Confirmed)", ip: "185.220.101.4", device: "Chrome / macOS", result: "SUCCESS" },
        { timestamp: "2026-09-10 09:15:02", admin: "finance@regal.io", action: "Approved Withdrawal", user: "USR-7821", module: "Withdrawals", oldValue: "Pending ($75.00)", newValue: "Approved", ip: "194.165.16.8", device: "Firefox / Windows", result: "SUCCESS" },
        { timestamp: "2026-09-08 14:00:00", admin: "admin@regal.io", action: "Daily ROI Calculation Run", user: "BATCH-ROI", module: "ROI Engine", oldValue: "Prior Ledger", newValue: "1640 Active Contracts Credited", ip: "127.0.0.1 (CRON)", device: "Server Automation", result: "SUCCESS" }
      ]);
    }

    console.log("[Seed] Checking existing CMS content...");
    const existingCms = await CmsContent.countDocuments();
    if (existingCms === 0) {
      console.log("[Seed] Seeding CMS content...");
      const faqs = faqData.map((f, i) => ({ type: "faq", title: f.question, category: f.category, content: f, order: i }));
      const roadmaps = roadmapData.map((r, i) => ({ type: "roadmap", title: r.phase, content: r, order: i }));
      const docs = docsData.map((d, i) => ({ type: "doc", slug: d.slug, title: d.title, content: d, order: i }));
      await CmsContent.insertMany([...faqs, ...roadmaps, ...docs]);
    }

    console.log("[Seed] Seeding complete! Database is initialized and ready.");
  } catch (err) {
    console.error("[Seed] Error during database seeding:", err);
  }
};

// Execute if run directly via node
if (process.argv[1]?.includes("seed.js")) {
  seedDatabase().then(() => {
    console.log("[Seed] Process exiting.");
    process.exit(0);
  });
}
