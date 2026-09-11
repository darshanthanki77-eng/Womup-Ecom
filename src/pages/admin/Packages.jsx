import { AlertCircle, CheckCircle2, Crown, Edit3, Plus, ShieldCheck, X } from "lucide-react";
import React, { useState } from "react";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [editingPkg, setEditingPkg] = useState(null);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    api.packages.getAll().then((res) => {
      if (res.success && res.data) setPackages(res.data);
      setLoading(false);
    });
  }, []);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const res = await api.packages.update(editingPkg.packageId || editingPkg.id, editingPkg);
    if (res.success) {
      setPackages(packages.map((p) => ((p.packageId || p.id) === (editingPkg.packageId || editingPkg.id) ? editingPkg : p)));
      setNotification(`Package "${editingPkg.name}" configuration updated & logged in Audit Ledger!`);
    } else {
      setNotification(res.error || "Update failed.");
    }
    setEditingPkg(null);
    setTimeout(() => setNotification(""), 4000);
  };

  const toggleStatus = (id) => {
    setPackages(packages.map((p) => ((p.packageId || p.id) === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p)));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
          PRODUCT CONFIGURATION
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Investment <span className="gold-gradient-text">Package Management</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Adjust capital boundaries, commission tiers, and ROI phases without code modification. All changes are logged.
        </p>
      </div>

      {notification && (
        <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22C55E", borderRadius: "10px", padding: "14px", color: "#22C55E", display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px" }}>
          <CheckCircle2 size={16} /> {notification}
        </div>
      )}

      {/* Package Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "24px" }}>
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="regal-card"
            style={{
              background: "#0E0E0E",
              padding: "26px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Crown size={20} color="var(--gold-bright)" />
                  <h3 style={{ fontSize: "20px", color: "#FFF" }}>{pkg.name}</h3>
                </div>
                <StatusPill status={pkg.status} />
              </div>

              <div style={{ margin: "16px 0", borderBottom: "1px solid #1C1C1C", paddingBottom: "16px" }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Allowed Capital Range</div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 800, color: "var(--gold-bright)", marginTop: "2px" }}>
                  ${pkg.minAmount.toLocaleString()}{" "}
                  <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                    to {pkg.maxAmount >= 100000 ? "Unlimited" : `$${pkg.maxAmount.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Referral Commission:</span>
                  <strong style={{ color: "var(--gold-bright)" }}>{pkg.referralPercent}%</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Buffer Period:</span>
                  <strong style={{ color: "#FFF" }}>{pkg.maturityDays} Days (0% ROI)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Month 3–5 Daily Rate:</span>
                  <strong style={{ color: "#22C55E" }}>{pkg.phase1Rate}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Month 6–8 Accelerated:</span>
                  <strong style={{ color: "#22C55E" }}>{pkg.phase2Rate}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Cycle Duration:</span>
                  <strong style={{ color: "#FFF" }}>{pkg.cycleDurationMonths} Months</strong>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setEditingPkg({ ...pkg })}
                className="btn btn-outline-gold btn-sm"
                style={{ flex: 1 }}
              >
                <Edit3 size={14} /> Configure
              </button>
              <button
                onClick={() => toggleStatus(pkg.id)}
                className="btn btn-outline btn-sm"
              >
                {pkg.status === "Active" ? "Pause" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Package Modal */}
      {editingPkg && (
        <div className="modal-overlay" onClick={() => setEditingPkg(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "18px" }}>Edit {editingPkg.name} Parameters</h3>
              <button onClick={() => setEditingPkg(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label className="regal-label">Minimum Investment (USDT)</label>
                  <input
                    type="number"
                    value={editingPkg.minAmount}
                    onChange={(e) => setEditingPkg({ ...editingPkg, minAmount: parseFloat(e.target.value) || 0 })}
                    className="regal-input"
                    required
                  />
                </div>

                <div>
                  <label className="regal-label">Maximum Investment (USDT)</label>
                  <input
                    type="number"
                    value={editingPkg.maxAmount}
                    onChange={(e) => setEditingPkg({ ...editingPkg, maxAmount: parseFloat(e.target.value) || 0 })}
                    className="regal-input"
                    required
                  />
                </div>

                <div>
                  <label className="regal-label">Referral Commission (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingPkg.referralPercent}
                    onChange={(e) => setEditingPkg({ ...editingPkg, referralPercent: parseFloat(e.target.value) || 0 })}
                    className="regal-input"
                    required
                  />
                </div>

                <div>
                  <label className="regal-label">Month 3–5 Daily Rate</label>
                  <input
                    type="text"
                    value={editingPkg.phase1Rate}
                    onChange={(e) => setEditingPkg({ ...editingPkg, phase1Rate: e.target.value })}
                    className="regal-input"
                    required
                  />
                </div>

                <div>
                  <label className="regal-label">Month 6–8 Accelerated Rate</label>
                  <input
                    type="text"
                    value={editingPkg.phase2Rate}
                    onChange={(e) => setEditingPkg({ ...editingPkg, phase2Rate: e.target.value })}
                    className="regal-input"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setEditingPkg(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-gold btn-sm">
                  Commit & Log Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
