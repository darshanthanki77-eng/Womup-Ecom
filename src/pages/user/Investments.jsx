import { CheckCircle2, Clock, Coins, Crown, ExternalLink, Layers, PlusCircle, Shield, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegalTable from "../../components/common/RegalTable";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";

export default function UserInvestments() {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [selectedInv, setSelectedInv] = useState(null);

  React.useEffect(() => {
    api.investments.getMy().then((res) => {
      if (res.success && res.data) {
        setInvestments(res.data);
      }
    });
  }, []);

  const columns = [
    {
      header: "Investment ID",
      accessor: "investmentId",
      render: (row) => (
        <span style={{ fontFamily: "monospace", color: "var(--gold-bright)", fontWeight: 700 }}>
          {row.investmentId || row.id}
        </span>
      )
    },
    {
      header: "Package",
      accessor: "packageName",
      render: (row) => (
        <span style={{ fontWeight: 600, color: "#FFF" }}>
          {row.packageName}
        </span>
      )
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--gold-primary)" }}>
          ${row.amount.toLocaleString()} USDT
        </span>
      )
    },
    {
      header: "Start Date",
      accessor: "startDate",
      render: (row) => <span style={{ color: "var(--text-secondary)" }}>{row.startDate}</span>
    },
    {
      header: "Cycle End",
      accessor: "cycleEndDate",
      render: (row) => <span style={{ color: "var(--text-secondary)" }}>{row.cycleEndDate}</span>
    },
    {
      header: "Current Phase",
      accessor: "currentPhase",
      render: (row) => (
        <span
          style={{
            fontSize: "12px",
            color: "var(--gold-bright)",
            background: "rgba(212, 175, 55, 0.12)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            padding: "4px 10px",
            borderRadius: "999px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 600
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--gold-bright)",
              boxShadow: "0 0 8px var(--gold-bright)",
              animation: "ripplePulse 2s infinite"
            }}
          />
          {row.currentPhase} ({row.currentRoiRate})
        </span>
      )
    },
    {
      header: "Accrued ROI",
      accessor: "accruedRoi",
      render: (row) => (
        <span style={{ color: "#22C55E", fontWeight: 700 }}>
          +${row.accruedRoi.toFixed(2)}
        </span>
      )
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusPill status={row.status} />
    },
    {
      header: "Action",
      render: (row) => (
        <button
          onClick={() => setSelectedInv(row)}
          className="btn btn-outline-gold btn-sm"
          style={{ padding: "5px 12px", fontSize: "11px", boxShadow: "0 0 8px rgba(212, 175, 55, 0.15)" }}
        >
          Inspect Contract
        </button>
      )
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
            PORTFOLIO CONTRACTS
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
            My Active <span className="gold-gradient-text">Investments</span>
          </h1>
        </div>
        <button onClick={() => navigate("/investment")} className="btn btn-gold btn-sm">
          <PlusCircle size={15} /> New Investment
        </button>
      </div>

      {/* Main Table */}
      <RegalTable
        columns={columns}
        data={investments}
        searchPlaceholder="Filter investments by ID, package, or date..."
      />

      {/* Glassmorphic Slide-out Investment Detail Modal / Drawer */}
      {selectedInv && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedInv(null)}
          style={{
            backdropFilter: "blur(10px)",
            background: "rgba(0, 0, 0, 0.75)",
            animation: "fadeIn 0.25s ease"
          }}
        >
          <div
            className="modal-content regal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "620px",
              background: "rgba(16, 16, 16, 0.95)",
              border: "1px solid rgba(212, 175, 55, 0.35)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 30px rgba(212, 175, 55, 0.15)",
              borderRadius: "16px",
              padding: "28px"
            }}
          >
            <div className="modal-header" style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.15)", paddingBottom: "16px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(212, 175, 55, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Crown size={20} color="var(--gold-bright)" />
                </div>
                <div>
                  <h3 style={{ fontSize: "19px", color: "#FFF", fontWeight: 800 }}>Investment Contract Specification</h3>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>{selectedInv.id}</span>
                </div>
              </div>
              <button onClick={() => setSelectedInv(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(6, 6, 6, 0.8)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>PACKAGE & PRINCIPAL</div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "2px" }}>
                    {selectedInv.packageName} — ${selectedInv.amount.toLocaleString()} USDT
                  </div>
                </div>
                <StatusPill status={selectedInv.status} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "12px", fontSize: "13px" }}>
                <div style={{ background: "rgba(12, 12, 12, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>INVESTMENT ID</div>
                  <div style={{ color: "#FFF", fontWeight: 700, fontFamily: "monospace", marginTop: "2px" }}>{selectedInv.id}</div>
                </div>
                <div style={{ background: "rgba(12, 12, 12, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>CYCLE TIMELINE</div>
                  <div style={{ color: "#FFF", fontWeight: 700, marginTop: "2px" }}>Day {selectedInv.cycleDay} / {selectedInv.totalCycleDays}</div>
                </div>
                <div style={{ background: "rgba(12, 12, 12, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>START DATE</div>
                  <div style={{ color: "#FFF", marginTop: "2px" }}>{selectedInv.startDate}</div>
                </div>
                <div style={{ background: "rgba(12, 12, 12, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>CYCLE END DATE</div>
                  <div style={{ color: "#FFF", marginTop: "2px" }}>{selectedInv.cycleEndDate}</div>
                </div>
                <div style={{ background: "rgba(12, 12, 12, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>TODAY'S DAILY YIELD</div>
                  <div style={{ color: "#22C55E", fontWeight: 700, marginTop: "2px" }}>+${selectedInv.todayRoi.toFixed(2)} ({selectedInv.currentRoiRate})</div>
                </div>
                <div style={{ background: "rgba(12, 12, 12, 0.8)", padding: "14px", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "11px", textTransform: "uppercase" }}>TOTAL ACCRUED ROI</div>
                  <div style={{ color: "var(--gold-bright)", fontWeight: 700, marginTop: "2px" }}>${selectedInv.accruedRoi.toFixed(2)}</div>
                </div>
              </div>

              {/* Blockchain Receipt Box */}
              <div style={{ background: "rgba(6, 6, 6, 0.9)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(212, 175, 55, 0.25)", fontSize: "12px" }}>
                <div style={{ color: "var(--gold-bright)", fontWeight: 700, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Shield size={14} /> ON-CHAIN VERIFICATION RECEIPT
                </div>
                <div style={{ marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-muted)" }}>BNB Smart Chain Block: </span>
                  <span style={{ color: "#FFF", fontFamily: "monospace" }}>#{selectedInv.blockNumber}</span>
                </div>
                <div style={{ wordBreak: "break-all" }}>
                  <span style={{ color: "var(--text-muted)" }}>Transaction Hash: </span>
                  <a
                    href={`https://bscscan.com/tx/${selectedInv.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--gold-primary)", textDecoration: "none", fontFamily: "monospace" }}
                  >
                    {selectedInv.txHash} <ExternalLink size={10} style={{ display: "inline" }} />
                  </a>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px", marginTop: "20px" }}>
              <button onClick={() => setSelectedInv(null)} className="btn btn-outline btn-sm">
                Close
              </button>
              <button onClick={() => navigate("/roi-history")} className="btn btn-gold btn-sm">
                View ROI Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
