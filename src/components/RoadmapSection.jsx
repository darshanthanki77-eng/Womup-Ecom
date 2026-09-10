import { Calendar, CheckCircle2, Circle, Clock, Compass, Sparkles } from "lucide-react";
import React from "react";

export default function RoadmapSection({ roadmap }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return {
          bg: "rgba(34, 197, 94, 0.15)",
          color: "#22C55E",
          border: "rgba(34, 197, 94, 0.4)",
          icon: <CheckCircle2 size={13} />
        };
      case "In Progress":
        return {
          bg: "rgba(212, 175, 55, 0.2)",
          color: "var(--gold-bright)",
          border: "rgba(212, 175, 55, 0.5)",
          icon: <Clock size={13} />
        };
      default:
        return {
          bg: "rgba(255, 255, 255, 0.05)",
          color: "#A0A0A0",
          border: "rgba(255, 255, 255, 0.1)",
          icon: <Circle size={13} />
        };
    }
  };

  const romanNumerals = ["I", "II", "III", "IV", "V"];

  return (
    <section id="roadmap" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Sparkles size={13} />
            13 • ROADMAP
          </div>
          <h2 className="section-title">
            Project <span className="gold-gradient-text">Roadmap</span>
          </h2>
          <p className="section-subtitle">
            Strategic milestone progression from legal foundation and presale to real-world commercial activation and DEX liquidity lock.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div
          style={{
            maxWidth: "840px",
            margin: "0 auto",
            position: "relative"
          }}
        >
          {/* Vertical gold line down center/left */}
          <div
            style={{
              position: "absolute",
              top: "30px",
              bottom: "30px",
              left: "28px",
              width: "2px",
              background: "linear-gradient(180deg, var(--gold-primary) 0%, rgba(212, 175, 55, 0.2) 100%)",
              zIndex: 0
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "34px", position: "relative", zIndex: 1 }}>
            {roadmap && roadmap.map((item, idx) => {
              const badge = getStatusBadge(item.status);
              const isActive = item.status === "In Progress" || item.status === "Completed";
              const stageNumeral = romanNumerals[idx] || (idx + 1);

              return (
                <div
                  key={item.phase || idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "28px"
                  }}
                >
                  {/* Step Marker with Roman Numeral */}
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: isActive ? "var(--gold-gradient)" : "#141414",
                      color: isActive ? "#050505" : "#888",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-heading)",
                      fontSize: "17px",
                      fontWeight: 800,
                      flexShrink: 0,
                      boxShadow: isActive ? "0 0 25px rgba(212, 175, 55, 0.4)" : "none",
                      border: "2px solid #050505"
                    }}
                  >
                    {stageNumeral}
                  </div>

                  {/* Card Content */}
                  <div
                    className="regal-card"
                    style={{
                      flex: 1,
                      background: "#0D0D0D",
                      border: `1px solid ${isActive ? "rgba(212, 175, 55, 0.35)" : "var(--border-standard)"}`,
                      padding: "26px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--gold-primary)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {item.stage || `Stage ${stageNumeral}`}
                        </span>
                        <h3 style={{ fontSize: "21px", color: "#FFF", marginTop: "2px", fontWeight: 700 }}>
                          {item.title}
                        </h3>
                      </div>

                      {/* Status pill */}
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: "999px",
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px"
                        }}
                      >
                        {badge.icon} {item.status}
                      </span>
                    </div>

                    <p style={{ fontSize: "14px", color: "#E0E0E0", marginBottom: "16px", lineHeight: "1.65" }}>
                      {item.description}
                    </p>

                    {/* Milestones list */}
                    {item.milestones && item.milestones.length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        {item.milestones.map((m, mIdx) => (
                          <div key={mIdx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12.5px", color: "var(--text-secondary)" }}>
                            <CheckCircle2 size={14} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official 13 Roadmap Milestones Table */}
        <div style={{ marginTop: "60px", maxWidth: "840px", margin: "60px auto 0" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 12px",
                borderRadius: "20px",
                background: "rgba(212, 175, 55, 0.08)",
                fontSize: "11px",
                color: "var(--gold-bright)",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "8px"
              }}
            >
              SUMMARY MATRIX
            </div>
            <h3 style={{ fontSize: "20px", color: "#FFF", fontWeight: 700 }}>
              Stages & <span className="gold-text">Key Milestones</span>
            </h3>
          </div>

          <div
            className="regal-card"
            style={{
              padding: 0,
              overflow: "hidden",
              border: "1px solid rgba(212, 175, 55, 0.25)",
              background: "#080808"
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#0F1423", borderBottom: "1px solid rgba(212, 175, 55, 0.3)" }}>
                    <th style={{ padding: "16px 22px", color: "#FFF", fontWeight: 700, width: "230px" }}>Stage</th>
                    <th style={{ padding: "16px 22px", color: "#FFF", fontWeight: 700 }}>Key Milestones</th>
                  </tr>
                </thead>
                <tbody>
                  {roadmap && roadmap.map((item, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: idx === roadmap.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.07)",
                        background: idx % 2 === 0 ? "rgba(255, 255, 255, 0.01)" : "rgba(212, 175, 55, 0.02)"
                      }}
                    >
                      <td style={{ padding: "16px 22px", verticalAlign: "top", fontWeight: 700, color: "var(--gold-bright)", whiteSpace: "nowrap" }}>
                        {item.stage || `Stage ${romanNumerals[idx] || (idx + 1)} — ${item.title}`}
                      </td>
                      <td style={{ padding: "16px 22px", color: "#D1D5DB", lineHeight: "1.65" }}>
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
