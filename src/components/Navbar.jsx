import { ChevronDown, ExternalLink, Menu, Shield, Wallet, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { coinHero } from "../assets";

export default function Navbar({
  currentView,
  setCurrentView,
  wallet,
  onOpenWalletModal,
  onOpenInvestModal
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "ecosystem", label: "Ecosystem" },
    { id: "token", label: "Token" },
    { id: "packages", label: "Packages" },
    { id: "how-it-works", label: "How It Works" },
  ];

  const handleNavClick = (id) => {
    if (currentView === "dashboard" || currentView === "roi-center") {
      setCurrentView("website");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        height: scrolled ? "76px" : "88px",
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(5, 5, 5, 0.92)" : "rgba(5, 5, 5, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(212, 175, 55, 0.15)",
        display: "flex",
        alignItems: "center"
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Brand Logo */}
        <div
          onClick={() => {
            setCurrentView("website");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          <div style={{ position: "relative", width: "42px", height: "42px" }}>
            <img
              src={coinHero}
              alt="Regal RGL"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 0 10px rgba(212, 175, 55, 0.4))"
              }}
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 800, letterSpacing: "0.08em", color: "#F5F5F5" }}>
                REGAL
              </span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "var(--gold-bright)",
                  background: "rgba(212, 175, 55, 0.15)",
                  border: "1px solid rgba(212, 175, 55, 0.4)",
                  padding: "2px 6px",
                  borderRadius: "4px"
                }}
              >
                RGL
              </span>
            </div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              BNB Smart Chain
            </div>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav
          style={{
            display: "none",
            gap: "22px",
            alignItems: "center"
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-body)",
                fontSize: "13.5px",
                fontWeight: 500,
                cursor: "pointer",
                padding: "6px 0",
                transition: "color 0.2s ease",
                position: "relative"
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--gold-bright)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          
          {/* Network Pill */}
          <div
            style={{
              display: "none",
              alignItems: "center",
              gap: "7px",
              padding: "7px 12px",
              background: "#101010",
              border: "1px solid var(--border-standard)",
              borderRadius: "999px",
              fontSize: "12px",
              color: "var(--text-secondary)"
            }}
            className="network-badge"
          >
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E" }}></span>
            BSC (56)
          </div>

          {/* Wallet Button */}
          {wallet.connected ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                className="btn btn-outline-gold btn-sm"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E" }}></span>
                {wallet.shortAddress}
                <ChevronDown size={14} />
              </button>

              {walletDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "220px",
                    background: "#101010",
                    border: "1px solid var(--border-highlight)",
                    borderRadius: "12px",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.8)",
                    padding: "12px",
                    zIndex: 1000
                  }}
                >
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>CONNECTED WALLET</div>
                  <div style={{ fontSize: "13px", color: "var(--gold-bright)", fontWeight: 600, marginBottom: "10px" }}>
                    {wallet.address}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                    Balance: <strong style={{ color: "#FFF" }}>{wallet.bnbBalance} BNB</strong>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView("dashboard");
                      setWalletDropdownOpen(false);
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ width: "100%", marginBottom: "8px" }}
                  >
                    View Portfolio
                  </button>
                  <button
                    onClick={() => {
                      wallet.disconnect();
                      setWalletDropdownOpen(false);
                    }}
                    style={{
                      width: "100%",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#EF4444",
                      padding: "7px 0",
                      borderRadius: "8px",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onOpenWalletModal} className="btn btn-gold btn-sm">
              <Wallet size={15} />
              Connect Wallet
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              padding: "6px"
            }}
            className="mobile-nav-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: scrolled ? "76px" : "88px",
            left: 0,
            right: 0,
            background: "#090909",
            borderBottom: "1px solid var(--border-highlight)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.9)"
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-primary)",
                textAlign: "left",
                fontFamily: "var(--font-heading)",
                fontSize: "16px",
                padding: "10px 0",
                borderBottom: "1px solid #181818"
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenInvestModal();
              setMobileMenuOpen(false);
            }}
            className="btn btn-gold"
            style={{ marginTop: "10px" }}
          >
            Invest Now
          </button>
        </div>
      )}

      {/* Media query styles embedded */}
      <style>{`
        @media (min-width: 1080px) {
          .desktop-nav { display: flex !important; }
          .network-badge { display: flex !important; }
          .mobile-nav-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
