import {
    ArrowRight,
    Calculator,
    CheckCircle,
    Clock,
    Coins,
    Layers,
    Shield,
    TrendingUp,
    Users,
    Wallet
} from "lucide-react";
import React, { useState } from "react";

export default function HowItWorksSection({ onOpenInvestModal }) {
  const [activeTab, setActiveTab] = useState("timeline");
  const [calcAmount, setCalcAmount] = useState(1000);

  const steps = [
    {
      num: "01",
      title: "Connect Wallet",
      icon: <Wallet size={22} color="var(--gold-primary)" />,
      desc: "Connect MetaMask, Trust Wallet, or WalletConnect to the BNB Smart Chain network in one click."
    },
    {
      num: "02",
      title: "Select Package",
      icon: <Layers size={22} color="var(--gold-primary)" />,
      desc: "Choose between Regal Silver ($100+), Regal Gold ($1,000+), or Regal Black ($3,000+) tier."
    },
    {
      num: "03",
      title: "Invest USDT",
      icon: <Coins size={22} color="var(--gold-primary)" />,
      desc: "Approve and broadcast your deposit directly through our audited BEP-20 smart contracts."
    },
    {
      num: "04",
      title: "Track & Earn",
      icon: <TrendingUp size={22} color="var(--gold-primary)" />,
      desc: "Watch simple daily ROI accrue automatically and claim referral bonuses on verified referees."
    }
  ];

  // Calculations for ROI Calculator
  const numericVal = parseFloat(calcAmount) || 0;
  const dailyPhase1 = numericVal * 0.0015; // 0.15%
  const dailyPhase2 = numericVal * 0.0025; // 0.25%
  const totalPhase1 = dailyPhase1 * 90; // ~3 months
  const totalPhase2 = dailyPhase2 * 90; // ~3 months
  const totalYield = totalPhase1 + totalPhase2;
  const totalReturn = numericVal + totalYield;

  return (
    <section id="how-it-works" className="section-padding" style={{ background: "#080808", position: "relative" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Clock size={13} />
            PROTOCOL MECHANICS
          </div>
          <h2 className="section-title">
            How Regal <span className="gold-gradient-text">Works</span>
          </h2>
          <p className="section-subtitle">
            A structured, fully auditable 8-month investment lifecycle designed with zero compounding assumptions and non-custodial principal settlement.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            marginBottom: "70px"
          }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              className="regal-card"
              style={{
                background: "#0D0D0D",
                padding: "28px 24px",
                position: "relative"
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "44px",
                  fontWeight: 900,
                  color: "rgba(212, 175, 55, 0.12)",
                  position: "absolute",
                  top: "14px",
                  right: "18px"
                }}
              >
                {step.num}
              </div>

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(212, 175, 55, 0.1)",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px"
                }}
              >
                {step.icon}
              </div>

              <h4 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: "#F5F5F5" }}>
                {step.title}
              </h4>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Tab Navigation for Detailed Breakdown & Calculator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "40px",
            flexWrap: "wrap"
          }}
        >
          <button
            onClick={() => setActiveTab("timeline")}
            className={`btn btn-sm ${activeTab === "timeline" ? "btn-gold" : "btn-outline"}`}
          >
            ROI Lifecycle Timeline
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`btn btn-sm ${activeTab === "calculator" ? "btn-gold" : "btn-outline"}`}
          >
            Interactive ROI Calculator
          </button>
          <button
            onClick={() => setActiveTab("referral")}
            className={`btn btn-sm ${activeTab === "referral" ? "btn-gold" : "btn-outline"}`}
          >
            Referral Tiers
          </button>
        </div>

        {/* TAB 1: ROI Timeline */}
        {activeTab === "timeline" && (
          <div className="regal-card" style={{ padding: "40px", background: "#0F0F0F" }}>
            <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 36px" }}>
              <h3 style={{ fontSize: "24px", color: "var(--gold-bright)", marginBottom: "8px" }}>
                8-Month Structured Lifecycle
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                Yield begins strictly after the 60-day buffer period, followed by simple daily accrual and 100% principal return at Month 8.
              </p>
            </div>

            {/* Horizontal / Vertical Stepper */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                position: "relative"
              }}
            >
              <div style={{ background: "#080808", border: "1px solid var(--border-standard)", borderRadius: "14px", padding: "24px", textAlign: "center" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1E1E1E", color: "#A0A0A0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontWeight: 700 }}>
                  1
                </div>
                <h4 style={{ fontSize: "16px", color: "#FFF", marginBottom: "4px" }}>Day 1 – 60</h4>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-muted)", margin: "8px 0" }}>0% ROI</div>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                  Capital Deployment & Protocol Buffer Period. No yield distributed.
                </p>
              </div>

              <div style={{ background: "#080808", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "14px", padding: "24px", textAlign: "center" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(212,175,55,0.2)", color: "var(--gold-bright)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontWeight: 700 }}>
                  2
                </div>
                <h4 style={{ fontSize: "16px", color: "#FFF", marginBottom: "4px" }}>Month 3 – 5</h4>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--gold-bright)", margin: "8px 0" }}>0.15% Daily</div>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                  Simple daily accrual credited directly to your connected wallet.
                </p>
              </div>

              <div style={{ background: "#080808", border: "1px solid rgba(212,175,55,0.5)", borderRadius: "14px", padding: "24px", textAlign: "center", boxShadow: "0 0 25px rgba(212,175,55,0.1)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--gold-gradient)", color: "#050505", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontWeight: 700 }}>
                  3
                </div>
                <h4 style={{ fontSize: "16px", color: "#FFF", marginBottom: "4px" }}>Month 6 – 8</h4>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--gold-bright)", margin: "8px 0" }}>0.25% Daily</div>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                  Accelerated protocol yield phase maximizing returns before maturity.
                </p>
              </div>

              <div style={{ background: "#080808", border: "1px solid #22C55E", borderRadius: "14px", padding: "24px", textAlign: "center" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(34,197,94,0.2)", color: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontWeight: 700 }}>
                  4
                </div>
                <h4 style={{ fontSize: "16px", color: "#FFF", marginBottom: "4px" }}>End of Month 8</h4>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#22C55E", margin: "8px 0" }}>100% Principal</div>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                  100% of deposited capital unlocked for direct withdrawal or re-allocation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Interactive ROI Calculator */}
        {activeTab === "calculator" && (
          <div className="regal-card" style={{ padding: "36px", background: "#0F0F0F", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <Calculator size={22} color="var(--gold-primary)" />
              <h3 style={{ fontSize: "22px" }}>Investment Yield Calculator</h3>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label className="regal-label">Enter Principal (USDT):</label>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                  className="regal-input"
                  style={{ maxWidth: "260px", fontSize: "18px", fontWeight: 700 }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  {[500, 1000, 2500, 5000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setCalcAmount(preset)}
                      className="btn btn-outline btn-sm"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                background: "#080808",
                border: "1px solid var(--border-standard)",
                borderRadius: "14px",
                padding: "20px",
                marginBottom: "24px"
              }}
            >
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Month 3–5 (Daily)</span>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "4px" }}>
                  ${dailyPhase1.toFixed(2)}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>0.15% per day</div>
              </div>

              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Month 6–8 (Daily)</span>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "4px" }}>
                  ${dailyPhase2.toFixed(2)}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>0.25% per day</div>
              </div>

              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Accrued Yield</span>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#22C55E", marginTop: "4px" }}>
                  +${totalYield.toFixed(2)}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Across 6 yield months</div>
              </div>

              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Payout at End</span>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "#FFF", marginTop: "4px" }}>
                  ${totalReturn.toFixed(2)}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Principal + Yield</div>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={onOpenInvestModal} className="btn btn-gold">
                Invest ${numericVal.toLocaleString()} Now <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Referral Tiers */}
        {activeTab === "referral" && (
          <div className="regal-card" style={{ padding: "36px", background: "#0F0F0F", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
              <Users size={22} color="var(--gold-primary)" />
              <h3 style={{ fontSize: "22px" }}>Direct Referral Tier Structure</h3>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
              Earn instant blockchain-credited commissions on every qualifying investment activated by your direct referrals on BNB Smart Chain.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <div style={{ background: "#080808", border: "1px solid var(--border-standard)", borderRadius: "12px", padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Regal Silver ($100 - $999.99)</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--gold-bright)", margin: "8px 0" }}>1.5%</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Instant On-Chain Credit</div>
              </div>

              <div style={{ background: "#080808", border: "1px solid var(--gold-primary)", borderRadius: "12px", padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "13px", color: "var(--gold-bright)" }}>Regal Gold ($1,000 - $2,999.99)</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--gold-bright)", margin: "8px 0" }}>3.0%</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Instant On-Chain Credit</div>
              </div>

              <div style={{ background: "#080808", border: "1px solid var(--border-standard)", borderRadius: "12px", padding: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Regal Black ($3,000+)</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--gold-bright)", margin: "8px 0" }}>5.0%</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>VIP Affiliate Tier</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
