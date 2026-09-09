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

  return (
    <section id="roadmap" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Compass size={13} />
            STRATEGIC MILESTONES
          </div>
          <h2 className="section-title">
            Project <span className="gold-gradient-text">Roadmap</span>
          </h2>
          <p className="section-subtitle">
            Our multi-phase execution timeline taking Regal from foundational audited smart contracts to a decentralized global asset ecosystem.
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

              return (
                <div
                  key={item.phase}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "28px"
                  }}
                >
                  {/* Step Marker */}
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: isActive ? "var(--gold-gradient)" : "#141414",
                      color: isActive ? "#050505" : "#666",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-heading)",
                      fontSize: "18px",
                      fontWeight: 800,
                      flexShrink: 0,
                      boxShadow: isActive ? "0 0 25px rgba(212, 175, 55, 0.4)" : "none",
                      border: "2px solid #050505"
                    }}
                  >
                    {idx + 1}
                  </div>

                  {/* Card Content */}
                  <div
                    className="regal-card"
                    style={{
                      flex: 1,
                      background: "#0D0D0D",
                      border: `1px solid ${isActive ? "rgba(212, 175, 55, 0.3)" : "var(--border-standard)"}`,
                      padding: "26px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--gold-primary)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {item.phase} • {item.quarter}
                        </span>
                        <h3 style={{ fontSize: "20px", color: "#FFF", marginTop: "2px" }}>{item.title}</h3>
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

                    <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.6" }}>
                      {item.description}
                    </p>

                    {/* Milestones list */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
                      {item.milestones.map((m, mIdx) => (
                        <div key={mIdx} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "12.5px", color: "#D1D1D1" }}>
                          <CheckCircle2 size={14} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
