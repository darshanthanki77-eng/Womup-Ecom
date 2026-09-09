import { CheckCircle2, Globe, Lock, Network, ShieldCheck, Sparkles } from "lucide-react";
import React from "react";
import { ecosystemDiagram } from "../assets";

export default function EcosystemSection({ onOpenInvestModal }) {
  return (
    <section id="ecosystem" className="section-padding" style={{ background: "#070707", position: "relative" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Network size={13} />
            INTERCONNECTED ARCHITECTURE
          </div>
          <h2 className="section-title">
            The Regal <span className="gold-gradient-text">Ecosystem</span>
          </h2>
          <p className="section-subtitle" style={{ fontSize: "17px", color: "var(--gold-bright)", fontWeight: 600, marginBottom: "8px" }}>
            One Token. Multiple Opportunities.
          </p>
          <p className="section-subtitle">
            An institutional architecture combining audited BEP-20 tokenomics, automated investment contracts, and decentralized referral incentives.
          </p>
        </div>

        {/* Ecosystem Infographic Diagram */}
        <div
          style={{
            maxWidth: "780px",
            
            margin: "0 auto 60px",
            position: "relative",
            textAlign: "center"
          }}
        >
          {/* Subtle gold glow behind diagram */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "500px",
              height: "500px",
              background: "radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(5, 5, 5, 0) 70%)",
              filter: "blur(50px)",
              pointerEvents: "none",
              zIndex: 0
            }}
          />

          <img
            src={ecosystemDiagram}
            alt="The Regal Ecosystem Diagram"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "18px",
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 15px 40px rgba(0,0,0,0.8)) drop-shadow(0 0 30px rgba(212, 175, 55, 0.18))"
            }}
          />
        </div>

        {/* 3 Supporting Principles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px"
          }}
        >
          <div className="regal-card" style={{ textAlign: "center", background: "#0C0C0C", padding: "30px 24px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid var(--gold-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}
            >
              <CheckCircle2 size={24} color="var(--gold-primary)" />
            </div>
            <h4 style={{ fontSize: "18px", color: "#FFF", marginBottom: "8px" }}>Transparency</h4>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>
              On-chain verification for all deposits, ROI distributions, and commission payments via BscScan explorer.
            </p>
          </div>

          <div className="regal-card" style={{ textAlign: "center", background: "#0C0C0C", padding: "30px 24px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid var(--gold-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}
            >
              <ShieldCheck size={24} color="var(--gold-primary)" />
            </div>
            <h4 style={{ fontSize: "18px", color: "#FFF", marginBottom: "8px" }}>Security</h4>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>
              Audited smart contracts, multi-signature timelocks, and complete non-custodial protocol execution.
            </p>
          </div>

          <div className="regal-card" style={{ textAlign: "center", background: "#0C0C0C", padding: "30px 24px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid var(--gold-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}
            >
              <Globe size={24} color="var(--gold-primary)" />
            </div>
            <h4 style={{ fontSize: "18px", color: "#FFF", marginBottom: "8px" }}>Global Access</h4>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>
              Borderless Web3 ecosystem accessibility with 24/7 liquidity and zero intermediary gatekeeping.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
