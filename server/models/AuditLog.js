import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    timestamp: { type: String, required: true },
    admin: { type: String, required: true },
    action: { type: String, required: true },
    user: { type: String, default: "SYSTEM" },
    module: { type: String, required: true },
    oldValue: { type: String, default: "-" },
    newValue: { type: String, default: "-" },
    ip: { type: String, default: "127.0.0.1" },
    device: { type: String, default: "Server Automation" },
    result: { type: String, enum: ["SUCCESS", "FAILED", "WARNING"], default: "SUCCESS" }
  },
  { timestamps: true }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
