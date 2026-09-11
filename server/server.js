import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import { initCronJobs } from "./jobs/cronJobs.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import blockchainRoutes from "./routes/blockchainRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import roiRoutes from "./routes/roiRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";
import { seedDatabase } from "./scripts/seed.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Global Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logging in dev
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`[${req.method}] ${req.originalUrl}`);
  }
  next();
});

// Ensure Database is connected (crucial for Vercel serverless functions)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("[MongoDB Serverless] Connection failed:", err.message);
    res.status(500).json({ success: false, error: "Database connection failed" });
  }
});

// RESTful API V1 Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/packages", packageRoutes);
app.use("/api/v1/investments", investmentRoutes);
app.use("/api/v1/roi", roiRoutes);
app.use("/api/v1/referrals", referralRoutes);
app.use("/api/v1/withdrawals", withdrawalRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/support", supportRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/blockchain", blockchainRoutes);
app.use("/api/v1/cms", cmsRoutes);

// Vercel serverless prefix fallback (/v1/...)
app.use("/v1/auth", authRoutes);
app.use("/v1/packages", packageRoutes);
app.use("/v1/investments", investmentRoutes);
app.use("/v1/roi", roiRoutes);
app.use("/v1/referrals", referralRoutes);
app.use("/v1/withdrawals", withdrawalRoutes);
app.use("/v1/transactions", transactionRoutes);
app.use("/v1/wallet", walletRoutes);
app.use("/v1/notifications", notificationRoutes);
app.use("/v1/support", supportRoutes);
app.use("/v1/admin", adminRoutes);
app.use("/v1/blockchain", blockchainRoutes);
app.use("/v1/cms", cmsRoutes);

// Backward Compatibility Routes for Landing Page & UI prototype (Vite /api proxy)
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/roi", roiRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/dashboard", (req, res) => {
  res.json({
    success: true,
    data: {
      totalInvested: 5000,
      accruedROI: 45,
      referralEarnings: 750,
      principalBalance: 5000
    }
  });
});
app.use("/api/token", (req, res, next) => { req.url = "/token"; cmsRoutes(req, res, next); });
app.use("/api/tokenomics", (req, res, next) => { req.url = "/tokenomics"; cmsRoutes(req, res, next); });
app.use("/api/roadmap", (req, res, next) => { req.url = "/roadmap"; cmsRoutes(req, res, next); });
app.use("/api/faq", (req, res, next) => { req.url = "/faq"; cmsRoutes(req, res, next); });
app.use("/api/docs", (req, res, next) => { req.url = "/docs"; cmsRoutes(req, res, next); });

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    platform: "REGAL (RGL) Ecosystem Backend",
    network: "BNB Smart Chain (56)",
    timestamp: new Date().toISOString(),
    status: "HEALTHY"
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "REGAL (RGL) Web3 Investment Backend API",
    docs: "/api/v1",
    health: "/api/health"
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[Server Error]`, err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error"
  });
});

// Server bootstrap
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    initCronJobs();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[Regal API] Server active at http://localhost:${PORT}`);
      console.log(`[Regal API] V1 API endpoints mounted at http://localhost:${PORT}/api/v1`);
    });
  } catch (err) {
    console.error(`[Regal API] Critical initialization failure:`, err);
    process.exit(1);
  }
};

// Only start standalone listener when not running in Vercel serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
