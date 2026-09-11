import { Activity, Download, Eye, FileSpreadsheet, Filter, Lock, ShieldCheck, X } from "lucide-react";
import React, { useState } from "react";
import RegalTable from "../../components/common/RegalTable";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";
import { exportToCsv } from "../../utils/exportCsv";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [inspectLog, setInspectLog] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    api.admin.getAuditLogs().then((res) => {
      if (res.success && res.data) setLogs(res.data);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      header: "Timestamp",
      accessor: "timestamp",
      render: (row) => <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{row.timestamp}</span>
    },
    {
      header: "Admin Account",
      accessor: "admin",
      render: (row) => <span style={{ fontWeight: 600, color: "#FFF" }}>{row.admin}</span>
    },
    {
      header: "Action Executed",
      accessor: "action",
      render: (row) => <span style={{ color: "var(--gold-bright)", fontWeight: 700 }}>{row.action}</span>
    },
    {
      header: "Target Module",
      accessor: "module",
      render: (row) => <span style={{ color: "#FFF" }}>{row.module}</span>
    },
    {
      header: "IP Address",
      accessor: "ip",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--text-muted)", fontSize: "12px" }}>{row.ip}</span>
    },
    {
      header: "Result",
      accessor: "result",
      render: (row) => <StatusPill status={row.result} />
    },
    {
      header: "Details",
      render: (row) => (
        <button onClick={() => setInspectLog(row)} className="btn btn-outline btn-sm" style={{ padding: "4px 8px", fontSize: "11px" }}>
          Inspect Diff
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
            TAMPER-EVIDENT SURVEILLANCE
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
            Admin Security <span className="gold-gradient-text">Audit Logs</span>
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Immutable logging of all parameter alterations, manual approvals, and security interventions.
          </p>
        </div>

        <button onClick={() => exportToCsv(logs, "regal-admin-audit-logs")} className="btn btn-outline-gold btn-sm">
          <FileSpreadsheet size={15} /> Export Audit Logs (CSV)
        </button>
      </div>

      {/* Audit Table */}
      {loading && <div style={{ color: "var(--text-muted)", fontSize: "14px", padding: "10px 0" }}>Loading audit logs...</div>}
      <RegalTable
        columns={columns}
        data={logs}
        searchPlaceholder="Search audit logs by admin, action, module, or IP..."
      />

      {/* Log Details Modal with Old vs New Diff */}
      {inspectLog && (
        <div className="modal-overlay" onClick={() => setInspectLog(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "18px" }}>Audit Trail Entry Inspection</h3>
              <button onClick={() => setInspectLog(null)} style={{ background: "none", border: "none", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13px" }}>
              <div style={{ background: "#060606", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-standard)" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>ACTION DETAILS</div>
                <div style={{ fontSize: "16px", color: "var(--gold-bright)", fontWeight: 700, marginTop: "2px" }}>
                  {inspectLog.action} ({inspectLog.module})
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>
                  By: {inspectLog.admin} • {inspectLog.timestamp}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "12px" }}>
                <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", padding: "12px", borderRadius: "8px" }}>
                  <div style={{ color: "#EF4444", fontSize: "11px", fontWeight: 700 }}>PREVIOUS VALUE</div>
                  <div style={{ color: "#FFF", marginTop: "4px" }}>{inspectLog.oldValue}</div>
                </div>

                <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)", padding: "12px", borderRadius: "8px" }}>
                  <div style={{ color: "#22C55E", fontSize: "11px", fontWeight: 700 }}>COMMITTED VALUE</div>
                  <div style={{ color: "#FFF", marginTop: "4px" }}>{inspectLog.newValue}</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px" }}>
                <span style={{ color: "var(--text-muted)" }}>Originating IP & Device:</span>
                <span style={{ color: "#FFF", fontFamily: "monospace" }}>{inspectLog.ip} ({inspectLog.device})</span>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setInspectLog(null)} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
