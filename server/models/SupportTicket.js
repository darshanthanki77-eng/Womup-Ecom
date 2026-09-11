import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    category: {
      type: String,
      enum: ["ROI", "Investment", "Wallet", "Withdrawal", "Network Sync", "General"],
      default: "General"
    },
    subject: { type: String, required: true },
    status: {
      type: String,
      enum: ["OPEN", "IN PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN"
    },
    priority: { type: String, enum: ["Normal", "High", "VIP"], default: "Normal" },
    messages: [
      {
        sender: { type: String, required: true }, // "User" | "Concierge" | "Admin"
        text: { type: String, required: true },
        time: { type: String, required: true }
      }
    ],
    created: { type: String, required: true },
    lastUpdate: { type: String, default: "Just now" }
  },
  { timestamps: true }
);

export const SupportTicket = mongoose.models.SupportTicket || mongoose.model("SupportTicket", supportTicketSchema);
