// REGAL (RGL) System Constants & Defaults

export const SYSTEM_DEFAULTS = {
  NETWORK: {
    NAME: "BNB Smart Chain",
    CHAIN_ID: 56,
    RPC_URL: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/",
    RPC_FALLBACK: process.env.BSC_RPC_FALLBACK_URL || "https://bsc-dataseed1.defibit.io/",
    REQUIRED_CONFIRMATIONS: 3
  },
  CONTRACTS: {
    RGL: process.env.RGL_TOKEN_ADDRESS || "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    USDT: "0x55d398326f99059fF775485246999027B3197955", // Binance-Peg BSC-USD
    TREASURY: process.env.TREASURY_ADDRESS || "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B"
  },
  PACKAGES: [
    {
      id: "regal-silver",
      name: "Regal Silver",
      minAmount: 100,
      maxAmount: 999.99,
      referralPercent: 1.5,
      cycleDurationDays: 240,
      maturityDays: 60,
      phase1Rate: 0.0015, // 0.15% daily
      phase2Rate: 0.0025, // 0.25% daily
      status: "Active"
    },
    {
      id: "regal-gold",
      name: "Regal Gold",
      minAmount: 1000,
      maxAmount: 2999.99,
      referralPercent: 3.0,
      cycleDurationDays: 240,
      maturityDays: 60,
      phase1Rate: 0.0015,
      phase2Rate: 0.0025,
      status: "Active"
    },
    {
      id: "regal-black",
      name: "Regal Black",
      minAmount: 3000,
      maxAmount: 1000000,
      referralPercent: 5.0,
      cycleDurationDays: 240,
      maturityDays: 60,
      phase1Rate: 0.0015,
      phase2Rate: 0.0025,
      status: "Active"
    }
  ],
  WITHDRAWAL: {
    MIN_AMOUNT: 50.0,
    FEE_PERCENT: 1.0, // 1%
    MODE: "MANUAL" // MANUAL | AUTOMATED
  },
  ROI: {
    BUFFER_DAYS: 60,
    PHASE1_DAYS: 90, // Month 3–5 (Day 61–150)
    PHASE2_DAYS: 90, // Month 6–8 (Day 151–240)
    TOTAL_DAYS: 240
  }
};
