import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    packageId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    referralPercent: { type: Number, required: true },
    cycleDurationDays: { type: Number, default: 240 },
    maturityDays: { type: Number, default: 60 },
    phase1Rate: { type: Number, default: 0.0015 }, // 0.15% daily
    phase2Rate: { type: Number, default: 0.0025 }, // 0.25% daily
    principalReturnPercent: { type: Number, default: 100 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export const Package = mongoose.models.Package || mongoose.model("Package", packageSchema);
