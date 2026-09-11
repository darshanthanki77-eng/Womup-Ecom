import mongoose from "mongoose";

const roiLedgerSchema = new mongoose.Schema(
  {
    roiId: { type: String, required: true, unique: true, index: true },
    investmentId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessDate: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
    package: { type: String, required: true },
    phase: { type: String, required: true },
    rate: { type: String, required: true },
    principalBase: { type: Number, required: true },
    accruedAmount: { type: Number, required: true },
    status: { type: String, enum: ["Accrued", "Paid"], default: "Accrued" },
    calculationRunId: { type: String, required: true }
  },
  { timestamps: true }
);

// CRITICAL: Guaranteed prevention of duplicate daily accruals on any single contract
roiLedgerSchema.index({ investmentId: 1, businessDate: 1 }, { unique: true });

export const RoiLedger = mongoose.models.RoiLedger || mongoose.model("RoiLedger", roiLedgerSchema);
