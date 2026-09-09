import { Copy, ExternalLink, Globe, Shield, Terminal } from "lucide-react";
import React, { useState } from "react";
import { coinHero } from "../assets";

export default function Footer({ onNavigate, onOpenInvestModal }) {
  const [copied, setCopied] = useState(false);
  const contractAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      style={{
        background: "#050505",
        borderTop: "1px solid var(--border-standard)",
        paddingTop: "80px",
        paddingBottom: "40px",
        position: "relative",
        zIndex: 1
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "50px",
            marginBottom: "60px"
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: "320px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <img src={coinHero} alt="Regal" style={{ width: "36px", height: "36px" }} />
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 800, color: "#F5F5F5", letterSpacing: "0.05em" }}>
                REGAL
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", marginBottom: "22px" }}>
              A luxury digital asset and investment ecosystem engineered on the BNB Smart Chain (BEP-20). Transparent yield mechanics, audited contracts, and institutional security.
            </p>

            {/* Contract Address Pill */}
            <div
              style={{
                background: "#0A0A0A",
                border: "1px solid var(--border-standard)",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px"
              }}
            >
              <div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  BEP-20 Contract
                </div>
                <div style={{ fontSize: "12px", color: "var(--gold-bright)", fontFamily: "monospace" }}>
                  0x7a25...488D
                </div>
              </div>
              <button
                onClick={handleCopy}
                style={{
                  background: "rgba(212, 175, 55, 0.1)",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  color: "var(--gold-primary)",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Copy size={12} />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Column 1: Regal */}
          <div>
            <h4 style={{ fontSize: "15px", color: "var(--gold-bright)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Regal Ecosystem
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {["about", "ecosystem", "token", "tokenomics", "roadmap"].map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(id);
                    }}
                    style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.target.style.color = "var(--gold-bright)")}
                    onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1).replace("-", " ")}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 style={{ fontSize: "15px", color: "var(--gold-bright)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Investment
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {["packages", "how-it-works", "faq", "docs"].map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(id);
                    }}
                    style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.target.style.color = "var(--gold-bright)")}
                    onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
                  >
                    {id === "how-it-works" ? "How It Works" : id.toUpperCase()}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={onOpenInvestModal}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--gold-primary)",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  Launch Investment Flow →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h4 style={{ fontSize: "15px", color: "var(--gold-bright)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Legal & Support
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); onNavigate("contact"); }}
                  style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px" }}
                >
                  Contact Concierge
                </a>
              </li>
              <li>
                <a
                  href="#docs"
                  onClick={(e) => { e.preventDefault(); onNavigate("docs"); }}
                  style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px" }}
                >
                  Risk Disclosure
                </a>
              </li>
              <li>
                <a
                  href="https://bscscan.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  BscScan Explorer <ExternalLink size={13} />
                </a>
              </li>
              <li>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  Official Telegram <ExternalLink size={13} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider & copyright */}
        <div
          style={{
            borderTop: "1px solid var(--border-standard)",
            paddingTop: "30px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "18px",
            fontSize: "13px",
            color: "var(--text-muted)"
          }}
        >
          <div>
            © 2026 REGAL (RGL). All rights reserved.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E" }}></span>
              BNB Smart Chain Mainnet (Chain ID: 56)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
