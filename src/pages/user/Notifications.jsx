import { Bell, Check, CheckCheck, Clock, Coins, Layers, Radio, Shield, Users } from "lucide-react";
import React, { useState } from "react";
import ScrollableTabs from "../../components/common/ScrollableTabs";
import { initialNotifications } from "../../data/portalData";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const filtered = filter === "All"
    ? notifications
    : filter === "Unread"
    ? notifications.filter((n) => !n.read)
    : notifications.filter((n) => n.type.toLowerCase().includes(filter.toLowerCase()));

  const getIcon = (type) => {
    switch (type) {
      case "Investment Confirmed":
      case "Investment Pending":
        return <Layers size={18} color="var(--gold-primary)" />;
      case "ROI Available":
      case "ROI Paid":
        return <Coins size={18} color="#22C55E" />;
      case "Referral Commission":
        return <Users size={18} color="var(--gold-bright)" />;
      case "60-Day Period Completed":
      case "Principal Returned":
        return <Shield size={18} color="var(--gold-bright)" />;
      default:
        return <Radio size={18} color="#3B82F6" />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "12px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
            COMMUNICATION DISPATCH
          </span>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#F5F5F5", marginTop: "2px" }}>
            Account <span className="gold-gradient-text">Notifications</span>
          </h1>
        </div>

        <button onClick={markAllRead} className="btn btn-outline-gold btn-sm">
          <CheckCheck size={14} /> Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <ScrollableTabs
        tabs={["All", "Unread", "Investment", "ROI", "Referral", "System"]}
        activeTab={filter}
        onTabChange={(t) => setFilter(t)}
      />

      {/* Notifications List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            className="regal-card card-spotlight"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
            }}
            style={{
              padding: "20px 24px",
              background: item.read ? "rgba(10, 10, 10, 0.75)" : "rgba(22, 18, 10, 0.85)",
              border: `1px solid ${item.read ? "rgba(255, 255, 255, 0.08)" : "rgba(212, 175, 55, 0.35)"}`,
              borderLeft: item.read ? "1px solid rgba(255, 255, 255, 0.08)" : "4px solid var(--gold-bright)",
              boxShadow: item.read ? "none" : "0 0 20px rgba(212, 175, 55, 0.12)",
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              transition: "all 0.25s ease"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "rgba(212, 175, 55, 0.12)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              {getIcon(item.type)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <h4 style={{ fontSize: "15px", color: item.read ? "#E5E5E5" : "#FFF", fontWeight: item.read ? 600 : 700 }}>
                  {item.title}
                </h4>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.time}</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6", margin: "0 0 8px 0" }}>
                {item.message}
              </p>

              {/* Quick Actions */}
              <div style={{ display: "flex", gap: "10px" }}>
                {!item.read && (
                  <button
                    onClick={() => setNotifications(notifications.map((n) => n.id === item.id ? { ...n, read: true } : n))}
                    style={{ background: "none", border: "none", color: "var(--gold-bright)", fontSize: "11.5px", fontWeight: 700, cursor: "pointer", padding: 0 }}
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => setNotifications(notifications.filter((n) => n.id !== item.id))}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "11.5px", cursor: "pointer", padding: 0 }}
                >
                  Dismiss
                </button>
              </div>
            </div>

            {!item.read && (
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--gold-bright)", boxShadow: "0 0 8px var(--gold-bright)", marginTop: "6px", flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
