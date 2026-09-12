import {
    ArrowDownRight,
    ArrowUpRight,
    Bell,
    CheckCircle2,
    Clock,
    Coins,
    Crown,
    ExternalLink,
    HelpCircle,
    History,
    Home,
    Layers,
    Lock,
    LogOut,
    Menu,
    PlusCircle,
    Send,
    Shield,
    TrendingUp,
    User,
    Users,
    Wallet,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { coinHero } from "../assets";
import { api } from "../services/api";
import { useWallet } from "../context/WalletContext";

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const wallet = useWallet();

  // Strict Authentication Guard: Only authenticated users can access the dashboard/portal
  const token = localStorage.getItem("regal_token");
  const savedUserStr = localStorage.getItem("regal_user");

  if (!token || !savedUserStr) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      if (savedUserStr) return JSON.parse(savedUserStr);
    } catch (e) {}
    return null;
  });
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [liveNotifs, setLiveNotifs] = useState([]);

  // Fetch live user and notifications from API on mount
  React.useEffect(() => {
    api.auth.getMe().then((res) => {
      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem("regal_user", JSON.stringify(res.data));
      }
    });

    api.notifications.getMy().then((res) => {
      if (res.success && res.data) {
        setLiveNotifs(res.data.slice(0, 3));
      }
    });
  }, []);

  // Sync user updates to localStorage
  const handleUpdateUser = (updated) => {
    setUser(updated);
    try {
      localStorage.setItem("regal_user", JSON.stringify(updated));
    } catch (e) {}
  };

  // Sign out user and return to landing page
  const handleSignOut = () => {
    try {
      localStorage.removeItem("regal_user");
      localStorage.removeItem("regal_token");
    } catch (e) {}
    navigate("/");
  };

  const navGroups = [
    {
      group: "MAIN",
      items: [
        { path: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
        { path: "/investment", label: "Investment", icon: <PlusCircle size={18} /> },
        { path: "/investments", label: "My Investments", icon: <Layers size={18} /> },
        { path: "/roi-history", label: "ROI History", icon: <History size={18} /> },
        { path: "/referrals", label: "Referrals", icon: <Users size={18} /> }
      ]
    },
    {
      group: "FINANCE",
      items: [
        { path: "/wallet", label: "Wallet", icon: <Wallet size={18} /> },
        { path: "/withdraw", label: "Withdraw", icon: <ArrowUpRight size={18} /> },
        { path: "/transactions", label: "Transactions", icon: <Clock size={18} /> }
      ]
    },
    {
      group: "ACCOUNT",
      items: [
        { path: "/notifications", label: "Notifications", icon: <Bell size={18} />, badge: "2" },
        { path: "/profile", label: "Profile", icon: <User size={18} /> },
        { path: "/security", label: "Security", icon: <Shield size={18} /> },
        { path: "/support", label: "Support", icon: <HelpCircle size={18} /> }
      ]
    }
  ];

  const currentPath = location.pathname;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-deep-black)" }}>
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
        className="portal-sidebar"
      >
        {/* Sidebar Brand Header */}
        <div
          onClick={() => navigate("/")}
          style={{
            padding: "24px 22px",
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
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 800, color: "#FFF", letterSpacing: "0.06em" }}>
                REGAL
              </span>
              <span style={{ fontSize: "9.5px", fontWeight: 700, color: "var(--gold-bright)", background: "rgba(212,175,55,0.15)", padding: "1px 5px", borderRadius: "3px" }}>
                RGL
              </span>
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              User Portal
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 12px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {navGroups.map((group) => (
            <div key={group.group}>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.14em", padding: "0 12px 6px" }}>
                {group.group}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {group.items.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
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

        {/* Sidebar Bottom Network & Wallet Pill */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border-standard)", background: "#050505" }}>
          {/* User Referral ID badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", background: "rgba(212, 175, 55, 0.08)", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(212, 175, 55, 0.2)" }}>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ref ID</div>
            <div style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "var(--gold-bright)" }}>
              {user.referralCode || "RGL7821"}
            </div>
          </div>

          {wallet?.isConnected && wallet?.account ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "11px", color: "var(--text-secondary)" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: wallet.isCorrectChain ? "#22C55E" : "#EF4444", boxShadow: `0 0 8px ${wallet.isCorrectChain ? "#22C55E" : "#EF4444"}` }} />
                <span>{wallet.isCorrectChain ? "BNB Smart Chain (56)" : `Wrong Chain (${wallet.chainId})`}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--gold-bright)", fontWeight: 600 }}>
                  {`${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`}
                </div>
                <button
                  onClick={() => navigate("/wallet")}
                  title="View Wallet"
                  style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "2px" }}
                >
                  <ExternalLink size={13} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "11px", color: "var(--text-secondary)" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#EAB308", boxShadow: "0 0 8px rgba(234,179,8,0.4)" }} />
                <span>Wallet Not Connected</span>
              </div>
              <button
                onClick={() => wallet.connect().catch((err) => console.warn("[UserLayout] Connect:", err?.message || err))}
                className="btn btn-outline-gold btn-xs"
                style={{ width: "100%", fontSize: "11px", padding: "5px 8px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                <Wallet size={12} /> Connect MetaMask
              </button>
            </>
          )}

          {/* Sign Out Action */}
          <button
            onClick={handleSignOut}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "7px 12px",
              background: "rgba(239, 68, 68, 0.06)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#EF4444",
              borderRadius: "6px",
              fontSize: "11.5px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area with Topbar */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Sticky Topbar */}
        <header
          className="user-topbar"
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
          {/* Mobile hamburger + Page Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="portal-mobile-toggle"
              style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
            >
              <Menu size={22} />
            </button>

            <div>
              <div style={{ fontSize: "11px", color: "var(--gold-primary)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
                USER PORTAL
              </div>
              <h2 style={{ fontSize: "18px", color: "#FFF", fontWeight: 700 }}>
                {navGroups.flatMap(g => g.items).find(i => i.path === currentPath)?.label || "Portal"}
              </h2>
            </div>
          </div>

          {/* Right Topbar Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Quick Invest CTA */}
            <button onClick={() => navigate("/investment")} className="btn btn-gold btn-sm" style={{ display: "none" }} id="topbar-invest-btn">
              <PlusCircle size={14} /> Invest
            </button>

            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setNotifDropdown(!notifDropdown)}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  background: "#101010",
                  border: "1px solid var(--border-standard)",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
              >
                <Bell size={16} color="var(--gold-bright)" />
                <span style={{ position: "absolute", top: "7px", right: "7px", width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" }} />
              </button>

              {notifDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "300px",
                    background: "#0D0D0D",
                    border: "1px solid var(--border-highlight)",
                    borderRadius: "14px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
                    padding: "16px",
                    zIndex: 1000
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #1A1A1A", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#FFF" }}>NOTIFICATIONS</span>
                    <Link to="/notifications" onClick={() => setNotifDropdown(false)} style={{ fontSize: "11px", color: "var(--gold-primary)", textDecoration: "none" }}>
                      View All
                    </Link>
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                    {liveNotifs.length > 0 ? (
                      liveNotifs.map((n) => (
                        <p key={n.notificationId || n._id} style={{ marginBottom: "8px" }}>
                          🟢 <strong>{n.title}:</strong> {n.message}
                        </p>
                      ))
                    ) : (
                      <p>No new notifications.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill with Referral Code */}
            <div
              onClick={() => navigate("/profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#101010",
                border: "1px solid var(--border-standard)",
                padding: "5px 12px 5px 5px",
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--gold-gradient)", display: "flex", alignItems: "center", justifyContent: "center", color: "#050505", fontWeight: 800, fontSize: "11px" }}>
                {(user?.name || "U").slice(0, 2).toUpperCase()}
              </div>
              <div className="user-profile-details">
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#F5F5F5", lineHeight: "1.2" }}>
                  {(user?.name || "User").split(" ")[0]}
                </div>
                <div style={{ fontSize: "9.5px", fontFamily: "monospace", color: "var(--gold-bright)", lineHeight: "1" }}>
                  {user?.referralCode || "RGL7821"}
                </div>
              </div>
            </div>

            {/* Topbar Sign Out Button */}
            <button
              onClick={handleSignOut}
              title="Sign Out to Landing Page"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#EF4444",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              <LogOut size={13} />
              <span className="logout-text">Exit</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="user-main-content" style={{ flex: 1, padding: "30px 28px 60px", maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Outlet context={{ user, setUser: handleUpdateUser }} />
          </motion.div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "280px", height: "100%", background: "#080808", borderRight: "1px solid var(--border-highlight)", padding: "20px", display: "flex", flexDirection: "column" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={coinHero} alt="REGAL" style={{ width: "30px", height: "30px" }} />
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "#FFF" }}>REGAL</span>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "#FFF" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
              {navGroups.flatMap(g => g.items).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: currentPath === item.path ? "var(--gold-bright)" : "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "8px 0"
                  }}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>

            <div style={{ paddingTop: "16px", borderTop: "1px solid var(--border-standard)", marginTop: "12px" }}>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "10px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#EF4444",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .portal-sidebar { display: none !important; }
          .portal-mobile-toggle { display: block !important; }
          .user-topbar { padding: 0 14px !important; }
          .user-main-content { padding: 16px 12px 40px !important; }
        }
        @media (max-width: 520px) {
          .user-profile-details { display: none !important; }
          .logout-text { display: none !important; }
        }
        @media (min-width: 901px) {
          .portal-mobile-toggle { display: none !important; }
          #topbar-invest-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
}
