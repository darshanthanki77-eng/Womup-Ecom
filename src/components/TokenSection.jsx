import {
    Coins,
    Copy,
    ExternalLink
} from "lucide-react";
import React, { useState } from "react";
import { coinHero } from "../assets";

export default function TokenSection({ tokenInfo }) {
  const [copied, setCopied] = useState(false);
  const contractAddress = tokenInfo?.contractAddress || "0xcc6Ba1e3a452fd0b184204723E49eB30691e53A5";

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="token" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Coins size={13} />
            NATIVE ASSET
          </div>
          <h2 className="section-title">
            REGAL <span className="gold-gradient-text">(RGL)</span> Token
          </h2>
          <p className="section-subtitle">
            RGL is the audited BEP-20 utility and settlement token engineered exclusively to power the Regal investment architecture on BNB Smart Chain.
          </p>
        </div>

        {/* Token Specs Card */}
        <div
          className="regal-card"
          style={{
            background: "linear-gradient(135deg, #101010 0%, #0A0A0A 100%)",
            border: "1px solid var(--border-highlight)",
            padding: "36px"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              alignItems: "center"
            }}
            className="token-hero-grid"
          >
            {/* Left Token Visual & Details */}
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <img
                src={coinHero}
                alt="RGL Coin"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 25px rgba(212, 175, 55, 0.35))"
                }}
              />
              <div>
                <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                  Standard BEP-20
                </span>
                <h3 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
                  REGAL (RGL)
                </h3>
                <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "6px" }}>
                  Fixed hard supply, non-custodial allowance protocol, zero arbitrary minting.
                </p>
              </div>
            </div>

            {/* Right 3 Metric Badges */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "14px"
              }}
              className="token-metrics-grid"
            >
              <div style={{ background: "#050505", border: "1px solid var(--border-standard)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Supply</div>
                <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "4px" }}>
                  100,000,000
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>RGL</div>
              </div>

              <div style={{ background: "#050505", border: "1px solid var(--border-standard)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Network</div>
                <div style={{ fontSize: "17px", fontWeight: 800, color: "#FFF", marginTop: "4px" }}>
                  BNB Chain
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>ChainId 56</div>
              </div>

              <div style={{ background: "#050505", border: "1px solid var(--border-standard)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Standard</div>
                <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--gold-primary)", marginTop: "4px" }}>
                  BEP-20
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Decimals 18</div>
              </div>
            </div>
          </div>

          {/* Contract Address Bar */}
          <div
            style={{
              marginTop: "30px",
              paddingTop: "24px",
              borderTop: "1px solid #1C1C1C",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px"
            }}
          >
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Verified Contract Address (BNB Smart Chain)
              </span>
              <div style={{ fontFamily: "monospace", fontSize: "15px", color: "var(--gold-bright)", marginTop: "2px" }}>
                {contractAddress}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleCopy}
                className="btn btn-outline-gold btn-sm"
              >
                <Copy size={13} />
                {copied ? "Copied!" : "Copy Address"}
              </button>
              <a
                href={tokenInfo?.explorerUrl || "https://bscscan.com"}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
              >
                View on BscScan <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 840px) {
          .token-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .token-metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
