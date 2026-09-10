import { Database, ExternalLink, Eye, FileSpreadsheet, Filter, X } from "lucide-react";
import React, { useState } from "react";
import RegalTable from "../../components/common/RegalTable";
import StatusPill from "../../components/common/StatusPill";
import { initialTransactions } from "../../data/portalData";
import { exportToCsv } from "../../utils/exportCsv";

export default function AdminTransactions() {
  const [transactions] = useState(initialTransactions);
  const [inspectTx, setInspectTx] = useState(null);

  const columns = [
    {
      header: "Record ID",
      accessor: "id",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)", fontWeight: 700 }}>{row.id}</span>
    },
    {
      header: "Timestamp",
      accessor: "date",
      render: (row) => <span>{row.date}</span>
    },
    {
      header: "Type",
      accessor: "type",
      render: (row) => <span style={{ fontWeight: 600, color: "#FFF" }}>{row.type}</span>
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span style={{ fontWeight: 700, color: row.amount.startsWith("+") ? "#22C55E" : row.amount.startsWith("-") ? "#EF4444" : "#FFF" }}>
          {row.amount} {row.asset}
        </span>
      )
    },
    {
      header: "User Wallet",
      accessor: "wallet",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-primary)", fontSize: "12px" }}>{row.wallet}</span>
    },
    {
      header: "Block",
      accessor: "block",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>#{row.block}</span>
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusPill status={row.status} />
    },
    {
      header: "Actions",
      render: (row) => (
        <button onClick={() => setInspectTx(row)} className="btn btn-outline-gold btn-sm" style={{ padding: "4px 8px", fontSize: "11px" }}>
          <Eye size={12} /> Inspect
        </button>
      )
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "12px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
            GLOBAL LEDGER
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
            Platform <span className="gold-gradient-text">Transactions Ledger</span>
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Master financial audit records spanning all smart contract deposits, yield accruals, referrals, and withdrawals.
          </p>
        </div>

        <button onClick={() => exportToCsv(transactions, "admin-transactions-ledger")} className="btn btn-outline-gold btn-sm">
          <FileSpreadsheet size={15} /> Export Ledger (CSV)
        </button>
      </div>

      {/* Table */}
      <RegalTable
        columns={columns}
        data={transactions}
        searchPlaceholder="Search global transactions by ID, type, hash, or wallet..."
      />

      {/* Transaction Detail Modal */}
      {inspectTx && (
        <div className="modal-overlay" onClick={() => setInspectTx(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "18px" }}>Transaction Ledger Entry: {inspectTx.id}</h3>
              <button onClick={() => setInspectTx(null)} style={{ background: "none", border: "none", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div style={{ background: "#060606", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-standard)" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>TRANSACTION HASH</div>
                <div style={{ fontFamily: "monospace", color: "var(--gold-bright)", wordBreak: "break-all", marginTop: "4px" }}>
                  {inspectTx.txHash}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Network:</span>
                <span style={{ color: "#22C55E" }}>BNB Smart Chain (Mainnet 56)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Block Number:</span>
                <span style={{ color: "#FFF", fontFamily: "monospace" }}>#{inspectTx.block}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Type & Amount:</span>
                <span style={{ color: "var(--gold-primary)", fontWeight: 700 }}>{inspectTx.type} ({inspectTx.amount})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Target Wallet:</span>
                <span style={{ fontFamily: "monospace", color: "#FFF" }}>{inspectTx.wallet}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setInspectTx(null)} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
