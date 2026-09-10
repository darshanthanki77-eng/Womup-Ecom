import { CheckCircle2, Crown, ExternalLink, Network, ShieldCheck, Users } from "lucide-react";
import React, { useState } from "react";
import MetricCard from "../../components/common/MetricCard";
import RegalTable from "../../components/common/RegalTable";
import StatusPill from "../../components/common/StatusPill";
import { initialReferrals } from "../../data/portalData";

export default function AdminReferrals() {
  const [referrals] = useState(initialReferrals);

  const columns = [
    {
      header: "Referral ID",
      accessor: "id",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)", fontWeight: 700 }}>{row.id}</span>
    },
    {
      header: "Sponsor Wallet",
      render: () => <span style={{ fontFamily: "monospace", color: "#FFF" }}>0x82A4...7B91</span>
    },
    {
      header: "Referee User",
      accessor: "user",
      render: (row) => <span>{row.user}</span>
    },
    {
      header: "Referee Wallet",
      accessor: "wallet",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-primary)" }}>{row.wallet}</span>
    },
    {
      header: "Package",
      accessor: "package",
      render: (row) => <span>{row.package}</span>
    },
    {
      header: "Qualifying Capital",
      accessor: "investmentAmount",
      render: (row) => <span style={{ fontWeight: 700, color: "#FFF" }}>${row.investmentAmount.toLocaleString()}</span>
    },
    {
      header: "Commission Rate",
      accessor: "rate",
      render: (row) => <span style={{ color: "var(--gold-bright)", fontWeight: 700 }}>{row.rate}</span>
    },
    {
      header: "Commission Total",
      accessor: "commission",
      render: (row) => <span style={{ color: "#22C55E", fontWeight: 700 }}>${row.commission.toFixed(2)} USDT</span>
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
        <MetricCard title="Total Network Referrals" value="2,840" subtitle="Platform-wide referees" icon={<Users size={18} color="var(--gold-primary)" />} />
        <MetricCard title="Qualified Contracts" value="2,190" subtitle="Min $100 funded" icon={<ShieldCheck size={18} color="#22C55E" />} />
        <MetricCard title="Total Commissions Paid" value="$145,500" subtitle="Settled via BSC" icon={<Crown size={18} color="var(--gold-bright)" />} />
        <MetricCard title="Pending Audit" value="$1,850" subtitle="Blockchain verifying" icon={<Network size={18} color="#F59E0B" />} />
      </div>

      {/* Table */}
      <RegalTable
        columns={columns}
        data={referrals}
        searchPlaceholder="Filter commissions by sponsor, referee, or wallet..."
      />
    </div>
  );
}
