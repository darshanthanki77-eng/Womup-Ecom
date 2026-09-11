import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    notificationId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true }, // Optional if broadcast
    isBroadcast: { type: Boolean, default: false },
    type: {
      type: String,
      enum: [
        "Investment Confirmed",
        "ROI Available",
        "Referral Commission",
        "60-Day Period Completed",
        "Withdrawal Submitted",
        "Withdrawal Completed",
        "Principal Returned",
        "System Announcement"
      ],
      required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, default: "Just now" },
    read: { type: Boolean, default: false },
    referenceId: { type: String }
  },
  { timestamps: true }
);

export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
