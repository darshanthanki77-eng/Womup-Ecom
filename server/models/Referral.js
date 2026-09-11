import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    referralId: { type: String, required: true, unique: true, index: true },
    referrerId: { type: String, required: true, index: true },     // Sponsor's referralCode or userId
    referredId: { type: String, required: true, index: true },     // Downline referee's referralCode or userId
    referredWallet: { type: String, required: true },
    referredUser: { type: String, required: true },
    investmentId: { type: String, required: true, index: true },
    packageId: { type: String, required: true },
    packageName: { type: String, required: true },
    investmentAmount: { type: Number, required: true },
    rate: { type: String, required: true },                       // "1.5%", "3.0%", "5.0%"
    commission: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Paid", "Cancelled"], default: "Paid" },
    date: { type: String, required: true }
  },
  { timestamps: true }
);

// Prevent duplicate referral commission on the same investment
referralSchema.index({ referrerId: 1, referredId: 1, investmentId: 1 }, { unique: true });

export const Referral = mongoose.models.Referral || mongoose.model("Referral", referralSchema);
