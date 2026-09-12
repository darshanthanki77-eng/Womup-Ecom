import {
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    DollarSign,
    ExternalLink,
    HelpCircle,
    Shield,
    Wallet,
    X
} from "lucide-react";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import RegalTable from "../../components/common/RegalTable";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";

import { useWallet } from "../../context/WalletContext";

export default function UserWithdraw() {
  const { user, setUser } = useOutletContext();
  const wallet = useWallet();
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("USDT");
  const [destination, setDestination] = useState(wallet?.account || "");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (wallet?.account && !destination) {
      setDestination(wallet.account);
    }
  }, [wallet?.account]);

  const fetchWithdrawals = () => {
    api.withdrawals.getMy().then((res) => {
      if (res.success && res.data) {
        setWithdrawals(res.data);
      }
    });
  };

  React.useEffect(() => {
    fetchWithdrawals();
  }, []);

  const availableBal = user?.kpi?.availableBalance || 0;
  const numAmount = parseFloat(amount) || 0;
  const fee = numAmount * 0.01; // 1% configurable fee
  const finalReceive = Math.max(numAmount - fee, 0);

  const handleValidate = (e) => {
    e.preventDefault();
    if (numAmount < 50) {
      setErrorMsg("Minimum withdrawal amount is $50.00 USDT.");
      return;
    }
    if (numAmount > availableBal) {
      setErrorMsg(`Insufficient available balance ($${availableBal.toFixed(2)} USDT available).`);
      return;
    }
    setErrorMsg("");
    setIsConfirmOpen(true);
  };

  const handleExecuteWithdrawal = async () => {
    try {
      const res = await api.withdrawals.requestPayout(numAmount, destination || user?.walletAddress);
      if (res.success && res.data) {
        setWithdrawals([res.data, ...withdrawals]);
        setIsConfirmOpen(false);
        setAmount("");
        setSuccessMsg(`Withdrawal of $${numAmount.toFixed(2)} USDT logged successfully! Awaiting processing.`);

        // Refresh user balance from backend
        api.auth.getMe().then((u) => {
          if (u.success && u.data && setUser) setUser(u.data);
        });

        setTimeout(() => setSuccessMsg(""), 6000);
      } else {
        setErrorMsg(res.error || "Withdrawal request failed.");
        setIsConfirmOpen(false);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to process withdrawal.");
      setIsConfirmOpen(false);
    }
  };

  const columns = [
    {
      header: "ID",
      accessor: "withdrawalId",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)" }}>{row.withdrawalId || row.id}</span>
    },
    {
      header: "Date",
      accessor: "date",
      render: (row) => <span>{row.date}</span>
    },
    {
      header: "Requested",
      accessor: "amount",
      render: (row) => <span style={{ fontWeight: 700, color: "#FFF" }}>${row.amount.toFixed(2)} {row.asset}</span>
    },
    {
      header: "Fee",
      accessor: "fee",
      render: (row) => <span style={{ color: "var(--text-muted)" }}>${row.fee.toFixed(2)}</span>
    },
    {
      header: "Net Received",
      accessor: "finalAmount",
      render: (row) => <span style={{ color: "#22C55E", fontWeight: 700 }}>${row.finalAmount.toFixed(2)}</span>
    },
    {
      header: "Destination",
      accessor: "destination",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-primary)" }}>{row.destination}</span>
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
          CAPITAL SETTLEMENT
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Request <span className="gold-gradient-text">Withdrawal</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Withdraw earned daily ROI and referral commissions directly to your connected BNB Smart Chain wallet.
        </p>
      </div>

      {successMsg && (
        <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22C55E", borderRadius: "10px", padding: "14px", color: "#22C55E", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}>
          <CheckCircle2 size={18} /> {successMsg}
        </div>
      )}

      {/* Main Withdrawal Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", alignItems: "start" }} className="withdraw-grid">
        {/* Left Form */}
        <div className="regal-card" style={{ padding: "28px", background: "#0E0E0E" }}>
          <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "18px" }}>Withdrawal Parameters</h3>

          <form onSubmit={handleValidate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="regal-label">Select Asset & Network</label>
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="regal-input"
                style={{ background: "#070707" }}
              >
                <option value="USDT">Tether USDT (BNB Smart Chain BEP-20)</option>
                <option value="RGL">REGAL (RGL Token Native)</option>
              </select>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label className="regal-label" style={{ marginBottom: 0 }}>Withdrawal Amount</label>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Available: <strong style={{ color: "var(--gold-bright)" }}>${availableBal.toFixed(2)} USDT</strong>
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min. 50.00"
                  className="regal-input"
                  style={{ fontSize: "17px", fontWeight: 700 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setAmount(availableBal.toString())}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", color: "var(--gold-bright)", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                >
                  MAX
                </button>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label className="regal-label" style={{ margin: 0 }}>Destination Address (BSC BEP-20)</label>
                {wallet?.isConnected && wallet?.account && (
                  <button
                    type="button"
                    onClick={() => setDestination(wallet.account)}
                    style={{ background: "none", border: "none", color: "var(--gold-bright)", cursor: "pointer", fontSize: "11px", textDecoration: "underline", padding: 0 }}
                  >
                    Auto-Fill Connected Wallet
                  </button>
                )}
              </div>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="0x... your connected BSC wallet address"
                className="regal-input"
                style={{ fontFamily: "monospace", fontSize: "13px" }}
                required
              />
            </div>

            {errorMsg && (
              <div style={{ color: "#EF4444", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertCircle size={15} /> {errorMsg}
              </div>
            )}

            <button type="submit" className="btn btn-gold" style={{ marginTop: "10px", padding: "14px 0" }}>
              Review Withdrawal <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Right Summary Card with Multi-Sig Security Badge */}
        <div
          className="regal-card card-spotlight"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          }}
          style={{ padding: "26px", background: "rgba(12, 12, 12, 0.85)", border: "1px solid rgba(212, 175, 55, 0.3)" }}
        >
          <h3 style={{ fontSize: "16px", color: "var(--gold-bright)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Summary & Fee Breakdown
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Requested Amount:</span>
              <span style={{ color: "#FFF", fontWeight: 700 }}>${numAmount.toFixed(2)} USDT</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Protocol Network Fee (1%):</span>
              <span style={{ color: "var(--gold-primary)" }}>-${fee.toFixed(2)} USDT</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "12px" }}>
              <span style={{ color: "#FFF", fontWeight: 700 }}>Net Disbursed to Wallet:</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 800, color: "#22C55E" }}>
                ${finalReceive.toFixed(2)} USDT
              </span>
            </div>
          </div>

          {/* Multi-Sig Security Badge */}
          <div
            style={{
              background: "rgba(6, 6, 6, 0.85)",
              padding: "16px",
              borderRadius: "10px",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              fontSize: "12px",
              color: "var(--text-secondary)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--gold-bright)", fontWeight: 700 }}>
                <Shield size={14} /> Multi-Sig Protection Active
              </div>
              <span style={{ fontSize: "11px", color: "#22C55E", fontWeight: 700 }}>2/3 Signers Online</span>
            </div>
            <p style={{ margin: "0 0 10px 0", lineHeight: 1.5 }}>
              Withdrawals up to $1,000 are processed automatically via BSC smart contract within 10–30 minutes. Institutional amounts are subjected to multi-sig authorization.
            </p>
            {/* Glowing security audit progress bar */}
            <div style={{ height: "4px", width: "100%", background: "rgba(255, 255, 255, 0.08)", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg, #22C55E, #D4AF37)", boxShadow: "0 0 8px rgba(34, 197, 94, 0.5)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="modal-overlay" onClick={() => setIsConfirmOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "18px" }}>Confirm Withdrawal Request</h3>
              <button onClick={() => setIsConfirmOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ fontSize: "13.5px", color: "var(--text-secondary)" }}>
                Please review your transaction details before submitting to the smart contract queue:
              </p>
              <div style={{ background: "#060606", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-standard)", fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Amount:</span>
                  <strong style={{ color: "#FFF" }}>${numAmount.toFixed(2)} USDT</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Fee:</span>
                  <span style={{ color: "var(--gold-primary)" }}>${fee.toFixed(2)} USDT</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Destination:</span>
                  <span style={{ fontFamily: "monospace", color: "var(--gold-bright)" }}>{destination.slice(0, 10)}...{destination.slice(-6)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Network:</span>
                  <span style={{ color: "#22C55E" }}>BNB Smart Chain (56)</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setIsConfirmOpen(false)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button onClick={handleExecuteWithdrawal} className="btn btn-gold btn-sm">
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal History Table */}
      <div>
        <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "14px" }}>
          Withdrawal Settlement History
        </h3>
        <RegalTable
          columns={columns}
          data={withdrawals}
          searchPlaceholder="Search withdrawals by ID or destination..."
        />
      </div>

      <style>{`
        @media (max-width: 860px) {
          .withdraw-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
