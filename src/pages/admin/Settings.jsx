import { CheckCircle2, Loader2, Save, Users, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";

const defaultSettings = {
  withdrawals: {
    minimumUsdt: 50,
    maximumUsdt: 50000,
    feePercent: 1.0,
    approvalMode: "Manual Above $1,000"
  },
  roi: {
    dailyCutoffUtc: "00:00 UTC",
    autoPayout: true
  },
  blockchain: {
    rpcUrl: "https://bsc-dataseed.binance.org/",
    confirmationsRequired: 15
  },
  emergency: {
    pauseInvestments: false,
    pauseWithdrawals: false,
    pauseRoi: false
  }
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [adminList] = useState([
    { email: "superadmin@regal.io", role: "Super Admin", access: "Full System Authority", status: "Active" },
    { email: "finance@regal.io", role: "Finance Admin", access: "Investments, ROI, Withdrawals", status: "Active" },
    { email: "support@regal.io", role: "Support Admin", access: "Users, Tickets, Notifications", status: "Active" },
    { email: "content@regal.io", role: "Content Admin", access: "CMS, FAQ, Docs", status: "Active" }
  ]);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const res = await api.admin.getSettings();
        if (res.success && Array.isArray(res.data)) {
          const loaded = { ...defaultSettings };
          res.data.forEach((item) => {
            if (item.key && item.value !== undefined) {
              loaded[item.key] = item.value;
            }
          });
          setSettings(loaded);
        }
      } catch (err) {
        console.warn("Could not fetch settings from server, using active state", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await Promise.all([
        api.admin.updateSetting("withdrawals", settings.withdrawals),
        api.admin.updateSetting("roi", settings.roi),
        api.admin.updateSetting("blockchain", settings.blockchain)
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
          SYSTEM PARAMETERS & ROLES
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Admin & <span className="gold-gradient-text">System Settings</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Configure withdrawal limits, daily cutoff times, blockchain parameters, and administrative privileges.
        </p>
      </div>

      {saved && (
        <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22C55E", borderRadius: "10px", padding: "14px", color: "#22C55E", display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px" }}>
          <CheckCircle2 size={16} /> Global configuration parameters committed to database!
        </div>
      )}

      {/* Admin Users & Roles Table */}
      <div className="regal-card" style={{ padding: "26px", background: "#0E0E0E" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Users size={18} color="var(--gold-bright)" />
            <h3 style={{ fontSize: "18px", color: "#FFF" }}>Privileged Admin Roles</h3>
          </div>
          <button className="btn btn-outline-gold btn-sm">
            <UserPlus size={13} /> Add Admin
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {adminList.map((adm) => (
            <div key={adm.email} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#080808", borderRadius: "8px", border: "1px solid #181818" }}>
              <div>
                <div style={{ fontWeight: 600, color: "#FFF" }}>{adm.email}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{adm.access}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "11px", color: "var(--gold-bright)", background: "rgba(212,175,55,0.1)", padding: "2px 8px", borderRadius: "4px" }}>
                  {adm.role}
                </span>
                <StatusPill status={adm.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configurable Financial & Operational Settings Form */}
      <div className="regal-card" style={{ padding: "28px", background: "#0E0E0E" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "18px", color: "#FFF" }}>Configurable Protocol Parameters</h3>
          {loading && (
            <span style={{ fontSize: "12px", color: "var(--gold-bright)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Loader2 size={14} className="spin" /> Loading parameters...
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Withdrawal Settings */}
          <div>
            <h4 style={{ fontSize: "14px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Withdrawal Thresholds & Rules
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
              <div>
                <label className="regal-label">Minimum Withdrawal (USDT)</label>
                <input
                  type="number"
                  value={settings.withdrawals.minimumUsdt}
                  onChange={(e) => setSettings({ ...settings, withdrawals: { ...settings.withdrawals, minimumUsdt: parseFloat(e.target.value) || 0 } })}
                  className="regal-input"
                  required
                />
              </div>

              <div>
                <label className="regal-label">Maximum Withdrawal (USDT)</label>
                <input
                  type="number"
                  value={settings.withdrawals.maximumUsdt}
                  onChange={(e) => setSettings({ ...settings, withdrawals: { ...settings.withdrawals, maximumUsdt: parseFloat(e.target.value) || 0 } })}
                  className="regal-input"
                  required
                />
              </div>

              <div>
                <label className="regal-label">Protocol Withdrawal Fee (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.withdrawals.feePercent}
                  onChange={(e) => setSettings({ ...settings, withdrawals: { ...settings.withdrawals, feePercent: parseFloat(e.target.value) || 0 } })}
                  className="regal-input"
                  required
                />
              </div>

              <div>
                <label className="regal-label">Approval Governance Mode</label>
                <select
                  value={settings.withdrawals.approvalMode}
                  onChange={(e) => setSettings({ ...settings, withdrawals: { ...settings.withdrawals, approvalMode: e.target.value } })}
                  className="regal-input"
                  style={{ background: "#070707" }}
                >
                  <option value="Manual Above $1,000">Manual Above $1,000 (Recommended)</option>
                  <option value="Fully Automated">Fully Automated Smart Contract</option>
                  <option value="Strict Manual All">Strict Manual Review (All)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ROI Engine Settings */}
          <div style={{ borderTop: "1px solid #1A1A1A", paddingTop: "18px" }}>
            <h4 style={{ fontSize: "14px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              ROI Calculation Engine Schedule
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
              <div>
                <label className="regal-label">Daily Calculation Cutoff Time</label>
                <input
                  type="text"
                  value={settings.roi.dailyCutoffUtc}
                  onChange={(e) => setSettings({ ...settings, roi: { ...settings.roi, dailyCutoffUtc: e.target.value } })}
                  className="regal-input"
                  required
                />
              </div>

              <div>
                <label className="regal-label">Automated Ledger Payout</label>
                <select
                  value={settings.roi.autoPayout ? "true" : "false"}
                  onChange={(e) => setSettings({ ...settings, roi: { ...settings.roi, autoPayout: e.target.value === "true" } })}
                  className="regal-input"
                  style={{ background: "#070707" }}
                >
                  <option value="true">Enabled (Deterministic CRON)</option>
                  <option value="false">Manual Confirmation Required</option>
                </select>
              </div>
            </div>
          </div>

          {/* Blockchain Node Settings */}
          <div style={{ borderTop: "1px solid #1A1A1A", paddingTop: "18px" }}>
            <h4 style={{ fontSize: "14px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Blockchain Node & Explorer
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "14px" }}>
              <div>
                <label className="regal-label">Primary BNB Smart Chain RPC</label>
                <input
                  type="text"
                  value={settings.blockchain.rpcUrl}
                  onChange={(e) => setSettings({ ...settings, blockchain: { ...settings.blockchain, rpcUrl: e.target.value } })}
                  className="regal-input"
                  required
                />
              </div>
              <div>
                <label className="regal-label">Required Block Confirmations</label>
                <input
                  type="number"
                  value={settings.blockchain.confirmationsRequired}
                  onChange={(e) => setSettings({ ...settings, blockchain: { ...settings.blockchain, confirmationsRequired: parseInt(e.target.value) || 15 } })}
                  className="regal-input"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-gold btn-sm" style={{ alignSelf: "flex-start", marginTop: "8px" }}>
            <Save size={14} /> Commit & Apply Settings
          </button>
        </form>
      </div>
    </div>
  );
}
