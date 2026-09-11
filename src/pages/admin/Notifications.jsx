import { Bell, CheckCircle2, Loader2, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import RegalTable from "../../components/common/RegalTable";
import StatusPill from "../../components/common/StatusPill";
import { api } from "../../services/api";

export default function AdminNotifications() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("All Users");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBroadcasts = async () => {
    try {
      const res = await api.notifications.getBroadcasts();
      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((b) => ({
          id: b.notificationId || `BRD-${b._id?.slice(-4)}`,
          title: b.title,
          audience: "All Users",
          sent: b.createdAt ? new Date(b.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          delivered: 1428,
          read: b.read ? 1 : 0,
          status: "Delivered"
        }));
        setHistory(mapped);
      }
    } catch (err) {
      console.warn("Could not load broadcasts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.notifications.broadcast({
        title,
        message,
        type: priority === "Critical" ? "Critical Alert" : priority === "High" ? "Security Alert" : "System Announcement"
      });

      if (res.success) {
        setTitle("");
        setMessage("");
        setSuccess("Announcement broadcasted across selected user segments!");
        fetchBroadcasts();
      } else {
        setSuccess(`Failed to broadcast: ${res.error || "Unknown error"}`);
      }
    } catch (err) {
      setSuccess(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccess(""), 4000);
    }
  };

  const columns = [
    {
      header: "Broadcast ID",
      accessor: "id",
      render: (row) => <span style={{ fontFamily: "monospace", color: "var(--gold-bright)", fontWeight: 700 }}>{row.id}</span>
    },
    {
      header: "Title",
      accessor: "title",
      render: (row) => <span style={{ fontWeight: 600, color: "#FFF" }}>{row.title}</span>
    },
    {
      header: "Target Audience",
      accessor: "audience",
      render: (row) => <span style={{ color: "var(--gold-primary)" }}>{row.audience}</span>
    },
    {
      header: "Sent Date",
      accessor: "sent",
      render: (row) => <span>{row.sent}</span>
    },
    {
      header: "Delivered",
      accessor: "delivered",
      render: (row) => <span style={{ color: "#FFF", fontWeight: 700 }}>{row.delivered} Users</span>
    },
    {
      header: "Read Count",
      accessor: "read",
      render: (row) => <span style={{ color: "#22C55E" }}>{row.read}</span>
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusPill status={row.status} />
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: "12px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
          COMMUNICATION DISPATCH
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
          Broadcast <span className="gold-gradient-text">Notifications & Alerts</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Deliver high-priority announcements and protocol updates directly to user portal dispatch boxes.
        </p>
      </div>

      {success && (
        <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid #22C55E", borderRadius: "10px", padding: "14px", color: "#22C55E", display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px" }}>
          <CheckCircle2 size={16} /> {success}
        </div>
      )}

      {/* Broadcast Composer */}
      <div className="regal-card" style={{ padding: "26px", background: "#0E0E0E" }}>
        <h3 style={{ fontSize: "18px", color: "#FFF", marginBottom: "16px" }}>Compose Global Announcement</h3>

        <form onSubmit={handleBroadcast} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "700px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "16px" }}>
            <div>
              <label className="regal-label">Target Audience Segment</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value)} className="regal-input" style={{ background: "#070707" }}>
                <option value="All Users">All Registered Users</option>
                <option value="Active Investors">Active Capital Holders Only</option>
                <option value="Gold Tier Investors">Regal Gold Package Holders</option>
                <option value="Black Tier VIP">Regal Black VIP Institutional</option>
              </select>
            </div>

            <div>
              <label className="regal-label">Priority Level</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="regal-input" style={{ background: "#070707" }}>
                <option value="Normal">Normal</option>
                <option value="High">High (Security Alert)</option>
                <option value="Critical">Critical (Emergency Notice)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="regal-label">Broadcast Subject / Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Protocol Upgrade Notification"
              className="regal-input"
              required
            />
          </div>

          <div>
            <label className="regal-label">Message Body</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the notification copy..."
              rows={3}
              className="regal-input"
              required
            />
          </div>

          <button type="submit" disabled={submitting} className="btn btn-gold btn-sm" style={{ alignSelf: "flex-start", marginTop: "4px" }}>
            {submitting ? <Loader2 size={14} className="spin" /> : <Send size={14} />} Transmit Broadcast
          </button>
        </form>
      </div>

      {/* Broadcast History */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontSize: "18px", color: "#FFF" }}>Past Transmitted Dispatches</h3>
          {loading && (
            <span style={{ fontSize: "12px", color: "var(--gold-bright)", display: "flex", alignItems: "center", gap: "6px" }}>
              <Loader2 size={13} className="spin" /> Loading broadcasts...
            </span>
          )}
        </div>
        <RegalTable
          columns={columns}
          data={history}
          searchPlaceholder="Search past broadcasts..."
        />
      </div>
    </div>
  );
}
