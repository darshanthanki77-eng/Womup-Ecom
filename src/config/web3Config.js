// Web3 Configuration for Regal Ecosystem on BNB Smart Chain

export const BSC_CHAINS = {
  MAINNET: {
    chainId: 56,
    chainIdHex: "0x38",
    chainName: "BNB Smart Chain Mainnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: [
      "https://bsc-dataseed.binance.org/",
      "https://bsc-dataseed1.defibit.io/",
      "https://bsc-dataseed1.ninicoin.io/"
    ],
    blockExplorerUrls: ["https://bscscan.com"]
  },
  TESTNET: {
    chainId: 97,
    chainIdHex: "0x61",
    chainName: "BNB Smart Chain Testnet",
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18
    },
    rpcUrls: [
      "https://data-seed-prebsc-1-s1.binance.org:8545/",
      "https://data-seed-prebsc-2-s1.binance.org:8545/"
    ],
    blockExplorerUrls: ["https://testnet.bscscan.com"]
  }
};

export const DEFAULT_CHAIN_ID = 56;

export const CONTRACT_ADDRESSES = {
  // Deployed RegalToken contract address
  RGL_TOKEN: "0xcc6Ba1e3a452fd0b184204723E49eB30691e53A5",
  // Standard BEP-20 USDT on BSC Mainnet
  USDT_TOKEN: "0x55d398326f99059fF775485246999027B3197955",
  // Approved Platform Treasury
  TREASURY: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B"
};

export const ERC20_MINIMAL_ABI = [
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
