import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true, index: true },
    passwordHash: { type: String },
    walletAddress: { type: String, lowercase: true, index: true },
    shortAddress: { type: String },
    referralCode: { type: String, required: true, unique: true, uppercase: true, index: true },
    referredBy: { type: String, uppercase: true, index: true }, // Sponsor's referralCode
    sponsorWallet: { type: String },
    role: { type: String, enum: ["USER", "ADMIN", "SUPER_ADMIN"], default: "USER" },
    status: { type: String, enum: ["Active", "Pending", "Suspended", "Flagged"], default: "Active" },
    kycStatus: { type: String, enum: ["None", "Pending", "Level 1", "Level 2 Verified"], default: "Level 2 Verified" },
    balances: {
      usdt: { type: Number, default: 0 },
      bnb: { type: Number, default: 0 },
      rgl: { type: Number, default: 0 }
    },
    kpi: {
      totalInvested: { type: Number, default: 0 },
      activeInvested: { type: Number, default: 0 },
      totalRoi: { type: Number, default: 0 },
      pendingRoi: { type: Number, default: 0 },
      paidRoi: { type: Number, default: 0 },
      referralEarnings: { type: Number, default: 0 },
      availableBalance: { type: Number, default: 0 },
      lockedBalance: { type: Number, default: 0 },
      principalReturn: { type: Number, default: 0 }
    },
    twoFactorEnabled: { type: Boolean, default: false },
    withdrawalPinHash: { type: String },
    registeredDate: { type: String },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
