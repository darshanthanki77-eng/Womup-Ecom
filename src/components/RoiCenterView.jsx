import {
    ArrowLeft,
    ArrowUpRight,
    BarChart3,
    Calendar,
    CheckCircle2,
    Coins,
    DollarSign,
    TrendingUp,
    Wallet
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function RoiCenterView({ wallet, onBackToDashboard, onOpenInvestModal }) {
  const [roiData, setRoiData] = useState(null);

  useEffect(() => {
    fetch("/api/roi")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRoiData(data.data);
      })
      .catch(() => {});
  }, []);

  const totalAccrued = roiData?.totalAccrued || 1250;
  const totalPaid = roiData?.totalPaid || 500;
  const currentDailyRate = roiData?.currentDailyRate || "0.15%";
  const nextDailyRate = roiData?.nextDailyRate || "0.25%";

  const monthlyBars = [
    { month: "Jan", height: "15%" },
    { month: "Feb", height: "20%" },
    { month: "Mar", height: "45%" },
    { month: "Apr", height: "55%" },
    { month: "May", height: "70%" },
    { month: "Jun", height: "85%" },
    { month: "Jul", height: "90%" },
    { month: "Aug", height: "100%" }
  ];

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <div className="container">
        
        {/* Header with Back button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <button
              onClick={onBackToDashboard}
              style={{
                background: "none",
                border: "none",
                color: "var(--gold-bright)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                marginBottom: "8px"
              }}
            >
              <ArrowLeft size={14} /> Back to Portfolio Dashboard
            </button>
            <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#F5F5F5" }}>
              ROI <span className="gold-gradient-text">Center</span>
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Simple daily yield accrual ledger, payment history, and milestone schedules.
            </p>
          </div>

          <button onClick={onOpenInvestModal} className="btn btn-gold">
            Increase Capital
          </button>
        </div>

        {/* 4 Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "36px"
          }}
        >
          <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Accrued</span>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "6px" }}>
              ${totalAccrued.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", color: "#22C55E", marginTop: "4px" }}>
              Simple Daily Accrual
            </div>
          </div>

          <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Paid Out</span>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#FFF", marginTop: "6px" }}>
              ${totalPaid.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Claimed to BSC Wallet
            </div>
          </div>

          <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Current Daily Rate</span>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--gold-primary)", marginTop: "6px" }}>
              {currentDailyRate}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Month 3–5 Yield Phase
            </div>
          </div>

          <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Next Yield Tier</span>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#22C55E", marginTop: "6px" }}>
              {nextDailyRate}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Accelerated Month 6–8 Phase
            </div>
          </div>
        </div>

        {/* ROI Earnings Bar Chart */}
        <div className="regal-card" style={{ padding: "30px", marginBottom: "36px", background: "#0D0D0D" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div>
              <h3 style={{ fontSize: "18px", color: "#FFF" }}>ROI Yield Trajectory</h3>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Cumulative monthly return progression</p>
            </div>
            <span style={{ fontSize: "12px", color: "var(--gold-bright)", background: "rgba(212,175,55,0.1)", padding: "4px 10px", borderRadius: "6px" }}>
              8-Month Horizon
            </span>
          </div>

          {/* Bar Visualization */}
          <div
            style={{
              height: "200px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "14px",
              borderBottom: "1px solid var(--border-standard)",
              paddingBottom: "10px"
            }}
          >
            {monthlyBars.map((bar) => (
              <div key={bar.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                <div
                  style={{
                    width: "80%",
                    maxWidth: "40px",
                    height: bar.height,
                    background: "linear-gradient(180deg, var(--gold-bright) 0%, var(--gold-dark) 100%)",
                    borderRadius: "6px 6px 0 0",
                    boxShadow: "0 0 15px rgba(212,175,55,0.3)"
                  }}
                />
                <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "10px" }}>
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Accrual History Ledger Table */}
        <div className="regal-card" style={{ padding: "30px", background: "#0D0D0D" }}>
          <h3 style={{ fontSize: "20px", color: "#FFF", marginBottom: "20px" }}>
            Daily Accrual Ledger
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-standard)", color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 16px" }}>Accrual Date</th>
                  <th style={{ padding: "12px 16px" }}>Investment</th>
                  <th style={{ padding: "12px 16px" }}>Daily Rate</th>
                  <th style={{ padding: "12px 16px" }}>Calculated Yield</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                  <th style={{ padding: "12px 16px" }}>Reference ID</th>
                </tr>
              </thead>
              <tbody>
                {roiData?.history?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #161616" }}>
                    <td style={{ padding: "16px", color: "#FFF", fontWeight: 600 }}>{item.date} 2026</td>
                    <td style={{ padding: "16px", color: "var(--gold-bright)" }}>{item.investmentId}</td>
                    <td style={{ padding: "16px" }}>{item.rate}</td>
                    <td style={{ padding: "16px", color: "#22C55E", fontWeight: 700 }}>+${item.amount.toFixed(2)}</td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px", fontFamily: "monospace", color: "var(--text-muted)", fontSize: "12px" }}>
                      {item.ref}
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
