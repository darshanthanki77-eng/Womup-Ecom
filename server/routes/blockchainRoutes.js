import express from "express";
import { BLOCKCHAIN_CONFIG } from "../config/blockchain.js";
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
        network: BLOCKCHAIN_CONFIG.NETWORK.NAME,
        chainId: BLOCKCHAIN_CONFIG.NETWORK.CHAIN_ID,
        rpcUrl: BLOCKCHAIN_CONFIG.NETWORK.RPC_URL,
        rpcLatencyMs: latencyMs,
        currentBlock: blockNumber,
        gasPriceGwei: gasPrice,
        status: "OPERATIONAL",
        contracts: BLOCKCHAIN_CONFIG.CONTRACTS,
        treasuryBalanceUsdt: "1,250,000.00",
        confirmationsRequired: BLOCKCHAIN_CONFIG.NETWORK.REQUIRED_CONFIRMATIONS
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/blockchain/contract-state
// Returns live on-chain parameters directly from RegalToken (0xcc6Ba1e3a452fd0b184204723E49eB30691e53A5)
router.get("/contract-state", async (req, res) => {
  try {
    const state = await blockchainService.getContractParameters();
    res.json({
      success: true,
      data: state
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/blockchain/verify-tx
// Diagnostic endpoint to inspect any BSC transaction
router.post("/verify-tx", async (req, res) => {
  try {
    const { txHash, amount, walletAddress, asset } = req.body;
    const result = await blockchainService.verifyInvestmentTx(txHash, amount || 100, walletAddress, asset || "USDT");
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
