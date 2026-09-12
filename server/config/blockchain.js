import dotenv from "dotenv";
dotenv.config();

export const BLOCKCHAIN_CONFIG = {
  NETWORK: {
    NAME: "BNB Smart Chain",
    CHAIN_ID: parseInt(process.env.CHAIN_ID || "56", 10),
    RPC_URL: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/",
    RPC_FALLBACK: process.env.BSC_RPC_FALLBACK_URL || "https://bsc-dataseed1.defibit.io/",
    REQUIRED_CONFIRMATIONS: parseInt(process.env.REQUIRED_CONFIRMATIONS || "3", 10)
  },
  CONTRACTS: {
    // Official deployed RegalToken contract address
    RGL: process.env.RGL_TOKEN_ADDRESS || "0xcc6Ba1e3a452fd0b184204723E49eB30691e53A5",
    // Official BEP-20 USDT on BSC
    USDT: process.env.USDT_TOKEN_ADDRESS || "0x55d398326f99059fF775485246999027B3197955",
    // Approved Investment Treasury
    TREASURY: process.env.TREASURY_ADDRESS || "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B"
  },
  INVESTMENT: {
    // Primary approved payment asset for REGAL investment packages: "USDT" or "RGL" or "BNB"
    PRIMARY_ASSET: process.env.INVESTMENT_ASSET || "USDT",
    REQUEST_EXPIRY_MINUTES: 30
  }
};

export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];
