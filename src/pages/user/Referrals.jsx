import confetti from "canvas-confetti";
import {
    Check,
    CheckCircle2,
    Coins,
    Copy,
    Crown,
    ExternalLink,
    Network,
    Share2,
    Shield,
    Sparkles,
    Users
} from "lucide-react";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import MetricCard from "../../components/common/MetricCard";
import RegalTable from "../../components/common/RegalTable";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";

export default function UserReferrals() {
  const { user } = useOutletContext();
  const [copied, setCopied] = useState(false);
  const [idCopied, setIdCopied] = useState(false);
  const [referrals, setReferrals] = useState([]);

  React.useEffect(() => {
    api.referrals.getMy().then((res) => {
      if (res.success && res.data) {
        setReferrals(res.data);
      }
    });
  }, []);

  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter((r) => r.status === "PAID" || r.status === "Paid" || r.status === "Active").length;
  const qualifiedReferrals = referrals.filter((r) => Number(r.investmentAmount) >= 100).length;
  const totalCommission = referrals.reduce((s, r) => s + Number(r.commission || 0), 0);
  const pendingCommission = referrals.filter((r) => r.status === "PENDING" || r.status === "Pending").reduce((s, r) => s + Number(r.commission || 0), 0);
  const paidCommission = referrals.filter((r) => r.status === "PAID" || r.status === "Paid").reduce((s, r) => s + Number(r.commission || 0), 0);

  const referralCode = user?.referralCode || "RGL7821";
  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/?ref=${referralCode}`
    : `https://regal.com/?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#D4AF37", "#F4D77A", "#FFFFFF", "#22C55E"]
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(referralCode);
    setIdCopied(true);
    confetti({
      particleCount: 35,
      spread: 45,
      origin: { y: 0.7 },
      colors: ["#D4AF37", "#F4D77A", "#FFFFFF"]
    });
    setTimeout(() => setIdCopied(false), 2000);
  };

  const columns = [
    {
      header: "Referee User",
      accessor: "user",
      render: (row) => <span style={{ fontWeight: 600, color: "#FFF" }}>{row.referredUser || row.user}</span>
    },
    {
      header: "Referred Wallet",
      accessor: "wallet",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)" }}>{row.referredWallet || row.wallet}</span>
    },
    {
      header: "Package Tier",
      accessor: "package",
      render: (row) => <span>{row.packageName || row.package}</span>
    },
    {
      header: "Qualifying Amount",
      accessor: "investmentAmount",
      render: (row) => <span style={{ color: "#FFF", fontWeight: 700 }}>${Number(row.investmentAmount || 0).toLocaleString()} USDT</span>
    },
    {
      header: "Tier Rate",
      accessor: "rate",
      render: (row) => <span style={{ color: "var(--gold-primary)", fontWeight: 700 }}>{row.rate}</span>
    },
    {
      header: "Commission Paid",
      accessor: "commission",
      render: (row) => (
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "#22C55E" }}>
          +${row.commission.toFixed(2)}
        </span>
      )
    },
    {
      header: "Date",
      accessor: "date",
      render: (row) => <span style={{ color: "var(--text-secondary)" }}>{row.date}</span>
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
      <div>
        <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
          AFFILIATE NETWORK
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Referrals & <span className="gold-gradient-text">Commissions</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Earn instant on-chain commissions when your referee activates a verified package on BNB Smart Chain.
        </p>
      </div>

      {/* Referral Hero Link Card with Spotlight & Ambient Aura */}
      <div
        className="regal-card card-spotlight"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }}
        style={{
          background: "linear-gradient(135deg, rgba(24, 20, 10, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)",
          border: "1px solid rgba(212, 175, 55, 0.4)",
          boxShadow: "0 0 30px rgba(212, 175, 55, 0.15)",
          padding: "28px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Sparkles size={16} color="var(--gold-bright)" />
              <span style={{ fontSize: "11.5px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                YOUR UNIQUE REFERRAL IDENTIFIER & LINK
              </span>
            </div>

            {/* Referral ID Pill */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Your Referral ID:</div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "var(--gold-bright)",
                  background: "rgba(212, 175, 55, 0.12)",
                  border: "1px solid rgba(212, 175, 55, 0.35)",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  letterSpacing: "0.08em"
                }}
              >
                {referralCode}
              </div>
              <button
                onClick={handleCopyId}
                className="btn btn-outline btn-xs"
                style={{ fontSize: "11px", padding: "4px 10px" }}
              >
                {idCopied ? <Check size={12} color="#22C55E" /> : <Copy size={12} />} {idCopied ? "ID Copied" : "Copy ID"}
              </button>
            </div>

            <div
              style={{
                fontFamily: "monospace",
                fontSize: "13.5px",
                color: "#E0E0E0",
                background: "rgba(0, 0, 0, 0.6)",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                wordBreak: "break-all",
                display: "inline-block",
                maxWidth: "100%"
              }}
            >
              {referralLink}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={handleCopy}
              className="btn btn-gold btn-sm"
              style={{ padding: "8px 18px", boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)" }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied Link!" : "Copy Full Link"}
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "Join Regal RGL", url: referralLink });
                } else {
                  handleCopy();
                }
              }}
              className="btn btn-outline btn-sm"
            >
              <Share2 size={15} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* 6 Referral Statistics Cards */}
      <div className="dashboard-kpi-grid metric-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
        <MetricCard title="Total Referrals" value={totalReferrals.toString()} subtitle="Invited members" icon={<Users size={18} color="var(--gold-primary)" />} />
        <MetricCard title="Active Referrals" value={activeReferrals.toString()} subtitle="Active packages" icon={<CheckCircle2 size={18} color="#22C55E" />} />
        <MetricCard title="Qualified Referrals" value={qualifiedReferrals.toString()} subtitle="Min $100 funded" icon={<Crown size={18} color="var(--gold-bright)" />} />
        <MetricCard title="Total Commission" value={`$${totalCommission.toFixed(2)}`} subtitle="Cumulative earned" icon={<Coins size={18} color="var(--gold-primary)" />} />
        <MetricCard title="Pending Commission" value={`$${pendingCommission.toFixed(2)}`} subtitle="Blockchain audit" icon={<Network size={18} color="#F59E0B" />} />
        <MetricCard title="Paid Commission" value={`$${paidCommission.toFixed(2)}`} subtitle="Credited to ledger" icon={<CheckCircle2 size={18} color="#22C55E" />} />
      </div>

      {/* Visual Multi-Tier Cascading Commission Tree */}
      <div className="regal-card" style={{ padding: "24px", background: "rgba(14, 14, 14, 0.85)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div>
            <h3 style={{ fontSize: "17px", color: "#FFF", fontWeight: 700 }}>Commission Tier Multiplier Structure</h3>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Direct on-chain commissions paid automatically on referee deposit activation</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "16px" }}>
          <div style={{ background: "rgba(20, 24, 32, 0.7)", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "12px", padding: "18px", textAlign: "center", position: "relative" }}>
            <div style={{ color: "#94A3B8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Tier 1 • Regal Silver</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "#E2E8F0", margin: "6px 0" }}>1.5%</div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>Volume: $100 – $999.99</div>
            <div style={{ fontSize: "11px", color: "#22C55E", marginTop: "6px", fontWeight: 600 }}>Auto-Disbursed BEP-20</div>
          </div>

          <div style={{ background: "linear-gradient(145deg, rgba(38, 30, 12, 0.8) 0%, rgba(18, 14, 6, 0.9) 100%)", border: "1px solid var(--gold-bright)", borderRadius: "12px", padding: "18px", textAlign: "center", position: "relative", boxShadow: "0 0 20px rgba(212, 175, 55, 0.2)" }}>
            <div style={{ color: "var(--gold-bright)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Tier 2 • Regal Gold (Popular)</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "var(--gold-bright)", margin: "6px 0" }}>3.0%</div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>Volume: $1,000 – $2,999.99</div>
            <div style={{ fontSize: "11px", color: "#22C55E", marginTop: "6px", fontWeight: 600 }}>2X Multiplier Rate</div>
          </div>

          <div style={{ background: "rgba(22, 22, 22, 0.8)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "12px", padding: "18px", textAlign: "center", position: "relative" }}>
            <div style={{ color: "#FFF", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Tier 3 • Regal Black VIP</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 800, color: "#FFF", margin: "6px 0" }}>5.0%</div>
            <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>Volume: $3,000+ Unlimited</div>
            <div style={{ fontSize: "11px", color: "#22C55E", marginTop: "6px", fontWeight: 600 }}>Maximum Affiliate Royalty</div>
          </div>
        </div>
      </div>

      {/* Downline Referral Table */}
      <div>
        <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "14px" }}>
          Direct Downline Network Records
        </h3>
        <RegalTable
          columns={columns}
          data={referrals}
          searchPlaceholder="Filter referees by name or wallet..."
        />
      </div>
    </div>
  );
}
