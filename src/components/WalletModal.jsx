import { AlertTriangle, CheckCircle, ExternalLink, ShieldCheck, Wallet, X } from "lucide-react";
import React, { useState } from "react";

export default function WalletModal({ isOpen, onClose, wallet }) {
  const [connectingProvider, setConnectingProvider] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const providers = [
    {
      id: "metamask",
      name: "MetaMask",
      badge: "Popular",
      description: "Connect using your browser extension or mobile wallet app.",
      icon: "🦊"
    },
    {
      id: "trustwallet",
      name: "Trust Wallet",
      badge: "BSC Native",
      description: "Recommended mobile wallet for Binance Smart Chain.",
      icon: "🛡️"
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      badge: "Multi-Chain",
      description: "Scan QR code with any of 100+ supported Web3 mobile wallets.",
      icon: "🔗"
    }
  ];

  const handleConnect = (providerId) => {
    setConnectingProvider(providerId);
    setErrorMsg("");

    setTimeout(() => {
      wallet.connect(providerId);
      setConnectingProvider(null);
      onClose();
    }, 900);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Wallet size={20} color="var(--gold-primary)" />
            <h3 style={{ fontSize: "18px" }}>Connect Crypto Wallet</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary)", marginBottom: "20px" }}>
            Select your preferred Web3 provider to interact with the Regal investment protocol on BNB Smart Chain.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => handleConnect(p.id)}
                disabled={connectingProvider !== null}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#101010",
                  border: "1px solid var(--border-standard)",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--gold-primary)";
                  e.currentTarget.style.background = "rgba(212, 175, 55, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-standard)";
                  e.currentTarget.style.background = "#101010";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "28px" }}>{p.icon}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontFamily: "var(--font-heading)", fontSize: "15px", fontWeight: 700, color: "#F5F5F5" }}>
                        {p.name}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "var(--gold-bright)",
                          background: "rgba(212, 175, 55, 0.12)",
                          padding: "2px 6px",
                          borderRadius: "4px"
                        }}
                      >
                        {p.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {p.description}
                    </div>
                  </div>
                </div>

                {connectingProvider === p.id && (
                  <div style={{ fontSize: "12px", color: "var(--gold-bright)", fontStyle: "italic" }}>
                    Connecting...
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Security Notice */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              background: "rgba(140, 106, 22, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              borderRadius: "10px",
              padding: "12px 14px",
              fontSize: "12px",
              color: "var(--text-secondary)"
            }}
          >
            <ShieldCheck size={18} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong style={{ color: "var(--gold-bright)" }}>Non-Custodial Security:</strong> Regal will never request your private key or seed phrase. All transactions are signed directly within your wallet.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
