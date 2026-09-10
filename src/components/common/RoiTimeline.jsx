import { CheckCircle2, Clock, Coins, ShieldCheck, Sparkles } from "lucide-react";
import React from "react";

export default function RoiTimeline({ currentPhase = "Month 3–5" }) {
  const steps = [
    {
      id: "Day 1–60",
      title: "Day 1–60",
      rate: "0.00% ROI",
      desc: "Capital Deployment & Protocol Buffer. Zero yield distributed.",
      icon: <ShieldCheck size={18} color="var(--gold-primary)" />
    },
    {
      id: "Month 3–5",
      title: "Month 3–5",
      rate: "0.15% Daily",
      desc: "Simple daily yield accrual credited directly to investor balance.",
      icon: <Clock size={18} color="var(--gold-bright)" />
    },
    {
      id: "Month 6–8",
      title: "Month 6–8",
      rate: "0.25% Daily",
      desc: "Accelerated protocol yield phase maximizing cycle returns.",
      icon: <Sparkles size={18} color="var(--gold-bright)" />
    },
    {
      id: "Maturity",
      title: "Month 8 End",
      rate: "100% Principal Return",
      desc: "Full initial capital unlocked for withdrawal or restaking.",
      icon: <Coins size={18} color="#22C55E" />
    }
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        position: "relative"
      }}
    >
      {steps.map((step, idx) => {
        const isCurrent = step.id === currentPhase;
        return (
          <div
            key={step.id}
            style={{
              background: isCurrent ? "rgba(212, 175, 55, 0.08)" : "#090909",
              border: `1px solid ${isCurrent ? "var(--gold-primary)" : "var(--border-standard)"}`,
              borderRadius: "14px",
              padding: "20px",
              position: "relative",
              boxShadow: isCurrent ? "0 0 30px rgba(212, 175, 55, 0.15)" : "none",
              transition: "all 0.3s ease"
            }}
          >
            {isCurrent && (
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "14px",
                  background: "var(--gold-gradient)",
                  color: "#050505",
                  fontSize: "9px",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "999px",
                  letterSpacing: "0.08em"
                }}
              >
                CURRENT ACTIVE
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: isCurrent ? "rgba(212, 175, 55, 0.2)" : "#151515",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {step.icon}
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Stage 0{idx + 1}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#F5F5F5" }}>
                  {step.title}
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 800,
                color: idx === 3 ? "#22C55E" : isCurrent ? "var(--gold-bright)" : "var(--gold-primary)",
                marginBottom: "6px"
              }}
            >
              {step.rate}
            </div>

            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              {step.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
