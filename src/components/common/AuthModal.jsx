import confetti from "canvas-confetti";
import {
    AlertCircle,
    ArrowRight,
    Check,
    CheckCircle2,
    Copy,
    Crown,
    Lock,
    Mail,
    ShieldCheck,
    Sparkles,
    User,
    Wallet,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialUser } from "../../data/portalData";

export default function AuthModal({ isOpen, onClose, initialMode = "signup", defaultSponsor = "", redirectTo = "/dashboard" }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode); // "signup" | "login"
  
  // Sign Up Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [sponsorId, setSponsorId] = useState(defaultSponsor || "RGL7821");

  // Log In Form State
  const [loginIdentifier, setLoginIdentifier] = useState(""); // Referral ID or Wallet
  const [loginPassword, setLoginPassword] = useState("");

  // Status & Success state
  const [errorMsg, setErrorMsg] = useState("");
  const [createdUser, setCreatedUser] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    if (defaultSponsor) {
      setSponsorId(defaultSponsor);
    }
  }, [initialMode, defaultSponsor]);

  // Generate a random valid-looking BSC address if empty
  useEffect(() => {
    if (isOpen && !walletAddress) {
      const randomHex = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      setWalletAddress(randomHex);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handler: Sign Up
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    // Generate unique Referral ID starting strictly with "RGL"
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5 digits
    const generatedReferralId = `RGL${randomDigits}`;

    const shortAddr = walletAddress.length > 12 
      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
      : walletAddress;

    const newUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      email: email.trim(),
      walletAddress: walletAddress.trim(),
      shortAddress: shortAddr,
      referralCode: generatedReferralId, // Guaranteed prefix RGL
      sponsor: sponsorId.trim() ? `${sponsorId.trim()} (Sponsor)` : "RGL7821 (Protocol Genesis)",
      registrationDate: new Date().toISOString().slice(0, 10),
      status: "ACTIVE",
      network: "BNB Smart Chain (Mainnet 56)",
      balances: {
        bnb: "1.250",
        usdt: "5,000.00",
        rgl: "10,000.00"
      },
      kpi: {
        totalInvested: 0,
        activeInvested: 0,
        totalRoi: 0,
        pendingRoi: 0,
        paidRoi: 0,
        referralEarnings: 0,
        availableBalance: 0,
        principalReturn: 0
      }
    };

    // Persist to local storage
    localStorage.setItem("regal_user", JSON.stringify(newUser));
    setCreatedUser(newUser);

    // Fire celebratory confetti
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#F4D77A", "#FFFFFF", "#22C55E"]
    });
  };

  // Handler: Log In
  const handleLogin = (e) => {
    e.preventDefault();
    const id = loginIdentifier.trim();
    if (!id) {
      setErrorMsg("Please enter your Referral ID (e.g. RGL...) or Wallet Address.");
      return;
    }

    let userToLoad = initialUser;
    const existing = localStorage.getItem("regal_user");
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        if (parsed.referralCode?.toLowerCase() === id.toLowerCase() || parsed.walletAddress?.toLowerCase() === id.toLowerCase()) {
          userToLoad = parsed;
        } else if (id.toUpperCase().startsWith("RGL")) {
          userToLoad = { ...parsed, referralCode: id.toUpperCase() };
        }
      } catch (err) {}
    } else if (id.toUpperCase().startsWith("RGL")) {
      userToLoad = { ...initialUser, referralCode: id.toUpperCase() };
    }

    localStorage.setItem("regal_user", JSON.stringify(userToLoad));
    onClose();
    navigate(redirectTo || "/dashboard");
  };

  const handleCopyCode = () => {
    if (createdUser) {
      navigator.clipboard.writeText(createdUser.referralCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleProceedToDashboard = () => {
    onClose();
    navigate(redirectTo || "/dashboard");
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.8)" }}>
      <div
        className="modal-content regal-card card-spotlight auth-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "500px",
          background: "rgba(14, 14, 14, 0.96)",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212, 175, 55, 0.15)",
          borderRadius: "16px",
          padding: "26px",
          overflowY: "auto"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(212, 175, 55, 0.15)", border: "1px solid rgba(212, 175, 55, 0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Crown size={20} color="var(--gold-bright)" />
            </div>
            <div>
              <h3 style={{ fontSize: "19px", color: "#FFF", fontWeight: 800 }}>REGAL Ecosystem</h3>
              <span style={{ fontSize: "11px", color: "var(--gold-bright)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Web3 Non-Custodial Portal
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Screen after Account Creation with Generated RGL Referral ID */}
        {createdUser ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ width: "62px", height: "62px", borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "2px solid #22C55E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle2 size={34} color="#22C55E" />
            </div>

            <h3 style={{ fontSize: "22px", color: "#FFF", fontWeight: 800, marginBottom: "6px" }}>
              Account Successfully Created!
            </h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Welcome, <strong style={{ color: "#FFF" }}>{createdUser.name}</strong>. Your account has been registered on BNB Smart Chain.
            </p>

            {/* Generated Referral ID Card */}
            <div
              style={{
                background: "linear-gradient(135deg, rgba(28, 22, 10, 0.9) 0%, rgba(12, 10, 5, 0.95) 100%)",
                border: "1px solid var(--gold-bright)",
                borderRadius: "12px",
                padding: "18px 20px",
                marginBottom: "20px",
                boxShadow: "0 0 25px rgba(212, 175, 55, 0.2)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "var(--gold-bright)", fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "8px" }}>
                <Sparkles size={14} /> YOUR NEW EXCLUSIVE REFERRAL ID
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 900, color: "var(--gold-bright)", letterSpacing: "0.06em" }}>
                  {createdUser.referralCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="btn btn-outline-gold btn-sm"
                  style={{ padding: "4px 10px", fontSize: "11px" }}
                >
                  {isCopied ? <Check size={13} /> : <Copy size={13} />} {isCopied ? "Copied" : "Copy"}
                </button>
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--text-secondary)", marginTop: "8px" }}>
                Prefix <strong>RGL</strong> guaranteed • Share to earn up to 5% referral rewards
              </div>
            </div>

            <div style={{ background: "rgba(6, 6, 6, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "10px", padding: "12px 16px", marginBottom: "24px", textAlign: "left", fontSize: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Registered Wallet:</span>
                <span style={{ color: "#FFF", fontFamily: "monospace" }}>{createdUser.shortAddress}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Sponsor ID:</span>
                <span style={{ color: "var(--gold-bright)", fontWeight: 700 }}>{createdUser.sponsor}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToDashboard}
              className="btn btn-gold btn-lg"
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)" }}
            >
              Proceed to Dashboard <ArrowRight size={17} />
            </button>
          </div>
        ) : (
          <>
            {/* Mode Segmented Tab Switcher */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                background: "rgba(255, 255, 255, 0.04)",
                padding: "4px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                marginBottom: "22px"
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg("");
                }}
                className="btn btn-sm"
                style={{
                  background: mode === "signup" ? "var(--gold-gradient)" : "transparent",
                  color: mode === "signup" ? "#050505" : "var(--text-secondary)",
                  fontWeight: mode === "signup" ? 800 : 600,
                  boxShadow: mode === "signup" ? "0 0 12px rgba(212, 175, 55, 0.35)" : "none",
                  border: "none",
                  borderRadius: "7px"
                }}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                }}
                className="btn btn-sm"
                style={{
                  background: mode === "login" ? "var(--gold-gradient)" : "transparent",
                  color: mode === "login" ? "#050505" : "var(--text-secondary)",
                  fontWeight: mode === "login" ? 800 : 600,
                  boxShadow: mode === "login" ? "0 0 12px rgba(212, 175, 55, 0.35)" : "none",
                  border: "none",
                  borderRadius: "7px"
                }}
              >
                Log In
              </button>
            </div>

            {errorMsg && (
              <div style={{ color: "#EF4444", background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "12.5px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <AlertCircle size={15} /> {errorMsg}
              </div>
            )}

            {/* SIGN UP FORM */}
            {mode === "signup" ? (
              <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label className="regal-label" style={{ fontSize: "12px", marginBottom: "6px" }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={16} color="var(--gold-primary)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Duke Vance"
                      className="regal-input"
                      style={{ paddingLeft: "40px" }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="regal-label" style={{ fontSize: "12px", marginBottom: "6px" }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} color="var(--gold-primary)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. duke@regal-asset.io"
                      className="regal-input"
                      style={{ paddingLeft: "40px" }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="regal-label" style={{ fontSize: "12px", marginBottom: "6px" }}>Sponsor Referral ID (Mandatory)</label>
                  <div style={{ position: "relative" }}>
                    <Sparkles size={16} color="var(--gold-bright)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      value={sponsorId}
                      onChange={(e) => setSponsorId(e.target.value.toUpperCase())}
                      placeholder="e.g. RGL7821"
                      className="regal-input"
                      style={{ paddingLeft: "40px", fontFamily: "monospace", fontWeight: 700, color: "var(--gold-bright)" }}
                      required
                    />
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px", display: "block" }}>
                    Connected via sponsor invitation. Your personal ID will automatically generate with prefix <strong>RGL</strong>.
                  </span>
                </div>

                <div>
                  <label className="regal-label" style={{ fontSize: "12px", marginBottom: "6px" }}>BEP-20 Wallet Address</label>
                  <div style={{ position: "relative" }}>
                    <Wallet size={16} color="var(--gold-primary)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="regal-input"
                      style={{ paddingLeft: "40px", fontFamily: "monospace", fontSize: "12px" }}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-gold btn-lg"
                  style={{ width: "100%", marginTop: "8px", boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" }}
                >
                  Create Account & Generate Referral ID <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              /* LOG IN FORM */
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="regal-label" style={{ fontSize: "12px", marginBottom: "6px" }}>
                    Referral ID or Wallet Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Sparkles size={16} color="var(--gold-bright)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. RGL7821 or 0x82A4..."
                      className="regal-input"
                      style={{ paddingLeft: "40px", fontFamily: "monospace", fontWeight: 700 }}
                      required
                    />
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                    Hint: Use your generated <strong>RGL...</strong> referral code or default <strong>RGL7821</strong>.
                  </span>
                </div>

                <div>
                  <label className="regal-label" style={{ fontSize: "12px", marginBottom: "6px" }}>
                    Web3 Key / Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} color="var(--gold-primary)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="regal-input"
                      style={{ paddingLeft: "40px" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-gold btn-lg"
                  style={{ width: "100%", marginTop: "6px", boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" }}
                >
                  Sign In to Dashboard <ArrowRight size={16} />
                </button>
              </form>
            )}

            <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "11.5px", color: "var(--text-muted)" }}>
              <ShieldCheck size={14} color="#22C55E" />
              Protected by Non-Custodial Cryptographic Protocol
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .auth-modal-content {
            padding: 20px 16px !important;
            border-radius: 16px !important;
            max-height: 94vh !important;
          }
        }
      `}</style>
    </div>
  );
}
