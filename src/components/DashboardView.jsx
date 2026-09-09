import {
    ArrowDownRight,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Coins,
    Crown,
    ExternalLink,
    Layers,
    PlusCircle,
    TrendingUp,
    Users,
    Wallet
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function DashboardView({ wallet, onOpenInvestModal, onSwitchToRoi }) {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDashboardData(data.data);
      })
      .catch(() => {});
  }, []);

  const totalInvested = dashboardData?.totalInvested || 5000;
  const accruedROI = dashboardData?.accruedROI || 45;
  const referralEarnings = dashboardData?.referralEarnings || 750;
  const principalBalance = dashboardData?.principalBalance || 5000;

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <div className="container">
        
        {/* Dashboard Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "36px"
          }}
        >
          <div>
            <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
              AUTHENTICATED PORTFOLIO
            </span>
            <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#F5F5F5", marginTop: "4px" }}>
              Welcome back, <span className="gold-gradient-text">Regal User</span>
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E" }}></span>
              Connected: <strong style={{ color: "#FFF", fontFamily: "monospace" }}>{wallet.address}</strong> (BNB Smart Chain)
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={onSwitchToRoi} className="btn btn-outline">
              <TrendingUp size={16} /> ROI Center
            </button>
            <button onClick={onOpenInvestModal} className="btn btn-gold">
              <PlusCircle size={16} /> New Investment
            </button>
          </div>
        </div>

        {/* 4 Dashboard Metric Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "36px"
          }}
        >
          <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
              <span>Total Investment</span>
              <Coins size={16} color="var(--gold-primary)" />
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "#FFF", marginTop: "8px" }}>
              ${totalInvested.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", color: "#22C55E", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
              <ArrowUpRight size={12} /> Active across 2 packages
            </div>
          </div>

          <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
              <span>Accrued ROI</span>
              <TrendingUp size={16} color="var(--gold-bright)" />
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "8px" }}>
              ${accruedROI.toFixed(2)}
            </div>
            <div style={{ fontSize: "11px", color: "var(--gold-primary)", marginTop: "4px" }}>
              Current: 0.15% simple daily
            </div>
          </div>

          <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
              <span>Referral Earnings</span>
              <Users size={16} color="var(--gold-primary)" />
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "#FFF", marginTop: "8px" }}>
              ${referralEarnings.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
              3 active referees
            </div>
          </div>

          <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
              <span>Principal Balance</span>
              <Crown size={16} color="var(--gold-primary)" />
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "#22C55E", marginTop: "8px" }}>
              ${principalBalance.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
              100% principal protected
            </div>
          </div>
        </div>

        {/* Investment Timeline Progress Card */}
        <div className="regal-card" style={{ padding: "30px", marginBottom: "36px", background: "#0D0D0D" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontSize: "18px", color: "#FFF" }}>Portfolio Cycle Timeline</h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>8-Month Structured Lifecycle Progress</p>
            </div>
            <span style={{ fontSize: "12px", background: "rgba(212,175,55,0.15)", color: "var(--gold-bright)", padding: "4px 12px", borderRadius: "999px", fontWeight: 700 }}>
              Phase: Month 3–5 Active
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", padding: "20px 0" }}>
            <div style={{ position: "absolute", top: "50%", left: "5%", right: "5%", height: "2px", background: "var(--gold-primary)", zIndex: 0 }}></div>
            
            {["Day 1", "Day 60", "Month 3 (0.15%)", "Month 6 (0.25%)", "Month 8 (Return)"].map((point, idx) => {
              const isPassed = idx <= 2;
              return (
                <div key={point} style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: isPassed ? "var(--gold-gradient)" : "#1E1E1E",
                      border: "3px solid #050505",
                      margin: "0 auto 8px",
                      boxShadow: isPassed ? "0 0 15px rgba(212,175,55,0.6)" : "none"
                    }}
                  />
                  <div style={{ fontSize: "11px", color: isPassed ? "#FFF" : "var(--text-muted)", fontWeight: isPassed ? 700 : 400 }}>
                    {point}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Investments Table */}
        <div className="regal-card" style={{ padding: "30px", background: "#0D0D0D" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", color: "#FFF" }}>Active Investments</h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Blockchain Verified</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-standard)", color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 16px" }}>Investment ID</th>
                  <th style={{ padding: "12px 16px" }}>Package</th>
                  <th style={{ padding: "12px 16px" }}>Amount</th>
                  <th style={{ padding: "12px 16px" }}>Phase / Rate</th>
                  <th style={{ padding: "12px 16px" }}>Accrued</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                  <th style={{ padding: "12px 16px" }}>Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.recentInvestments?.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: "1px solid #161616" }}>
                    <td style={{ padding: "16px", fontWeight: 700, color: "#FFF" }}>{inv.id}</td>
                    <td style={{ padding: "16px", color: "var(--gold-bright)", fontWeight: 600 }}>{inv.packageName}</td>
                    <td style={{ padding: "16px", fontWeight: 700 }}>${inv.amount.toLocaleString()} USDT</td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ color: "#FFF", fontWeight: 600 }}>{inv.currentPhase}</div>
                      <div style={{ fontSize: "11px", color: "var(--gold-primary)" }}>{inv.currentDailyRate} / day</div>
                    </td>
                    <td style={{ padding: "16px", color: "#22C55E", fontWeight: 700 }}>${inv.accruedROI.toFixed(2)}</td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <a
                        href={`https://bscscan.com/tx/${inv.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "var(--gold-primary)", textDecoration: "none", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px" }}
                      >
                        {inv.txHash.slice(0, 6)}...{inv.txHash.slice(-4)} <ExternalLink size={11} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
