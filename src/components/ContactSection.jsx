import {
    AlertCircle,
    CheckCircle2,
    HelpCircle,
    Mail,
    MessageCircle,
    MessageSquare,
    Send,
    ShieldCheck,
    Sparkles
} from "lucide-react";
import React, { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Investment",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successTicket, setSuccessTicket] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (pe) {
        data = {};
      }

      if (data.success) {
        setSuccessTicket(data.data);
        setFormData({ name: "", email: "", subject: "Investment", message: "" });
      } else {
        setErrorMsg(data.error || "Failed to submit message.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to support server. Please reach out via Telegram.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding" style={{ background: "#060606", position: "relative" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <MessageSquare size={13} />
            CONCIERGE DESK
          </div>
          <h2 className="section-title">
            Get In <span className="gold-gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle">
            Our 24/7 dedicated support team is available across decentralized channels and direct inquiry ticketing.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: "40px",
            alignItems: "start"
          }}
          className="contact-layout-grid"
        >
          {/* Left Contact Channels */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="regal-card" style={{ background: "#0A0A0A", padding: "22px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(212, 175, 55, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Mail size={20} color="var(--gold-primary)" />
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Official Email
                </span>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#F5F5F5", marginTop: "2px" }}>
                  support@regal.com
                </div>
              </div>
            </div>

            <div className="regal-card" style={{ background: "#0A0A0A", padding: "22px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(212, 175, 55, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MessageCircle size={20} color="var(--gold-primary)" />
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Telegram Concierge
                </span>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--gold-bright)", marginTop: "2px" }}>
                  @regal_support
                </div>
              </div>
            </div>

            <div className="regal-card" style={{ background: "#0A0A0A", padding: "22px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(212, 175, 55, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <HelpCircle size={20} color="var(--gold-primary)" />
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Support Desk Availability
                </span>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#22C55E", marginTop: "2px" }}>
                  Active 24/7 Global Response
                </div>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="regal-card" style={{ background: "#0D0D0D", border: "1px solid var(--border-highlight)", padding: "34px" }}>
            <h3 style={{ fontSize: "22px", color: "#F5F5F5", marginBottom: "6px" }}>
              Send Us a Message
            </h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginBottom: "24px" }}>
              Submit your inquiry and receive a verified ticket code for instant tracking.
            </p>

            {successTicket ? (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.15)", border: "2px solid #22C55E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <CheckCircle2 size={32} color="#22C55E" />
                </div>
                <h4 style={{ fontSize: "20px", color: "#FFF", marginBottom: "8px" }}>Ticket Logged Successfully!</h4>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px" }}>
                  Your reference ID is <strong style={{ color: "var(--gold-bright)", fontFamily: "monospace" }}>{successTicket.ticketId}</strong>. A support specialist will follow up at {successTicket.email}.
                </p>
                <button
                  onClick={() => setSuccessTicket(null)}
                  className="btn btn-outline-gold btn-sm"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="regal-label">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="regal-input"
                    required
                  />
                </div>

                <div>
                  <label className="regal-label">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="regal-input"
                    required
                  />
                </div>

                <div>
                  <label className="regal-label">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="regal-input"
                    style={{ background: "#0A0A0A", cursor: "pointer" }}
                  >
                    <option value="Investment">Investment Packages & Deposits</option>
                    <option value="Wallet">Wallet Connection / BSC Network</option>
                    <option value="ROI">Daily ROI Accruals</option>
                    <option value="Referral">Referral Commissions</option>
                    <option value="Technical Issue">Smart Contract & Technical</option>
                    <option value="General Query">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="regal-label">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry..."
                    rows={4}
                    className="regal-input"
                    style={{ resize: "vertical" }}
                    required
                  />
                </div>

                {errorMsg && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#EF4444", fontSize: "13px" }}>
                    <AlertCircle size={15} /> {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-gold"
                  style={{ marginTop: "8px", padding: "14px 0" }}
                >
                  <Send size={15} />
                  {submitting ? "Submitting Inquiry..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
