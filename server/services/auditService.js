import { AuditLog } from "../models/AuditLog.js";

class AuditService {
  async logAction({
    admin = "admin@regal.io",
    action,
    user = "SYSTEM",
    module,
    oldValue = "-",
    newValue = "-",
    ip = "127.0.0.1",
    device = "Chrome / macOS",
    result = "SUCCESS"
  }) {
    try {
      const entry = new AuditLog({
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        admin,
        action,
        user,
        module,
        oldValue,
        newValue,
        ip,
        device,
        result
      });
      await entry.save();
      return entry;
    } catch (err) {
      console.error("[AuditService] Failed to record audit log:", err.message);
    }
  }
}

export const auditService = new AuditService();
