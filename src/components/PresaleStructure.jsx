import {
  ArrowRight,
  ArrowUpRight,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  Coins,
  DollarSign,
  Flame,
  Layers,
  Percent,
  Radio,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Official RGL Presale Structure Data (Strictly preserved)
const presalePhases = [
  {
    phase: "Phase 1",
    phaseNumber: "01",
    allocation: "5,000,000",
    allocationNum: 5000000,
    price: "0.25",
    priceNum: 0.25,
    proceeds: "1,250,000",
    percentage: 25,
    status: "CURRENT PHASE",
    isLive: true,
    growth: "Base Price",
    summary: "Institutional & early backer entry round with preferential valuation."
  },
  {
    phase: "Phase 2",
    phaseNumber: "02",
    allocation: "7,000,000",
    allocationNum: 7000000,
    price: "0.45",
    priceNum: 0.45,
    proceeds: "3,150,000",
    percentage: 35,
    status: "UPCOMING",
    isLive: false,
    growth: "+80.0%",
    summary: "Expansion allocation stage preparing for decentralized ecosystem deployment."
  },
  {
    phase: "Phase 3",
    phaseNumber: "03",
    allocation: "8,000,000",
    allocationNum: 8000000,
    price: "0.60",
    priceNum: 0.60,
    proceeds: "4,800,000",
    percentage: 40,
    status: "FINAL STAGE",
    isLive: false,
    growth: "+140.0%",
    summary: "Final distribution tranche prior to liquidity pool lock and trading activation."
  }
];

export default function PresaleStructure({ onOpenInvestModal }) {
  const [hoveredPhase, setHoveredPhase] = useState(null);
  const [calcPhaseIndex, setCalcPhaseIndex] = useState(0); // Default Phase 1
  const [isPhaseDropdownOpen, setIsPhaseDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [calcAmount, setCalcAmount] = useState(500); // Default $500
  const [targetListingPrice, setTargetListingPrice] = useState(1.50); // $1.50 listing benchmark

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsPhaseDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedPhase = presalePhases[calcPhaseIndex];
  const calculatedTokens = Math.floor(calcAmount / selectedPhase.priceNum);
  const projectedListingValue = calculatedTokens * targetListingPrice;
  const projectedRoiPercent = calcAmount > 0 
    ? Math.round(((projectedListingValue - calcAmount) / calcAmount) * 100) 
    : 0;

  const quickAmounts = [100, 250, 500, 1000, 2500, 5000];

  return (
    <section
      id="presale"
      className="section-padding"
      style={{
        position: "relative",
        background: "radial-gradient(ellipse at 50% 10%, rgba(212, 175, 55, 0.05) 0%, #050505 60%, #030303 100%)",
        borderTop: "1px solid rgba(212, 175, 55, 0.12)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.12)",
        overflow: "hidden"
      }}
    >
      {/* Subtle Web3 Ambient Grid & Radial Aura */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(212, 175, 55, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212, 175, 55, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          opacity: 0.7
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "750px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.09) 0%, rgba(5, 5, 5, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none"
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: "center", marginBottom: "50px" }}>
          <div
            className="section-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              background: "rgba(212, 175, 55, 0.08)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "var(--gold-bright)",
              textTransform: "uppercase",
              marginBottom: "16px"
            }}
          >
            <Layers size={13} color="var(--gold-primary)" />
            OFFICIAL TOKEN ARCHITECTURE
          </div>
          <h2
            className="section-title"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: "16px"
            }}
          >
            RGL <span className="gold-gradient-text">Presale Structure</span>
          </h2>
          <p
            className="section-subtitle"
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              fontSize: "16px",
              color: "var(--text-secondary)",
              lineHeight: 1.6
            }}
          >
            Three progressive presale phases with increasing RGL token value.
          </p>
        </div>

        {/* Desktop Progressive Timeline Bar */}
        <div
          className="presale-timeline-container"
          style={{
            maxWidth: "960px",
            margin: "0 auto 48px",
            padding: "20px 24px",
            background: "rgba(16, 16, 16, 0.65)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            borderRadius: "16px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative"
            }}
            className="presale-timeline-row"
          >
            {/* Connecting Gold Progression Track */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "10%",
                right: "10%",
                height: "2px",
                background: "linear-gradient(90deg, #D4AF37 0%, #8C6A16 50%, #F4D77A 100%)",
                opacity: 0.35,
                zIndex: 0
              }}
              className="presale-timeline-track"
            />

            {presalePhases.map((p, idx) => {
              const isHovered = hoveredPhase === idx;
              return (
                <div
                  key={p.phase}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "transform 0.2s ease"
                  }}
                  onMouseEnter={() => setHoveredPhase(idx)}
                  onMouseLeave={() => setHoveredPhase(null)}
                  onClick={() => setCalcPhaseIndex(idx)}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: p.isLive
                        ? "linear-gradient(135deg, #D4AF37 0%, #8C6A16 100%)"
                        : "#141414",
                      border: `2px solid ${p.isLive ? "#F4D77A" : isHovered ? "var(--gold-primary)" : "rgba(212, 175, 55, 0.3)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: p.isLive ? "#050505" : "#FFF",
                      fontWeight: 800,
                      fontSize: "14px",
                      boxShadow: p.isLive
                        ? "0 0 20px rgba(212, 175, 55, 0.45)"
                        : isHovered
                        ? "0 0 14px rgba(212, 175, 55, 0.25)"
                        : "none",
                      transition: "all 0.25s ease"
                    }}
                  >
                    {p.phaseNumber}
                  </div>
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: p.isLive ? "var(--gold-bright)" : "#E0E0E0" }}>
                      {p.phase}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--gold-primary)", marginTop: "2px" }}>
                      ${p.price}
                    </div>
                    {p.isLive ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: "rgba(34, 197, 94, 0.15)",
                          color: "#4ADE80",
                          fontWeight: 700,
                          marginTop: "4px"
                        }}
                      >
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ADE80", display: "inline-block", animation: "pulse 1.8s infinite" }} />
                        LIVE
                      </span>
                    ) : (
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                        {p.growth}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Main Phase Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "26px",
            marginBottom: "40px"
          }}
          className="presale-cards-grid"
        >
          {presalePhases.map((phase, idx) => {
            const isHovered = hoveredPhase === idx;
            const isSelected = calcPhaseIndex === idx;

            return (
              <div
                key={phase.phase}
                onMouseEnter={() => setHoveredPhase(idx)}
                onMouseLeave={() => setHoveredPhase(null)}
                onClick={() => setCalcPhaseIndex(idx)}
                style={{
                  position: "relative",
                  background: phase.isLive
                    ? "linear-gradient(180deg, rgba(22, 20, 14, 0.85) 0%, rgba(14, 14, 14, 0.85) 100%)"
                    : "rgba(16, 16, 16, 0.75)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderRadius: "20px",
                  border: phase.isLive
                    ? "1px solid rgba(212, 175, 55, 0.6)"
                    : isHovered || isSelected
                    ? "1px solid var(--gold-primary)"
                    : "1px solid rgba(212, 175, 55, 0.25)",
                  boxShadow: phase.isLive
                    ? "0 15px 45px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.16)"
                    : isHovered
                    ? "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(212, 175, 55, 0.18)"
                    : "0 10px 30px rgba(0, 0, 0, 0.4)",
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                  overflow: "hidden"
                }}
              >
                {/* Card Top: Phase Header & Large Number with Badge Down Below (01 -> CURRENT PHASE) */}
                <div style={{ position: "relative", zIndex: 1, marginBottom: "22px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                    {/* Left: Phase Title */}
                    <div>
                      <span
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "13px",
                          fontWeight: 800,
                          letterSpacing: "0.15em",
                          color: "var(--gold-bright)",
                          textTransform: "uppercase",
                          display: "inline-block",
                          marginTop: "6px"
                        }}
                      >
                        PHASE {phase.phaseNumber}
                      </span>
                    </div>

                    {/* Right: Large Number 01, 02, 03 on top + Badge DOWN after the number */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "52px",
                          fontWeight: 900,
                          lineHeight: 1,
                          letterSpacing: "-0.04em",
                          background: "linear-gradient(135deg, rgba(212, 175, 55, 0.45) 0%, rgba(140, 106, 22, 0.18) 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          userSelect: "none"
                        }}
                      >
                        {phase.phaseNumber}
                      </div>

                      {/* Badge shown DOWN after 01, 02, 03 */}
                      <div>
                        {phase.isLive ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              background: "rgba(34, 197, 94, 0.12)",
                              border: "1px solid rgba(34, 197, 94, 0.35)",
                              color: "#4ADE80",
                              fontSize: "11px",
                              fontWeight: 700,
                              letterSpacing: "0.05em",
                              whiteSpace: "nowrap"
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#22C55E",
                                boxShadow: "0 0 10px #22C55E"
                              }}
                            />
                            CURRENT PHASE
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "var(--text-muted)",
                              background: "rgba(255, 255, 255, 0.04)",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              whiteSpace: "nowrap"
                            }}
                          >
                            {phase.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Token Allocation Amount */}
                  <div style={{ marginBottom: "6px" }}>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Token Allocation
                    </div>
                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: 800,
                        fontFamily: "var(--font-heading)",
                        color: "#FFFFFF",
                        letterSpacing: "-0.02em",
                        marginTop: "2px"
                      }}
                    >
                      {phase.allocation}{" "}
                      <span style={{ fontSize: "17px", color: "var(--gold-bright)", fontWeight: 700 }}>
                        RGL
                      </span>
                    </div>
                  </div>

                  {/* Allocation Visualization Bar */}
                  <div style={{ marginTop: "14px", marginBottom: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                        Pool Share of Presale
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--gold-bright)" }}>
                        {phase.percentage}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "7px",
                        borderRadius: "999px",
                        background: "rgba(255, 255, 255, 0.08)",
                        overflow: "hidden",
                        position: "relative"
                      }}
                    >
                      <div
                        style={{
                          width: `${phase.percentage}%`,
                          height: "100%",
                          borderRadius: "999px",
                          background: phase.isLive || isHovered
                            ? "linear-gradient(90deg, #8C6A16 0%, #D4AF37 60%, #F4D77A 100%)"
                            : "linear-gradient(90deg, #8C6A16 0%, #D4AF37 100%)",
                          boxShadow: phase.isLive || isHovered
                            ? "0 0 10px rgba(212, 175, 55, 0.6)"
                            : "none",
                          transition: "width 0.8s ease, filter 0.3s ease"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Middle: Price per RGL with progression */}
                <div
                  style={{
                    background: "rgba(8, 8, 8, 0.75)",
                    border: "1px solid rgba(212, 175, 55, 0.15)",
                    borderRadius: "14px",
                    padding: "16px 18px",
                    marginBottom: "20px",
                    position: "relative",
                    zIndex: 1
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Price / Token
                    </span>
                    <span
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: phase.isLive ? "#4ADE80" : "var(--gold-bright)"
                      }}
                    >
                      {phase.growth}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "30px",
                        fontWeight: 900,
                        fontFamily: "var(--font-heading)",
                        color: "var(--gold-bright)"
                      }}
                    >
                      ${phase.price}
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>
                      per RGL
                    </span>
                  </div>
                </div>

                {/* Bottom: Maximum Gross Proceeds */}
                <div
                  style={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    paddingTop: "18px",
                    position: "relative",
                    zIndex: 1
                  }}
                >
                  <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Maximum Gross Proceeds
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      fontFamily: "var(--font-heading)",
                      color: "#FFFFFF",
                      marginTop: "4px"
                    }}
                  >
                    ${phase.proceeds}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.4 }}>
                    {phase.summary}
                  </div>
                </div>

                {/* Sub-card visual connection hint */}
                {idx < 2 && (
                  <div
                    style={{
                      position: "absolute",
                      right: "-17px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "#101010",
                      border: "1px solid rgba(212, 175, 55, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--gold-primary)",
                      zIndex: 3,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.6)"
                    }}
                    className="presale-phase-arrow"
                    title={`Proceeds to Phase 0${idx + 2}`}
                  >
                    <ArrowRight size={13} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section 9: Total Summary Card */}
        <div
          style={{
            position: "relative",
            background: "linear-gradient(135deg, rgba(24, 20, 12, 0.95) 0%, rgba(12, 12, 12, 0.95) 50%, rgba(18, 16, 10, 0.95) 100%)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderRadius: "22px",
            border: "1px solid rgba(212, 175, 55, 0.4)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7), 0 0 45px rgba(212, 175, 55, 0.12)",
            padding: "36px 40px",
            marginBottom: "48px",
            overflow: "hidden"
          }}
          className="presale-total-card"
        >
          {/* Subtle golden corner flare */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, rgba(244, 215, 122, 0.18) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none"
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
              gap: "28px",
              alignItems: "center"
            }}
            className="presale-total-grid"
          >
            {/* Title & Badge */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: "var(--gold-bright)",
                  textTransform: "uppercase",
                  marginBottom: "8px"
                }}
              >
                <Sparkles size={13} color="var(--gold-primary)" />
                AGGREGATE SALE METRICS
              </div>
              <h3
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "-0.02em"
                }}
              >
                TOTAL <span className="gold-gradient-text">PRESALE</span>
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                3-phase hard-cap distribution architecture
              </p>
            </div>

            {/* Total Allocation Metric */}
            <div
              style={{
                background: "rgba(5, 5, 5, 0.6)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                borderRadius: "14px",
                padding: "18px 20px"
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Total Allocation
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  fontFamily: "var(--font-heading)",
                  color: "var(--gold-bright)",
                  marginTop: "4px"
                }}
              >
                20,000,000
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                RGL (20% of Supply)
              </div>
            </div>

            {/* Total Maximum Gross Proceeds Metric */}
            <div
              style={{
                background: "rgba(5, 5, 5, 0.6)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                borderRadius: "14px",
                padding: "18px 20px"
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Maximum Gross Proceeds
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  fontFamily: "var(--font-heading)",
                  color: "#FFFFFF",
                  marginTop: "4px"
                }}
              >
                $9,200,000
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--gold-primary)", fontWeight: 600, marginTop: "2px" }}>
                USD Hard Cap
              </div>
            </div>

            {/* Value Appreciation from Phase 1 to 3 */}
            <div
              style={{
                background: "rgba(5, 5, 5, 0.6)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                borderRadius: "14px",
                padding: "18px 20px"
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Phase Growth
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  fontFamily: "var(--font-heading)",
                  color: "#4ADE80",
                  marginTop: "4px"
                }}
              >
                +140.0%
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "2px" }}>
                $0.25 → $0.60 per RGL
              </div>
            </div>
          </div>
        </div>

        {/* Reference Dashboard-Inspired Interactive Profit & Token Calculator */}
        <div
          style={{
            background: "rgba(14, 14, 14, 0.8)",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "22px",
            padding: "36px 38px",
            marginBottom: "28px"
          }}
          className="presale-calc-wrapper"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: "40px",
              alignItems: "center"
            }}
            className="presale-calc-grid"
          >
            {/* Left Column: Interactive Inputs */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <Calculator size={18} color="var(--gold-primary)" />
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    fontFamily: "var(--font-heading)"
                  }}
                >
                  Interactive <span className="gold-gradient-text">Presale Calculator</span>
                </h3>
              </div>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginBottom: "22px" }}>
                Select a presale phase and investment amount to model your RGL token allocation and projected returns.
              </p>

              {/* Stage / Phase Dropdown Selector (Matching Reference Image: [ Stage 2 ▼ ]  $ 0.19896) */}
              <div style={{ marginBottom: "20px" }} ref={dropdownRef}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Current Token Price & Phase
                  </label>
                  <span style={{ fontSize: "11px", color: "var(--gold-bright)", fontWeight: 600 }}>
                    Select Phase to Calculate
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.3fr 1fr",
                    gap: "12px",
                    position: "relative"
                  }}
                  className="presale-dropdown-row"
                >
                  {/* Luxury Web3 Custom Dropdown Trigger */}
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      id="presale-phase-dropdown-btn"
                      onClick={() => setIsPhaseDropdownOpen(!isPhaseDropdownOpen)}
                      style={{
                        width: "100%",
                        background: "#080808",
                        border: isPhaseDropdownOpen
                          ? "1px solid var(--gold-primary)"
                          : "1px solid rgba(212, 175, 55, 0.35)",
                        borderRadius: "12px",
                        padding: "13px 16px",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        fontFamily: "var(--font-heading)",
                        fontSize: "14px",
                        fontWeight: 700,
                        transition: "all 0.25s ease",
                        boxShadow: isPhaseDropdownOpen
                          ? "0 0 20px rgba(212, 175, 55, 0.25)"
                          : "none"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ color: "var(--gold-bright)" }}>
                          {selectedPhase.phase}
                        </span>
                        {selectedPhase.isLive ? (
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "2px 7px",
                              borderRadius: "999px",
                              background: "rgba(34, 197, 94, 0.18)",
                              color: "#4ADE80",
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4ADE80" }} />
                            LIVE
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "2px 7px",
                              borderRadius: "999px",
                              background: "rgba(255, 255, 255, 0.06)",
                              color: "var(--text-muted)",
                              fontWeight: 600
                            }}
                          >
                            {selectedPhase.status}
                          </span>
                        )}
                      </div>

                      <ChevronDown
                        size={17}
                        color="var(--gold-primary)"
                        style={{
                          transform: isPhaseDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                      />
                    </button>

                    {/* Popover Dropdown Menu */}
                    {isPhaseDropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 8px)",
                          left: 0,
                          right: 0,
                          background: "#0C0C0C",
                          border: "1px solid rgba(212, 175, 55, 0.45)",
                          borderRadius: "14px",
                          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.85), 0 0 30px rgba(212, 175, 55, 0.2)",
                          zIndex: 100,
                          overflow: "hidden",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          animation: "fadeIn 0.2s ease"
                        }}
                      >
                        {presalePhases.map((phase, idx) => {
                          const isSelected = calcPhaseIndex === idx;
                          return (
                            <div
                              key={phase.phase}
                              id={`select-${phase.phase.toLowerCase().replace(/\s+/g, '-')}`}
                              onClick={() => {
                                setCalcPhaseIndex(idx);
                                setIsPhaseDropdownOpen(false);
                              }}
                              style={{
                                padding: "14px 16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: isSelected
                                  ? "linear-gradient(90deg, rgba(212, 175, 55, 0.18) 0%, rgba(140, 106, 22, 0.1) 100%)"
                                  : "transparent",
                                borderBottom: idx < presalePhases.length - 1
                                  ? "1px solid rgba(255, 255, 255, 0.05)"
                                  : "none",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) e.currentTarget.style.background = "rgba(212, 175, 55, 0.08)";
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) e.currentTarget.style.background = "transparent";
                              }}
                            >
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 800,
                                      fontFamily: "var(--font-heading)",
                                      color: isSelected ? "var(--gold-bright)" : "#FFFFFF"
                                    }}
                                  >
                                    {phase.phase}
                                  </span>
                                  {phase.isLive ? (
                                    <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "3px", background: "rgba(34, 197, 94, 0.2)", color: "#4ADE80", fontWeight: 700 }}>
                                      LIVE
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "3px", background: "rgba(255, 255, 255, 0.06)", color: "var(--text-muted)" }}>
                                      {phase.status}
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                                  Allocation: {phase.allocation} RGL ({phase.percentage}%)
                                </div>
                              </div>

                              <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "10px" }}>
                                <div>
                                  <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--gold-bright)", fontFamily: "var(--font-heading)" }}>
                                    ${phase.price}
                                  </div>
                                  <div style={{ fontSize: "10px", color: phase.isLive ? "#4ADE80" : "var(--gold-primary)" }}>
                                    {phase.growth}
                                  </div>
                                </div>
                                {isSelected && (
                                  <Check size={16} color="var(--gold-bright)" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Token Price Display Box (Matching Reference Dashboard Screenshot) */}
                  <div
                    style={{
                      background: "#080808",
                      border: "1px solid rgba(212, 175, 55, 0.25)",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase" }}>
                      Token Price:
                    </span>
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 900,
                        color: "var(--gold-bright)",
                        fontFamily: "var(--font-heading)"
                      }}
                    >
                      ${selectedPhase.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>
                  Investment Amount (USD)
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#080808",
                    border: "1px solid rgba(212, 175, 55, 0.3)",
                    borderRadius: "12px",
                    padding: "6px 16px"
                  }}
                >
                  <DollarSign size={18} color="var(--gold-bright)" />
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value) || 0))}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-heading)",
                      fontSize: "20px",
                      fontWeight: 800,
                      padding: "8px 10px"
                    }}
                    placeholder="Enter amount"
                  />
                  <span style={{ fontSize: "12px", color: "var(--gold-bright)", fontWeight: 700 }}>
                    USD
                  </span>
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCalcAmount(amt)}
                    style={{
                      background: calcAmount === amt ? "rgba(212, 175, 55, 0.18)" : "#0A0A0A",
                      border: `1px solid ${calcAmount === amt ? "var(--gold-primary)" : "var(--border-standard)"}`,
                      borderRadius: "6px",
                      color: calcAmount === amt ? "var(--gold-bright)" : "var(--text-muted)",
                      padding: "5px 12px",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Output Summary Card */}
            <div
              style={{
                background: "linear-gradient(135deg, #0A0A0A 0%, #121212 100%)",
                border: "1px solid rgba(212, 175, 55, 0.35)",
                borderRadius: "18px",
                padding: "28px",
                position: "relative",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <span style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Estimated RGL Tokens
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--gold-bright)",
                    background: "rgba(212, 175, 55, 0.12)",
                    padding: "3px 10px",
                    borderRadius: "999px"
                  }}
                >
                  @{selectedPhase.phase} (${selectedPhase.price})
                </span>
              </div>

              {/* Tokens You Receive */}
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 900,
                  fontFamily: "var(--font-heading)",
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                  marginBottom: "4px"
                }}
              >
                {calculatedTokens.toLocaleString()}{" "}
                <span style={{ fontSize: "20px", color: "var(--gold-bright)" }}>RGL</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "22px" }}>
                Secured at preferential entry pricing before exchange listing
              </div>

              {/* Benchmark Valuation Comparison */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                  background: "#050505",
                  border: "1px solid rgba(212, 175, 55, 0.15)",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "24px"
                }}
              >
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Target Benchmark</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "2px" }}>
                    ${projectedListingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>@ $1.50 Reference Target</div>
                </div>

                <div style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.08)", paddingLeft: "14px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Projected ROI</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#4ADE80", marginTop: "2px" }}>
                    +{projectedRoiPercent}%
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-secondary)" }}>Potential Appreciation</div>
                </div>
              </div>

              {/* Direct Action Button */}
              <button
                type="button"
                onClick={() => onOpenInvestModal && onOpenInvestModal()}
                className="btn btn-gold"
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  cursor: "pointer"
                }}
              >
                <Zap size={16} />
                Participate in RGL Presale
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Section 16: Legal / Official Terms Disclaimer */}
        <div style={{ textAlign: "center", padding: "10px 20px" }}>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              maxWidth: "800px",
              margin: "0 auto"
            }}
          >
            Presale allocation and pricing are subject to the official REGAL token distribution and sale terms.
            Tokens distributed across phases are non-custodial and adhere to standard BEP-20 smart contract allowances.
          </p>
        </div>
      </div>
    </section>
  );
}
