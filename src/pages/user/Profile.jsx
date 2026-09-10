import { CheckCircle2, Copy, Edit3, Key, Mail, Shield, User, Wallet } from "lucide-react";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import StatusPill from "../../components/common/StatusPill";

export default function UserProfile() {
  const { user, setUser } = useOutletContext();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...user, name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
          ACCOUNT IDENTITY
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          User <span className="gold-gradient-text">Profile</span>
        </h1>
      </div>

      {saved && (
        <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22C55E", borderRadius: "10px", padding: "14px", color: "#22C55E", display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px" }}>
          <CheckCircle2 size={16} /> Profile parameters updated successfully.
        </div>
      )}

      {/* User Bio Card */}
      <div className="regal-card" style={{ padding: "28px", background: "linear-gradient(135deg, #101010 0%, #060606 100%)", borderColor: "var(--border-highlight)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--gold-gradient)", color: "#050505", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 800 }}>
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2 style={{ fontSize: "22px", color: "#FFF" }}>{user.name}</h2>
              <StatusPill status={user.status} />
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              {user.email} • Member since {user.registrationDate}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Detail Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }} className="profile-grid">
        {/* Left Edit Form */}
        <div className="regal-card" style={{ padding: "26px", background: "#0D0D0D" }}>
          <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "18px" }}>Personal Details</h3>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="regal-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="regal-input"
                required
              />
            </div>

            <div>
              <label className="regal-label">Email Address (Notifications)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="regal-input"
                required
              />
            </div>

            <div>
              <label className="regal-label">User Identifier</label>
              <input
                type="text"
                value={user.id}
                disabled
                className="regal-input"
                style={{ opacity: 0.6, cursor: "not-allowed", fontFamily: "monospace" }}
              />
            </div>

            <button type="submit" className="btn btn-gold btn-sm" style={{ alignSelf: "flex-start", marginTop: "8px" }}>
              Save Changes
            </button>
          </form>
        </div>

        {/* Right Referral & Affiliation Card */}
        <div className="regal-card" style={{ padding: "26px", background: "#0A0A0A" }}>
          <h3 style={{ fontSize: "16px", color: "var(--gold-bright)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Ecosystem Affiliation
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "13px" }}>
            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>YOUR REFERRAL CODE</div>
              <div style={{ fontFamily: "monospace", fontSize: "16px", color: "var(--gold-bright)", fontWeight: 700, marginTop: "2px" }}>
                {user.referralCode}
              </div>
            </div>

            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>ASSIGNED SPONSOR</div>
              <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#FFF", marginTop: "2px" }}>
                {user.sponsor}
              </div>
            </div>

            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>PRIMARY CONNECTED WALLET</div>
              <div style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--gold-primary)", marginTop: "2px", wordBreak: "break-all" }}>
                {user.walletAddress}
              </div>
            </div>

            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>NETWORK VERIFICATION</div>
              <div style={{ color: "#22C55E", fontWeight: 600, marginTop: "2px" }}>
                Active Mainnet (Chain ID 56)
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
