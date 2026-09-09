import { BookOpen, ChevronRight, Copy, ExternalLink, FileText, Search, ShieldCheck } from "lucide-react";
import React, { useState } from "react";

export default function DocsSection({ docsList }) {
  const [selectedSlug, setSelectedSlug] = useState("introduction");
  const [docSearch, setDocSearch] = useState("");

  const currentDoc = (docsList || []).find((d) => d.slug === selectedSlug) || (docsList && docsList[0]);

  const filteredDocs = (docsList || []).filter((d) => {
    if (!docSearch) return true;
    return d.title.toLowerCase().includes(docSearch.toLowerCase()) || d.content.toLowerCase().includes(docSearch.toLowerCase());
  });

  return (
    <section id="docs" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <BookOpen size={13} />
            TECHNICAL REPOSITORY
          </div>
          <h2 className="section-title">
            Protocol <span className="gold-gradient-text">Documentation</span>
          </h2>
          <p className="section-subtitle">
            Comprehensive specifications, smart contract architecture, investment mechanics, and risk disclosures.
          </p>
        </div>

        {/* Dual-Pane Documentation Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: "30px",
            alignItems: "start"
          }}
          className="docs-layout-grid"
        >
          {/* Left Navigation Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Search Docs */}
            <div className="regal-card" style={{ padding: "18px", background: "#0A0A0A" }}>
              <div style={{ position: "relative" }}>
                <Search size={15} color="var(--gold-primary)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder="Search docs..."
                  className="regal-input"
                  style={{ paddingLeft: "38px", fontSize: "13px", padding: "10px 12px 10px 38px" }}
                />
              </div>

              {/* Document Nav Links */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "16px" }}>
                {filteredDocs.map((doc) => {
                  const isSelected = doc.slug === currentDoc?.slug;
                  return (
                    <button
                      key={doc.slug}
                      onClick={() => setSelectedSlug(doc.slug)}
                      style={{
                        textAlign: "left",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        background: isSelected ? "rgba(212, 175, 55, 0.12)" : "transparent",
                        border: isSelected ? "1px solid var(--gold-primary)" : "1px solid transparent",
                        color: isSelected ? "var(--gold-bright)" : "var(--text-secondary)",
                        fontSize: "13px",
                        fontWeight: isSelected ? 700 : 500,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {doc.title}
                      </span>
                      <ChevronRight size={14} style={{ opacity: isSelected ? 1 : 0.4 }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="regal-card" style={{ padding: "20px", background: "#0A0A0A" }}>
              <h4 style={{ fontSize: "13px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                Quick Links
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px" }}>
                <a
                  href="https://bscscan.com/token/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <ExternalLink size={12} color="var(--gold-primary)" /> BscScan Token Contract
                </a>
                <a
                  href="#faq"
                  style={{ color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <FileText size={12} color="var(--gold-primary)" /> Platform FAQs
                </a>
                <a
                  href="#contact"
                  style={{ color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <ShieldCheck size={12} color="var(--gold-primary)" /> Concierge Assistance
                </a>
              </div>
            </div>

          </div>

          {/* Right Main Content Pane */}
          <div
            className="regal-card"
            style={{
              background: "#0D0D0D",
              border: "1px solid var(--border-highlight)",
              padding: "40px",
              minHeight: "520px"
            }}
          >
            {currentDoc ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", color: "var(--gold-primary)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                    {currentDoc.category}
                  </span>
                </div>
                <h3 style={{ fontSize: "28px", color: "#F5F5F5", marginBottom: "24px", borderBottom: "1px solid var(--border-standard)", paddingBottom: "16px" }}>
                  {currentDoc.title}
                </h3>

                <div
                  style={{
                    fontSize: "14.5px",
                    color: "var(--text-secondary)",
                    lineHeight: "1.8",
                    whiteSpace: "pre-line"
                  }}
                >
                  {currentDoc.content}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                Select a document from the sidebar to view technical specifications.
              </div>
            )}
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .docs-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
