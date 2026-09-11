import express from "express";
import {
    docsData,
    faqData,
    roadmapData,
    tokenData,
    tokenomicsData
} from "../data/protocolData.js";
import { CmsContent } from "../models/CmsContent.js";

const router = express.Router();

// GET /api/v1/cms/faq
router.get("/faq", async (req, res) => {
  try {
    const { category, search } = req.query;
    let dbFaqs = await CmsContent.find({ type: "faq", active: true }).sort({ order: 1 });
    let items = dbFaqs.length > 0 ? dbFaqs.map(f => f.content) : faqData;

    if (category && category !== "All") {
      items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.question?.toLowerCase().includes(q) || i.answer?.toLowerCase().includes(q));
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.json({ success: true, count: faqData.length, data: faqData });
  }
});

// GET /api/v1/cms/roadmap
router.get("/roadmap", async (req, res) => {
  try {
    const dbRoadmap = await CmsContent.find({ type: "roadmap", active: true }).sort({ order: 1 });
    const data = dbRoadmap.length > 0 ? dbRoadmap.map(r => r.content) : roadmapData;
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.json({ success: true, count: roadmapData.length, data: roadmapData });
  }
});

// GET /api/v1/cms/docs
router.get("/docs", async (req, res) => {
  try {
    const dbDocs = await CmsContent.find({ type: "doc", active: true }).sort({ order: 1 });
    const data = dbDocs.length > 0 ? dbDocs.map(d => d.content) : docsData;
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.json({ success: true, count: docsData.length, data: docsData });
  }
});

// GET /api/v1/cms/token
router.get("/token", (req, res) => {
  res.json({ success: true, data: tokenData });
});

// GET /api/v1/cms/tokenomics
router.get("/tokenomics", (req, res) => {
  res.json({ success: true, data: tokenomicsData });
});

// GET /api/v1/cms/all
router.get("/all", async (req, res) => {
  try {
    const contents = await CmsContent.find();
    res.json({ success: true, data: contents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/cms/save
router.post("/save", async (req, res) => {
  try {
    const { slug, title, type, content } = req.body;
    const item = await CmsContent.findOneAndUpdate(
      { slug },
      { slug, title, type: type || "custom", content, active: true },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
