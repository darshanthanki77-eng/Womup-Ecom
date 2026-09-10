import { Briefcase, Coins, Globe, Handshake, Key, PieChart, ShieldCheck, Sparkles, Users } from "lucide-react";
import React, { useState } from "react";
import { tokenomicsChart } from "../assets";

export default function TokenomicsSection({ tokenomics }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const utilityIcons = {
    "Platform Access": <Key size={22} color="var(--gold-primary)" />,
    "Ecosystem Incentives": <Coins size={22} color="var(--gold-primary)" />,
    "Partner Benefits": <Handshake size={22} color="var(--gold-primary)" />,
    "Digital Services": <Globe size={22} color="var(--gold-primary)" />,
    "Governance Features": <Users size={22} color="var(--gold-primary)" />,
    "Delivered Products": <Briefcase size={22} color="var(--gold-primary)" />,
    "Investment": <Coins size={22} color="var(--gold-primary)" />,
    "Staking": <ShieldCheck size={22} color="var(--gold-primary)" />,
    "Governance": <Users size={22} color="var(--gold-primary)" />,
    "Ecosystem": <Globe size={22} color="var(--gold-primary)" />
  };

  return (
    <section id="tokenomics" className="section-padding" style={{ background: "#060606", position: "relative" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <PieChart size={13} />
            SUPPLY ARCHITECTURE
          </div>
          <h2 className="section-title">
            Regal <span className="gold-gradient-text">Tokenomics</span>
          </h2>
          <p className="section-subtitle">
            A balanced allocation structure engineered for long-term price stability, deep decentralized liquidity, and protocol-level utility.
          </p>
        </div>

        {/* Donut Chart & Breakdown Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "50px",
            alignItems: "center",
            marginBottom: "70px"
          }}
          className="tokenomics-grid"
        >
          {/* Left Chart Visual */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "360px",
                height: "360px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(5, 5, 5, 0) 70%)",
                filter: "blur(40px)"
              }}
            />
            <img
              src={tokenomicsChart}
              alt="100,000,000 RGL Total Supply Donut Chart"
              style={{
                width: "100%",
                maxWidth: "360px",
                height: "auto",
                borderRadius: "50%",
                position: "relative",
                zIndex: 1,
                filter: "drop-shadow(0 15px 40px rgba(0,0,0,0.8)) drop-shadow(0 0 35px rgba(212, 175, 55, 0.2))"
              }}
            />
          </div>

          {/* Right Allocations Table / Badges */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "20px", color: "#FFF" }}>Allocation Distribution</h3>
              <span style={{ fontSize: "12px", color: "var(--gold-bright)", fontWeight: 600 }}>
                Total: 100,000,000 RGL
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {tokenomics?.allocations && tokenomics.allocations.map((item, idx) => {
                const isHovered = hoveredIndex === idx;
                return (
                  <div
                    key={item.category}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      background: isHovered ? "rgba(212, 175, 55, 0.08)" : "#0E0E0E",
                      border: `1px solid ${isHovered ? "var(--gold-primary)" : "var(--border-standard)"}`,
                      borderRadius: "10px",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease",
                      cursor: "default"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "3px",
                          background: item.color,
                          display: "inline-block"
                        }}
                      />
                      <div>
                        <span style={{ fontWeight: 700, color: "#F5F5F5", fontSize: "14px" }}>
                          {item.category}
                        </span>
                        <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                          {item.description}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--gold-bright)", fontSize: "15px" }}>
                        {item.percentage}%
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                        {item.amount.toLocaleString()} RGL
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 14 Token Utility Section */}
        <div style={{ marginTop: "50px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "20px",
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.25)",
                fontSize: "12px",
                color: "var(--gold-bright)",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "12px"
              }}
            >
              <Sparkles size={13} />
              14 • TOKEN UTILITY
            </div>
            <h3 style={{ fontSize: "28px", color: "#FFF", fontWeight: 800, marginBottom: "12px" }}>
              Token <span className="gold-text">Utility</span>
            </h3>
            <p
              style={{
                fontSize: "15px",
                color: "#D1D5DB",
                maxWidth: "840px",
                margin: "0 auto",
                lineHeight: "1.75"
              }}
            >
              As the ecosystem develops, the token may support defined platform access, ecosystem incentives, partner benefits, participation in digital services, governance features and other utilities connected to products actually delivered by the project.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "28px"
            }}
          >
            {tokenomics?.utilities && tokenomics.utilities.map((util) => (
              <div
                key={util.title}
                className="regal-card"
                style={{
                  background: "#0A0A0A",
                  textAlign: "center",
                  padding: "26px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(212, 175, 55, 0.1)",
                    border: "1px solid var(--gold-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px"
                  }}
                >
                  {utilityIcons[util.title] || <Coins size={22} color="var(--gold-primary)" />}
                </div>
                <h4 style={{ fontSize: "16.5px", color: "#FFF", marginBottom: "8px", fontWeight: 700 }}>{util.title}</h4>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  {util.description}
                </p>
              </div>
            ))}
          </div>

          {/* Progressive Expansion & Market Appreciation Notice */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(15, 15, 15, 0.95) 100%)",
              border: "1px solid rgba(212, 175, 55, 0.25)",
              borderRadius: "14px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(212, 175, 55, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <ShieldCheck size={22} color="var(--gold-primary)" />
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
                Progressive Ecosystem Expansion
              </div>
              <p style={{ fontSize: "13.5px", color: "#E5E5E5", marginTop: "4px", lineHeight: "1.6", margin: "4px 0 0" }}>
                Utility will be expanded progressively as the underlying ecosystem grows. Token utility should remain distinct from any promise of market appreciation.
              </p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .tokenomics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
