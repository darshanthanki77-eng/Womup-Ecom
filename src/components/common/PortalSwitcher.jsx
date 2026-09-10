import { Globe, ShieldCheck, UserCheck } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PortalSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isPublic = path === "/";
  const isAdmin = path.startsWith("/admin");
  const isUser = !isPublic && !isAdmin;

  return (
    <>
      <div
        className="portal-switcher-bar"
        style={{
          position: "fixed",
          zIndex: 9999,
          background: "rgba(10, 10, 10, 0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          borderRadius: "999px",
          padding: "4px 6px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.15)"
        }}
      >
        <button
          onClick={() => navigate("/")}
          className="portal-switch-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 12px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 700,
            background: isPublic ? "var(--gold-gradient)" : "transparent",
            color: isPublic ? "#050505" : "var(--text-secondary)",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap"
          }}
        >
          <Globe size={12} /> <span className="switch-label-full">Landing</span><span className="switch-label-short">Home</span>
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="portal-switch-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 12px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 700,
            background: isUser ? "var(--gold-gradient)" : "transparent",
            color: isUser ? "#050505" : "var(--text-secondary)",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap"
          }}
        >
          <UserCheck size={12} /> <span className="switch-label-full">User Portal</span><span className="switch-label-short">User</span>
        </button>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="portal-switch-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 12px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 700,
            background: isAdmin ? "var(--gold-gradient)" : "transparent",
            color: isAdmin ? "#050505" : "var(--text-secondary)",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap"
          }}
        >
          <ShieldCheck size={12} /> <span className="switch-label-full">Admin Portal</span><span className="switch-label-short">Admin</span>
        </button>
      </div>

      <style>{`
        .portal-switcher-bar {
          top: 8px;
          right: 16px;
        }
        .switch-label-short {
          display: none;
        }
        @media (max-width: 768px) {
          .portal-switcher-bar {
            top: auto !important;
            bottom: 12px !important;
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%) !important;
            padding: 3px 5px !important;
            box-shadow: 0 10px 35px rgba(0,0,0,0.9), 0 0 15px rgba(212,175,55,0.2) !important;
          }
          .portal-switch-btn {
            padding: 5px 9px !important;
            font-size: 10px !important;
          }
          .switch-label-full {
            display: none !important;
          }
          .switch-label-short {
            display: inline !important;
          }
        }
      `}</style>
    </>
  );
}
