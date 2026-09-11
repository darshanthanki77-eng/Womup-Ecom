import { CheckCircle2, Crown, ExternalLink, Eye, Flag, Layers, ShieldAlert, X } from "lucide-react";
import React, { useState } from "react";
import RegalTable from "../../components/common/RegalTable";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";

export default function AdminInvestments() {
  const [investments, setInvestments] = useState([]);
  const [inspectInv, setInspectInv] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    api.investments.getAll().then((res) => {
      if (res.success && res.data) setInvestments(res.data);
      setLoading(false);
    });
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setInvestments(investments.map((inv) => (inv.id === id || inv.investmentId === id ? { ...inv, status: newStatus } : inv)));
    setInspectInv(null);
    setMsg(`Contract ${id} status updated to ${newStatus}.`);
    setTimeout(() => setMsg(""), 4000);
  };

  const columns = [
    {
      header: "Investment ID",
      accessor: "investmentId",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)", fontWeight: 700 }}>{row.investmentId || row.id}</span>
    },
    {
      header: "Package",
      accessor: "packageName",
      render: (row) => <span style={{ fontWeight: 600, color: "#FFF" }}>{row.packageName}</span>
    },
    {
      header: "Capital Amount",
      accessor: "amount",
      render: (row) => <span style={{ color: "var(--gold-primary)", fontWeight: 700 }}>${Number(row.amount || 0).toLocaleString()} USDT</span>
    },
    {
      header: "Start Date",
      accessor: "startDate",
      render: (row) => <span>{row.startDate}</span>
    },
    {
      header: "Cycle End",
      accessor: "cycleEndDate",
      render: (row) => <span>{row.cycleEndDate}</span>
    },
    {
      header: "Cycle Day",
      accessor: "cycleDay",
      render: (row) => <span>Day {row.cycleDay || 0} / 240</span>
    },
    {
      header: "TX Hash",
      accessor: "txHash",
      render: (row) => (
        <span style={{ fontFamily: "monospace", color: "var(--text-muted)", fontSize: "12px" }}>
          {row.txHash ? row.txHash.slice(0, 10) + "..." : "—"}
        </span>
      )
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusPill status={row.status} />
    },
    {
      header: "Actions",
      render: (row) => (
        <button onClick={() => setInspectInv(row)} className="btn btn-outline-gold btn-sm" style={{ padding: "4px 8px", fontSize: "11px" }}>
          Audit Contract
        </button>
      )
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
          CONTRACT SURVEILLANCE
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Investment <span className="gold-gradient-text">Lifecycle Moderation</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Verify on-chain deposit receipts, inspect active cycles, and enforce protocol compliance.
        </p>
      </div>

      {msg && (
        <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22C55E", borderRadius: "10px", padding: "14px", color: "#22C55E", fontSize: "13.5px" }}>
          {msg}
        </div>
      )}

      {loading && (
        <div style={{ color: "var(--text-muted)", fontSize: "14px", padding: "20px 0" }}>Loading investments...</div>
      )}

      {/* Table */}
      <RegalTable
        columns={columns}
        data={investments}
        searchPlaceholder="Search contracts by ID, package, or status..."
      />

      {/* Audit Modal */}
      {inspectInv && (
        <div className="modal-overlay" onClick={() => setInspectInv(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px" }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "18px" }}>Audit Contract {inspectInv.investmentId || inspectInv.id}</h3>
              <button onClick={() => setInspectInv(null)} style={{ background: "none", border: "none", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
              <div style={{ background: "#060606", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-standard)" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>ON-CHAIN TRANSACTION HASH</div>
                <div style={{ fontFamily: "monospace", color: "var(--gold-bright)", wordBreak: "break-all", marginTop: "4px" }}>
                  {inspectInv.txHash || "—"}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>BNB Chain Block:</span>
                <span style={{ color: "#FFF", fontFamily: "monospace" }}>#{inspectInv.blockNumber || "—"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Capital Deployed:</span>
                <span style={{ color: "var(--gold-primary)", fontWeight: 700 }}>${Number(inspectInv.amount || 0).toLocaleString()} USDT</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Current Yield Rate:</span>
                <span style={{ color: "#22C55E", fontWeight: 700 }}>{inspectInv.currentRoiRate || "—"} Daily</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>User Wallet:</span>
                <span style={{ fontFamily: "monospace", color: "#FFF", fontSize: "12px" }}>{inspectInv.userWallet || inspectInv.wallet || "—"}</span>
              </div>
            </div>
            <div className="modal-footer">
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleUpdateStatus(inspectInv.investmentId || inspectInv.id, "Flagged")} className="btn btn-outline btn-sm" style={{ color: "#EF4444" }}>
                  Flag Contract
                </button>
                <button onClick={() => handleUpdateStatus(inspectInv.investmentId || inspectInv.id, "ACTIVE")} className="btn btn-gold btn-sm">
                  Verify & Keep Active
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
