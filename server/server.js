import cors from "cors";
import express from "express";
import {
    docsData,
    faqData,
    packagesData,
    roadmapData,
    tokenData,
    tokenomicsData
} from "./data/mockData.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory persistent collections
const investmentsStore = [
  {
    id: "INV-8921",
    userId: "USR-001",
    walletAddress: "0x82A4...B91A",
    packageId: "regal-gold",
    packageName: "Regal Gold",
    amount: 2000,
    asset: "USDT",
    network: "BNB Smart Chain",
    txHash: "0x7f9a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
    blockNumber: 38472910,
    status: "Active",
    startDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    maturityDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    cycleEndDate: new Date(Date.now() + 165 * 24 * 60 * 60 * 1000).toISOString(),
    currentPhase: "Month 3–5",
    currentDailyRate: "0.15%",
    accruedROI: 45.00,
    referralTier: "3.0%"
  },
  {
    id: "INV-6512",
    userId: "USR-001",
    walletAddress: "0x82A4...B91A",
    packageId: "regal-black",
    packageName: "Regal Black",
    amount: 3000,
    asset: "USDT",
    network: "BNB Smart Chain",
    txHash: "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    blockNumber: 38469012,
    status: "Active",
    startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    maturityDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    cycleEndDate: new Date(Date.now() + 205 * 24 * 60 * 60 * 1000).toISOString(),
    currentPhase: "Day 1–60",
    currentDailyRate: "0.00%",
    accruedROI: 0.00,
    referralTier: "5.0%"
  }
];

const supportTicketsStore = [];

// API Routes

// 1. Packages
app.get("/api/packages", (req, res) => {
  res.json({ success: true, count: packagesData.length, data: packagesData });
});

app.get("/api/packages/:id", (req, res) => {
  const pkg = packagesData.find(p => p.id === req.params.id);
  if (!pkg) return res.status(404).json({ success: false, error: "Package not found" });
  res.json({ success: true, data: pkg });
});

// 2. Token Details
app.get("/api/token", (req, res) => {
  res.json({ success: true, data: tokenData });
});

// 3. Tokenomics
app.get("/api/tokenomics", (req, res) => {
  res.json({ success: true, data: tokenomicsData });
});

// 4. Roadmap
app.get("/api/roadmap", (req, res) => {
  res.json({ success: true, count: roadmapData.length, data: roadmapData });
});

// 5. FAQ (with search and category filter)
app.get("/api/faq", (req, res) => {
  const { search, category } = req.query;
  let results = [...faqData];
  if (category && category !== "All") {
    results = results.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(item => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q));
  }
  res.json({ success: true, count: results.length, data: results });
});

// 6. Documentation
app.get("/api/docs", (req, res) => {
  res.json({ success: true, data: docsData });
});

app.get("/api/docs/:slug", (req, res) => {
  const doc = docsData.find(d => d.slug === req.params.slug);
  if (!doc) return res.status(404).json({ success: false, error: "Document not found" });
  res.json({ success: true, data: doc });
});

// 7. Support Inquiries
app.post("/api/support", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  const ticket = {
    ticketId: `RGL-TKT-${Math.floor(100000 + Math.random() * 900000)}`,
    name,
    email,
    subject,
    message,
    status: "Submitted",
    timestamp: new Date().toISOString()
  };

  supportTicketsStore.push(ticket);
  res.status(201).json({
    success: true,
    message: "Your inquiry has been logged. Our concierge support team will reach out shortly.",
    data: ticket
  });
});

// 8. Investment Intent & Validation
app.post("/api/investments/intent", (req, res) => {
  const { packageId, amount, walletAddress } = req.body;
  const pkg = packagesData.find(p => p.id === packageId);
  if (!pkg) {
    return res.status(400).json({ success: false, error: "Invalid package specified." });
  }
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount < pkg.minAmount || numericAmount > pkg.maxAmount) {
    return res.status(400).json({
      success: false,
      error: `Investment amount for ${pkg.name} must be between $${pkg.minAmount.toLocaleString()} and $${pkg.maxAmount.toLocaleString()} USDT.`
    });
  }

  res.json({
    success: true,
    data: {
      intentId: `INTENT-${Date.now()}`,
      package: pkg,
      amount: numericAmount,
      walletAddress: walletAddress || "Unconnected",
      network: "BNB Smart Chain (ChainId 56)",
      contractRecipient: tokenData.contractAddress,
      estimatedGasBnb: "0.00045 BNB"
    }
  });
});

// 9. Blockchain Verification & Investment Creation
app.post("/api/investments/verify", (req, res) => {
  const { packageId, amount, walletAddress, txHash } = req.body;
  const pkg = packagesData.find(p => p.id === packageId) || packagesData[1];
  const numericAmount = parseFloat(amount) || pkg.minAmount;

  const generatedTxHash = txHash || `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;
  const newInvestment = {
    id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: "USR-001",
    walletAddress: walletAddress || "0x82A4F1...7B91",
    packageId: pkg.id,
    packageName: pkg.name,
    amount: numericAmount,
    asset: "USDT",
    network: "BNB Smart Chain",
    txHash: generatedTxHash,
    blockNumber: 38480100 + Math.floor(Math.random() * 500),
    status: "Active",
    startDate: new Date().toISOString(),
    maturityDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    cycleEndDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(),
    currentPhase: "Day 1–60 (Buffer)",
    currentDailyRate: "0.00%",
    accruedROI: 0.00,
    referralTier: `${pkg.referralPercent}%`
  };

  investmentsStore.unshift(newInvestment);

  res.json({
    success: true,
    message: "Investment verified on BNB Smart Chain and activated successfully.",
    data: newInvestment
  });
});

// 10. User Portfolio & Dashboard Data
app.get("/api/dashboard", (req, res) => {
  const totalInvested = investmentsStore.reduce((sum, inv) => sum + inv.amount, 0);
  const accruedROI = investmentsStore.reduce((sum, inv) => sum + inv.accruedROI, 0);

  res.json({
    success: true,
    data: {
      walletAddress: "0x82A4...B91A",
      network: "BNB Smart Chain",
      totalInvested,
      accruedROI,
      referralEarnings: 750,
      principalBalance: totalInvested,
      activeInvestmentsCount: investmentsStore.length,
      nextMilestone: {
        event: "ROI Phase Change",
        countdownDays: 12,
        countdownHours: 4,
        currentRate: "0.15%",
        nextRate: "0.25%"
      },
      recentInvestments: investmentsStore
    }
  });
});

// 11. ROI Center Endpoint
app.get("/api/roi", (req, res) => {
  res.json({
    success: true,
    data: {
      totalAccrued: 1250,
      totalPaid: 500,
      currentDailyRate: "0.15%",
      nextDailyRate: "0.25%",
      history: [
        { date: "09 Sep", investmentId: "INV-8921", rate: "0.15%", amount: 3.00, status: "Credited", ref: "ROI-9821" },
        { date: "08 Sep", investmentId: "INV-8921", rate: "0.15%", amount: 3.00, status: "Credited", ref: "ROI-9820" },
        { date: "07 Sep", investmentId: "INV-8921", rate: "0.15%", amount: 3.00, status: "Credited", ref: "ROI-9819" },
        { date: "06 Sep", investmentId: "INV-8921", rate: "0.15%", amount: 3.00, status: "Credited", ref: "ROI-9818" }
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`[Regal API] Server running on http://localhost:${PORT}`);
});
