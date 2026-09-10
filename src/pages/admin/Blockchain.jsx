import {
    Activity,
    AlertOctagon,
    CheckCircle2,
    Copy,
    Database,
    ExternalLink,
    Lock,
    PauseCircle,
    PlayCircle,
    Radio,
    RefreshCw,
    ShieldAlert,
    ShieldCheck
} from "lucide-react";
import React, { useState } from "react";
import StatusPill from "../../components/common/StatusPill";
import { initialSystemSettings } from "../../data/portalData";

export default function AdminBlockchain() {
  const [settings, setSettings] = useState(initialSystemSettings);
  const [copied, setCopied] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const handleToggleEmergency = (key) => {
    const nextVal = !settings.emergency[key];
    setSettings({
      ...settings,
      emergency: { ...settings.emergency, [key]: nextVal }
    });
    setAlertMsg(`Emergency Protocol Alert: ${key} toggled to ${nextVal ? "PAUSED (HALTED)" : "ACTIVE (NORMAL)"}.`);
    setTimeout(() => setAlertMsg(""), 5000);
  };

  const contracts = [
    { name: "RGL Token Contract", standard: "BEP-20", address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", status: "Active" },
    { name: "Regal 8-Month Investment Vault", standard: "Vault Protocol", address: "0x3f5c78a910d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5", status: "Active" },
    { name: "PancakeSwap V2 Liquidity Pair", standard: "RGL/USDT Pair", address: "0x98a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9", status: "Active" },
    { name: "DAO Multi-Sig Treasury", standard: "Gnosis Safe (4 of 7)", address: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B", status: "Active" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
          WEB3 INFRASTRUCTURE & ORACLE
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Blockchain & <span className="gold-gradient-text">Smart Contract Health</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Live BNB Smart Chain RPC synchronization, smart contract parameters, and emergency circuit breakers.
        </p>
      </div>

      {alertMsg && (
        <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #EF4444", borderRadius: "10px", padding: "14px", color: "#EF4444", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}>
          <AlertOctagon size={18} /> {alertMsg}
        </div>
      )}

      {/* Emergency Control Console */}
      <div className="regal-card" style={{ padding: "26px", background: "#120808", border: "1px solid rgba(239,68,68,0.4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <ShieldAlert size={22} color="#EF4444" />
          <h3 style={{ fontSize: "18px", color: "#FFF" }}>Emergency Circuit Breakers (Multi-Sig Guarded)</h3>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
          In case of an on-chain zero-day exploit, DEX liquidity drainage, or network reorganization, toggling these controls triggers immediate timelocked contract pauses.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <button
            onClick={() => handleToggleEmergency("pauseInvestments")}
            className="btn btn-sm"
            style={{
              background: settings.emergency.pauseInvestments ? "#EF4444" : "rgba(239,68,68,0.15)",
              color: settings.emergency.pauseInvestments ? "#FFF" : "#EF4444",
              border: "1px solid #EF4444"
            }}
          >
            {settings.emergency.pauseInvestments ? <PlayCircle size={15} /> : <PauseCircle size={15} />}
            {settings.emergency.pauseInvestments ? "Resume New Investments" : "Halt New Investments (Emergency Pause)"}
          </button>

          <button
            onClick={() => handleToggleEmergency("pauseWithdrawals")}
            className="btn btn-sm"
            style={{
              background: settings.emergency.pauseWithdrawals ? "#EF4444" : "rgba(239,68,68,0.15)",
              color: settings.emergency.pauseWithdrawals ? "#FFF" : "#EF4444",
              border: "1px solid #EF4444"
            }}
          >
            {settings.emergency.pauseWithdrawals ? <PlayCircle size={15} /> : <PauseCircle size={15} />}
            {settings.emergency.pauseWithdrawals ? "Resume Withdrawals" : "Halt Withdrawals (Emergency Lock)"}
          </button>
        </div>
      </div>

      {/* Live Node Telemetry */}
      <div className="regal-card" style={{ padding: "26px", background: "#0E0E0E" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "18px", color: "#FFF" }}>BNB Smart Chain Node Telemetry</h3>
          <span style={{ fontSize: "12px", color: "#22C55E", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
            Operational Mainnet
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", fontSize: "13px" }}>
          <div style={{ background: "#060606", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-standard)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>NETWORK CHAIN ID</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "4px" }}>56 (0x38)</div>
          </div>
          <div style={{ background: "#060606", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-standard)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>SYNCED BLOCK HEIGHT</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#FFF", fontFamily: "monospace", marginTop: "4px" }}>#38,942,104</div>
          </div>
          <div style={{ background: "#060606", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-standard)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>PRIMARY RPC LATENCY</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#22C55E", marginTop: "4px" }}>180ms</div>
          </div>
          <div style={{ background: "#060606", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-standard)" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>CONFIRMATIONS REQUIRED</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--gold-primary)", marginTop: "4px" }}>15 Blocks</div>
          </div>
        </div>
      </div>

      {/* Verified Contracts Registry */}
      <div className="regal-card" style={{ padding: "26px", background: "#0E0E0E" }}>
        <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "16px" }}>Protocol Smart Contracts Registry</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {contracts.map((c) => (
            <div
              key={c.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                padding: "16px",
                background: "#080808",
                borderRadius: "10px",
                border: "1px solid var(--border-standard)"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h4 style={{ fontSize: "15px", color: "#FFF" }}>{c.name}</h4>
                  <span style={{ fontSize: "10px", color: "var(--gold-bright)", background: "rgba(212,175,55,0.15)", padding: "1px 6px", borderRadius: "3px" }}>
                    {c.standard}
                  </span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {c.address}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <StatusPill status={c.status} />
                <a
                  href={`https://bscscan.com/address/${c.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ padding: "5px 10px", fontSize: "11px" }}
                >
                  <ExternalLink size={12} /> BscScan
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
