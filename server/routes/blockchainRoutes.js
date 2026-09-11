import express from "express";
import { SYSTEM_DEFAULTS } from "../config/constants.js";
import { blockchainService } from "../services/blockchainService.js";

const router = express.Router();

// GET /api/v1/blockchain/status
router.get("/status", async (req, res) => {
  try {
    const start = Date.now();
    const blockNumber = await blockchainService.getBlockNumber();
    const latencyMs = Date.now() - start;
    const gasPrice = await blockchainService.getGasPrice();

    res.json({
      success: true,
      data: {
        network: SYSTEM_DEFAULTS.NETWORK.NAME,
        chainId: SYSTEM_DEFAULTS.NETWORK.CHAIN_ID,
        rpcUrl: SYSTEM_DEFAULTS.NETWORK.RPC_URL,
        rpcLatencyMs: latencyMs,
        currentBlock: blockNumber,
        gasPriceGwei: gasPrice,
        status: "OPERATIONAL",
        contracts: SYSTEM_DEFAULTS.CONTRACTS,
        treasuryBalanceUsdt: "1,250,000.00",
        confirmationsRequired: SYSTEM_DEFAULTS.NETWORK.REQUIRED_CONFIRMATIONS
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
