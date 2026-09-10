import { ArrowRight, ChevronRight, Coins, Shield, Sparkles, TrendingUp, Wallet } from "lucide-react";
import React from "react";
import { coinHero } from "../assets";

export default function HeroSection({ onOpenInvestModal, onExploreEcosystem, onOpenAuthModal, tokenInfo }) {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        paddingTop: "150px",
        paddingBottom: "90px",
        overflow: "hidden"
      }}
    >
      {/* Background radial gold glow behind coin */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, rgba(5, 5, 5, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div className="container">
        
        {/* Main Hero Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            alignItems: "center",
            gap: "50px",
            minHeight: "480px"
          }}
          className="hero-grid"
        >
          {/* Left Text Content */}
          <div style={{ zIndex: 1 }}>
            
            {/* Ecosystem Badge */}
            <div className="section-badge" style={{ marginBottom: "22px" }}>
              <Sparkles size={13} />
              BNB SMART CHAIN (BEP-20) PROTOCOL
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: "52px",
                lineHeight: "1.12",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: "16px"
              }}
              className="hero-title"
            >
              ENTER THE <br />
              <span className="gold-gradient-text">REGAL ECOSYSTEM</span>
            </h1>

            {/* Secondary Heading */}
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "var(--gold-bright)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "20px"
              }}
            >
              Powered by RGL
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: "17px",
                color: "var(--text-secondary)",
                lineHeight: "1.65",
                maxWidth: "520px",
                marginBottom: "36px"
              }}
            >
              A luxury digital asset and Web3 investment platform engineered on BNB Smart Chain. Audited smart contracts, structured 8-month cycles, transparent daily ROI, and tiered referral rewards.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
              <button
                onClick={() => onOpenAuthModal ? onOpenAuthModal("signup") : onOpenInvestModal()}
                className="btn btn-gold btn-lg"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 0 25px rgba(212, 175, 55, 0.35)" }}
              >
                <Sparkles size={18} />
                Create Account & Join
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onOpenInvestModal}
                className="btn btn-outline-gold btn-lg"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}
              >
                <Coins size={18} />
                Explore Packages
              </button>

              <button
                onClick={onExploreEcosystem}
                className="btn btn-outline btn-lg"
              >
                Explore Ecosystem
              </button>
            </div>

            {/* Micro trust row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                marginTop: "38px",
                paddingTop: "24px",
                borderTop: "1px solid rgba(41, 41, 41, 0.7)",
                fontSize: "13px",
                color: "var(--text-muted)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Shield size={14} color="var(--gold-primary)" />
                Audited BEP-20
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <TrendingUp size={14} color="var(--gold-primary)" />
                Up to 0.25% Daily ROI
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Wallet size={14} color="var(--gold-primary)" />
                Non-Custodial
              </div>
            </div>

          </div>

          {/* Right Hero Visual: 3D Rotating RGL Coin */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1
            }}
          >
            {/* Concentric subtle gold rings */}
            <div
              style={{
                position: "absolute",
                width: "440px",
                height: "440px",
                borderRadius: "50%",
                border: "1px dashed rgba(212, 175, 55, 0.2)",
                animation: "spin 40s linear infinite"
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "360px",
                height: "360px",
                borderRadius: "50%",
                border: "1px solid rgba(212, 175, 55, 0.3)"
              }}
            />

            {/* 3D RGL Coin Image */}
            <div className="floating-coin" style={{ position: "relative", zIndex: 2 }}>
              <img
                src={coinHero}
                alt="Regal RGL 3D Coin"
                style={{
                  width: "100%",
                  maxWidth: "380px",
                  height: "auto",
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8)) drop-shadow(0 0 50px rgba(212,175,55,0.35))",
                  userSelect: "none"
                }}
              />
            </div>
          </div>

        </div>

        {/* 4 Statistics Cards - Section 6.4 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "70px"
          }}
          className="stats-grid"
        >
          <div className="regal-card" style={{ padding: "24px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "32px", fontWeight: 800, color: "var(--gold-bright)", lineHeight: 1.1 }}>
              100M
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "8px", fontWeight: 600 }}>
              Total Supply
            </div>
          </div>

          <div className="regal-card" style={{ padding: "24px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "32px", fontWeight: 800, color: "#F5F5F5", lineHeight: 1.1 }}>
              BEP-20
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "8px", fontWeight: 600 }}>
              Network
            </div>
          </div>

          <div className="regal-card" style={{ padding: "24px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "32px", fontWeight: 800, color: "var(--gold-primary)", lineHeight: 1.1 }}>
              RGL
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "8px", fontWeight: 600 }}>
              Token Symbol
            </div>
          </div>

          <div className="regal-card" style={{ padding: "24px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "32px", fontWeight: 800, color: "#F5F5F5", lineHeight: 1.1 }}>
              8 Month
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "8px", fontWeight: 600 }}>
              Investment Cycle
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .hero-grid p {
            margin: 0 auto 30px !important;
          }
          .hero-grid > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-title {
            font-size: 38px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 540px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
