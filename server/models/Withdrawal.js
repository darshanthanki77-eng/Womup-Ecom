import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    withdrawalId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    walletAddress: { type: String, required: true, lowercase: true, index: true },
    amount: { type: Number, required: true },
    asset: { type: String, default: "USDT" },
    fee: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    destination: { type: String, required: true },
    txHash: { type: String, default: "Pending Blockchain Mining" },
    status: {
      type: String,
      enum: ["Requested", "Pending", "Approved", "Processing", "Completed", "Rejected", "Cancelled"],
      default: "Pending"
    },
    approvedBy: { type: String },
    rejectionReason: { type: String },
    date: { type: String, required: true }
  },
  { timestamps: true }
);

export const Withdrawal = mongoose.models.Withdrawal || mongoose.model("Withdrawal", withdrawalSchema);
