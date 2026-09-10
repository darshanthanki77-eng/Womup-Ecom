import { CheckCircle2, HelpCircle, MessageCircle, MessageSquare, PlusCircle, Send, ShieldCheck, X } from "lucide-react";
import React, { useState } from "react";
import StatusPill from "../../components/common/StatusPill";
import { initialTickets } from "../../data/portalData";

export default function UserSupport() {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("Investment");
  const [newMessage, setNewMessage] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateTicket = (e) => {
    e.preventDefault();
    const createdTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newCategory,
      subject: newSubject,
      created: new Date().toISOString().slice(0, 10),
      lastUpdate: "Just now",
      status: "OPEN",
      messages: [
        { sender: "User", text: newMessage, time: new Date().toISOString().replace("T", " ").slice(0, 16) }
      ]
    };

    setTickets([createdTicket, ...tickets]);
    setNewSubject("");
    setNewMessage("");
    setSuccess(`Ticket ${createdTicket.id} submitted! A dedicated concierge specialist will respond shortly.`);
    setTimeout(() => setSuccess(""), 5000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
          CONCIERGE DESK
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Support & <span className="gold-gradient-text">Assistance</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Direct communication line with the Regal Web3 concierge team. 24/7 priority ticketing response.
        </p>
      </div>

      {success && (
        <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22C55E", borderRadius: "10px", padding: "14px", color: "#22C55E", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
          <CheckCircle2 size={16} /> {success}
        </div>
      )}

      {/* Two Column Layout: Create Ticket & Active Tickets */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px", alignItems: "start" }} className="support-grid">
        {/* Left Ticket Form */}
        <div
          className="regal-card card-spotlight"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          }}
          style={{ padding: "26px", background: "rgba(14, 14, 14, 0.85)" }}
        >
          <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "16px", fontWeight: 700 }}>Submit Support Inquiry</h3>

          <form onSubmit={handleCreateTicket} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="regal-label">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="regal-input"
                style={{ background: "rgba(7, 7, 7, 0.8)" }}
              >
                <option value="Investment">Investment Packages & Cycles</option>
                <option value="ROI">Daily ROI Accruals & Calculations</option>
                <option value="Withdrawal">Withdrawals & Settlement</option>
                <option value="Referral">Referral Commissions</option>
                <option value="Wallet">Wallet & BNB Smart Chain</option>
                <option value="Technical">Smart Contract / Blockchain</option>
              </select>
            </div>

            <div>
              <label className="regal-label">Subject</label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Brief subject summary"
                className="regal-input"
                required
              />
            </div>

            <div>
              <label className="regal-label">Message</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Describe your question or issue in detail..."
                rows={4}
                className="regal-input"
                style={{ resize: "vertical" }}
                required
              />
            </div>

            <button type="submit" className="btn btn-gold" style={{ marginTop: "6px", boxShadow: "0 0 15px rgba(212, 175, 55, 0.3)" }}>
              <Send size={15} /> Submit Inquiry
            </button>
          </form>
        </div>

        {/* Right Active Tickets Table */}
        <div
          className="regal-card card-spotlight"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          }}
          style={{ padding: "26px", background: "rgba(13, 13, 13, 0.85)" }}
        >
          <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "16px", fontWeight: 700 }}>My Support Tickets</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                style={{
                  background: "rgba(8, 8, 8, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderLeft: "3px solid var(--gold-bright)",
                  borderRadius: "10px",
                  padding: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--gold-bright)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.borderLeft = "3px solid var(--gold-bright)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", color: "var(--gold-bright)", fontFamily: "monospace", fontWeight: 700 }}>
                    {t.id} • {t.category}
                  </span>
                  <StatusPill status={t.status} />
                </div>
                <h4 style={{ fontSize: "14.5px", color: "#FFF", marginBottom: "4px" }}>{t.subject}</h4>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Opened: {t.created} • Last update: {t.lastUpdate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Details Glassmorphic Modal */}
      {selectedTicket && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedTicket(null)}
          style={{ backdropFilter: "blur(10px)", background: "rgba(0, 0, 0, 0.75)" }}
        >
          <div
            className="modal-content regal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "580px",
              background: "rgba(16, 16, 16, 0.95)",
              border: "1px solid rgba(212, 175, 55, 0.35)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 30px rgba(212, 175, 55, 0.15)",
              borderRadius: "16px",
              padding: "26px"
            }}
          >
            <div className="modal-header" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "16px", marginBottom: "18px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--gold-bright)", fontFamily: "monospace" }}>
                  {selectedTicket.id} • {selectedTicket.category}
                </span>
                <h3 style={{ fontSize: "19px", color: "#FFF", marginTop: "2px", fontWeight: 700 }}>{selectedTicket.subject}</h3>
              </div>
              <button onClick={() => setSelectedTicket(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Status:</span>
                <StatusPill status={selectedTicket.status} />
              </div>

              {selectedTicket.messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    background: m.sender === "Concierge" ? "rgba(212,175,55,0.08)" : "rgba(10, 10, 10, 0.8)",
                    border: `1px solid ${m.sender === "Concierge" ? "rgba(212,175,55,0.3)" : "rgba(255, 255, 255, 0.08)"}`,
                    borderLeft: m.sender === "Concierge" ? "3px solid var(--gold-bright)" : "3px solid #666",
                    borderRadius: "10px",
                    padding: "14px 16px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "11px" }}>
                    <strong style={{ color: m.sender === "Concierge" ? "var(--gold-bright)" : "#FFF" }}>
                      {m.sender === "Concierge" ? "Regal Support Concierge" : "You"}
                    </strong>
                    <span style={{ color: "var(--text-muted)" }}>{m.time}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", margin: 0 }}>
                    {m.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="modal-footer" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px", marginTop: "18px" }}>
              <button onClick={() => setSelectedTicket(null)} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .support-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
