import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: String },
    updatedBy: { type: String, default: "SYSTEM" }
  },
  { timestamps: true }
);

export const SystemSetting = mongoose.models.SystemSetting || mongoose.model("SystemSetting", systemSettingSchema);
