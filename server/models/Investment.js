import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    investmentId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    walletAddress: { type: String, required: true, lowercase: true, index: true },
    packageId: { type: String, required: true },
    packageName: { type: String, required: true },
    amount: { type: Number, required: true },
    asset: { type: String, default: "USDT" },
    network: { type: String, default: "BNB Smart Chain" },
    txHash: { type: String, required: true, unique: true, index: true },
    blockNumber: { type: Number },
    startDate: { type: Date, default: Date.now },
    waitingEndDate: { type: Date, required: true }, // Day 60 (end of buffer)
    phase1EndDate: { type: Date, required: true },  // Day 150 (end of 0.15% phase)
    cycleEndDate: { type: Date, required: true },   // Day 240 (end of 0.25% phase & maturity)
    cycleDay: { type: Number, default: 1 },
    totalCycleDays: { type: Number, default: 240 },
    currentPhase: {
      type: String,
      enum: ["Day 1–60", "Month 3–5", "Month 6–8", "Matured"],
      default: "Day 1–60"
    },
    currentRoiRate: { type: String, default: "0.00%" },
    todayRoi: { type: Number, default: 0 },
    accruedRoi: { type: Number, default: 0 },
    paidRoi: { type: Number, default: 0 },
    referralTier: { type: String, default: "1.5%" },
    principalStatus: {
      type: String,
      enum: ["Locked", "Eligible", "Returned"],
      default: "Locked"
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Completed", "Cancelled", "Flagged"],
      default: "Active"
    }
  },
  { timestamps: true }
);

export const Investment = mongoose.models.Investment || mongoose.model("Investment", investmentSchema);
