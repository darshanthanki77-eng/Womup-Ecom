import { CheckCircle2, Crown, ExternalLink, Network, ShieldCheck, Users } from "lucide-react";
import React, { useState } from "react";
import MetricCard from "../../components/common/MetricCard";
import RegalTable from "../../components/common/RegalTable";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    qualified: 0,
    totalCommissions: 0,
    pendingAudit: 0
  });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    api.referrals.getAll().then((res) => {
      if (res.success && res.data) {
        setReferrals(res.data);
        // Compute stats from live data
        const total = res.data.length;
        const qualified = res.data.filter((r) => r.status === "PAID" || r.status === "Paid" || Number(r.investmentAmount) >= 100).length;
        const totalCommissions = res.data.reduce((sum, r) => sum + (Number(r.commission) || 0), 0);
        const pendingAudit = res.data.filter((r) => r.status === "PENDING" || r.status === "Pending").reduce((sum, r) => sum + (Number(r.commission) || 0), 0);
        setStats({ total, qualified, totalCommissions, pendingAudit });
      }
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      header: "Referral ID",
      accessor: "referralId",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)", fontWeight: 700 }}>{row.referralId || row.id}</span>
    },
    {
      header: "Sponsor Wallet",
      accessor: "sponsorWallet",
      render: (row) => <span style={{ fontFamily: "monospace", color: "#FFF" }}>{row.sponsorWallet || row.sponsorAddress || "—"}</span>
    },
    {
      header: "Referee User",
      accessor: "referredUser",
      render: (row) => <span>{row.referredUser || row.user || "—"}</span>
    },
    {
      header: "Referee Wallet",
      accessor: "referredWallet",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-primary)" }}>{row.referredWallet || row.wallet || "—"}</span>
    },
    {
      header: "Package",
      accessor: "packageName",
      render: (row) => <span>{row.packageName || row.package || "—"}</span>
    },
    {
      header: "Qualifying Capital",
      accessor: "investmentAmount",
      render: (row) => <span style={{ fontWeight: 700, color: "#FFF" }}>${Number(row.investmentAmount || 0).toLocaleString()}</span>
    },
    {
      header: "Commission Rate",
      accessor: "rate",
      render: (row) => <span style={{ color: "var(--gold-bright)", fontWeight: 700 }}>{row.rate || "—"}</span>
    },
    {
      header: "Commission Total",
      accessor: "commission",
      render: (row) => <span style={{ color: "#22C55E", fontWeight: 700 }}>${Number(row.commission || 0).toFixed(2)} USDT</span>
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusPill status={row.status} />
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
          AFFILIATE SURVEILLANCE
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Referral Management & <span className="gold-gradient-text">Commission Audit</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Audit qualification proofs, verify multi-tier commission distribution, and prevent duplicate commission exploits.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <MetricCard title="Total Network Referrals" value={stats.total.toLocaleString()} subtitle="Platform-wide referees" icon={<Users size={18} color="var(--gold-primary)" />} />
        <MetricCard title="Qualified Contracts" value={stats.qualified.toLocaleString()} subtitle="Min $100 funded" icon={<ShieldCheck size={18} color="#22C55E" />} />
        <MetricCard title="Total Commissions Paid" value={`$${stats.totalCommissions.toFixed(2)}`} subtitle="Settled via BSC" icon={<Crown size={18} color="var(--gold-bright)" />} />
        <MetricCard title="Pending Audit" value={`$${stats.pendingAudit.toFixed(2)}`} subtitle="Blockchain verifying" icon={<Network size={18} color="#F59E0B" />} />
      </div>

      {loading && (
        <div style={{ color: "var(--text-muted)", fontSize: "14px", padding: "10px 0" }}>Loading referrals...</div>
      )}

      {/* Table */}
      <RegalTable
        columns={columns}
        data={referrals}
        searchPlaceholder="Filter commissions by sponsor, referee, or wallet..."
      />
    </div>
  );
}
