// REGAL (RGL) — Unified Portal Datasets & Mock Store

export const initialUser = {
  id: "USR-7821",
  name: "Alexander Vance",
  email: "alexander.vance@regal-asset.io",
  walletAddress: "0x82A4F19c8d3e4b7c8d9e0f1a2b3c4d5e7B91",
  shortAddress: "0x82A4...7B91",
  referralCode: "RGL7821",
  sponsor: "0x41E9...5C22 (Sponsor: Duke)",
  registrationDate: "2026-06-15",
  status: "ACTIVE",
  network: "BNB Smart Chain (Mainnet 56)",
  balances: {
    bnb: "2.450",
    usdt: "8,500.00",
    rgl: "15,000.00"
  },
  kpi: {
    totalInvested: 5000,
    activeInvested: 5000,
    totalRoi: 325.00,
    pendingRoi: 125.00,
    paidRoi: 200.00,
    referralEarnings: 150.00,
    availableBalance: 275.00,
    principalReturn: 5000.00
  }
};

export const initialInvestments = [
  {
    id: "INV-9021",
    packageName: "Gold Package",
    packageId: "regal-gold",
    amount: 2500,
    asset: "USDT",
    startDate: "2026-06-15",
    cycleEndDate: "2027-02-15",
    cycleDay: 96,
    totalCycleDays: 240,
    currentPhase: "Month 3–5",
    currentRoiRate: "0.15%",
    todayRoi: 3.75,
    accruedRoi: 135.00,
    paidRoi: 80.00,
    status: "ACTIVE",
    txHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    blockNumber: 38942104,
    referralTier: "3.0%"
  },
  {
    id: "INV-8910",
    packageName: "Gold Package",
    packageId: "regal-gold",
    amount: 2500,
    asset: "USDT",
    startDate: "2026-07-01",
    cycleEndDate: "2027-03-01",
    cycleDay: 80,
    totalCycleDays: 240,
    currentPhase: "Month 3–5",
    currentRoiRate: "0.15%",
    todayRoi: 3.75,
    accruedRoi: 75.00,
    paidRoi: 50.00,
    status: "ACTIVE",
    txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
    blockNumber: 38992015,
    referralTier: "3.0%"
  }
];

export const initialRoiLedger = [
  { id: "ROI-104", date: "2026-09-10", investmentId: "INV-9021", package: "Gold", phase: "Month 3–5", rate: "0.15%", amount: 3.75, status: "Accrued" },
  { id: "ROI-103", date: "2026-09-09", investmentId: "INV-9021", package: "Gold", phase: "Month 3–5", rate: "0.15%", amount: 3.75, status: "Paid" },
  { id: "ROI-102", date: "2026-09-08", investmentId: "INV-9021", package: "Gold", phase: "Month 3–5", rate: "0.15%", amount: 3.75, status: "Paid" },
  { id: "ROI-101", date: "2026-09-10", investmentId: "INV-8910", package: "Gold", phase: "Month 3–5", rate: "0.15%", amount: 3.75, status: "Accrued" },
  { id: "ROI-100", date: "2026-09-09", investmentId: "INV-8910", package: "Gold", phase: "Month 3–5", rate: "0.15%", amount: 3.75, status: "Paid" },
  { id: "ROI-099", date: "2026-09-08", investmentId: "INV-8910", package: "Gold", phase: "Month 3–5", rate: "0.15%", amount: 3.75, status: "Paid" }
];

export const initialReferrals = [
  { id: "REF-01", wallet: "0x91F2...4C19", user: "Viktor Petrov", package: "Regal Gold", investmentAmount: 2000, rate: "3.0%", commission: 60.00, date: "2026-08-12", status: "Paid" },
  { id: "REF-02", wallet: "0x33A8...7E4B", user: "Elena Rostova", package: "Regal Black", investmentAmount: 3000, rate: "5.0%", commission: 150.00, date: "2026-08-20", status: "Paid" },
  { id: "REF-03", wallet: "0x67C1...82D9", user: "Marcus Aurel", package: "Regal Silver", investmentAmount: 500, rate: "1.5%", commission: 7.50, date: "2026-09-02", status: "Pending" }
];

export const initialWithdrawals = [
  { id: "WTH-5501", date: "2026-09-05", amount: 200.00, asset: "USDT", fee: 2.00, finalAmount: 198.00, destination: "0x82A4...7B91", txHash: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b", status: "Completed" },
  { id: "WTH-5502", date: "2026-09-08", amount: 75.00, asset: "USDT", fee: 1.50, finalAmount: 73.50, destination: "0x82A4...7B91", txHash: "Pending Blockchain Mining", status: "Pending" }
];

export const initialTransactions = [
  { id: "TX-8912", date: "2026-09-10 10:14", type: "ROI Accrual", amount: "+$3.75", asset: "USDT", wallet: "0x82A4...7B91", txHash: "0x7a8b9c...4f5a", block: 38942104, status: "Confirmed" },
  { id: "TX-8911", date: "2026-09-08 14:22", type: "Withdrawal", amount: "-$75.00", asset: "USDT", wallet: "0x82A4...7B91", txHash: "0x6f5e4d...3b2a", block: 38931200, status: "Pending" },
  { id: "TX-8910", date: "2026-09-05 09:18", type: "Withdrawal", amount: "-$200.00", asset: "USDT", wallet: "0x82A4...7B91", txHash: "0x9a8b7c...1e0f", block: 38914002, status: "Confirmed" },
  { id: "TX-8909", date: "2026-08-20 18:30", type: "Referral Commission", amount: "+$150.00", asset: "USDT", wallet: "0x82A4...7B91", txHash: "0x4b3c2d...9a8b", block: 38851092, status: "Confirmed" },
  { id: "TX-8908", date: "2026-07-01 11:05", type: "Investment Deposit", amount: "$2,500.00", asset: "USDT", wallet: "0x82A4...7B91", txHash: "0x3c4d5e...2b3c", block: 38710920, status: "Confirmed" },
  { id: "TX-8907", date: "2026-06-15 08:40", type: "Investment Deposit", amount: "$2,500.00", asset: "USDT", wallet: "0x82A4...7B91", txHash: "0x7a8b9c...6f7a", block: 38590114, status: "Confirmed" }
];

export const initialNotifications = [
  { id: "NOTIF-01", type: "Investment Confirmed", title: "Investment Verified on BNB Smart Chain", message: "Your $2,500 USDT deposit for Regal Gold (INV-9021) has been verified at block #38942104.", time: "10 mins ago", read: false },
  { id: "NOTIF-02", type: "ROI Available", title: "Daily ROI Accrued", message: "Daily ROI of $7.50 USDT (0.15%) has been credited to your internal ledger.", time: "4 hours ago", read: false },
  { id: "NOTIF-03", type: "Referral Commission", title: "New Referral Commission Paid", message: "You received $150.00 USDT from referee Elena Rostova (Regal Black).", time: "2 days ago", read: true },
  { id: "NOTIF-04", type: "60-Day Period Completed", title: "Buffer Phase Completed", message: "Investment INV-9021 has exited the 60-day buffer period and is now actively yielding 0.15% daily.", time: "6 days ago", read: true },
  { id: "NOTIF-05", type: "System Announcement", title: "BNB Smart Chain RPC Optimization", message: "Regal node latency has been upgraded to under 240ms with redundant fallback RPCs.", time: "1 week ago", read: true }
];

export const initialTickets = [
  { id: "TKT-9912", category: "ROI", subject: "Inquiry on Month 6 ROI Acceleration", created: "2026-09-08", lastUpdate: "2026-09-09", status: "IN PROGRESS", messages: [
    { sender: "User", text: "When does the 0.25% daily rate activate exactly?", time: "2026-09-08 14:10" },
    { sender: "Concierge", text: "Hello Alexander, your investment reaches Day 151 (Month 6) on November 15, 2026, where the 0.25% daily rate begins automatically.", time: "2026-09-09 09:30" }
  ]},
  { id: "TKT-9804", category: "Wallet", subject: "Trust Wallet BSC Network Verification", created: "2026-08-14", lastUpdate: "2026-08-15", status: "RESOLVED", messages: [
    { sender: "User", text: "Connected via WalletConnect, balance confirmed.", time: "2026-08-14" },
    { sender: "Concierge", text: "Your session is fully secured with Chain ID 56.", time: "2026-08-15" }
  ]}
];

// Admin Platform Datasets
export const initialAdminStats = {
  totalUsers: 1428,
  activeUsers: 982,
  totalInvestments: 2190,
  activeInvestments: 1640,
  totalInvested: 4850000,
  roiAccrued: 421800,
  referralCommissions: 145500,
  pendingWithdrawals: 18500,
  completedWithdrawals: 312000,
  principalReturned: 850000
};

export const initialAllUsers = [
  { id: "USR-001", name: "Alexander Vance", wallet: "0x82A4...7B91", email: "alexander@regal.io", referralCode: "RGL7821", investments: 5000, totalRoi: 325, referralEarnings: 150, status: "Active", joined: "2026-06-15" },
  { id: "USR-002", name: "Elena Rostova", wallet: "0x33A8...7E4B", email: "elena@crypto.ch", referralCode: "RGL3301", investments: 12000, totalRoi: 890, referralEarnings: 420, status: "Active", joined: "2026-06-20" },
  { id: "USR-003", name: "Viktor Petrov", wallet: "0x91F2...4C19", email: "viktor@nordic.se", referralCode: "RGL9102", investments: 2000, totalRoi: 140, referralEarnings: 60, status: "Active", joined: "2026-07-02" },
  { id: "USR-004", name: "Marcus Aurel", wallet: "0x67C1...82D9", email: "marcus@rome.it", referralCode: "RGL6711", investments: 500, totalRoi: 35, referralEarnings: 0, status: "Pending", joined: "2026-08-10" },
  { id: "USR-005", name: "Dmitry Sokolov", wallet: "0x54B2...99C1", email: "dmitry@invest.ru", referralCode: "RGL5401", investments: 8500, totalRoi: 540, referralEarnings: 310, status: "Flagged", joined: "2026-08-28" }
];

export const initialAuditLogs = [
  { timestamp: "2026-09-10 11:20:14", admin: "admin@regal.io", action: "Updated Package Limits", user: "SYSTEM", module: "Packages", oldValue: "Gold Min: $1000", newValue: "Gold Min: $1000 (Confirmed)", ip: "185.220.101.4", device: "Chrome / macOS", result: "SUCCESS" },
  { timestamp: "2026-09-10 09:15:02", admin: "finance@regal.io", action: "Approved Withdrawal", user: "USR-001", module: "Withdrawals", oldValue: "Pending ($75.00)", newValue: "Approved", ip: "194.165.16.8", device: "Firefox / Windows", result: "SUCCESS" },
  { timestamp: "2026-09-09 18:44:30", admin: "security@regal.io", action: "Flagged Account", user: "USR-005", module: "Users", oldValue: "Active", newValue: "Flagged (Suspicious IP hop)", ip: "185.220.101.4", device: "Chrome / macOS", result: "SUCCESS" },
  { timestamp: "2026-09-08 14:00:00", admin: "admin@regal.io", action: "Daily ROI Calculation Run", user: "BATCH-ROI", module: "ROI Engine", oldValue: "Prior Ledger", newValue: "1640 Active Contracts Credited", ip: "127.0.0.1 (CRON)", device: "Server Automation", result: "SUCCESS" }
];

export const initialPackagesConfig = [
  { id: "regal-silver", name: "Regal Silver", minAmount: 100, maxAmount: 999.99, referralPercent: 1.5, maturityDays: 60, cycleDurationMonths: 8, phase1Rate: "0.15%", phase2Rate: "0.25%", status: "Active" },
  { id: "regal-gold", name: "Regal Gold", minAmount: 1000, maxAmount: 2999.99, referralPercent: 3.0, maturityDays: 60, cycleDurationMonths: 8, phase1Rate: "0.15%", phase2Rate: "0.25%", status: "Active" },
  { id: "regal-black", name: "Regal Black", minAmount: 3000, maxAmount: 100000, referralPercent: 5.0, maturityDays: 60, cycleDurationMonths: 8, phase1Rate: "0.15%", phase2Rate: "0.25%", status: "Active" }
];

export const initialSystemSettings = {
  blockchain: {
    rpcUrl: "https://bsc-dataseed.binance.org/",
    chainId: 56,
    confirmationsRequired: 15,
    rglContract: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    treasuryWallet: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B"
  },
  withdrawals: {
    minimumUsdt: 50,
    maximumUsdt: 25000,
    feePercent: 1.0,
    approvalMode: "Manual Above $1,000" // Manual | Automated
  },
  roi: {
    dailyCutoffUtc: "00:00 UTC",
    autoPayout: true,
    preventDuplicateRuns: true
  },
  emergency: {
    pauseInvestments: false,
    pauseWithdrawals: false
  }
};
