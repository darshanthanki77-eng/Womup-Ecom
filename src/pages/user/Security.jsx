import { AlertTriangle, CheckCircle2, Globe, Key, Lock, LogOut, Shield, ShieldCheck, Smartphone } from "lucide-react";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import StatusPill from "../../components/common/StatusPill";

export default function UserSecurity() {
  const { user } = useOutletContext();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: "macOS 14.5 (Chrome)", ip: "185.220.101.4", location: "Zurich, Switzerland", current: true, time: "Active Now" },
    { id: 2, device: "iPhone 15 Pro (Safari Mobile)", ip: "185.220.101.4", location: "Zurich, Switzerland", current: false, time: "2 hours ago" }
  ]);

  const handleTerminateSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
          PROTECTION & ACCESS
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Security & <span className="gold-gradient-text">Authentication</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Manage your Web3 wallet connections, active device sessions, and authentication security guards.
        </p>
      </div>

      {/* 2FA Card */}
      <div
        className="regal-card card-spotlight"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }}
        style={{ padding: "26px", background: "rgba(14, 14, 14, 0.85)", border: "1px solid rgba(212, 175, 55, 0.3)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={22} color="var(--gold-bright)" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h3 style={{ fontSize: "19px", color: "#FFF", fontWeight: 700 }}>Two-Factor Authentication (2FA)</h3>
                <StatusPill status={twoFactorEnabled ? "Active" : "Disabled"} />
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "3px" }}>
                Require an authenticator code (TOTP) before signing high-value withdrawals or altering account details.
              </p>
            </div>
          </div>

          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={twoFactorEnabled ? "btn btn-outline btn-sm" : "btn btn-gold btn-sm"}
            style={{
              boxShadow: twoFactorEnabled ? "none" : "0 0 15px rgba(212, 175, 55, 0.35)",
              padding: "8px 18px"
            }}
          >
            {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA Guard"}
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div
        className="regal-card card-spotlight"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }}
        style={{ padding: "26px", background: "rgba(13, 13, 13, 0.85)" }}
      >
        <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "16px", fontWeight: 700 }}>Active Web Sessions</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sessions.map((sess) => (
            <div
              key={sess.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "rgba(8, 8, 8, 0.8)",
                borderRadius: "12px",
                border: sess.current ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: sess.current ? "0 0 15px rgba(34, 197, 94, 0.1)" : "none"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <Smartphone size={22} color={sess.current ? "#22C55E" : "#888"} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFF", display: "flex", alignItems: "center", gap: "8px" }}>
                    {sess.device}
                    {sess.current && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#22C55E",
                          background: "rgba(34, 197, 94, 0.12)",
                          border: "1px solid rgba(34, 197, 94, 0.3)",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px"
                        }}
                      >
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22C55E", animation: "ripplePulse 2s infinite" }} />
                        Active Session
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                    IP: {sess.ip} • {sess.location} • {sess.time}
                  </div>
                </div>
              </div>

              {!sess.current && (
                <button
                  onClick={() => handleTerminateSession(sess.id)}
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.35)",
                    color: "#EF4444",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Terminate
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Audit Events */}
      <div className="regal-card" style={{ padding: "26px", background: "#0A0A0A" }}>
        <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "14px" }}>Recent Security Alerts & Logs</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #161616" }}>
            <span style={{ color: "#FFF" }}>🟢 Web3 Wallet Connection verified via MetaMask</span>
            <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>2026-09-10 10:14</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #161616" }}>
            <span style={{ color: "#FFF" }}>🟢 Investment signature approved on-chain ($2,500 USDT)</span>
            <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>2026-07-01 11:05</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
            <span style={{ color: "#FFF" }}>🟢 Profile passwordless session initialized on BNB Chain (56)</span>
            <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>2026-06-15 08:40</span>
          </div>
        </div>
      </div>
    </div>
  );
}
