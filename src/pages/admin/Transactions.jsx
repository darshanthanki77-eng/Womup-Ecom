import { Database, Eye, FileSpreadsheet, X } from "lucide-react";
import React, { useState } from "react";
import RegalTable from "../../components/common/RegalTable";
import ScrollableTabs from "../../components/common/ScrollableTabs";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";
import { exportToCsv } from "../../utils/exportCsv";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [inspectTx, setInspectTx] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    api.transactions.getAll(typeFilter !== "All" ? typeFilter : undefined).then((res) => {
      if (res.success && res.data) setTransactions(res.data);
      setLoading(false);
    });
  }, [typeFilter]);

  const columns = [
    {
      header: "Record ID",
      accessor: "transactionId",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)", fontWeight: 700 }}>{row.transactionId || row.id}</span>
    },
    {
      header: "Timestamp",
      accessor: "createdAt",
      render: (row) => <span>{row.createdAt ? new Date(row.createdAt).toLocaleString() : row.date || "—"}</span>
    },
    {
      header: "Type",
      accessor: "type",
      render: (row) => <span style={{ fontWeight: 600, color: "#FFF" }}>{row.type}</span>
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => {
        const amt = row.amount || "";
        const isPos = String(amt).startsWith("+");
        const isNeg = String(amt).startsWith("-");
        return (
          <span style={{ fontWeight: 700, color: isPos ? "#22C55E" : isNeg ? "#EF4444" : "#FFF" }}>
            {amt} {row.asset || row.currency || ""}
          </span>
        );
      }
    },
    {
      header: "User Wallet",
      accessor: "wallet",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-primary)", fontSize: "12px" }}>{row.wallet || row.userWallet || "—"}</span>
    },
    {
      header: "Block",
      accessor: "blockNumber",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>#{row.blockNumber || row.block || "—"}</span>
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

      {/* Type Filter Tabs */}
      <ScrollableTabs
        tabs={["All", "DEPOSIT", "ROI", "REFERRAL", "WITHDRAWAL"]}
        activeTab={typeFilter}
        onTabChange={(t) => { setTypeFilter(t); setLoading(true); }}
      />

      {loading && (
        <div style={{ color: "var(--text-muted)", fontSize: "14px", padding: "10px 0" }}>Loading transactions...</div>
      )}

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
              <h3 style={{ fontSize: "18px" }}>Transaction Ledger Entry: {inspectTx.transactionId || inspectTx.id}</h3>
              <button onClick={() => setInspectTx(null)} style={{ background: "none", border: "none", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div style={{ background: "#060606", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-standard)" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>TRANSACTION HASH</div>
                <div style={{ fontFamily: "monospace", color: "var(--gold-bright)", wordBreak: "break-all", marginTop: "4px" }}>
                  {inspectTx.txHash || inspectTx.transactionHash || "—"}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Network:</span>
                <span style={{ color: "#22C55E" }}>BNB Smart Chain (Mainnet 56)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Block Number:</span>
                <span style={{ color: "#FFF", fontFamily: "monospace" }}>#{inspectTx.blockNumber || inspectTx.block || "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Type & Amount:</span>
                <span style={{ color: "var(--gold-primary)", fontWeight: 700 }}>{inspectTx.type} ({inspectTx.amount})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Target Wallet:</span>
                <span style={{ fontFamily: "monospace", color: "#FFF" }}>{inspectTx.wallet || inspectTx.userWallet || "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Timestamp:</span>
                <span style={{ color: "#FFF" }}>{inspectTx.createdAt ? new Date(inspectTx.createdAt).toLocaleString() : "—"}</span>
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
