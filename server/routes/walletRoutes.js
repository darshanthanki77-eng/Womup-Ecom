import express from "express";
import { SYSTEM_DEFAULTS } from "../config/constants.js";
import { authenticateToken } from "../middleware/auth.js";
import { blockchainService } from "../services/blockchainService.js";

const router = express.Router();

// GET /api/v1/wallet/balances
router.get("/balances", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      walletAddress: user.walletAddress,
      shortAddress: user.shortAddress,
      balances: user.balances,
      kpi: user.kpi
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/wallet/network
router.get("/network", async (req, res) => {
  try {
    const blockNumber = await blockchainService.getBlockNumber();
    const gasPrice = await blockchainService.getGasPrice();

    res.json({
      success: true,
      network: SYSTEM_DEFAULTS.NETWORK.NAME,
      chainId: SYSTEM_DEFAULTS.NETWORK.CHAIN_ID,
      blockNumber,
      gasPriceGwei: gasPrice,
      contracts: SYSTEM_DEFAULTS.CONTRACTS,
      status: "CONNECTED"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
