// Investment Model Definition for Regal Platform
export const InvestmentSchema = {
  userId: { type: String, required: true },
  walletAddress: { type: String, required: true },
  packageId: { type: String, required: true },
  packageVersion: { type: Number, default: 1 },
  amount: { type: Number, required: true },
  asset: { type: String, default: "USDT" },
  network: { type: String, default: "BNB Smart Chain" },
  txHash: { type: String, required: true, unique: true },
  blockNumber: { type: Number },
  startDate: { type: Date, default: Date.now },
  maturityDate: { type: Date, required: true },
  roiStartDate: { type: Date, required: true },
  phase1Start: { type: Date, required: true },
  phase1End: { type: Date, required: true },
  phase2Start: { type: Date, required: true },
  phase2End: { type: Date, required: true },
  cycleEndDate: { type: Date, required: true },
  accruedROI: { type: Number, default: 0 },
  principalStatus: { type: String, enum: ["Active", "Matured", "Returned"], default: "Active" },
  status: { type: String, enum: ["Pending", "Active", "Completed", "Cancelled"], default: "Active" },
  createdAt: { type: Date, default: Date.now }
};
