import mongoose from "mongoose";

const cmsContentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["faq", "roadmap", "doc", "announcement"], required: true, index: true },
    slug: { type: String, index: true },
    title: { type: String, required: true },
    category: { type: String },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CmsContent = mongoose.models.CmsContent || mongoose.model("CmsContent", cmsContentSchema);
