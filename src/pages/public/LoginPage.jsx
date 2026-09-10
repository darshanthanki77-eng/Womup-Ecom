import confetti from "canvas-confetti";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Coins,
    Copy,
    Key,
    Lock,
    LogIn,
    Shield,
    Sparkles,
    UserPlus,
    Wallet
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { coinHero } from "../../assets";
import { initialUser } from "../../data/portalData";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // URL query parameters (e.g. ?redirect=/investment&package=Regal%20Gold&ref=RGL7821)
  const queryParams = new URLSearchParams(location.search);
  const redirectTarget = queryParams.get("redirect") || "/investment";
  const selectedPackage = queryParams.get("package") || "";
  const initialRef = queryParams.get("ref") || "";

  const [mode, setMode] = useState(location.pathname === "/signup" || location.pathname === "/register" ? "signup" : "login");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Signup fields
  const [fullName, setFullName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [sponsorRef, setSponsorRef] = useState(initialRef);
  const [signupPassword, setSignupPassword] = useState("");
  const [createdUser, setCreatedUser] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // If already logged in, redirect directly
  useEffect(() => {
    try {
      const existing = localStorage.getItem("regal_user");
      if (existing) {
        const dest = selectedPackage
          ? `${redirectTarget}?package=${encodeURIComponent(selectedPackage)}`
          : redirectTarget;
        navigate(dest, { replace: true, state: { selectedPackage } });
      }
    } catch (e) {}
  }, [navigate, redirectTarget, selectedPackage]);

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const id = loginId.trim();
    if (!id) {
      setErrorMsg("Please enter your Referral ID (e.g. RGL...) or Wallet Address.");
      return;
    }

    let userToLoad = initialUser;
    const existing = localStorage.getItem("regal_user");
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (
          parsed.referralCode?.toLowerCase() === id.toLowerCase() ||
          parsed.walletAddress?.toLowerCase() === id.toLowerCase()
        ) {
          userToLoad = parsed;
        } else if (id.toUpperCase().startsWith("RGL")) {
          userToLoad = { ...parsed, referralCode: id.toUpperCase() };
        }
      } catch (err) {}
    } else if (id.toUpperCase().startsWith("RGL")) {
      userToLoad = { ...initialUser, referralCode: id.toUpperCase() };
    }

    localStorage.setItem("regal_user", JSON.stringify(userToLoad));
    const dest = selectedPackage
      ? `${redirectTarget}?package=${encodeURIComponent(selectedPackage)}`
      : redirectTarget;
    navigate(dest, { state: { selectedPackage } });
  };

  // One-click quick demo login
  const handleDemoLogin = () => {
    localStorage.setItem("regal_user", JSON.stringify(initialUser));
    const dest = selectedPackage
      ? `${redirectTarget}?package=${encodeURIComponent(selectedPackage)}`
      : redirectTarget;
    navigate(dest, { state: { selectedPackage } });
  };

  // Handle Sign Up
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    const autoWallet = walletAddress.trim() || `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    const generatedReferralId = `RGL${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = {
      ...initialUser,
      name: fullName.trim(),
      walletAddress: autoWallet,
      shortAddress: `${autoWallet.slice(0, 6)}...${autoWallet.slice(-4)}`,
      referralCode: generatedReferralId,
      sponsorId: sponsorRef.trim().toUpperCase() || "RGL9901",
      registeredDate: new Date().toISOString().split("T")[0],
      status: "Active",
      stats: {
        activeInvested: 0,
        totalRoi: 0,
        pendingRoi: 0,
        paidRoi: 0,
        referralEarnings: 0,
        availableBalance: 0,
        principalReturn: 0
      }
    };

    localStorage.setItem("regal_user", JSON.stringify(newUser));
    setCreatedUser(newUser);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#F4D77A", "#FFFFFF", "#22C55E"]
    });
  };

  const handleProceedToInvestment = () => {
    const dest = selectedPackage
      ? `${redirectTarget}?package=${encodeURIComponent(selectedPackage)}`
      : redirectTarget;
    navigate(dest, { state: { selectedPackage } });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep-black)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px 16px",
        position: "relative"
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "fixed",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "650px",
          height: "450px",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(5, 5, 5, 0) 70%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      {/* Top Bar with Back Link */}
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 2
        }}
      >
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            textDecoration: "none",
            fontSize: "13.5px",
            transition: "color 0.2s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-bright)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {selectedPackage && (
          <span
            style={{
              fontSize: "12px",
              padding: "4px 10px",
              borderRadius: "20px",
              background: "rgba(212, 175, 55, 0.12)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              color: "var(--gold-bright)",
              fontWeight: 600
            }}
          >
            Target: {selectedPackage}
          </span>
        )}
      </div>

      {/* Main Card */}
      <div
        className="regal-card"
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(13, 13, 13, 0.88)",
          backdropFilter: "blur(18px)",
          border: "1px solid var(--border-highlight)",
          boxShadow: "0 25px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(212, 175, 55, 0.12)",
          padding: "32px 28px",
          position: "relative",
          zIndex: 2
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "26px" }}>
          <img
            src={coinHero}
            alt="REGAL Coin"
            style={{
              width: "56px",
              height: "56px",
              objectFit: "contain",
              margin: "0 auto 12px",
              filter: "drop-shadow(0 0 18px rgba(212, 175, 55, 0.4))"
            }}
          />
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            REGAL <span className="gold-gradient-text">PORTAL</span>
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginTop: "6px" }}>
            {mode === "login"
              ? "Sign in to access your investment portfolio & daily ROI."
              : "Register your account with auto-generated RGL referral ID."}
          </p>
        </div>

        {/* Success Screen after Signup */}
        {createdUser ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(34, 197, 94, 0.15)",
                border: "2px solid #22C55E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px"
              }}
            >
              <CheckCircle2 size={32} color="#22C55E" />
            </div>

            <h3 style={{ fontSize: "20px", color: "#FFF", fontWeight: 700, marginBottom: "8px" }}>
              Account Created Successfully!
            </h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginBottom: "22px" }}>
              Your account has been registered on BNB Smart Chain ledger.
            </p>

            {/* Generated Referral Code Card */}
            <div
              style={{
                background: "rgba(212, 175, 55, 0.08)",
                border: "1px solid rgba(212, 175, 55, 0.35)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "24px"
              }}
            >
              <span style={{ fontSize: "11px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>
                Your Unique Referral ID
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "6px"
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "var(--gold-primary)",
                    letterSpacing: "1px"
                  }}
                >
                  {createdUser.referralCode}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(createdUser.referralCode);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="btn btn-outline-gold btn-sm"
                  style={{ padding: "4px 8px" }}
                >
                  {isCopied ? "Copied!" : <Copy size={13} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleProceedToInvestment}
              className="btn btn-gold btn-lg"
              style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              Proceed to {selectedPackage ? `${selectedPackage} Investment` : "Investment Page"} <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: "#080808",
                borderRadius: "10px",
                padding: "4px",
                marginBottom: "22px",
                border: "1px solid rgba(255, 255, 255, 0.08)"
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                }}
                style={{
                  background: mode === "login" ? "var(--gold-gradient)" : "transparent",
                  color: mode === "login" ? "#050505" : "var(--text-secondary)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "9px 0",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <LogIn size={15} /> Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg("");
                }}
                style={{
                  background: mode === "signup" ? "var(--gold-gradient)" : "transparent",
                  color: mode === "signup" ? "#050505" : "var(--text-secondary)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "9px 0",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <UserPlus size={15} /> Sign Up
              </button>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#EF4444",
                  fontSize: "12.5px",
                  marginBottom: "16px"
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: "16px" }}>
                  <label className="regal-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Key size={13} color="var(--gold-primary)" /> Referral ID or Wallet Address
                  </label>
                  <input
                    type="text"
                    className="regal-input"
                    placeholder="e.g. RGL7821 or 0x82A4...7B91"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    autoFocus
                  />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                    Enter the RGL ID generated during your registration.
                  </span>
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <label className="regal-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Lock size={13} color="var(--gold-primary)" /> Security PIN / Password
                  </label>
                  <input
                    type="password"
                    className="regal-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-gold btn-lg"
                  style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "12px" }}
                >
                  Sign In to Portal <ArrowRight size={16} />
                </button>

                {/* Instant Demo Login Button */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="btn btn-outline"
                  style={{ width: "100%", fontSize: "13px", padding: "10px 0" }}
                >
                  <Sparkles size={14} color="var(--gold-primary)" /> Instant Access (Demo User)
                </button>
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleSignupSubmit}>
                <div style={{ marginBottom: "14px" }}>
                  <label className="regal-label">Full Name</label>
                  <input
                    type="text"
                    className="regal-input"
                    placeholder="e.g. Alexander Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label className="regal-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Wallet size={13} color="var(--gold-primary)" /> BSC Wallet Address (Optional)
                  </label>
                  <input
                    type="text"
                    className="regal-input"
                    placeholder="0x... (leave blank to auto-generate)"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label className="regal-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Sparkles size={13} color="var(--gold-primary)" /> Sponsor / Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    className="regal-input"
                    placeholder="RGL..."
                    value={sponsorRef}
                    onChange={(e) => setSponsorRef(e.target.value.toUpperCase())}
                  />
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <label className="regal-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Lock size={13} color="var(--gold-primary)" /> Security Password
                  </label>
                  <input
                    type="password"
                    className="regal-input"
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-gold btn-lg"
                  style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  Create Account <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* Bottom Security Info */}
            <div
              style={{
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "12px",
                color: "var(--text-muted)"
              }}
            >
              <Shield size={14} color="var(--gold-primary)" />
              Secured with OpenZeppelin BEP-20 protocols
            </div>
          </>
        )}
      </div>
    </div>
  );
}
