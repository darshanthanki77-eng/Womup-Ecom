import { CheckCircle2, Clock, Download, FileSpreadsheet, Filter, Sparkles, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import MetricCard from "../../components/common/MetricCard";
import RegalTable from "../../components/common/RegalTable";
import ScrollableTabs from "../../components/common/ScrollableTabs";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";
import { exportToCsv } from "../../utils/exportCsv";

export default function UserROIHistory() {
  const [ledger, setLedger] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState("All");

  React.useEffect(() => {
    api.roi.getMyHistory().then((res) => {
      if (res.success && res.data) {
        setLedger(res.data);
      }
    });
  }, []);

  const totalRoi = ledger.reduce((s, r) => s + Number(r.accruedAmount ?? r.amount ?? 0), 0);
  const pendingRoi = ledger
    .filter((r) => r.status === "PENDING" || r.status === "Pending" || r.status === "Accrued" || r.status === "ACCRUED")
    .reduce((s, r) => s + Number(r.accruedAmount ?? r.amount ?? 0), 0);
  const paidRoi = ledger
    .filter((r) => r.status === "PAID" || r.status === "Paid" || r.status === "SETTLED")
    .reduce((s, r) => s + Number(r.accruedAmount ?? r.amount ?? 0), 0);
  const activeRate = ledger.length > 0 ? (ledger[0]?.rate || ledger[0]?.appliedRate || "0.15%") : "0.15%";

  const filtered = selectedPhase === "All"
    ? ledger
    : ledger.filter((item) => item.phase?.includes(selectedPhase));

  const columns = [
    {
      header: "Date",
      accessor: "date",
      render: (row) => <span style={{ color: "#FFF", fontWeight: 600 }}>{row.businessDate || row.date}</span>
    },
    {
      header: "Investment ID",
      accessor: "investmentId",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)" }}>{row.investmentId}</span>
    },
    {
      header: "Phase",
      accessor: "phase",
      render: (row) => (
        <span style={{ fontSize: "12px", background: "rgba(212,175,55,0.1)", color: "var(--gold-bright)", padding: "2px 8px", borderRadius: "4px" }}>
          {row.phase}
        </span>
      )
    },
    {
      header: "Daily Rate",
      accessor: "rate",
      render: (row) => <span style={{ fontWeight: 700, color: "var(--gold-primary)" }}>{row.rate}</span>
    },
    {
      header: "ROI Amount",
      accessor: "amount",
      render: (row) => (
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "#22C55E" }}>
          +${Number(row.accruedAmount ?? row.amount ?? 0).toFixed(2)} USDT
        </span>
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
            FINANCIAL AUDIT LEDGER
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
            Daily ROI <span className="gold-gradient-text">History</span>
          </h1>
        </div>

        <button
          onClick={() => exportToCsv(ledger, "regal-roi-ledger")}
          className="btn btn-outline-gold btn-sm"
        >
          <FileSpreadsheet size={15} /> Export Ledger (CSV)
        </button>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-kpi-grid metric-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <MetricCard
          title="Total ROI"
          value={`$${totalRoi.toFixed(2)}`}
          subtitle="Cumulative earnings"
          icon={<TrendingUp size={18} color="var(--gold-primary)" />}
        />
        <MetricCard
          title="Pending Settlement"
          value={`$${pendingRoi.toFixed(2)}`}
          subtitle="Internal ledger accruals"
          icon={<Clock size={18} color="#F59E0B" />}
        />
        <MetricCard
          title="Paid ROI"
          value={`$${paidRoi.toFixed(2)}`}
          subtitle="Settled to user wallet"
          icon={<CheckCircle2 size={18} color="#22C55E" />}
        />
        <MetricCard
          title="Current Active Rate"
          value={`${activeRate} Daily`}
          subtitle="Simple yield"
          icon={<Sparkles size={18} color="var(--gold-bright)" />}
        />
      </div>

      {/* Interactive Yield Curve Progression Visualizer */}
      <div
        className="regal-card card-spotlight"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }}
        style={{
          padding: "24px 26px",
          background: "linear-gradient(135deg, rgba(18, 18, 18, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
          border: "1px solid rgba(212, 175, 55, 0.25)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "17px", color: "#FFF", fontWeight: 700 }}>Protocol Yield Curve Trajectory</h3>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Step-function yield acceleration model across 8-month protocol cycle</span>
          </div>
          <span style={{ fontSize: "12px", color: "var(--gold-bright)", background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
            CURRENT: PHASE 1 (0.15%/day)
          </span>
        </div>

        <div style={{ height: "130px", width: "100%", position: "relative" }}>
          <svg viewBox="0 0 700 110" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <defs>
              <linearGradient id="roiCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Step function path */}
            <path
              d="M 0 100 L 175 100 L 175 65 L 437 65 L 437 25 L 700 25 L 700 110 L 0 110 Z"
              fill="url(#roiCurveGrad)"
            />
            <path
              d="M 0 100 L 175 100 L 175 65 L 437 65 L 437 25 L 700 25"
              fill="none"
              stroke="#F4D77A"
              strokeWidth="2.5"
            />
            {/* Phase nodes */}
            <circle cx="87" cy="100" r="4" fill="#666" />
            <circle cx="306" cy="65" r="5" fill="#D4AF37" />
            <circle cx="568" cy="25" r="5" fill="#22C55E" />
          </svg>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr", marginTop: "6px", fontSize: "11px", textAlign: "center" }}>
            <div style={{ color: "var(--text-muted)", borderRight: "1px dashed rgba(255,255,255,0.1)" }}>
              <strong style={{ color: "#AAA" }}>Days 1–60</strong><br />0% Buffer
            </div>
            <div style={{ color: "var(--gold-bright)", borderRight: "1px dashed rgba(255,255,255,0.1)" }}>
              <strong>Months 3–5</strong><br />+0.15% Daily Simple ROI
            </div>
            <div style={{ color: "#22C55E" }}>
              <strong>Months 6–8</strong><br />+0.25% Daily Accelerated ROI
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Phase Filter */}
      <ScrollableTabs
        tabs={["All", "Month 3–5", "Month 6–8"]}
        activeTab={selectedPhase}
        onTabChange={(phase) => setSelectedPhase(phase)}
      />

      {/* ROI Ledger Table */}
      <RegalTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Filter ROI ledger by date, ID, rate..."
      />
    </div>
  );
}
