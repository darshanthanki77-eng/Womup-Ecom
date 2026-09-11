import {
    ArrowDownRight,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Coins,
    Crown,
    ExternalLink,
    HelpCircle,
    Layers,
    PlusCircle,
    Send,
    TrendingUp,
    Users,
    Wallet
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import MetricCard from "../../components/common/MetricCard";
import RoiTimeline from "../../components/common/RoiTimeline";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [chartFilter, setChartFilter] = useState("30d");
  const [investments, setInvestments] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [transactions, setTransactions] = useState([]);

  React.useEffect(() => {
    api.investments.getMy().then((r) => r.success && r.data && setInvestments(r.data));
    api.referrals.getMy().then((r) => r.success && r.data && setReferrals(r.data));
    api.transactions.getMy().then((r) => r.success && r.data && setTransactions(r.data));
  }, []);

  const currentInv = investments[0] || null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Top Greeting & Network Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "18px"
        }}
      >
        <div>
          <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
            NON-CUSTODIAL PORTFOLIO
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
            Welcome back, <span className="gold-gradient-text">{user.name}</span>
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px", fontSize: "13px", color: "var(--text-secondary)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
              BNB Smart Chain (Mainnet 56)
            </span>
            <span>•</span>
            <span style={{ fontFamily: "monospace", color: "var(--gold-bright)" }}>{user.shortAddress}</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/investment")} className="btn btn-gold btn-sm">
            <PlusCircle size={15} /> Invest Now
          </button>
          <button onClick={() => navigate("/withdraw")} className="btn btn-outline btn-sm">
            <ArrowUpRight size={15} /> Withdraw
          </button>
          <button onClick={() => navigate("/referrals")} className="btn btn-outline-gold btn-sm">
            <Users size={15} /> Invite Friends
          </button>
        </div>
      </div>

      {/* 8 Required KPI Cards */}
      <div>
        <h3 style={{ fontSize: "14px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
          Portfolio Financial Metrics
        </h3>
        <div
          className="dashboard-kpi-grid metric-kpi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px"
          }}
        >
          <MetricCard
            title="Total Investment"
            value={`$${user.kpi.totalInvested.toLocaleString()}`}
            subtitle="Principal balance"
            icon={<Coins size={18} color="var(--gold-primary)" />}
          />
          <MetricCard
            title="Active Investment"
            value={`$${user.kpi.activeInvested.toLocaleString()}`}
            subtitle="2 Active Packages"
            trend="+100%"
            icon={<Layers size={18} color="#22C55E" />}
          />
          <MetricCard
            title="Total ROI"
            value={`$${user.kpi.totalRoi.toFixed(2)}`}
            subtitle="Accrued + Paid"
            trend="+6.5%"
            showSparkline={true}
            icon={<TrendingUp size={18} color="var(--gold-bright)" />}
          />
          <MetricCard
            title="Pending ROI"
            value={`$${user.kpi.pendingRoi.toFixed(2)}`}
            subtitle="Awaiting settlement"
            icon={<Clock size={18} color="#F59E0B" />}
          />
          <MetricCard
            title="Paid ROI"
            value={`$${user.kpi.paidRoi.toFixed(2)}`}
            subtitle="Withdrawn to wallet"
            icon={<CheckCircle2 size={18} color="#22C55E" />}
          />
          <MetricCard
            title="Referral Earnings"
            value={`$${user.kpi.referralEarnings.toFixed(2)}`}
            subtitle="From 3 direct referee tiers"
            icon={<Users size={18} color="var(--gold-primary)" />}
          />
          <MetricCard
            title="Available Balance"
            value={`$${user.kpi.availableBalance.toFixed(2)}`}
            subtitle="Eligible for withdrawal"
            icon={<Wallet size={18} color="#22C55E" />}
          />
          <MetricCard
            title="Principal Return"
            value={`$${user.kpi.principalReturn.toLocaleString()}`}
            subtitle="Unlocks at Month 8 end"
            icon={<Crown size={18} color="var(--gold-bright)" />}
          />
        </div>
      </div>

      {/* Active Investment Spotlight Card */}
      {currentInv ? <div
        className="regal-card card-spotlight"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }}
        style={{
          background: "linear-gradient(135deg, rgba(22, 22, 22, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
          borderColor: "rgba(212, 175, 55, 0.35)",
          padding: "26px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "18px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(212,175,55,0.15)",
                border: "1px solid rgba(212,175,55,0.3)",
                boxShadow: "0 0 15px rgba(212,175,55,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Crown size={22} color="var(--gold-bright)" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h3 style={{ fontSize: "21px", color: "#FFF", fontWeight: 800, letterSpacing: "-0.01em" }}>{currentInv.packageName}</h3>
                <StatusPill status={currentInv.status} />
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                ID: {currentInv.investmentId || currentInv.id} • Tx: {currentInv.txHash ? `${currentInv.txHash.slice(0, 10)}...${currentInv.txHash.slice(-6)}` : "—"}
              </span>
            </div>
          </div>

          <button onClick={() => navigate("/investments")} className="btn btn-outline-gold btn-sm" style={{ boxShadow: "0 0 10px rgba(212, 175, 55, 0.15)" }}>
            Inspect Contract Details <ExternalLink size={13} />
          </button>
        </div>

        <div
          className="dashboard-kpi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
            gap: "16px",
            background: "rgba(6, 6, 6, 0.8)",
            padding: "20px",
            borderRadius: "14px",
            border: "1px solid rgba(212, 175, 55, 0.15)",
            position: "relative",
            zIndex: 2
          }}
        >
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Principal Capital</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "4px" }}>
              ${Number(currentInv.amount || 0).toLocaleString()} USDT
            </div>
          </div>

          {/* Cycle Progress with mini Circular SVG Ring */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative", width: "42px", height: "42px", flexShrink: 0 }}>
              <svg width="42" height="42" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="var(--gold-bright)"
                  strokeWidth="3"
                  strokeDasharray="94.2"
                  strokeDashoffset={94.2 - (94.2 * ((currentInv.cycleDay || 0) / (currentInv.totalCycleDays || 240)))}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "10px", fontWeight: 800, color: "var(--gold-bright)" }}>
                40%
              </span>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Cycle Progress</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#FFF", marginTop: "2px" }}>
                Day {currentInv.cycleDay || 0} <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>/ {currentInv.totalCycleDays || 240}</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Current Rate</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "4px" }}>
              {currentInv.currentRoiRate} Daily
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Today's Yield</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#22C55E", marginTop: "4px" }}>
              +${Number(currentInv.todayRoi || 0).toFixed(2)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Total Accrued</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#FFF", marginTop: "4px" }}>
              ${Number(currentInv.accruedRoi || currentInv.totalRoiAccrued || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Glowing Linear Progress Bar */}
        <div style={{ marginTop: "16px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: "var(--text-secondary)", marginBottom: "6px" }}>
            <span>Protocol Maturity Countdown (Month 8 Release)</span>
            <span style={{ color: "var(--gold-bright)", fontWeight: 700 }}>{Math.max(0, (currentInv.totalCycleDays || 240) - (currentInv.cycleDay || 0))} Days Remaining</span>
          </div>
          <div style={{ height: "6px", width: "100%", background: "rgba(255, 255, 255, 0.08)", borderRadius: "999px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${((currentInv.cycleDay || 0) / (currentInv.totalCycleDays || 240)) * 100}%`,
                background: "linear-gradient(90deg, #D4AF37 0%, #F4D77A 100%)",
                boxShadow: "0 0 10px rgba(212, 175, 55, 0.6)",
                borderRadius: "999px"
              }}
            />
          </div>
        </div>
      </div> : (
        <div className="regal-card" style={{ padding: "28px", background: "rgba(14,14,14,0.9)", border: "1px solid rgba(212,175,55,0.2)", textAlign: "center" }}>
          <Crown size={32} color="rgba(212,175,55,0.4)" style={{ marginBottom: "12px" }} />
          <h3 style={{ color: "#FFF", fontSize: "18px", marginBottom: "8px" }}>No Active Investment</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>Start your first investment to see live cycle progress here.</p>
          <button onClick={() => navigate("/investment")} className="btn btn-gold btn-sm"><PlusCircle size={14} /> Invest Now</button>
        </div>
      )}

      {/* ROI Lifecycle Section */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <div>
            <h3 style={{ fontSize: "18px", color: "#FFF" }}>ROI Lifecycle Progression</h3>
            <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
              Structured 8-month protocol schedule. Simple daily yield starts strictly after Day 60.
            </span>
          </div>
          <button onClick={() => navigate("/roi-history")} className="btn btn-outline btn-sm">
            View Ledger
          </button>
        </div>
        <RoiTimeline currentPhase={currentInv?.currentPhase} />
      </div>

      {/* Simulated Gold Line Chart Card */}
      <div className="regal-card" style={{ padding: "26px", background: "#0E0E0E" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "18px", color: "#FFF" }}>Cumulative ROI Performance</h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Simulated on-chain daily yield accruals</span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["7d", "30d", "3m", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setChartFilter(f)}
                className={`btn btn-sm ${chartFilter === f ? "btn-gold" : "btn-outline"}`}
                style={{ padding: "4px 10px", fontSize: "11px", textTransform: "uppercase" }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Gold Chart */}
        <div style={{ height: "180px", width: "100%", position: "relative" }}>
          <svg viewBox="0 0 700 160" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 150 Q 80 150 140 148 T 260 120 T 380 90 T 500 50 T 620 25 T 700 10 L 700 160 L 0 160 Z"
              fill="url(#chartGrad)"
            />
            <path
              d="M 0 150 Q 80 150 140 148 T 260 120 T 380 90 T 500 50 T 620 25 T 700 10"
              fill="none"
              stroke="#F4D77A"
              strokeWidth="3"
            />
            {/* Markers */}
            <circle cx="140" cy="148" r="4" fill="#D4AF37" />
            <circle cx="260" cy="120" r="4" fill="#D4AF37" />
            <circle cx="500" cy="50" r="4" fill="#D4AF37" />
            <circle cx="700" cy="10" r="5" fill="#22C55E" />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "11px", color: "var(--text-muted)" }}>
            <span>Day 1 (Deposit)</span>
            <span>Day 60 (0% Buffer End)</span>
            <span>Month 3–5 (0.15% Daily)</span>
            <span>Month 6–8 (0.25% Daily)</span>
            <span>Month 8 (Maturity)</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Transactions & Recent Referrals */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "24px" }}>
        {/* Recent Transactions */}
        <div className="regal-card" style={{ padding: "22px", background: "#0D0D0D" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", color: "#FFF" }}>Recent Account Transactions</h3>
            <button onClick={() => navigate("/transactions")} style={{ background: "none", border: "none", color: "var(--gold-primary)", fontSize: "12px", cursor: "pointer" }}>
              View All →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {transactions.length > 0 ? (
              transactions.slice(0, 4).map((tx) => (
                <div key={tx.transactionId || tx._id || tx.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#080808", borderRadius: "8px", border: "1px solid #1A1A1A" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFF" }}>{tx.type}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{tx.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: String(tx.amount).startsWith("+") ? "#22C55E" : String(tx.amount).startsWith("-") ? "#EF4444" : "#FFF" }}>
                      {tx.amount}
                    </div>
                    <StatusPill status={tx.status} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: "12px", color: "var(--text-muted)", padding: "12px 0" }}>No transactions recorded yet.</div>
            )}
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="regal-card" style={{ padding: "22px", background: "#0D0D0D" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", color: "#FFF" }}>Recent Direct Referrals</h3>
            <button onClick={() => navigate("/referrals")} style={{ background: "none", border: "none", color: "var(--gold-primary)", fontSize: "12px", cursor: "pointer" }}>
              View Network →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {referrals.length > 0 ? (
              referrals.slice(0, 4).map((ref) => (
                <div key={ref.referralId || ref._id || ref.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#080808", borderRadius: "8px", border: "1px solid #1A1A1A" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFF" }}>{ref.referredUser || ref.user}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>{ref.referredWallet || ref.wallet}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--gold-bright)" }}>
                      +${Number(ref.commission).toFixed(2)} ({ref.rate})
                    </div>
                    <StatusPill status={ref.status} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: "12px", color: "var(--text-muted)", padding: "12px 0" }}>No direct referrals yet. Invite friends to earn commissions.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
