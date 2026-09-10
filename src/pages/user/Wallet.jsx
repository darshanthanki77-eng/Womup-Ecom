import { Check, Copy, ExternalLink, Globe, Lock, LogOut, Radio, RefreshCw, ShieldAlert, ShieldCheck, Wallet } from "lucide-react";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import StatusPill from "../../components/common/StatusPill";

export default function UserWallet() {
  const { user } = useOutletContext();
  const [copied, setCopied] = useState(false);
  const [network, setNetwork] = useState("BNB Smart Chain (Chain ID: 56)");

  const handleCopy = () => {
    navigator.clipboard.writeText(user.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
          WEB3 INFRASTRUCTURE
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Connected <span className="gold-gradient-text">Wallet</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Non-custodial cryptographic connection to BNB Smart Chain. You maintain full ownership of your keys at all times.
        </p>
      </div>

      {/* Main Wallet Card */}
      <div className="regal-card" style={{ background: "linear-gradient(135deg, #101010 0%, #060606 100%)", borderColor: "var(--gold-primary)", padding: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(212,175,55,0.15)", border: "1px solid var(--gold-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={24} color="var(--gold-bright)" />
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                CONNECTED ACCOUNT
              </span>
              <div style={{ fontFamily: "monospace", fontSize: "16px", color: "#FFF", fontWeight: 700 }}>
                {user.walletAddress}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleCopy} className="btn btn-gold btn-sm">
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Address"}
            </button>
            <a
              href={`https://bscscan.com/address/${user.walletAddress}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
            >
              <ExternalLink size={14} /> BscScan
            </a>
          </div>
        </div>

        {/* 3 Token Balances Grid with Ambient Floating Token Watermarks */}
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
            {/* Ambient Token Watermark */}
            <div style={{ position: "absolute", right: "-10px", bottom: "-15px", fontSize: "72px", fontWeight: 900, color: "rgba(255, 255, 255, 0.03)", fontFamily: "var(--font-heading)", pointerEvents: "none", userSelect: "none" }}>
              BNB
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", position: "relative", zIndex: 2 }}>BNB Balance (Gas)</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 800, color: "#F5F5F5", marginTop: "4px", position: "relative", zIndex: 2 }}>
              {user.balances.bnb} BNB
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
            {/* Ambient Token Watermark */}
            <div style={{ position: "absolute", right: "-10px", bottom: "-15px", fontSize: "72px", fontWeight: 900, color: "rgba(212, 175, 55, 0.04)", fontFamily: "var(--font-heading)", pointerEvents: "none", userSelect: "none" }}>
              USDT
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", position: "relative", zIndex: 2 }}>USDT (BEP-20)</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "4px", position: "relative", zIndex: 2 }}>
              ${user.balances.usdt}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px", position: "relative", zIndex: 2 }}>Available Investment Capital</div>
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
            {/* Ambient Token Watermark */}
            <div style={{ position: "absolute", right: "-10px", bottom: "-15px", fontSize: "72px", fontWeight: 900, color: "rgba(212, 175, 55, 0.08)", fontFamily: "var(--font-heading)", pointerEvents: "none", userSelect: "none" }}>
              RGL
            </div>
            <div style={{ fontSize: "11px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.06em", position: "relative", zIndex: 2 }}>REGAL (RGL)</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "4px", position: "relative", zIndex: 2 }}>
              {user.balances.rgl} RGL
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px", position: "relative", zIndex: 2 }}>Native Ecosystem Protocol Token</div>
          </div>
        </div>
      </div>

      {/* Network & Node Details with Animated Ripple Signal */}
      <div className="regal-card" style={{ padding: "24px", background: "rgba(13, 13, 13, 0.85)" }}>
        <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "16px" }}>Network Configurations</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", fontSize: "13px" }}>
          <div style={{ background: "rgba(7, 7, 7, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>NETWORK</div>
            <div style={{ color: "#FFF", fontWeight: 700, marginTop: "2px" }}>BNB Smart Chain Mainnet</div>
          </div>
          <div style={{ background: "rgba(7, 7, 7, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>CHAIN ID</div>
            <div style={{ color: "var(--gold-bright)", fontWeight: 700, marginTop: "2px" }}>56 (0x38)</div>
          </div>
          <div style={{ background: "rgba(7, 7, 7, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>NODE LATENCY</div>
            <div style={{ color: "#22C55E", fontWeight: 700, marginTop: "2px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#22C55E",
                  boxShadow: "0 0 10px #22C55E",
                  animation: "ripplePulse 2s infinite"
                }}
              />
              180ms (Optimal Node Sync)
            </div>
          </div>
          <div style={{ background: "rgba(7, 7, 7, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>CONNECTION MODE</div>
            <div style={{ color: "#FFF", fontWeight: 700, marginTop: "2px" }}>Browser Provider (MetaMask / Web3)</div>
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
