import { ChevronDown, ChevronUp, HelpCircle, MessageSquare, Search } from "lucide-react";
import React, { useState } from "react";

export default function FaqSection({ faqList, onNavigateToContact }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openId, setOpenId] = useState(1); // First question opened by default

  const categories = ["All", "General", "Token", "Investment", "Referral", "Security", "Withdrawals"];

  const filteredFaqs = (faqList || []).filter((item) => {
    const matchesCat = selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="section-padding" style={{ background: "#070707", position: "relative" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <HelpCircle size={13} />
            KNOWLEDGE BASE
          </div>
          <h2 className="section-title">
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h2>
          <p className="section-subtitle">
            Find immediate answers regarding RGL token standards, investment tiers, daily ROI accruals, and Web3 security.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ position: "relative", marginBottom: "18px" }}>
            <Search size={18} color="var(--gold-primary)" style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your question (e.g. ROI, principal, referral, wallet)..."
              className="regal-input"
              style={{ paddingLeft: "48px", fontSize: "15px" }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? "btn-gold" : "btn-outline"}`}
                style={{ padding: "6px 14px", fontSize: "12px" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="regal-card"
                  style={{
                    padding: 0,
                    background: isOpen ? "#111111" : "#0A0A0A",
                    borderColor: isOpen ? "var(--gold-primary)" : "var(--border-standard)",
                    transition: "all 0.25s ease"
                  }}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      gap: "16px"
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 700, color: isOpen ? "var(--gold-bright)" : "#F5F5F5" }}>
                      {faq.question}
                    </span>
                    <span
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: isOpen ? "rgba(212, 175, 55, 0.15)" : "#141414",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      {isOpen ? <ChevronUp size={16} color="var(--gold-bright)" /> : <ChevronDown size={16} color="#A0A0A0}" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: "0 24px 22px",
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        lineHeight: "1.7",
                        borderTop: "1px solid #1A1A1A",
                        paddingTop: "16px"
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="regal-card" style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "var(--text-muted)", marginBottom: "14px" }}>
                No matching questions found for "{searchQuery}".
              </p>
              <button onClick={onNavigateToContact} className="btn btn-outline-gold btn-sm">
                Ask Our Support Team
              </button>
            </div>
          )}
        </div>

        {/* Bottom CTA Card */}
        <div
          className="regal-card"
          style={{
            marginTop: "50px",
            background: "linear-gradient(135deg, #101010 0%, #0C0C0C 100%)",
            border: "1px solid var(--border-highlight)",
            padding: "30px",
            textAlign: "center"
          }}
        >
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(212, 175, 55, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <MessageSquare size={20} color="var(--gold-bright)" />
          </div>
          <h3 style={{ fontSize: "20px", color: "#FFF", marginBottom: "8px" }}>
            Still have questions?
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px", maxWidth: "480px", margin: "0 auto 20px" }}>
            Our 24/7 Web3 concierge team is available to assist you with wallet setup, transaction verification, or package selection.
          </p>
          <button onClick={onNavigateToContact} className="btn btn-gold btn-sm">
            Contact Support Concierge
          </button>
        </div>

      </div>
    </section>
  );
}
