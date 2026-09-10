import {
    Activity,
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Coins,
    Crown,
    ExternalLink,
    FileText,
    History,
    Layers,
    Shield,
    TrendingUp,
    User,
    Users,
    Wallet
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetricCard from "../../components/common/MetricCard";
import StatusPill from "../../components/common/StatusPill";
import {
    initialAllUsers,
    initialInvestments,
    initialReferrals,
    initialRoiLedger,
    initialTransactions,
    initialWithdrawals
} from "../../data/portalData";

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const targetUser = initialAllUsers.find((u) => u.id === id) || initialAllUsers[0];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "investments", label: "Investments (2)" },
    { id: "roi", label: "ROI Ledger" },
    { id: "referrals", label: "Referrals (3)" },
    { id: "withdrawals", label: "Withdrawals (2)" },
    { id: "transactions", label: "Transactions" },
    { id: "audit", label: "Security Audit" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Back button & User Identity Header */}
      <div>
        <button onClick={() => navigate("/admin/users")} className="btn btn-outline btn-sm" style={{ marginBottom: "16px" }}>
          <ArrowLeft size={14} /> Back to Users Directory
        </button>

        <div className="regal-card" style={{ padding: "26px", background: "linear-gradient(135deg, #101010 0%, #060606 100%)", borderColor: "var(--border-highlight)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "var(--gold-gradient)", color: "#050505", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 800 }}>
                {targetUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h1 style={{ fontSize: "24px", color: "#FFF" }}>{targetUser.name}</h1>
                  <StatusPill status={targetUser.status} />
                  <span style={{ fontSize: "11px", color: "var(--gold-bright)", fontFamily: "monospace", background: "#181818", padding: "2px 8px", borderRadius: "4px" }}>
                    {targetUser.id}
                  </span>
                </div>
                <div style={{ fontSize: "12.5px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {targetUser.email} • Primary Wallet: <strong style={{ color: "var(--gold-primary)", fontFamily: "monospace" }}>{targetUser.wallet}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => navigate("/dashboard")} className="btn btn-outline-gold btn-sm">
                Impersonate View
              </button>
              <button className="btn btn-outline btn-sm" style={{ color: "#EF4444", borderColor: "rgba(239,68,68,0.4)" }}>
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Investigation Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-standard)", paddingBottom: "12px", overflowX: "auto" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`btn btn-sm ${activeTab === t.id ? "btn-gold" : "btn-outline"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <MetricCard title="Total Funded" value={`$${targetUser.investments.toLocaleString()}`} subtitle="Active capital" icon={<Coins size={18} color="var(--gold-primary)" />} />
            <MetricCard title="Accrued ROI" value={`$${targetUser.totalRoi.toFixed(2)}`} subtitle="Distributed yield" icon={<TrendingUp size={18} color="#22C55E" />} />
            <MetricCard title="Referral Income" value={`$${targetUser.referralEarnings.toFixed(2)}`} subtitle="Sponsorship bonuses" icon={<Crown size={18} color="var(--gold-bright)" />} />
            <MetricCard title="Referral Code" value={targetUser.referralCode} subtitle="Sponsor tier active" icon={<Users size={18} color="#3B82F6" />} />
          </div>

          <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
            <h3 style={{ fontSize: "16px", color: "#FFF", marginBottom: "14px" }}>Account Intelligence</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", fontSize: "13px" }}>
              <div style={{ background: "#070707", padding: "12px", borderRadius: "8px" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>REGISTRATION DATE</div>
                <div style={{ color: "#FFF", marginTop: "2px" }}>{targetUser.joined}</div>
              </div>
              <div style={{ background: "#070707", padding: "12px", borderRadius: "8px" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>NETWORK VERIFIED</div>
                <div style={{ color: "#22C55E", marginTop: "2px" }}>BNB Chain (56) Mainnet</div>
              </div>
              <div style={{ background: "#070707", padding: "12px", borderRadius: "8px" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>KYC/AML LEVEL</div>
                <div style={{ color: "var(--gold-bright)", marginTop: "2px" }}>Level 2 (Verified Cryptographic)</div>
              </div>
              <div style={{ background: "#070707", padding: "12px", borderRadius: "8px" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>RISK SCORE</div>
                <div style={{ color: "#22C55E", marginTop: "2px" }}>0.02 (Low Risk)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVESTMENTS */}
      {activeTab === "investments" && (
        <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
          <h3 style={{ fontSize: "16px", color: "#FFF", marginBottom: "16px" }}>User Contracts</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {initialInvestments.map((inv) => (
              <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#070707", borderRadius: "8px", border: "1px solid var(--border-standard)" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#FFF" }}>{inv.packageName} — ${inv.amount.toLocaleString()} USDT</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>ID: {inv.id} • Day {inv.cycleDay} / 240</div>
                </div>
                <StatusPill status={inv.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ROI */}
      {activeTab === "roi" && (
        <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
          <h3 style={{ fontSize: "16px", color: "#FFF", marginBottom: "16px" }}>Daily ROI Ledger Records</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {initialRoiLedger.map((r) => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "#070707", borderRadius: "6px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{r.date} • {r.investmentId}</span>
                <span style={{ color: "#22C55E", fontWeight: 700 }}>+${r.amount.toFixed(2)} ({r.rate})</span>
                <StatusPill status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REFERRALS */}
      {activeTab === "referrals" && (
        <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
          <h3 style={{ fontSize: "16px", color: "#FFF", marginBottom: "16px" }}>Referees & Downline</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {initialReferrals.map((ref) => (
              <div key={ref.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#070707", borderRadius: "8px" }}>
                <div>
                  <div style={{ color: "#FFF", fontWeight: 600 }}>{ref.user} ({ref.package})</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px", fontFamily: "monospace" }}>{ref.wallet}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "var(--gold-bright)", fontWeight: 700 }}>+${ref.commission.toFixed(2)}</div>
                  <StatusPill status={ref.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: WITHDRAWALS */}
      {activeTab === "withdrawals" && (
        <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
          <h3 style={{ fontSize: "16px", color: "#FFF", marginBottom: "16px" }}>User Withdrawal Requests</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {initialWithdrawals.map((w) => (
              <div key={w.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px", background: "#070707", borderRadius: "8px" }}>
                <div>
                  <div style={{ color: "#FFF", fontWeight: 600 }}>{w.id} — ${w.amount.toFixed(2)} USDT</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>{w.date} • Destination: {w.destination}</div>
                </div>
                <StatusPill status={w.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TRANSACTIONS */}
      {activeTab === "transactions" && (
        <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
          <h3 style={{ fontSize: "16px", color: "#FFF", marginBottom: "16px" }}>Account Financial Ledger</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {initialTransactions.map((tx) => (
              <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "#070707", borderRadius: "6px" }}>
                <span style={{ color: "#FFF" }}>{tx.type} ({tx.date})</span>
                <span style={{ color: tx.amount.startsWith("+") ? "#22C55E" : "#EF4444", fontWeight: 700 }}>{tx.amount}</span>
                <StatusPill status={tx.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT */}
      {activeTab === "audit" && (
        <div className="regal-card" style={{ padding: "24px", background: "#0E0E0E" }}>
          <h3 style={{ fontSize: "16px", color: "#FFF", marginBottom: "16px" }}>Security Logs & Anomalies</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
            <div style={{ padding: "10px", background: "#070707", borderRadius: "6px" }}>
              🟢 Session Authenticated: 2026-09-10 10:14 (IP: 185.220.101.4 / Zurich)
            </div>
            <div style={{ padding: "10px", background: "#070707", borderRadius: "6px" }}>
              🟢 Smart Contract Deposit: 2026-07-01 (Block #38942104)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
