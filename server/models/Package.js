// Package Model Definition for Regal Platform
export const PackageSchema = {
  name: { type: String, required: true },
  badge: { type: String },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  referralPercent: { type: Number, required: true },
  cycleDurationDays: { type: Number, default: 240 },
  maturityDays: { type: Number, default: 60 },
  version: { type: Number, default: 1 },
  status: { type: String, enum: ["active", "paused", "deprecated"], default: "active" },
  roiPhase1Rate: { type: Number, default: 0.0015 }, // 0.15% daily
  roiPhase2Rate: { type: Number, default: 0.0025 }, // 0.25% daily
  principalReturnPercent: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
};
