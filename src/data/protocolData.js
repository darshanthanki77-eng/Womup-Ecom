// Centralized Data Layer for REGAL (RGL) Ecosystem

export const tokenData = {
  name: "REGAL",
  symbol: "RGL",
  standard: "BEP-20",
  network: "BNB Smart Chain",
  chainId: 56,
  totalSupply: 100000000,
  formattedSupply: "100,000,000 RGL",
  contractAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  explorerUrl: "https://bscscan.com/token/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  cycleDuration: "8 Months",
  decimals: 18,
  functions: [
    {
      name: "Transfer",
      description: "Direct peer-to-peer on-chain transfer of RGL tokens across BNB Smart Chain addresses.",
      params: "address recipient, uint256 amount",
      returns: "bool success"
    },
    {
      name: "Transfer From",
      description: "Contract-authorized token transfer functionality using spender allowances.",
      params: "address sender, address recipient, uint256 amount",
      returns: "bool success"
    },
    {
      name: "Approve",
      description: "Grants permission to a smart contract or address to spend up to a designated amount.",
      params: "address spender, uint256 amount",
      returns: "bool success"
    },
    {
      name: "Allowance",
      description: "Queries the remaining number of tokens that a spender is authorized to withdraw from owner.",
      params: "address owner, address spender",
      returns: "uint256 remaining"
    },
    {
      name: "Balance Of",
      description: "Returns the real-time RGL token balance of any BSC public wallet address.",
      params: "address account",
      returns: "uint256 balance"
    },
    {
      name: "Burn",
      description: "Irreversibly burns designated tokens from circulating supply, reducing total supply.",
      params: "uint256 amount",
      returns: "bool success"
    },
    {
      name: "Ownership Transfer",
      description: "Secure two-step ownership transfer protected with Timelock and multi-signature validation.",
      params: "address newOwner",
      returns: "void"
    },
    {
      name: "Admin Control",
      description: "Role-based administrative controls for contract parameter adjustment and emergency stops.",
      params: "bytes32 role, address account",
      returns: "void"
    }
  ]
};

export const packagesData = [
  {
    id: "regal-silver",
    name: "Regal Silver",
    badge: "Entry Tier",
    minAmount: 100,
    maxAmount: 999.99,
    referralPercent: 1.5,
    cycleDuration: "8 Months",
    maturityDays: 60,
    roiSchedule: [
      { phase: "Day 1–60", rate: "0.00%", note: "Maturity / Buffer Period" },
      { phase: "Month 3–5", rate: "0.15% Daily", note: "Simple daily accrual" },
      { phase: "Month 6–8", rate: "0.25% Daily", note: "Accelerated yield phase" },
      { phase: "End of Month 8", rate: "100%", note: "Full principal return" }
    ],
    status: "active",
    featured: false,
    description: "Ideal entry tier for retail Web3 investors exploring the Regal asset ecosystem."
  },
  {
    id: "regal-gold",
    name: "Regal Gold",
    badge: "Most Popular",
    minAmount: 1000,
    maxAmount: 2999.99,
    referralPercent: 3.0,
    cycleDuration: "8 Months",
    maturityDays: 60,
    roiSchedule: [
      { phase: "Day 1–60", rate: "0.00%", note: "Maturity / Buffer Period" },
      { phase: "Month 3–5", rate: "0.15% Daily", note: "Simple daily accrual" },
      { phase: "Month 6–8", rate: "0.25% Daily", note: "Accelerated yield phase" },
      { phase: "End of Month 8", rate: "100%", note: "Full principal return" }
    ],
    status: "active",
    featured: true,
    description: "Our flagship investment tier balancing high capital efficiency and a 3.0% referral commission."
  },
  {
    id: "regal-black",
    name: "Regal Black",
    badge: "VIP Institutional",
    minAmount: 3000,
    maxAmount: 100000,
    referralPercent: 5.0,
    cycleDuration: "8 Months",
    maturityDays: 60,
    roiSchedule: [
      { phase: "Day 1–60", rate: "0.00%", note: "Maturity / Buffer Period" },
      { phase: "Month 3–5", rate: "0.15% Daily", note: "Simple daily accrual" },
      { phase: "Month 6–8", rate: "0.25% Daily", note: "Accelerated yield phase" },
      { phase: "End of Month 8", rate: "100%", note: "Full principal return" }
    ],
    status: "active",
    featured: false,
    description: "Exclusive tier engineered for institutional participants and high-tier community leaders."
  }
];

export const tokenomicsData = {
  totalSupply: 100000000,
  allocations: [
    { category: "Liquidity", percentage: 20, amount: 20000000, color: "#D4AF37", description: "DEX and CEX trading depth on BNB Chain pairs." },
    { category: "Treasury", percentage: 15, amount: 15000000, color: "#F4D77A", description: "DAO capital reserve and long-term liquidity backing." },
    { category: "Ecosystem", percentage: 25, amount: 25000000, color: "#B8860B", description: "Smart contract development and partnership grants." },
    { category: "Community", percentage: 15, amount: 15000000, color: "#C5A059", description: "Airdrops, community rewards, and governance." },
    { category: "Marketing", percentage: 10, amount: 10000000, color: "#8C6A16", description: "Global campaigns, conferences, and influencer syndicates." },
    { category: "Rewards", percentage: 8, amount: 8000000, color: "#E5C158", description: "Referral bonuses and special incentive pools." },
    { category: "Team", percentage: 5, amount: 5000000, color: "#544415", description: "Core contributors with 24-month linear vesting." },
    { category: "Reserve", percentage: 2, amount: 2000000, color: "#3D3110", description: "Emergency stabilization and black-swan protocol insurance." }
  ],
  utilities: [
    {
      title: "Platform Access",
      icon: "Key",
      description: "Defined platform access and tiered privileges across decentralized ecosystem smart contracts."
    },
    {
      title: "Ecosystem Incentives",
      icon: "Coins",
      description: "Participation rewards, yield opportunities, and tiered incentives across platform activities."
    },
    {
      title: "Partner Benefits",
      icon: "Handshake",
      description: "Exclusive merchant advantages, commercial partner integrations, and ecosystem perks."
    },
    {
      title: "Digital Services",
      icon: "Globe",
      description: "Seamless participation, payment settlement, and interaction across connected Web3 services."
    },
    {
      title: "Governance Features",
      icon: "Users",
      description: "Community-driven consensus, proposal participation, and decentralized governance voting."
    },
    {
      title: "Delivered Products",
      icon: "Briefcase",
      description: "Practical utility directly connected to products and commercial tools actually delivered by the project."
    }
  ]
};

export const roadmapData = [
  {
    stage: "I — Foundation",
    phase: "STAGE I",
    quarter: "Stage 1",
    title: "Foundation",
    status: "Completed",
    description: "Legal structure, tokenomics, smart-contract review, website, documentation, security and compliance framework.",
    milestones: [
      "Legal structure & compliance framework",
      "Tokenomics architecture design",
      "Smart-contract review & audit readiness",
      "Official website & documentation release",
      "Security & compliance framework"
    ]
  },
  {
    stage: "II — Presale",
    phase: "STAGE II",
    quarter: "Stage 2",
    title: "Presale",
    status: "In Progress",
    description: "Launch presale phases, publish official wallets, communicate terms and establish reporting process.",
    milestones: [
      "Launch presale phases",
      "Publish official wallets",
      "Communicate terms & allocation guidelines",
      "Establish reporting process"
    ]
  },
  {
    stage: "III — Business Activation",
    phase: "STAGE III",
    quarter: "Stage 3",
    title: "Business Activation",
    status: "Upcoming",
    description: "Deploy treasury according to policy; initiate and scale permitted general trading and import-export activities.",
    milestones: [
      "Deploy treasury according to policy",
      "Initiate permitted general trading",
      "Scale import-export activities",
      "Real-world commercial business execution"
    ]
  },
  {
    stage: "IV — DEX Launch",
    phase: "STAGE IV",
    quarter: "Stage 4",
    title: "DEX Launch",
    status: "Upcoming",
    description: "Finalize liquidity, complete launch checks, establish liquidity lock and pursue PancakeSwap launch.",
    milestones: [
      "Finalize liquidity provisioning",
      "Complete pre-launch security checks",
      "Establish verifiable liquidity lock",
      "Pursue PancakeSwap DEX launch"
    ]
  }
];

export const faqData = [
  {
    id: 1,
    category: "General",
    question: "What is Regal (RGL)?",
    answer: "Regal is a luxury digital asset and Web3 investment platform deployed on the BNB Smart Chain (BEP-20). It bridges decentralized finance with institutional-grade investment packages, audited smart contracts, transparent daily ROI cycles, and a tiered community referral model."
  },
  {
    id: 2,
    category: "Token",
    question: "Which network is used and what is the token standard?",
    answer: "Regal operates natively on the BNB Smart Chain using the BEP-20 token standard with a hard total supply of 100,000,000 RGL tokens. It delivers ultra-low transaction gas fees and sub-second confirmation finality."
  },
  {
    id: 3,
    category: "Investment",
    question: "How do I invest in a Regal package?",
    answer: "Investing is simple: 1) Click 'Connect Wallet' with MetaMask, Trust Wallet, or WalletConnect; 2) Select your preferred package (Regal Silver, Gold, or Black); 3) Enter the USDT amount; 4) Review terms and approve the smart contract transaction directly from your wallet."
  },
  {
    id: 4,
    category: "Investment",
    question: "When does my ROI begin accruing?",
    answer: "Each package operates on a structured 8-month lifecycle. Days 1 through 60 serve as the liquidity deployment and maturity period (0% ROI). Daily ROI starts on Month 3 at 0.15% per day (Months 3–5), and increases to 0.25% per day during Months 6–8."
  },
  {
    id: 5,
    category: "Referral",
    question: "What are the referral commissions?",
    answer: "Referral rewards are tiered based on package level: Regal Silver generates 1.5%, Regal Gold generates 3.0%, and Regal Black generates 5.0% instant blockchain-verified commission on qualified referred investments."
  },
  {
    id: 6,
    category: "Investment",
    question: "When will I get my initial principal back?",
    answer: "At the conclusion of the 8-month cycle (Month 8 maturity), 100% of your initial investment principal is unlocked and returned to your eligible balance for automated withdrawal or compounding."
  },
  {
    id: 7,
    category: "Security",
    question: "Is the Regal smart contract safe and audited?",
    answer: "Yes. Regal's smart contracts adhere to strict OpenZeppelin standards, featuring formal re-entrancy guards, multi-signature timelocks, and complete third-party auditing. The platform never holds or requests your private keys or seed phrases."
  },
  {
    id: 8,
    category: "Withdrawals",
    question: "Can I withdraw my accrued earnings anytime?",
    answer: "Yes, daily ROI earnings and referral commissions can be claimed and withdrawn to your connected BNB Chain wallet in accordance with standard network gas and minimum withdrawal guidelines."
  },
  {
    id: 9,
    category: "Support",
    question: "Who can I contact for technical or account support?",
    answer: "Our 24/7 concierge support desk is accessible via our Contact page, official Telegram channel (@regal_support), or by emailing support@regal.com."
  }
];

export const docsData = [
  {
    id: "introduction",
    slug: "introduction",
    title: "1. Introduction to Regal",
    category: "Overview",
    content: `### Executive Overview
Regal (RGL) represents the next evolution in decentralized digital asset management. Engineered exclusively on the BNB Smart Chain (BEP-20), Regal combines transparent smart contract logic with high-yield financial packaging.

### Vision & Mission
- **Vision**: Establish a global ecosystem where digital assets and international commerce work together to create sustainable economic activity.
- **Mission**: Build a scalable commercial operation, develop practical token utility, maintain transparent records and establish long-term value through real business execution.
- **Core Principle**: The project is structured around a simple principle: commercial activity first, ecosystem expansion second, and transparency throughout.

### Core Architecture
- **Protocol**: Decentralized asset management protocol
- **Settlement Asset**: USDT (BEP-20) / RGL Token
- **Execution Network**: BNB Smart Chain (Chain ID: 56)
- **Security Standard**: OpenZeppelin v5.0 Audited Contracts`
  },
  {
    id: "rgl-token",
    slug: "rgl-token",
    title: "2. RGL Token Specifications",
    category: "Token",
    content: `### Token Overview
- **Name**: REGAL
- **Symbol**: RGL
- **Decimals**: 18
- **Total Fixed Supply**: 100,000,000 RGL
- **Contract Standard**: BEP-20
- **Minting Policy**: Hard capped, non-inflationary. Zero arbitrary minting.`
  },
  {
    id: "token-contract",
    slug: "token-contract",
    title: "3. Smart Contract Verification",
    category: "Token",
    content: `### Contract Verification
The primary RGL token contract is deployed and verified on BscScan.
- **Contract Address**: \`0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D\`
- **Auditor**: CertiK / Hacken Independent Review
- **Owner Architecture**: Multi-Signature 3/5 Timelock Wallet`
  },
  {
    id: "packages",
    slug: "packages",
    title: "4. Investment Packages",
    category: "Investment",
    content: `### Tier Specifications
1. **Regal Silver**:
   - Minimum: $100.00 | Maximum: $999.99
   - Referral Tier: 1.5%
2. **Regal Gold**:
   - Minimum: $1,000.00 | Maximum: $2,999.99
   - Referral Tier: 3.0%
3. **Regal Black**:
   - Minimum: $3,000.00 | Maximum: Unlimited
   - Referral Tier: 5.0%`
  },
  {
    id: "investment-cycle",
    slug: "investment-cycle",
    title: "5. 8-Month Cycle Structure",
    category: "Investment",
    content: `### Chronological Timeline
- **Phase 0 (Day 1–60)**: 60-Day Capital Deployment Period (0.00% Daily)
- **Phase 1 (Month 3–5)**: Standard Yield Accrual (0.15% Daily Simple Accrual)
- **Phase 2 (Month 6–8)**: Accelerated Yield Accrual (0.25% Daily Simple Accrual)
- **Cycle Conclusion**: 100% Principal Return at Month 8 completion`
  },
  {
    id: "roi-engine",
    slug: "roi-engine",
    title: "6. ROI Calculation Engine",
    category: "Economics",
    content: `### Mathematical Model
Calculations are strictly simple daily accruals without assumed re-investment compounding:
\`\`\`
Daily ROI = Eligible Principal × Daily Rate
\`\`\`
Example ($1,000 Principal):
- Month 3–5: $1,000 × 0.15% = $1.50 / day
- Month 6–8: $1,000 × 0.25% = $2.50 / day`
  },
  {
    id: "referral-system",
    slug: "referral-system",
    title: "7. Referral Commission System",
    category: "Community",
    content: `### Commission Attribution
Referral bonuses are distributed immediately upon blockchain confirmation of the referee's investment package. Anti-fraud filters and unique transaction deduplication guarantee zero double-spends.`
  },
  {
    id: "wallet-guide",
    slug: "wallet-guide",
    title: "8. Web3 Wallet Integration",
    category: "Technical",
    content: `### Supported Providers
- **MetaMask**: Browser Extension & Mobile App
- **Trust Wallet**: Native BSC integration
- **WalletConnect**: Universal QR code bridge for 100+ hardware & mobile wallets`
  },
  {
    id: "security-audits",
    slug: "security-audits",
    title: "9. Security & Nonce Architecture",
    category: "Security",
    content: `### Security Standards
- Non-custodial signature authentication (EIP-712 / Personal Sign)
- Server-side cryptographic nonce verification
- Never stores seed phrases, private keys, or passwords
- Idempotent transaction verification against BSC RPC nodes`
  },
  {
    id: "risk-disclosure",
    slug: "risk-disclosure",
    title: "10. Risk Disclosure Statement",
    category: "Legal",
    content: `### Legal & Regulatory Notice
Participation in blockchain-based digital asset protocols involves financial risk. Market fluctuations on BNB Smart Chain, network congestion, and smart contract protocol updates may impact valuations. Ensure compliance with your local jurisdiction prior to transacting.`
  },
  {
    id: "roadmap",
    slug: "roadmap",
    title: "13. Roadmap",
    category: "Overview",
    content: `### 13 Roadmap Execution Stages

| Stage | Key Milestones |
| :--- | :--- |
| **I — Foundation** | Legal structure, tokenomics, smart-contract review, website, documentation, security and compliance framework. |
| **II — Presale** | Launch presale phases, publish official wallets, communicate terms and establish reporting process. |
| **III — Business Activation** | Deploy treasury according to policy; initiate and scale permitted general trading and import-export activities. |
| **IV — DEX Launch** | Finalize liquidity, complete launch checks, establish liquidity lock and pursue PancakeSwap launch. |`
  },
  {
    id: "token-utility",
    slug: "token-utility",
    title: "14. Token Utility",
    category: "Token",
    content: `### 14 Token Utility
As the ecosystem develops, the token may support defined platform access, ecosystem incentives, partner benefits, participation in digital services, governance features and other utilities connected to products actually delivered by the project.

### Progressive Growth & Market Disclaimer
Utility will be expanded progressively as the underlying ecosystem grows. Token utility should remain distinct from any promise of market appreciation.`
  }
];
