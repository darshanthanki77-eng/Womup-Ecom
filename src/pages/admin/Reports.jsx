import { Calendar, Download, FileSpreadsheet, FileText, Filter, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
    initialAllUsers,
    initialInvestments,
    initialReferrals,
    initialRoiLedger,
    initialTransactions,
    initialWithdrawals
} from "../../data/portalData";
import { exportToCsv } from "../../utils/exportCsv";

export default function AdminReports() {
  const [dateRange, setDateRange] = useState("all");

  const reports = [
    {
      title: "User Directory & KYC Report",
      desc: "Complete roster of 1,428 Web3 users with wallet addresses, sponsors, and verification states.",
      rows: initialAllUsers.length,
      filename: "regal-users-report",
      data: initialAllUsers
    },
    {
      title: "Investment Portfolio & Yield Report",
      desc: "All capital deployments across Silver, Gold, and Black tiers with cycle milestones.",
      rows: initialInvestments.length,
      filename: "regal-investments-report",
      data: initialInvestments
    },
    {
      title: "Daily ROI Settlement Ledger",
      desc: "Detailed day-by-day calculations, rates (0.15% & 0.25%), and distribution proofs.",
      rows: initialRoiLedger.length,
      filename: "regal-roi-ledger-report",
      data: initialRoiLedger
    },
    {
      title: "Affiliate & Referral Network Report",
      desc: "Multi-tier commission payouts, qualifying investments, and referee mapping.",
      rows: initialReferrals.length,
      filename: "regal-referral-network-report",
      data: initialReferrals
    },
    {
      title: "Withdrawal Queue & Disbursement Report",
      desc: "On-chain settlements, destination addresses, deducted protocol fees, and completion statuses.",
      rows: initialWithdrawals.length,
      filename: "regal-withdrawals-report",
      data: initialWithdrawals
    },
    {
      title: "Complete Blockchain Transaction Ledger",
      desc: "Global financial audit records with BSC transaction hashes and block confirmations.",
      rows: initialTransactions.length,
      filename: "regal-blockchain-transactions-report",
      data: initialTransactions
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
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{r.rows} Sample Records Indexed</span>
                </div>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "20px" }}>
                {r.desc}
              </p>
            </div>

            <button
              onClick={() => exportToCsv(r.data, r.filename)}
              className="btn btn-outline-gold btn-sm"
              style={{ width: "100%" }}
            >
              <Download size={14} /> Download CSV Export
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
