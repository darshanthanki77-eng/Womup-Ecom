import { ArrowRight, Eye, Globe, HeartHandshake, ShieldCheck, Sparkles, Target, TrendingUp } from "lucide-react";
import React from "react";
import { communitySkyline } from "../assets";

export default function AboutSection({ onOpenInvestModal }) {
  return (
    <section id="about" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Sparkles size={13} />
            03 • VISION & MISSION
          </div>
          <h2 className="section-title">
            Vision & <span className="gold-gradient-text">Mission</span>
          </h2>
          <p className="section-subtitle" style={{ fontSize: "16px", color: "var(--gold-bright)", fontWeight: 600, marginBottom: "8px" }}>
            Commercial Activity First • Ecosystem Expansion Second • Transparency Throughout
          </p>
          <p className="section-subtitle" style={{ maxWidth: "760px", margin: "0 auto 12px" }}>
            The project is structured around a simple principle: commercial activity first, ecosystem expansion second, and transparency throughout.
          </p>
        </div>

        {/* 3 Core Pillars: Vision, Mission, Core Principle */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "60px"
          }}
        >
          {/* Vision Card */}
          <div className="regal-card" style={{ background: "#0D0D0D" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(212, 175, 55, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px"
              }}
            >
              <Eye size={22} color="var(--gold-primary)" />
            </div>
            <div style={{ fontSize: "11px", color: "var(--gold-primary)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: "6px" }}>
              Pillar 01
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "#F5F5F5" }}>Vision</h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.7" }}>
              Establish a global ecosystem where digital assets and international commerce work together to create sustainable economic activity.
            </p>
          </div>

          {/* Mission Card */}
          <div className="regal-card" style={{ background: "#0D0D0D" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(212, 175, 55, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px"
              }}
            >
              <Target size={22} color="var(--gold-primary)" />
            </div>
            <div style={{ fontSize: "11px", color: "var(--gold-primary)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: "6px" }}>
              Pillar 02
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "#F5F5F5" }}>Mission</h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.7" }}>
              Build a scalable commercial operation, develop practical token utility, maintain transparent records and establish long-term value through real business execution.
            </p>
          </div>

          {/* Core Principle Card */}
          <div className="regal-card" style={{ background: "#0D0D0D" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(212, 175, 55, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px"
              }}
            >
              <HeartHandshake size={22} color="var(--gold-primary)" />
            </div>
            <div style={{ fontSize: "11px", color: "var(--gold-primary)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginBottom: "6px" }}>
              Pillar 03
            </div>
            <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "#F5F5F5" }}>Core Principle</h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.7" }}>
              The project is structured around a simple principle: commercial activity first, ecosystem expansion second, and transparency throughout.
            </p>
          </div>
        </div>

        {/* Why Choose Regal - 4 Feature Pillars */}
        <div style={{ marginBottom: "70px" }}>
          <h3 style={{ textAlign: "center", fontSize: "24px", marginBottom: "32px", color: "#FFF" }}>
            Why Choose <span className="gold-text">Regal?</span>
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "20px"
            }}
          >
            <div className="regal-card" style={{ padding: "24px", background: "#090909" }}>
              <ShieldCheck size={26} color="var(--gold-primary)" style={{ marginBottom: "12px" }} />
              <h4 style={{ fontSize: "16px", color: "#FFF", marginBottom: "6px" }}>Secure & Audited</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Audited BEP-20 smart contracts with multi-sig protection and timelock security.
              </p>
            </div>

            <div className="regal-card" style={{ padding: "24px", background: "#090909" }}>
              <Globe size={26} color="var(--gold-primary)" style={{ marginBottom: "12px" }} />
              <h4 style={{ fontSize: "16px", color: "#FFF", marginBottom: "6px" }}>Transparent</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Every transaction, accrual, and yield distribution is on-chain and verifiable on BscScan.
              </p>
            </div>

            <div className="regal-card" style={{ padding: "24px", background: "#090909" }}>
              <HeartHandshake size={26} color="var(--gold-primary)" style={{ marginBottom: "12px" }} />
              <h4 style={{ fontSize: "16px", color: "#FFF", marginBottom: "6px" }}>Community Driven</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Multi-tier referral commissions and decentralized governance empowering holders.
              </p>
            </div>

            <div className="regal-card" style={{ padding: "24px", background: "#090909" }}>
              <TrendingUp size={26} color="var(--gold-primary)" style={{ marginBottom: "12px" }} />
              <h4 style={{ fontSize: "16px", color: "#FFF", marginBottom: "6px" }}>Long-Term Growth</h4>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Sustainable financial packaging balancing liquidity depth and high capital efficiency.
              </p>
            </div>
          </div>
        </div>

        {/* Community Banner with Golden City Skyline Background */}
        <div
          style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid var(--border-highlight)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(212, 175, 55, 0.12)",
            minHeight: "260px",
            display: "flex",
            alignItems: "center"
          }}
        >
          {/* Skyline image background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${communitySkyline})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.55)",
              zIndex: 0
            }}
          />

          {/* Dark gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.6) 60%, rgba(5,5,5,0.85) 100%)",
              zIndex: 1
            }}
          />

          {/* Content inside banner */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              padding: "40px 50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              flexWrap: "wrap",
              gap: "24px"
            }}
          >
            <div>
              <div style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "8px" }}>
                GLOBAL WEB3 SYNDICATE
              </div>
              <h3 style={{ fontSize: "32px", fontWeight: 800, color: "#FFFFFF", marginBottom: "8px" }}>
                Together We Grow
              </h3>
              <p style={{ fontSize: "15px", color: "rgba(255, 255, 255, 0.8)", maxWidth: "540px" }}>
                Join our worldwide community of Web3 participants, liquidity builders, and institutional ambassadors.
              </p>
            </div>

            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold btn-lg"
              style={{ boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)" }}
            >
              Join Our Community <ArrowRight size={16} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
