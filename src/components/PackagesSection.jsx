import { ArrowRight, Check, Crown, Flame, Shield, Sparkles } from "lucide-react";
import React from "react";

export default function PackagesSection({ packages, onSelectPackage }) {
  return (
    <section id="packages" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Crown size={13} />
            INVESTMENT TIERS
          </div>
          <h2 className="section-title">
            Structured <span className="gold-gradient-text">Investment Packages</span>
          </h2>
          <p className="section-subtitle">
            Engineered with transparent yield progression, automated smart-contract accounting, and instant tiered referral commissions on BNB Smart Chain.
          </p>
        </div>

        {/* 3 Package Cards */}
        <div
          className="packages-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "24px",
            alignItems: "stretch"
          }}
        >
          {packages && packages.map((pkg) => {
            const isFeatured = pkg.featured || pkg.id === "regal-gold";
            return (
              <div
                key={pkg.id}
                className="regal-card"
                style={{
                  background: isFeatured ? "#121212" : "var(--bg-card)",
                  borderColor: isFeatured ? "var(--gold-primary)" : "var(--border-standard)",
                  boxShadow: isFeatured ? "0 20px 60px rgba(212, 175, 55, 0.18)" : "var(--shadow-card)",
                  transform: isFeatured ? "scale(1.02)" : "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative"
                }}
              >
                {/* Most Popular Badge for Gold */}
                {isFeatured && (
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "20px",
                      background: "var(--gold-gradient)",
                      color: "#050505",
                      fontSize: "10.5px",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "4px 12px",
                      borderRadius: "999px",
                      boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <Flame size={12} /> MOST POPULAR
                  </div>
                )}

                <div>
                  {/* Tier Title & Badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: isFeatured ? "rgba(212, 175, 55, 0.2)" : "rgba(255, 255, 255, 0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Crown size={18} color={isFeatured ? "var(--gold-bright)" : "#A0A0A0"} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#F5F5F5" }}>{pkg.name}</h3>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {pkg.badge}
                      </span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div style={{ margin: "24px 0", borderBottom: "1px solid var(--border-standard)", paddingBottom: "22px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Capital Range
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "30px",
                        fontWeight: 800,
                        color: isFeatured ? "var(--gold-bright)" : "#FFFFFF",
                        marginTop: "4px"
                      }}
                    >
                      ${pkg.minAmount.toLocaleString()}{" "}
                      <span style={{ fontSize: "16px", fontWeight: 500, color: "var(--text-secondary)" }}>
                        to {pkg.maxAmount >= 10000 ? "Unlimited" : `$${pkg.maxAmount.toLocaleString()}`}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--gold-primary)", fontWeight: 600, marginTop: "6px" }}>
                      USDT (BEP-20)
                    </div>
                  </div>

                  {/* Referral Highlight */}
                  <div
                    style={{
                      background: "rgba(212, 175, 55, 0.06)",
                      border: "1px solid rgba(212, 175, 55, 0.25)",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "24px"
                    }}
                  >
                    <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>Referral Commission:</span>
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 800, color: "var(--gold-bright)" }}>
                      {pkg.referralPercent}%
                    </span>
                  </div>

                  {/* Features List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px" }}>
                      <Check size={16} color="var(--gold-primary)" style={{ marginTop: "2px", flexShrink: 0 }} />
                      <span><strong>Day 1–60:</strong> 0.00% (Capital Deployment Period)</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px" }}>
                      <Check size={16} color="var(--gold-primary)" style={{ marginTop: "2px", flexShrink: 0 }} />
                      <span><strong>Month 3–5:</strong> 0.15% Daily Simple Yield</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px" }}>
                      <Check size={16} color="var(--gold-primary)" style={{ marginTop: "2px", flexShrink: 0 }} />
                      <span><strong>Month 6–8:</strong> 0.25% Daily Accelerated Yield</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px" }}>
                      <Check size={16} color="var(--gold-primary)" style={{ marginTop: "2px", flexShrink: 0 }} />
                      <span><strong>Cycle End:</strong> 100% Principal Return</span>
                    </div>
                  </div>
                </div>

                {/* Select CTA */}
                <button
                  onClick={() => onSelectPackage(pkg)}
                  className={isFeatured ? "btn btn-gold" : "btn btn-outline"}
                  style={{ width: "100%", padding: "14px 0", fontSize: "14.5px" }}
                >
                  Select {pkg.name} <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
