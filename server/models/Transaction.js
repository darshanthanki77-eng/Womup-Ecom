import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    walletAddress: { type: String, required: true, lowercase: true, index: true },
    type: {
      type: String,
      enum: [
        "Investment Deposit",
        "ROI Accrual",
        "Withdrawal",
        "Referral Commission",
        "Principal Return",
        "Manual Adjustment"
      ],
      required: true
    },
    amount: { type: String, required: true }, // e.g., "+$3.75", "-$75.00", "$2,500.00"
    numericAmount: { type: Number, required: true },
    asset: { type: String, default: "USDT" },
    txHash: { type: String, index: true },
    blockNumber: { type: Number },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Failed"],
      default: "Confirmed"
    }
  },
  { timestamps: true }
);

export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
