import { Calendar, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { exportToCsv } from "../../utils/exportCsv";

export default function AdminReports() {
  const [dateRange, setDateRange] = useState("all");
  const [loading, setLoading] = useState(true);

  const [dataSources, setDataSources] = useState({
    users: [],
    investments: [],
    roi: [],
    referrals: [],
    withdrawals: [],
    transactions: []
  });

  useEffect(() => {
    async function loadAllReports() {
      setLoading(true);
      try {
        const [usersRes, invRes, roiRes, refRes, wthRes, txRes] = await Promise.allSettled([
          api.admin.getUsers(),
          api.investments.getAll(),
          api.roi.getAll(),
          api.referrals.getAll(),
          api.withdrawals.getAll(),
          api.transactions.getAll()
        ]);

        setDataSources({
          users: usersRes.status === "fulfilled" && usersRes.value?.success ? usersRes.value.data : [],
          investments: invRes.status === "fulfilled" && invRes.value?.success ? invRes.value.data : [],
          roi: roiRes.status === "fulfilled" && roiRes.value?.success ? roiRes.value.data : [],
          referrals: refRes.status === "fulfilled" && refRes.value?.success ? refRes.value.data : [],
          withdrawals: wthRes.status === "fulfilled" && wthRes.value?.success ? wthRes.value.data : [],
          transactions: txRes.status === "fulfilled" && txRes.value?.success ? txRes.value.data : []
        });
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAllReports();
  }, []);

  const reports = [
    {
      title: "User Directory & KYC Report",
      desc: "Complete roster of registered Web3 users with wallet addresses, sponsors, and verification states.",
      rows: dataSources.users.length,
      filename: "regal-users-report",
      data: dataSources.users
    },
    {
      title: "Investment Portfolio & Yield Report",
      desc: "All capital deployments across Silver, Gold, and Black tiers with cycle milestones.",
      rows: dataSources.investments.length,
      filename: "regal-investments-report",
      data: dataSources.investments
    },
    {
      title: "Daily ROI Settlement Ledger",
      desc: "Detailed day-by-day calculations, rates (0.15% & 0.25%), and distribution proofs.",
      rows: dataSources.roi.length,
      filename: "regal-roi-ledger-report",
      data: dataSources.roi
    },
    {
      title: "Affiliate & Referral Network Report",
      desc: "Multi-tier commission payouts, qualifying investments, and referee mapping.",
      rows: dataSources.referrals.length,
      filename: "regal-referral-network-report",
      data: dataSources.referrals
    },
    {
      title: "Withdrawal Queue & Disbursement Report",
      desc: "On-chain settlements, destination addresses, deducted protocol fees, and completion statuses.",
      rows: dataSources.withdrawals.length,
      filename: "regal-withdrawals-report",
      data: dataSources.withdrawals
    },
    {
      title: "Complete Blockchain Transaction Ledger",
      desc: "Global financial audit records with BSC transaction hashes and block confirmations.",
      rows: dataSources.transactions.length,
      filename: "regal-blockchain-transactions-report",
      data: dataSources.transactions
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
          DATA EXPORT & COMPLIANCE
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Audit & <span className="gold-gradient-text">Financial Reports</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Download institutional-grade CSV exports for protocol reconciliation, tax compliance, and investor transparency.
        </p>
      </div>

      {/* Date Filter Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#0A0A0A", padding: "12px 18px", borderRadius: "10px", border: "1px solid var(--border-standard)" }}>
        <Calendar size={16} color="var(--gold-primary)" />
        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Date Range Scope:</span>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="regal-input"
          style={{ width: "auto", padding: "6px 12px", fontSize: "12px" }}
        >
          <option value="all">All Lifetime Records</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last Quarter (Q3 2026)</option>
          <option value="year">Year to Date (2026)</option>
        </select>
        {loading && (
          <span style={{ fontSize: "12px", color: "var(--gold-bright)", display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" }}>
            <Loader2 size={14} className="spin" /> Fetching live datasets from database...
          </span>
        )}
      </div>

      {/* Reports Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "20px" }}>
        {reports.map((r) => (
          <div
            key={r.title}
            className="regal-card"
            style={{
              padding: "24px",
              background: "#0E0E0E",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(212,175,55,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileSpreadsheet size={18} color="var(--gold-primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: "16px", color: "#FFF" }}>{r.title}</h3>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{r.rows} Live Records Indexed</span>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "20px" }}>
                {r.desc}
              </p>
            </div>

            <button
              onClick={() => exportToCsv(r.data, r.filename)}
              disabled={r.rows === 0}
              className="btn btn-outline-gold btn-sm"
              style={{ width: "100%", opacity: r.rows === 0 ? 0.5 : 1 }}
            >
              <Download size={14} /> Download CSV Export ({r.rows})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
