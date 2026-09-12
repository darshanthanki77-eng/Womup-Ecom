import {
    AlertCircle,
    ArrowRight,
    Check,
    CheckCircle2,
    Coins,
    Crown,
    ExternalLink,
    Flame,
    Layers,
    Loader2,
    Shield,
    Sparkles,
    Wallet
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";

import confetti from "canvas-confetti";
import { useWallet } from "../../context/WalletContext";
import web3Service from "../../services/web3Service";

const defaultPackages = [
  { id: "regal-silver", packageId: "regal-silver", name: "Regal Silver", minAmount: 100, maxAmount: 999.99, referralPercent: 1.5, phase1Rate: "0.15%", phase2Rate: "0.25%" },
  { id: "regal-gold", packageId: "regal-gold", name: "Regal Gold", minAmount: 1000, maxAmount: 2999.99, referralPercent: 3.0, phase1Rate: "0.15%", phase2Rate: "0.25%" },
  { id: "regal-black", packageId: "regal-black", name: "Regal Black", minAmount: 3000, maxAmount: 1000000, referralPercent: 5.0, phase1Rate: "0.15%", phase2Rate: "0.25%" }
];

export default function UserInvestment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useOutletContext();
  const wallet = useWallet();
  const [packages, setPackages] = useState(defaultPackages);
  const [selectedPkg, setSelectedPkg] = useState(defaultPackages[1]);
  const [amount, setAmount] = useState(defaultPackages[1].minAmount.toString());
  const [status, setStatus] = useState("idle"); // idle | validating | waiting_for_metamask | broadcasting | pending_verification | confirmed
  const [confirmedData, setConfirmedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [hoveredPkg, setHoveredPkg] = useState(null);

  // Fetch live package boundaries from backend
  useEffect(() => {
    api.packages.getAll().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setPackages(res.data);
        const initial = res.data[1] || res.data[0];
        setSelectedPkg(initial);
        setAmount(initial.minAmount.toString());
      }
    });
  }, []);

  // Pre-select package if passed via URL or state (e.g. from landing page)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetName = params.get("package") || location.state?.selectedPackage;
    if (targetName && packages.length > 0) {
      const match = packages.find(
        (p) =>
          p.name.toLowerCase() === targetName.toLowerCase() ||
          p.id?.toLowerCase() === targetName.toLowerCase() ||
          p.packageId?.toLowerCase() === targetName.toLowerCase() ||
          p.name.toLowerCase().includes(targetName.toLowerCase())
      );
      if (match) {
        setSelectedPkg(match);
        setAmount(match.minAmount.toString());
      }
    }
  }, [location, packages]);

  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
    setAmount(pkg.minAmount.toString());
    setErrorMsg("");
  };

  const handleStartInvestment = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < selectedPkg.minAmount || (selectedPkg.maxAmount < 1000000 && val > selectedPkg.maxAmount)) {
      setErrorMsg(`Amount must be between $${selectedPkg.minAmount.toLocaleString()} and $${selectedPkg.maxAmount.toLocaleString()} USDT.`);
      return;
    }
    setErrorMsg("");

    try {
      // Step 1: Ensure MetaMask is installed in the browser
      if (!web3Service.isMetaMaskAvailable()) {
        throw new Error("MetaMask is not detected. Please install the MetaMask browser extension to make on-chain investments.");
      }

      // Step 2: Open MetaMask to Connect Wallet if not already connected
      setStatus("waiting_for_metamask");
      let activeWallet = wallet.account;
      if (!wallet.isConnected || !activeWallet) {
        const connectRes = await wallet.connect();
        activeWallet = typeof connectRes === "string" ? connectRes : (connectRes?.account || wallet.account);
      }

      // Step 3: Ensure wallet is on BSC (Mainnet 56 or Testnet 97)
      const currentChain = await web3Service.getChainId();
      if (currentChain !== 56 && currentChain !== 97) {
        setStatus("waiting_for_metamask");
        await web3Service.switchToBSC(56);
      }

      // Step 4: Prepare Investment on Server
      setStatus("validating");
      const prepRes = await api.investments.prepare(selectedPkg.packageId || selectedPkg.id, val, activeWallet);

      if (!prepRes.success || !prepRes.data) {
        throw new Error(prepRes.error || "Failed to prepare investment terms with server.");
      }

      const prepData = prepRes.data;

      // Step 5: Open MetaMask for Payment / Investment Transfer
      setStatus("waiting_for_metamask");

      let txResult;
      if (prepData.asset === "RGL") {
        txResult = await web3Service.transferRGL(prepData.treasuryAddress, val);
      } else if (prepData.asset === "USDT") {
        txResult = await web3Service.transferUSDT(prepData.treasuryAddress, val);
      } else {
        txResult = await web3Service.transferBNB(prepData.treasuryAddress, val);
      }

      const txHash = txResult.txHash;

      // Step 6: Submit to Server for Independent Verification
      setStatus("broadcasting");
      setTimeout(() => setStatus("pending_verification"), 800);

      const res = await api.investments.submit({
        packageId: selectedPkg.packageId || selectedPkg.id,
        amount: val,
        txHash,
        walletAddress: activeWallet,
        investmentRequestId: prepData.investmentRequestId,
        asset: prepData.asset
      });

      if (res.success && res.data) {
        setStatus("confirmed");
        setConfirmedData({
          invId: res.data.investmentId,
          txHash: res.data.txHash,
          blockNumber: res.data.blockNumber || txResult.blockNumber,
          timestamp: new Date(res.data.startDate || Date.now()).toISOString().replace("T", " ").slice(0, 19)
        });

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#D4AF37", "#F4D77A", "#22C55E", "#FFFFFF"]
          });
        } catch (ce) {}

        if (wallet.refreshBalances) wallet.refreshBalances(activeWallet);
      } else {
        setStatus("idle");
        setErrorMsg(res.error || "Investment verification failed on BNB Smart Chain.");
      }
    } catch (err) {
      setStatus("idle");
      if (err.code === 4001 || err.message?.toLowerCase().includes("user rejected") || err.message?.toLowerCase().includes("rejected")) {
        setErrorMsg("MetaMask prompt was cancelled or closed.");
      } else if (err.message?.toLowerCase().includes("insufficient funds") || err.message?.toLowerCase().includes("exceeds balance")) {
        setErrorMsg("Insufficient wallet balance: Ensure your connected MetaMask account has enough BEP-20 USDT and BNB (for gas) on BNB Smart Chain.");
      } else if (err.message?.toLowerCase().includes("switch network") || err.message?.toLowerCase().includes("chain")) {
        setErrorMsg("Network error: Please switch your MetaMask network to BNB Smart Chain (Chain ID: 56).");
      } else {
        setErrorMsg(err.message || "Failed to complete investment process.");
      }
    }
  };


  const parseDailyRate = (rate) => {
    if (typeof rate === "number") {
      // MongoDB stores 0.0015 (which is 0.15%)
      return rate > 0.05 ? rate / 100 : rate;
    }
    const clean = parseFloat(String(rate || "0.15").replace("%", ""));
    return isNaN(clean) ? 0.0015 : (clean > 0.05 ? clean / 100 : clean);
  };

  const numAmount = parseFloat(amount) || selectedPkg.minAmount;
  const p1Rate = parseDailyRate(selectedPkg.phase1Rate);
  const p2Rate = parseDailyRate(selectedPkg.phase2Rate);
  const phase1DailyYield = (numAmount * p1Rate).toFixed(2);
  const phase2DailyYield = (numAmount * p2Rate).toFixed(2);
  const totalPhase1Yield = (parseFloat(phase1DailyYield) * 90).toFixed(2); // Month 3–5 (~90 days)
  const totalPhase2Yield = (parseFloat(phase2DailyYield) * 90).toFixed(2); // Month 6–8 (~90 days)
  const totalProjectedYield = (parseFloat(totalPhase1Yield) + parseFloat(totalPhase2Yield)).toFixed(2);
  const totalEstimatedReturn = (numAmount + parseFloat(totalProjectedYield)).toFixed(2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
          CAPITAL DEPLOYMENT
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Create New <span className="gold-gradient-text">Investment</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Select your desired investment tier, allocate USDT on BNB Smart Chain, and initiate automated 8-month protocol yield.
        </p>
      </div>

      {/* Package Selection Cards with Metallic Visual Styling & Hover Focus Dimming */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "20px" }}>
        {packages.map((pkg, index) => {
          const currentKey = pkg.id || pkg._id || pkg.packageId || `pkg-${index}`;
          const currentId = (pkg.id || pkg.packageId || "").toLowerCase();
          const selectedId = (selectedPkg?.id || selectedPkg?._id || selectedPkg?.packageId || "").toString().toLowerCase();
          const thisId = (pkg.id || pkg._id || pkg.packageId || "").toString().toLowerCase();
          const isSelected = selectedId === thisId;
          const isGold = currentId.includes("gold") || (pkg.name && pkg.name.toLowerCase().includes("gold"));
          const isBlack = currentId.includes("black") || (pkg.name && pkg.name.toLowerCase().includes("black"));
          const isSilver = currentId.includes("silver") || (pkg.name && pkg.name.toLowerCase().includes("silver"));
          const isDimmed = hoveredPkg && hoveredPkg !== currentKey;

          // Metallic theme backgrounds
          let cardBg = "rgba(18, 18, 18, 0.75)";
          let cardBorder = "rgba(255, 255, 255, 0.1)";
          if (isSilver) {
            cardBg = isSelected
              ? "linear-gradient(145deg, rgba(32, 42, 54, 0.9) 0%, rgba(16, 22, 30, 0.95) 100%)"
              : "linear-gradient(145deg, rgba(22, 28, 36, 0.7) 0%, rgba(12, 16, 22, 0.85) 100%)";
            cardBorder = isSelected ? "rgba(148, 163, 184, 0.7)" : "rgba(148, 163, 184, 0.25)";
          } else if (isGold) {
            cardBg = isSelected
              ? "linear-gradient(145deg, rgba(42, 32, 14, 0.95) 0%, rgba(20, 15, 6, 0.98) 100%)"
              : "linear-gradient(145deg, rgba(28, 22, 10, 0.75) 0%, rgba(14, 11, 5, 0.85) 100%)";
            cardBorder = isSelected ? "var(--gold-bright)" : "rgba(212, 175, 55, 0.35)";
          } else if (isBlack) {
            cardBg = isSelected
              ? "linear-gradient(145deg, rgba(28, 28, 28, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)"
              : "linear-gradient(145deg, rgba(16, 16, 16, 0.75) 0%, rgba(6, 6, 6, 0.85) 100%)";
            cardBorder = isSelected ? "rgba(245, 245, 245, 0.6)" : "rgba(255, 255, 255, 0.15)";
          }

          return (
            <div
              key={currentKey}
              onClick={() => handleSelectPackage(pkg)}
              onMouseEnter={() => setHoveredPkg(currentKey)}
              onMouseLeave={() => setHoveredPkg(null)}
              className="regal-card card-spotlight"
              style={{
                background: cardBg,
                borderColor: cardBorder,
                boxShadow: isSelected
                  ? isGold
                    ? "0 0 35px rgba(212, 175, 55, 0.3)"
                    : isSilver
                    ? "0 0 30px rgba(148, 163, 184, 0.25)"
                    : "0 0 30px rgba(255, 255, 255, 0.15)"
                  : "none",
                cursor: "pointer",
                padding: "26px",
                position: "relative",
                opacity: isDimmed ? 0.65 : 1,
                transform: isSelected ? "translateY(-4px)" : "translateY(0)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {isGold && (
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "16px",
                    background: "var(--gold-gradient)",
                    color: "#050505",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    letterSpacing: "0.06em",
                    boxShadow: "0 0 15px rgba(212, 175, 55, 0.6)",
                    animation: "breathingGlow 2.5s ease-in-out infinite"
                  }}
                >
                  ★ MOST POPULAR
                </div>
              )}

              {isBlack && (
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "16px",
                    background: "linear-gradient(90deg, #222, #444)",
                    color: "#E2E8F0",
                    border: "1px solid rgba(255,255,255,0.2)",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    letterSpacing: "0.06em"
                  }}
                >
                  ELITE VIP
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: isSelected ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${isSelected ? "rgba(212,175,55,0.5)" : "rgba(255,255,255,0.1)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Crown size={20} color={isSelected ? "var(--gold-bright)" : "#A0A0A0"} />
                </div>
                <div>
                  <h3 style={{ fontSize: "19px", color: "#FFF", fontWeight: 800 }}>{pkg.name}</h3>
                  <span style={{ fontSize: "11px", color: isGold ? "var(--gold-bright)" : "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                    Tier {pkg.referralPercent}% Commission
                  </span>
                </div>
              </div>

              <div style={{ margin: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "14px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Capital Boundaries</div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "25px", fontWeight: 800, color: isSelected ? "var(--gold-bright)" : "#FFF", marginTop: "4px" }}>
                  ${pkg.minAmount.toLocaleString()}{" "}
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>
                    to {pkg.maxAmount >= 100000 ? "Unlimited" : `$${pkg.maxAmount.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12.5px", color: "var(--text-secondary)" }}>
                <div>• <strong style={{ color: "#FFF" }}>Maturity Buffer:</strong> {pkg.maturityDays || 60} Days (0% ROI)</div>
                <div>• <strong style={{ color: "var(--gold-bright)" }}>Month 3–5:</strong> {typeof pkg.phase1Rate === "number" && pkg.phase1Rate < 0.05 ? `${(pkg.phase1Rate * 100).toFixed(2)}%` : String(pkg.phase1Rate || "0.15%").includes("%") ? pkg.phase1Rate : `${pkg.phase1Rate}%`} Daily Accrual</div>
                <div>• <strong style={{ color: "#22C55E" }}>Month 6–8:</strong> {typeof pkg.phase2Rate === "number" && pkg.phase2Rate < 0.05 ? `${(pkg.phase2Rate * 100).toFixed(2)}%` : String(pkg.phase2Rate || "0.25%").includes("%") ? pkg.phase2Rate : `${pkg.phase2Rate}%`} Daily Accelerated</div>
                <div>• <strong style={{ color: "#FFF" }}>Cycle Duration:</strong> {pkg.cycleDurationDays ? `${Math.round(pkg.cycleDurationDays / 30)} Months (${pkg.cycleDurationDays} Days)` : "8 Months Protocol"}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Investment Submission & Verification Console */}
      <div className="regal-card" style={{ padding: "32px", background: "rgba(14, 14, 14, 0.85)" }}>
        {status === "idle" && (
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <h3 style={{ fontSize: "22px", color: "#FFF", marginBottom: "6px" }}>
              Configure Deployment for <span className="gold-text">{selectedPkg.name}</span>
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px" }}>
              Funds are deposited in BEP-20 USDT into the audited Regal Investment contract on BNB Smart Chain.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label className="regal-label" style={{ margin: 0 }}>Investment Principal Amount (USDT):</label>
                  <span style={{ fontSize: "12px", color: "var(--gold-bright)", fontWeight: 700 }}>
                    Range: ${selectedPkg.minAmount.toLocaleString()} – ${selectedPkg.maxAmount >= 100000 ? "Unlimited" : selectedPkg.maxAmount.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="regal-input"
                    style={{ flex: 1, minWidth: "160px", fontSize: "20px", fontWeight: 800, color: "var(--gold-bright)" }}
                  />
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {[selectedPkg.minAmount, selectedPkg.minAmount * 2, selectedPkg.minAmount * 5].map((preset, idx) => (
                      <button
                        key={`preset-${preset}-${idx}`}
                        onClick={() => setAmount(preset.toString())}
                        className="btn btn-outline btn-sm"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        ${preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Dynamic Capital Range Slider */}
                <input
                  type="range"
                  min={selectedPkg.minAmount}
                  max={Math.min(selectedPkg.maxAmount, 50000)}
                  step={100}
                  value={Math.min(numAmount, 50000)}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: "100%",
                    accentColor: "var(--gold-primary)",
                    cursor: "pointer",
                    height: "6px"
                  }}
                />
              </div>

              {/* Real-time Reactive Yield Calculator Box */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(10,10,10,0.8) 100%)",
                  border: "1px solid rgba(212, 175, 55, 0.28)",
                  borderRadius: "12px",
                  padding: "18px 20px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <Sparkles size={16} color="var(--gold-bright)" />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Live Yield & Return Projections
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: "14px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Month 3–5 Daily Yield</div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "2px" }}>
                      +${phase1DailyYield} <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>/ day</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Month 6–8 Accelerated</div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "#22C55E", marginTop: "2px" }}>
                      +${phase2DailyYield} <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>/ day</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Est. Total ROI Yield</div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "#FFF", marginTop: "2px" }}>
                      +${parseFloat(totalProjectedYield).toLocaleString()} USDT
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Payout (Prin+ROI)</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "2px" }}>
                      ${parseFloat(totalEstimatedReturn).toLocaleString()} USDT
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Wallet & Network Display */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "14px", background: "rgba(7, 7, 7, 0.8)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-standard)" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Funding Wallet</div>
                  {wallet.isConnected && wallet.account ? (
                    <>
                      <div style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--gold-bright)", marginTop: "2px", wordBreak: "break-all" }}>
                        {wallet.account}
                      </div>
                      <div style={{ fontSize: "10px", color: "#22C55E", marginTop: "4px" }}>
                        ✓ MetaMask Connected ({wallet.balances.usdt} USDT / {wallet.balances.bnb} BNB)
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px", fontStyle: "italic" }}>
                        Wallet Not Connected
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => wallet.connect()}
                          style={{
                            fontSize: "11px",
                            color: "#000",
                            background: "var(--gold-primary)",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 12px",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px"
                          }}
                        >
                          <Wallet size={12} /> Connect MetaMask
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const addr = prompt("Paste your BSC Wallet Address (from MetaMask Account 1):");
                            if (addr) wallet.connectManual(addr.trim());
                          }}
                          style={{
                            fontSize: "11px",
                            color: "var(--gold-bright)",
                            background: "rgba(212, 175, 55, 0.1)",
                            border: "1px solid rgba(212, 175, 55, 0.3)",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            cursor: "pointer"
                          }}
                        >
                          Paste Address
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Network Standard</div>
                  <div style={{ fontSize: "13px", color: !wallet.isConnected ? "var(--gold-bright)" : (wallet.isCorrectChain ? "#22C55E" : "#EF4444"), fontWeight: 600, marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: !wallet.isConnected ? "var(--gold-bright)" : (wallet.isCorrectChain ? "#22C55E" : "#EF4444") }} />
                    {!wallet.isConnected ? "BNB Smart Chain (Chain ID: 56)" : wallet.isCorrectChain ? "BNB Smart Chain (Mainnet 56)" : `Wrong Chain (${wallet.chainId})`}
                  </div>
                  {wallet.isConnected && !wallet.isCorrectChain && (
                    <button
                      type="button"
                      onClick={() => wallet.switchNetwork(56)}
                      style={{ fontSize: "11px", color: "var(--gold-bright)", background: "rgba(212,175,55,0.1)", border: "1px solid var(--gold-bright)", borderRadius: "4px", padding: "2px 8px", cursor: "pointer", marginTop: "6px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      Switch to BSC (56)
                    </button>
                  )}
                </div>
              </div>

              {/* Protocol Terms Alert */}
              <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "10px", padding: "14px", fontSize: "12.5px", color: "var(--text-secondary)" }}>
                <strong style={{ color: "var(--gold-bright)" }}>Protocol Settlement Rule:</strong> Days 1 through 60 are the non-yielding liquidity deployment buffer. Daily simple ROI begins strictly on Month 3 at {typeof selectedPkg.phase1Rate === "number" && selectedPkg.phase1Rate < 0.05 ? `${(selectedPkg.phase1Rate * 100).toFixed(2)}%` : selectedPkg.phase1Rate} daily, accelerating to {typeof selectedPkg.phase2Rate === "number" && selectedPkg.phase2Rate < 0.05 ? `${(selectedPkg.phase2Rate * 100).toFixed(2)}%` : selectedPkg.phase2Rate} daily in Months 6–8, with 100% principal return at Month 8.
              </div>

              {errorMsg && (
                <div style={{ color: "#EF4444", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "12.5px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600 }}>
                    <AlertCircle size={15} />
                    {errorMsg.includes("Unable to find any account for 60")
                      ? "MetaMask Notice: Unable to find active account"
                      : errorMsg}
                  </div>
                  {errorMsg.includes("Unable to find any account for 60") && (
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      1. In MetaMask, click the back arrow (<strong>&lt;</strong>) at the top-left of the extension to exit the Notifications screen.<br />
                      2. Ensure <strong>Account 1</strong> is visible.<br />
                      3. Alternatively, click <strong>"Paste Address"</strong> above to link your wallet immediately.
                    </div>
                  )}
                </div>
              )}

              <button onClick={handleStartInvestment} className="btn btn-gold btn-lg" style={{ width: "100%", marginTop: "8px" }}>
                {!wallet.isConnected ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    Connect MetaMask & Pay (${parseFloat(amount || 0).toLocaleString()} USDT) <ArrowRight size={16} />
                  </span>
                ) : (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    Confirm & Pay via MetaMask (${parseFloat(amount || 0).toLocaleString()} USDT) <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {status === "validating" && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Loader2 size={42} color="var(--gold-primary)" style={{ animation: "spin 1.2s linear infinite", margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "20px", color: "#FFF", marginBottom: "8px" }}>Authorizing Investment Request...</h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>Preparing verified smart contract routing token with the backend.</p>
          </div>
        )}

        {status === "waiting_for_metamask" && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Wallet size={42} color="var(--gold-bright)" style={{ margin: "0 auto 16px", animation: "pulse 1.5s infinite" }} />
            <h3 style={{ fontSize: "20px", color: "#FFF", marginBottom: "8px" }}>Awaiting MetaMask Signature...</h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>Please confirm the deposit transaction in your MetaMask browser extension.</p>
          </div>
        )}

        {status === "broadcasting" && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Loader2 size={42} color="var(--gold-primary)" style={{ animation: "spin 1.2s linear infinite", margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "20px", color: "#FFF", marginBottom: "8px" }}>Broadcasting to BNB Smart Chain...</h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>Submitting transaction hash to BSC mempool and ledger.</p>
          </div>
        )}

        {status === "pending_verification" && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Shield size={42} color="var(--gold-bright)" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "20px", color: "#FFF", marginBottom: "8px" }}>Awaiting Backend On-Chain Verification...</h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", maxWidth: "480px", margin: "0 auto" }}>
              Transaction mined. The Regal backend node is now strictly validating the blockchain receipt to prevent simulated false approvals.
            </p>
          </div>
        )}

        {status === "confirmed" && confirmedData && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "2px solid #22C55E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <CheckCircle2 size={36} color="#22C55E" />
            </div>
            <h3 style={{ fontSize: "24px", color: "#FFF", marginBottom: "6px" }}>Investment Successfully Activated!</h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
              Your contract is active and verified on BNB Smart Chain.
            </p>

            <div style={{ maxWidth: "520px", margin: "0 auto 28px", background: "#080808", border: "1px solid var(--border-standard)", borderRadius: "12px", padding: "20px", textAlign: "left", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Investment ID:</span>
                <span style={{ color: "var(--gold-bright)", fontWeight: 700 }}>{confirmedData.invId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Amount & Tier:</span>
                <span style={{ color: "#FFF", fontWeight: 700 }}>${parseFloat(amount).toLocaleString()} USDT ({selectedPkg.name})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Block Height:</span>
                <span style={{ color: "#FFF", fontFamily: "monospace" }}>#{confirmedData.blockNumber}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Tx Hash:</span>
                <span style={{ color: "var(--gold-primary)", fontFamily: "monospace" }}>{confirmedData.txHash.slice(0, 14)}...{confirmedData.txHash.slice(-8)}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => navigate("/investments")} className="btn btn-gold">
                View My Investments
              </button>
              <button onClick={() => navigate("/dashboard")} className="btn btn-outline-gold">
                Go to Dashboard
              </button>
              <button onClick={() => setStatus("idle")} className="btn btn-outline">
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
