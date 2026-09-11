import { CheckCircle2, Globe, Loader2, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

const initialCmsContent = {
  hero: {
    headline: "ENTER THE REGAL ECOSYSTEM",
    subheadline: "Powered by RGL",
    description: "A luxury digital asset and Web3 investment platform engineered on BNB Smart Chain. Audited smart contracts, structured 8-month cycles, transparent daily ROI, and tiered referral rewards."
  },
  risk: {
    title: "Risk Disclosure & Protocol Terms",
    text: "Participation in digital asset investment packages on the BNB Smart Chain carries inherent market, technical, and regulatory risks. While Regal smart contracts are formally audited, capital allocation involves financial risk and users should review complete documentation."
  },
  faq: {
    generalQuestion: "What is Regal (RGL)?",
    generalAnswer: "Regal is a luxury digital asset and Web3 investment platform deployed on the BNB Smart Chain (BEP-20) with transparent daily yield and 8-month cycles."
  }
};

export default function AdminCMS() {
  const [activeSection, setActiveSection] = useState("hero");
  const [content, setContent] = useState(initialCmsContent);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCms() {
      try {
        const res = await api.cms.getAll();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const loaded = { ...initialCmsContent };
          res.data.forEach((item) => {
            if (item.slug && item.content) {
              loaded[item.slug] = item.content;
            }
          });
          setContent(loaded);
        }
      } catch (err) {
        console.warn("Could not load CMS content from server:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCms();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.cms.save({
        slug: activeSection,
        title: activeSection.toUpperCase(),
        type: "cms-section",
        content: content[activeSection]
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save CMS section:", err);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: "hero", label: "Hero & Headline" },
    { id: "risk", label: "Legal & Risk Disclosures" },
    { id: "faq", label: "FAQ Content" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
          CONTENT MANAGEMENT SYSTEM
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Public Website <span className="gold-gradient-text">CMS & Legal Copy</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Update headlines, FAQs, risk disclaimers, and legal policies on the public landing page without modifying source code.
        </p>
      </div>

      {saved && (
        <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22C55E", borderRadius: "10px", padding: "14px", color: "#22C55E", display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px" }}>
          <CheckCircle2 size={16} /> CMS Content synchronized with public landing page!
        </div>
      )}

      {/* Sections Selector Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-standard)", paddingBottom: "12px", overflowX: "auto" }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`btn btn-sm ${activeSection === s.id ? "btn-gold" : "btn-outline"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* CMS Edit Panel */}
      <div className="regal-card" style={{ padding: "28px", background: "#0E0E0E" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "780px" }}>
          {activeSection === "hero" && (
            <>
              <div>
                <label className="regal-label">Main Headline</label>
                <input
                  type="text"
                  value={content.hero.headline}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })}
                  className="regal-input"
                  required
                />
              </div>

              <div>
                <label className="regal-label">Sub-Headline</label>
                <input
                  type="text"
                  value={content.hero.subheadline}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, subheadline: e.target.value } })}
                  className="regal-input"
                  required
                />
              </div>

              <div>
                <label className="regal-label">Hero Paragraph Description</label>
                <textarea
                  value={content.hero.description}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })}
                  rows={4}
                  className="regal-input"
                  required
                />
              </div>
            </>
          )}

          {activeSection === "risk" && (
            <>
              <div>
                <label className="regal-label">Risk Disclosure Title</label>
                <input
                  type="text"
                  value={content.risk.title}
                  onChange={(e) => setContent({ ...content, risk: { ...content.risk, title: e.target.value } })}
                  className="regal-input"
                  required
                />
              </div>

              <div>
                <label className="regal-label">Legal Risk Disclosure Content</label>
                <textarea
                  value={content.risk.text}
                  onChange={(e) => setContent({ ...content, risk: { ...content.risk, text: e.target.value } })}
                  rows={6}
                  className="regal-input"
                  required
                />
              </div>
            </>
          )}

          {activeSection === "faq" && (
            <>
              <div>
                <label className="regal-label">Featured Question</label>
                <input
                  type="text"
                  value={content.faq?.generalQuestion || ""}
                  onChange={(e) => setContent({ ...content, faq: { ...content.faq, generalQuestion: e.target.value } })}
                  className="regal-input"
                  required
                />
              </div>

              <div>
                <label className="regal-label">Featured Answer</label>
                <textarea
                  value={content.faq?.generalAnswer || ""}
                  onChange={(e) => setContent({ ...content, faq: { ...content.faq, generalAnswer: e.target.value } })}
                  rows={4}
                  className="regal-input"
                  required
                />
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button type="submit" disabled={saving} className="btn btn-gold btn-sm">
              {saving ? <Loader2 size={15} className="spin" /> : <Save size={15} />} Save & Publish Changes
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
              <Globe size={15} /> View Public Website
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
