import {
    AlertCircle,
    ArrowDownUp,
    ArrowRight,
    Check,
    Coins,
    Copy,
    ExternalLink,
    Loader2,
    RefreshCw,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Wallet
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import StatusPill from "../../components/common/StatusPill";
import { CONTRACT_ADDRESSES } from "../../config/web3Config";
import { useWallet } from "../../context/WalletContext";
import { api } from "../../services/api";
import web3Service from "../../services/web3Service";

export default function UserWallet() {
  const { user } = useOutletContext();
  const wallet = useWallet();
  const [copied, setCopied] = useState(false);
  const [contractParams, setContractParams] = useState(null);
  const [loadingParams, setLoadingParams] = useState(true);

  // Swap State
  const [swapMode, setSwapMode] = useState("buy"); // "buy" | "sell"
  const [swapAmount, setSwapAmount] = useState("");
  const [swapState, setSwapState] = useState("idle"); // "idle" | "broadcasting" | "success" | "error"
  const [swapTxHash, setSwapTxHash] = useState("");
  const [swapError, setSwapError] = useState("");

  const activeWalletAddress = wallet.account;

  const handleCopy = () => {
    if (!activeWalletAddress) return;
    navigator.clipboard.writeText(activeWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fetch live contract parameters from deployed RegalToken contract
  const fetchContractData = async () => {
    setLoadingParams(true);
    try {
      const data = await web3Service.getContractParameters();
      setContractParams(data);
    } catch (e) {
      console.warn("Could not fetch contract data directly, falling back to API:", e);
      const res = await api.blockchain.getContractState();
      if (res.success) setContractParams(res.data);
    } finally {
      setLoadingParams(false);
    }
  };

  useEffect(() => {
    fetchContractData();
  }, []);

  const buyRate = contractParams?.buyRate || 1000;
  const sellRate = contractParams?.sellRate || 1000;

  // Calculate swap output
  const calculatedOutput = () => {
    const amt = parseFloat(swapAmount);
    if (isNaN(amt) || amt <= 0) return "0.00";
    if (swapMode === "buy") {
      return (amt * buyRate).toLocaleString(undefined, { maximumFractionDigits: 2 });
    } else {
      return (amt / sellRate).toFixed(4);
    }
  };

  // Execute on-chain Buy or Sell via RegalToken contract
  const handleExecuteSwap = async () => {
    const amt = parseFloat(swapAmount);
    if (isNaN(amt) || amt <= 0) {
      setSwapError("Please enter a valid amount.");
      return;
    }

    if (!wallet.isConnected) {
      try {
        await wallet.connect();
      } catch (ce) {
        setSwapError("Please connect your MetaMask wallet to execute swap.");
        return;
      }
    }

    if (!wallet.isCorrectChain) {
      try {
        await wallet.switchNetwork(56);
      } catch (ne) {
        setSwapError("Please switch to BNB Smart Chain (Chain ID: 56).");
        return;
      }
    }

    setSwapState("broadcasting");
    setSwapError("");
    setSwapTxHash("");

    try {
      let result;
      if (swapMode === "buy") {
        result = await web3Service.buyRGL(amt);
      } else {
        result = await web3Service.sellRGL(amt);
      }

      setSwapTxHash(result.txHash);
      setSwapState("success");
      setSwapAmount("");
      if (wallet.account) wallet.refreshBalances(wallet.account);
      fetchContractData();
    } catch (err) {
      console.error("Swap execution failed:", err);
      setSwapState("error");
      setSwapError(err.message || "Smart contract swap execution failed.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
            WEB3 INFRASTRUCTURE & CONTRACT TERMINAL
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
            Connected <span className="gold-gradient-text">Wallet & RGL Swap</span>
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Direct non-custodial interaction with RegalToken BEP-20 contract (<code>{CONTRACT_ADDRESSES.RGL_TOKEN.slice(0, 10)}...</code>) on BNB Smart Chain.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {!wallet.isConnected ? (
            <button onClick={() => wallet.connect()} className="btn btn-gold btn-sm">
              <Wallet size={14} /> Connect MetaMask
            </button>
          ) : (
            <button onClick={() => wallet.refreshBalances()} className="btn btn-outline-gold btn-sm">
              <RefreshCw size={14} /> Refresh Web3 Balances
            </button>
          )}
        </div>
      </div>

      {/* Main Wallet Card */}
      <div className="regal-card" style={{ background: "linear-gradient(135deg, #101010 0%, #060606 100%)", borderColor: "var(--gold-primary)", padding: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(212,175,55,0.15)", border: "1px solid var(--gold-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={24} color="var(--gold-bright)" />
            </div>
            <div>
              <span style={{ fontSize: "11px", color: wallet.isConnected ? "#22C55E" : "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {wallet.isConnected ? "METAMASK CONNECTED" : "METAMASK NOT CONNECTED"}
              </span>
              <div style={{ fontFamily: "monospace", fontSize: "16px", color: wallet.isConnected ? "#FFF" : "var(--text-muted)", fontWeight: 700, fontStyle: wallet.isConnected ? "normal" : "italic" }}>
                {wallet.isConnected && activeWalletAddress ? activeWalletAddress : "No Wallet Connected"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {wallet.isConnected && activeWalletAddress ? (
              <>
                <button onClick={handleCopy} className="btn btn-gold btn-sm">
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Address"}
                </button>
                <a
                  href={`https://bscscan.com/address/${activeWalletAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <ExternalLink size={14} /> BscScan
                </a>
              </>
            ) : (
              <button onClick={() => wallet.connect()} className="btn btn-gold btn-sm">
                <Wallet size={14} /> Connect MetaMask
              </button>
            )}
          </div>
        </div>

        {/* 3 Token Balances Grid with Live Web3 / Backend Sync */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <div
            className="regal-card card-spotlight"
            style={{
              background: "rgba(10, 10, 10, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "20px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", right: "-10px", bottom: "-15px", fontSize: "72px", fontWeight: 900, color: "rgba(255, 255, 255, 0.03)", fontFamily: "var(--font-heading)", pointerEvents: "none", userSelect: "none" }}>
              BNB
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", position: "relative", zIndex: 2 }}>BNB Balance (Gas)</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 800, color: "#F5F5F5", marginTop: "4px", position: "relative", zIndex: 2 }}>
              {wallet.isConnected ? wallet.balances.bnb : user.balances.bnb} BNB
            </div>
            <div style={{ fontSize: "11px", color: "#22C55E", marginTop: "4px", position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22C55E" }} />
              Native Network Asset
            </div>
          </div>

          <div
            className="regal-card card-spotlight"
            style={{
              background: "rgba(10, 10, 10, 0.8)",
              border: "1px solid rgba(212, 175, 55, 0.25)",
              borderRadius: "12px",
              padding: "20px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div style={{ position: "absolute", right: "-10px", bottom: "-15px", fontSize: "72px", fontWeight: 900, color: "rgba(212, 175, 55, 0.04)", fontFamily: "var(--font-heading)", pointerEvents: "none", userSelect: "none" }}>
              USDT
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", position: "relative", zIndex: 2 }}>USDT (BEP-20)</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "4px", position: "relative", zIndex: 2 }}>
              ${wallet.isConnected ? wallet.balances.usdt : user.balances.usdt}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px", position: "relative", zIndex: 2 }}>Available Capital</div>
          </div>

          <div
            className="regal-card card-spotlight"
            style={{
              background: "linear-gradient(135deg, rgba(28, 22, 10, 0.7) 0%, rgba(12, 10, 5, 0.85) 100%)",
              border: "1px solid var(--gold-bright)",
              borderRadius: "12px",
              padding: "20px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 0 20px rgba(212, 175, 55, 0.15)"
            }}
          >
            <div style={{ position: "absolute", right: "-10px", bottom: "-15px", fontSize: "72px", fontWeight: 900, color: "rgba(212, 175, 55, 0.08)", fontFamily: "var(--font-heading)", pointerEvents: "none", userSelect: "none" }}>
              RGL
            </div>
            <div style={{ fontSize: "11px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.06em", position: "relative", zIndex: 2 }}>REGAL (RGL)</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "4px", position: "relative", zIndex: 2 }}>
              {wallet.isConnected ? wallet.balances.rgl : user.balances.rgl} RGL
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px", position: "relative", zIndex: 2 }}>Ecosystem BEP-20 Token</div>
          </div>
        </div>
      </div>

      {/* RGL Smart Contract Swap Module */}
      <div className="regal-card" style={{ padding: "28px", border: "1px solid rgba(212, 175, 55, 0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "20px", color: "#FFF", display: "flex", alignItems: "center", gap: "8px" }}>
              <Coins size={20} color="var(--gold-primary)" /> RegalToken Smart Contract Swap
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
              Trade directly against the deployed <code>RegalToken.sol</code> contract on BNB Smart Chain.
            </p>
          </div>

          {/* Swap Tabs */}
          <div style={{ display: "flex", background: "#0A0A0A", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-standard)" }}>
            <button
              onClick={() => { setSwapMode("buy"); setSwapError(""); setSwapTxHash(""); }}
              style={{
                padding: "6px 16px",
                borderRadius: "6px",
                border: "none",
                background: swapMode === "buy" ? "var(--gold-primary)" : "transparent",
                color: swapMode === "buy" ? "#000" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              Buy RGL with BNB
            </button>
            <button
              onClick={() => { setSwapMode("sell"); setSwapError(""); setSwapTxHash(""); }}
              style={{
                padding: "6px 16px",
                borderRadius: "6px",
                border: "none",
                background: swapMode === "sell" ? "var(--gold-primary)" : "transparent",
                color: swapMode === "sell" ? "#000" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              Sell RGL for BNB
            </button>
          </div>
        </div>

        {/* Swap Form */}
        <div style={{ maxWidth: "560px", margin: "0 auto", background: "#0A0A0A", padding: "24px", borderRadius: "14px", border: "1px solid var(--border-standard)" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              {swapMode === "buy" ? "Send BNB (from connected wallet)" : "Sell RGL (tokens to burn/return)"}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                style={{
                  width: "100%",
                  background: "#121212",
                  border: "1px solid var(--border-standard)",
                  borderRadius: "10px",
                  padding: "14px 70px 14px 16px",
                  color: "#FFF",
                  fontSize: "18px",
                  fontWeight: 700,
                  outline: "none"
                }}
              />
              <span style={{ position: "absolute", right: "16px", top: "16px", color: "var(--gold-bright)", fontWeight: 800 }}>
                {swapMode === "buy" ? "BNB" : "RGL"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowDownUp size={16} color="var(--gold-bright)" />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              Estimated Output Received
            </label>
            <div
              style={{
                width: "100%",
                background: "#161616",
                border: "1px solid var(--border-standard)",
                borderRadius: "10px",
                padding: "14px 70px 14px 16px",
                color: "var(--gold-bright)",
                fontSize: "18px",
                fontWeight: 800,
                position: "relative"
              }}
            >
              {calculatedOutput()}
              <span style={{ position: "absolute", right: "16px", top: "14px", color: "#FFF", fontWeight: 700 }}>
                {swapMode === "buy" ? "RGL" : "BNB"}
              </span>
            </div>
          </div>

          {/* Rates and Info */}
          <div style={{ background: "#050505", borderRadius: "8px", padding: "12px", fontSize: "12px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Exchange Rate:</span>
              <span style={{ color: "#FFF", fontWeight: 600 }}>
                {swapMode === "buy" ? `1 BNB = ${buyRate} RGL` : `${sellRate} RGL = 1 BNB`}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Target Contract:</span>
              <a
                href={`https://bscscan.com/address/${CONTRACT_ADDRESSES.RGL_TOKEN}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--gold-bright)", textDecoration: "none", fontFamily: "monospace" }}
              >
                {CONTRACT_ADDRESSES.RGL_TOKEN.slice(0, 10)}...{CONTRACT_ADDRESSES.RGL_TOKEN.slice(-6)}
              </a>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Contract Status:</span>
              <span style={{ color: contractParams?.paused ? "#EF4444" : "#22C55E", fontWeight: 600 }}>
                {contractParams?.paused ? "PAUSED" : "ACTIVE"}
              </span>
            </div>
          </div>

          {swapError && (
            <div style={{ color: "#EF4444", fontSize: "13px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertCircle size={15} /> {swapError}
            </div>
          )}

          {swapTxHash && (
            <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", padding: "12px", marginBottom: "14px", fontSize: "12px" }}>
              <div style={{ color: "#22C55E", fontWeight: 700, marginBottom: "4px" }}>
                Swap Completed Successfully!
              </div>
              <a
                href={`https://bscscan.com/tx/${swapTxHash}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--gold-bright)", wordBreak: "break-all" }}
              >
                View on BscScan: {swapTxHash}
              </a>
            </div>
          )}

          <button
            onClick={handleExecuteSwap}
            disabled={swapState === "broadcasting"}
            className="btn btn-gold btn-lg"
            style={{ width: "100%" }}
          >
            {swapState === "broadcasting" ? (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Loader2 size={16} className="spin" /> Confirming in MetaMask...
              </span>
            ) : (
              <span>{swapMode === "buy" ? "Buy RGL with BNB" : "Sell RGL for BNB"} <ArrowRight size={16} /></span>
            )}
          </button>
        </div>
      </div>

      {/* Network & Deployed Contract Technical Specifications */}
      <div className="regal-card" style={{ padding: "24px", background: "rgba(13, 13, 13, 0.85)" }}>
        <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "16px" }}>Verified Smart Contract Parameters</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", fontSize: "13px" }}>
          <div style={{ background: "rgba(7, 7, 7, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>OFFICIAL CONTRACT</div>
            <div style={{ color: "var(--gold-bright)", fontFamily: "monospace", fontSize: "12px", marginTop: "2px" }}>
              {CONTRACT_ADDRESSES.RGL_TOKEN}
            </div>
          </div>
          <div style={{ background: "rgba(7, 7, 7, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>NETWORK & CHAIN ID</div>
            <div style={{ color: "#FFF", fontWeight: 700, marginTop: "2px" }}>BNB Smart Chain (56 / 0x38)</div>
          </div>
          <div style={{ background: "rgba(7, 7, 7, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>TOTAL SUPPLY</div>
            <div style={{ color: "#FFF", fontWeight: 700, marginTop: "2px" }}>
              {contractParams?.totalSupply ? Number(contractParams.totalSupply).toLocaleString() : "100,000,000"} RGL
            </div>
          </div>
          <div style={{ background: "rgba(7, 7, 7, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>CONTRACT BNB RESERVE</div>
            <div style={{ color: "#22C55E", fontWeight: 700, marginTop: "2px" }}>
              {contractParams?.contractBnbReserve || "0.0"} BNB
            </div>
          </div>
        </div>
      </div>

      {/* Non-Custodial Security Notice */}
      <div
        style={{
          background: "rgba(212, 175, 55, 0.05)",
          border: "1px solid rgba(212, 175, 55, 0.25)",
          borderRadius: "14px",
          padding: "20px",
          display: "flex",
          alignItems: "flex-start",
          gap: "14px"
        }}
      >
        <ShieldCheck size={24} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
          <strong style={{ color: "var(--gold-bright)" }}>Zero Private Key Storage Guarantee:</strong> Regal operates on pure non-custodial smart contract principles. The platform will never request, store, or transmit your seed phrases, private keys, or wallet passwords. All approvals happen exclusively in your provider interface.
        </div>
      </div>
    </div>
  );
}
