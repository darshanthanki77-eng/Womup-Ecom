import {
    Activity,
    AlertCircle,
    ArrowUpRight,
    BarChart3,
    CheckCircle2,
    Clock,
    Coins,
    Crown,
    Database,
    Layers,
    PieChart,
    PlusCircle,
    TrendingUp,
    Users,
    Wallet
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import MetricCard from "../../components/common/MetricCard";
import { api } from "../../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    activeUsers: 0,
    totalInvestments: 0,
    activeInvestments: 0,
    totalInvested: 0,
    roiAccrued: 0,
    referralCommissions: 0,
    pendingWithdrawals: 0,
    completedWithdrawals: 0,
    principalReturned: 0,
    packageDistribution: { silver: 0, gold: 0, black: 0 }
  });

  React.useEffect(() => {
    api.admin.getDashboard().then((res) => {
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
            GLOBAL PROTOCOL TELEMETRY
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
            Admin <span className="gold-gradient-text">Executive Dashboard</span>
          </h1>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/admin/reports")} className="btn btn-outline-gold btn-sm">
            Generate Reports
          </button>
          <button onClick={() => navigate("/admin/audit-logs")} className="btn btn-outline btn-sm">
            <Activity size={14} /> Audit Trail
          </button>
        </div>
      </div>

      {/* 10 KPI Cards Required by SRS */}
      <div>
        <h3 style={{ fontSize: "14px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
          Key Protocol Indicators
        </h3>
        <div className="dashboard-kpi-grid metric-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          <MetricCard title="Total Users" value={stats.totalUsers.toLocaleString()} subtitle="Registered on BSC" icon={<Users size={18} color="var(--gold-primary)" />} />
          <MetricCard title="Active Users" value={stats.activeUsers.toLocaleString()} subtitle="With active capital" trend="+68%" icon={<CheckCircle2 size={18} color="#22C55E" />} />
          <MetricCard title="Total Investments" value={stats.totalInvestments.toLocaleString()} subtitle="Lifetime contracts" icon={<Layers size={18} color="var(--gold-bright)" />} />
          <MetricCard title="Active Investments" value={stats.activeInvestments.toLocaleString()} subtitle="Currently yielding" icon={<Layers size={18} color="#22C55E" />} />
          <MetricCard title="Total Invested Volume" value={`$${stats.totalInvested.toLocaleString()}`} subtitle="BEP-20 USDT TVL" icon={<Coins size={18} color="var(--gold-bright)" />} />
          <MetricCard title="ROI Accrued" value={`$${stats.roiAccrued.toLocaleString()}`} subtitle="Protocol liability" icon={<TrendingUp size={18} color="#F59E0B" />} />
          <MetricCard title="Referral Commissions" value={`$${stats.referralCommissions.toLocaleString()}`} subtitle="Distributed to sponsors" icon={<Crown size={18} color="var(--gold-primary)" />} />
          <MetricCard title="Pending Withdrawals" value={`$${stats.pendingWithdrawals.toLocaleString()}`} subtitle="In settlement queue" icon={<Clock size={18} color="#EF4444" />} />
          <MetricCard title="Completed Withdrawals" value={`$${stats.completedWithdrawals.toLocaleString()}`} subtitle="Settled on-chain" icon={<Wallet size={18} color="#22C55E" />} />
          <MetricCard title="Principal Returned" value={`$${stats.principalReturned.toLocaleString()}`} subtitle="Completed 8-mo cycles" icon={<CheckCircle2 size={18} color="var(--gold-bright)" />} />
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "24px" }}>
        {/* Capital Growth Chart */}
        <div className="regal-card" style={{ padding: "26px", background: "#0E0E0E" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontSize: "16px", color: "#FFF" }}>Capital Growth (USDT TVL)</h3>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Cumulative invested capital</span>
            </div>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#22C55E" }}>
              ${stats.totalInvested.toLocaleString()} USDT
            </span>
          </div>

          <div style={{ height: "160px", width: "100%" }}>
            <svg viewBox="0 0 500 140" style={{ width: "100%", height: "100%" }}>
              <path d="M 0 130 Q 80 120 160 90 T 320 50 T 500 15 L 500 140 L 0 140 Z" fill="rgba(212,175,55,0.15)" />
              <path d="M 0 130 Q 80 120 160 90 T 320 50 T 500 15" fill="none" stroke="#D4AF37" strokeWidth="3" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)" }}>
              <span>M-6</span><span>M-5</span><span>M-4</span><span>M-3</span><span>M-2</span><span>Now</span>
            </div>
          </div>
        </div>

        {/* Tier Distribution Breakdown */}
        {(() => {
          const dist = stats.packageDistribution || { silver: 0, gold: 0, black: 0 };
          const total = (dist.silver || 0) + (dist.gold || 0) + (dist.black || 0) || stats.totalInvestments || 1;
          const goldPct = Math.round(((dist.gold || 0) / total) * 100);
          const blackPct = Math.round(((dist.black || 0) / total) * 100);
          const silverPct = 100 - goldPct - blackPct;
          return (
            <div className="regal-card" style={{ padding: "26px", background: "#0E0E0E" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", color: "#FFF" }}>Investment Package Distribution</h3>
                <span style={{ fontSize: "12px", color: "var(--gold-bright)", fontWeight: 700 }}>{total.toLocaleString()} Total</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span style={{ color: "#FFF" }}>Regal Gold ($1,000–$2,999.99)</span>
                    <strong style={{ color: "var(--gold-bright)" }}>{goldPct}% ({dist.gold || 0})</strong>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "#1C1C1C", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${goldPct}%`, height: "100%", background: "var(--gold-gradient)" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span style={{ color: "#FFF" }}>Regal Black ($3,000+)</span>
                    <strong style={{ color: "#FFF" }}>{blackPct}% ({dist.black || 0})</strong>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "#1C1C1C", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${blackPct}%`, height: "100%", background: "#F5F5F5" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                    <span style={{ color: "#FFF" }}>Regal Silver ($100–$999.99)</span>
                    <strong style={{ color: "var(--text-muted)" }}>{silverPct}% ({dist.silver || 0})</strong>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "#1C1C1C", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${silverPct}%`, height: "100%", background: "#666" }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
