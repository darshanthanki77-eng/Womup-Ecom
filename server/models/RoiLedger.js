// ROI Ledger and Support Ticket Schema definitions

export const RoiLedgerSchema = {
  investmentId: { type: String, required: true },
  userId: { type: String, required: true },
  accrualDate: { type: String, required: true }, // YYYY-MM-DD
  principalBase: { type: Number, required: true },
  rate: { type: Number, required: true },
  calculatedAmount: { type: Number, required: true },
  cycleId: { type: String, required: true },
  status: { type: String, enum: ["Credited", "Pending", "Failed"], default: "Credited" },
  createdAt: { type: Date, default: Date.now }
};

export const SupportTicketSchema = {
  ticketId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["Submitted", "In Review", "Resolved"], default: "Submitted" },
  priority: { type: String, enum: ["Normal", "High", "VIP"], default: "Normal" },
  createdAt: { type: Date, default: Date.now }
};
