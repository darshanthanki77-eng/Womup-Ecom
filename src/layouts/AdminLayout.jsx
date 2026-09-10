import {
    Activity,
    AlertCircle,
    ArrowUpRight,
    BarChart3,
    Bell,
    CheckCircle2,
    Database,
    FileCode,
    FileSpreadsheet,
    HelpCircle,
    Home,
    Layers,
    Lock,
    Menu,
    MessageSquare,
    Network,
    PlusCircle,
    Radio,
    Search,
    Settings,
    Shield,
    ShieldAlert,
    ShieldCheck,
    TrendingUp,
    Users,
    X
} from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { coinHero } from "../assets";
import PortalSwitcher from "../components/common/PortalSwitcher";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminNav = [
    {
      section: "OVERVIEW",
      items: [
        { path: "/admin/dashboard", label: "Dashboard", icon: <Home size={18} /> }
      ]
    },
    {
      section: "MANAGEMENT",
      items: [
        { path: "/admin/users", label: "Users", icon: <Users size={18} /> },
        { path: "/admin/investments", label: "Investments", icon: <Layers size={18} /> },
        { path: "/admin/packages", label: "Packages", icon: <PlusCircle size={18} /> },
        { path: "/admin/roi", label: "ROI Engine", icon: <TrendingUp size={18} /> },
        { path: "/admin/referrals", label: "Referrals", icon: <Network size={18} /> },
        { path: "/admin/withdrawals", label: "Withdrawals", icon: <ArrowUpRight size={18} /> },
        { path: "/admin/transactions", label: "Transactions", icon: <Database size={18} /> }
      ]
    },
    {
      section: "BLOCKCHAIN",
      items: [
        { path: "/admin/blockchain", label: "Blockchain & Node", icon: <Radio size={18} /> }
      ]
    },
    {
      section: "COMMUNICATION",
      items: [
        { path: "/admin/notifications", label: "Notifications", icon: <Bell size={18} /> },
        { path: "/admin/cms", label: "CMS & Content", icon: <FileCode size={18} /> }
      ]
    },
    {
      section: "ANALYTICS & SECURITY",
      items: [
        { path: "/admin/reports", label: "Reports & CSV", icon: <FileSpreadsheet size={18} /> },
        { path: "/admin/audit-logs", label: "Audit Logs", icon: <Activity size={18} /> },
        { path: "/admin/settings", label: "Admin Settings", icon: <Settings size={18} /> }
      ]
    }
  ];

  const currentPath = location.pathname;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-deep-black)" }}>
      <PortalSwitcher />

      {/* Desktop Left Sidebar */}
      <aside
        style={{
          width: "270px",
          background: "#080808",
          borderRight: "1px solid var(--border-standard)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 100
        }}
        className="admin-sidebar"
      >
        {/* Brand Header */}
        <div
          onClick={() => navigate("/admin/dashboard")}
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid var(--border-standard)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer"
          }}
        >
          <img src={coinHero} alt="REGAL" style={{ width: "34px", height: "34px" }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "17px", fontWeight: 800, color: "#FFF" }}>
                REGAL
              </span>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "#EF4444", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", padding: "1px 6px", borderRadius: "3px" }}>
                ADMIN
              </span>
            </div>
            <div style={{ fontSize: "10px", color: "var(--gold-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Super Admin Console
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {adminNav.map((group) => (
            <div key={group.section}>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.14em", padding: "0 10px 6px" }}>
                {group.section}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {group.items.map((item) => {
                  const isActive = currentPath === item.path || (item.path === "/admin/users" && currentPath.startsWith("/admin/users/"));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`sidebar-link ${isActive ? "active" : ""}`}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ color: isActive ? "var(--gold-bright)" : "var(--gold-primary)", display: "flex", alignItems: "center", transition: "transform 0.2s ease" }}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span style={{ fontSize: "10px", fontWeight: 800, background: "var(--gold-gradient)", color: "#050505", padding: "1px 6px", borderRadius: "999px" }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Status pill */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border-standard)", background: "#050505", fontSize: "11px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-secondary)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }} />
              RPC Connected
            </span>
            <span style={{ color: "var(--gold-bright)", fontWeight: 700 }}>Block #38942104</span>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <header
          className="admin-topbar"
          style={{
            height: "70px",
            background: "rgba(8, 8, 8, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border-standard)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            position: "sticky",
            top: 0,
            zIndex: 90
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="admin-mobile-toggle"
              style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
            >
              <Menu size={22} />
            </button>

            <div>
              <div style={{ fontSize: "11px", color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800 }}>
                ADMIN CONSOLE
              </div>
              <h2 style={{ fontSize: "18px", color: "#FFF", fontWeight: 700 }}>
                {adminNav.flatMap(g => g.items).find(i => i.path === currentPath)?.label || "Admin Console"}
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--gold-bright)",
                background: "rgba(212, 175, 55, 0.12)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                padding: "4px 10px",
                borderRadius: "999px"
              }}
            >
              SUPER ADMIN
            </span>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: "11px", fontWeight: 800 }}>
              SA
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-main-content" style={{ flex: 1, padding: "28px", maxWidth: "1380px", width: "100%", margin: "0 auto" }}>
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "280px", height: "100%", background: "#080808", padding: "20px", display: "flex", flexDirection: "column" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "#EF4444" }}>REGAL ADMIN</span>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "#FFF" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
              {adminNav.flatMap(g => g.items).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  style={{ color: "#FFF", textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .admin-sidebar { display: none !important; }
          .admin-mobile-toggle { display: block !important; }
          .admin-topbar { padding: 0 14px !important; }
          .admin-main-content { padding: 16px 12px 40px !important; }
        }
        @media (min-width: 961px) {
          .admin-mobile-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
}
