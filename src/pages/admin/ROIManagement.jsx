import { CheckCircle2, Clock, Play, RefreshCw, ShieldCheck, Terminal, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import MetricCard from "../../components/common/MetricCard";
import RegalTable from "../../components/common/RegalTable";
import StatusPill from "../../components/common/StatusPill";
import { initialRoiLedger } from "../../data/portalData";

export default function AdminROIManagement() {
  const [ledger] = useState(initialRoiLedger);
  const [running, setRunning] = useState(false);
  const [runLog, setRunLog] = useState(null);

  const handleTriggerDailyRun = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setRunLog({
        timestamp: new Date().toISOString(),
        contractsProcessed: 1640,
        totalCreditedUsdt: "7,275.00",
        failures: 0,
        skippedBuffer: 320,
        precision: "Fixed 18 Decimals (Deterministic)"
      });
    }, 1800);
  };

  const columns = [
    {
      header: "Record ID",
      accessor: "id",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)" }}>{row.id}</span>
    },
    {
      header: "Date",
      accessor: "date",
      render: (row) => <span>{row.date}</span>
    },
    {
      header: "Contract ID",
      accessor: "investmentId",
      render: (row) => <span style={{ fontFamily: "monospace", color: "#FFF" }}>{row.investmentId}</span>
    },
    {
      header: "Calculation Phase",
      accessor: "phase",
      render: (row) => <span>{row.phase}</span>
    },
    {
      header: "Applied Rate",
      accessor: "rate",
      render: (row) => <span style={{ color: "var(--gold-primary)", fontWeight: 700 }}>{row.rate}</span>
    },
    {
      header: "Amount Credited",
      accessor: "amount",
      render: (row) => <span style={{ color: "#22C55E", fontWeight: 700 }}>+${row.amount.toFixed(2)} USDT</span>
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
          <span style={{ fontSize: "12px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
            AUTOMATED YIELD ENGINE
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
            ROI Engine & <span className="gold-gradient-text">Calculation Ledger</span>
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Deterministic daily yield scheduler with duplicate accrual prevention and auditable ledger outputs.
          </p>
        </div>

        <button
          onClick={handleTriggerDailyRun}
          disabled={running}
          className="btn btn-gold btn-sm"
        >
          {running ? <RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={15} />}
          {running ? "Executing Daily Batch..." : "Trigger Manual Daily Run"}
        </button>
      </div>

      {/* 4 Summary Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <MetricCard title="Contracts Processed" value="1,640" subtitle="Active yielding contracts" icon={<TrendingUp size={18} color="var(--gold-primary)" />} />
        <MetricCard title="Daily Run Volume" value="$7,275.00" subtitle="Estimated daily liability" icon={<Clock size={18} color="var(--gold-bright)" />} />
        <MetricCard title="Successful Accruals" value="100%" subtitle="0 calculation conflicts" icon={<CheckCircle2 size={18} color="#22C55E" />} />
        <MetricCard title="Buffer Skipped" value="320" subtitle="Contracts in Day 1–60" icon={<ShieldCheck size={18} color="#666" />} />
      </div>

      {/* Real-time Calculation Run Log */}
      {runLog && (
        <div className="regal-card" style={{ padding: "20px", background: "#050505", border: "1px solid #22C55E" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#22C55E", fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>
            <Terminal size={16} /> Daily Yield Calculation Engine Output
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.7" }}>
            <div>[TIMESTAMP] {runLog.timestamp}</div>
            <div>[STATUS] SUCCESS: {runLog.contractsProcessed} contracts verified and credited.</div>
            <div>[SUM] Total Credited: ${runLog.totalCreditedUsdt} USDT. Failures: {runLog.failures}.</div>
            <div>[BUFFER] {runLog.skippedBuffer} contracts skipped (under 60-day zero-yield rule).</div>
            <div>[INTEGRITY] Precision: {runLog.precision}. Duplicate accrual check passed.</div>
          </div>
        </div>
      )}

      {/* Engine Ledger Table */}
      <RegalTable
        columns={columns}
        data={ledger}
        searchPlaceholder="Filter ROI records by ID, contract, or amount..."
      />
    </div>
  );
}
