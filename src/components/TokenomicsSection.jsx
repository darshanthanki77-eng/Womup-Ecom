import { Coins, Globe, PieChart, ShieldCheck, Sparkles, Users } from "lucide-react";
import React, { useState } from "react";
import { tokenomicsChart } from "../assets";

export default function TokenomicsSection({ tokenomics }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const utilityIcons = {
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

        {/* 4 Token Utility Cards */}
        <div>
          <h3 style={{ fontSize: "22px", color: "#FFF", marginBottom: "24px", textAlign: "center" }}>
            Token <span className="gold-text">Utility & Mechanics</span>
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px"
            }}
          >
            {tokenomics?.utilities && tokenomics.utilities.map((util) => (
              <div
                key={util.title}
                className="regal-card"
                style={{
                  background: "#0A0A0A",
                  textAlign: "center",
                  padding: "28px 20px"
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
                    margin: "0 auto 16px"
                  }}
                >
                  {utilityIcons[util.title] || <Coins size={22} color="var(--gold-primary)" />}
                </div>
                <h4 style={{ fontSize: "17px", color: "#FFF", marginBottom: "8px" }}>{util.title}</h4>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  {util.description}
                </p>
              </div>
            ))}
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
