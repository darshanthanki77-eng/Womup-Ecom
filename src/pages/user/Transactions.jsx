import { ExternalLink, FileSpreadsheet, Filter } from "lucide-react";
import React, { useState } from "react";
import RegalTable from "../../components/common/RegalTable";
import ScrollableTabs from "../../components/common/ScrollableTabs";
import StatusPill from "../../components/common/StatusPill";
import { initialTransactions } from "../../data/portalData";
import { exportToCsv } from "../../utils/exportCsv";

export default function UserTransactions() {
  const [transactions] = useState(initialTransactions);
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = typeFilter === "All"
    ? transactions
    : transactions.filter((t) => t.type.toLowerCase().includes(typeFilter.toLowerCase()));

  const columns = [
    {
      header: "Timestamp",
      accessor: "date",
      render: (row) => <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{row.date}</span>
    },
    {
      header: "Transaction Type",
      accessor: "type",
      render: (row) => <span style={{ fontWeight: 600, color: "#FFF" }}>{row.type}</span>
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            color: row.amount.startsWith("+") ? "#22C55E" : row.amount.startsWith("-") ? "#EF4444" : "#FFF"
          }}
        >
          {row.amount} {row.asset}
        </span>
      )
    },
    {
      header: "Wallet",
      accessor: "wallet",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)", fontSize: "12px" }}>{row.wallet}</span>
    },
    {
      header: "Block Height",
      accessor: "block",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>#{row.block}</span>
    },
    {
      header: "On-Chain Hash",
      accessor: "txHash",
      render: (row) => (
        <a
          href={`https://bscscan.com`}
          target="_blank"
          rel="noreferrer"
          className="onchain-link"
          style={{
            fontFamily: "monospace",
            color: "var(--gold-bright)",
            textDecoration: "none",
            fontSize: "12px",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            transition: "all 0.2s ease"
          }}
        >
          {row.txHash}
          <ExternalLink size={12} className="link-arrow" style={{ transition: "transform 0.2s ease" }} />
        </a>
      )
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
            BLOCKCHAIN AUDIT TRAIL
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
            Account <span className="gold-gradient-text">Transactions</span>
          </h1>
        </div>

        <button
          onClick={() => exportToCsv(transactions, "regal-transactions")}
          className="btn btn-outline-gold btn-sm"
          style={{ boxShadow: "0 0 10px rgba(212, 175, 55, 0.15)" }}
        >
          <FileSpreadsheet size={15} /> Export Ledger (CSV)
        </button>
      </div>

      {/* Horizontally Scrollable Segmented Filter Control */}
      <ScrollableTabs
        tabs={["All", "Investment", "ROI", "Referral", "Withdrawal"]}
        activeTab={typeFilter}
        onTabChange={(tab) => setTypeFilter(tab)}
      />

      <style>{`
        .onchain-link:hover .link-arrow {
          transform: translate(2px, -2px);
          color: var(--gold-bright);
        }
      `}</style>

      {/* Transactions Table */}
      <RegalTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Filter transactions by type, hash, or amount..."
      />
    </div>
  );
}
