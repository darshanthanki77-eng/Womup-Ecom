import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AboutSection from "../../components/AboutSection";
import AuthModal from "../../components/common/AuthModal";
import ContactSection from "../../components/ContactSection";
import DashboardView from "../../components/DashboardView";
import DocsSection from "../../components/DocsSection";
import EcosystemSection from "../../components/EcosystemSection";
import FaqSection from "../../components/FaqSection";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";
import HowItWorksSection from "../../components/HowItWorksSection";
import InvestmentModal from "../../components/InvestmentModal";
import Navbar from "../../components/Navbar";
import PackagesSection from "../../components/PackagesSection";
import RoadmapSection from "../../components/RoadmapSection";
import RoiCenterView from "../../components/RoiCenterView";
import TokenomicsSection from "../../components/TokenomicsSection";
import TokenSection from "../../components/TokenSection";
import WalletModal from "../../components/WalletModal";

// Synchronous default fallbacks
import {
    docsData,
    faqData,
    packagesData,
    roadmapData,
    tokenData,
    tokenomicsData
} from "../../data/protocolData";

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("website"); // "website" | "dashboard" | "roi-center"

  // Platform Data
  const [packages, setPackages] = useState(packagesData);
  const [tokenInfo, setTokenInfo] = useState(tokenData);
  const [tokenomics, setTokenomics] = useState(tokenomicsData);
  const [roadmap, setRoadmap] = useState(roadmapData);
  const [faqList, setFaqList] = useState(faqData);
  const [docsList, setDocsList] = useState(docsData);

  // Modals state
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Auth & Referral Registration state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [sponsorRef, setSponsorRef] = useState("");

  // Check URL query parameters for ?ref= (e.g. ?ref=RGL7821)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setSponsorRef(ref.toUpperCase());
      setAuthMode("signup");
      setIsAuthModalOpen(true);
    }
  }, []);

  const handleOpenAuth = (mode = "signup") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // Simulated Web3 Wallet State
  const [wallet, setWallet] = useState({
    connected: false,
    address: "0x82A4F19c8d3e4b7c8d9e0f1a2b3c4d5e7B91",
    shortAddress: "0x82A4...7B91",
    network: "BNB Smart Chain (56)",
    bnbBalance: "2.45",
    usdtBalance: "8,500.00",
    rglBalance: "15,000",
    connect: () => {
      setWallet((prev) => ({ ...prev, connected: true }));
    },
    disconnect: () => {
      setWallet((prev) => ({ ...prev, connected: false }));
    }
  });

  // Fetch live data from backend API safely
  useEffect(() => {
    const safeFetch = async (url) => {
      try {
        const res = await fetch(url);
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      } catch (e) {
        return null;
      }
    };

    safeFetch("/api/packages").then((d) => d?.success && setPackages(d.data));
    safeFetch("/api/token").then((d) => d?.success && setTokenInfo(d.data));
    safeFetch("/api/tokenomics").then((d) => d?.success && setTokenomics(d.data));
    safeFetch("/api/roadmap").then((d) => d?.success && setRoadmap(d.data));
    safeFetch("/api/faq").then((d) => d?.success && setFaqList(d.data));
    safeFetch("/api/docs").then((d) => d?.success && setDocsList(d.data));
  }, []);

  // Handle package selection (Silver, Gold, Black)
  const handleOpenInvestWithPackage = (pkg) => {
    const isLoggedIn = !!localStorage.getItem("regal_user");
    if (isLoggedIn) {
      // Logged in -> redirect user to investment page of user portal
      navigate(`/investment?package=${encodeURIComponent(pkg.name)}`, {
        state: { selectedPackage: pkg.name }
      });
    } else {
      // Not logged in -> redirect user to login page
      navigate(`/login?redirect=/investment&package=${encodeURIComponent(pkg.name)}`);
    }
  };

  // Handle general investment CTAs
  const handleGeneralInvestClick = () => {
    const isLoggedIn = !!localStorage.getItem("regal_user");
    if (isLoggedIn) {
      navigate("/investment");
    } else {
      navigate("/login?redirect=/investment");
    }
  };

  const handleNavigate = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-deep-black)" }}>
      {/* Sticky Global Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === "dashboard") {
            navigate("/dashboard");
          } else {
            setCurrentView(view);
          }
        }}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenInvestModal={handleGeneralInvestClick}
        onOpenAuthModal={(mode) => handleOpenAuth(mode || "signup")}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* Screen 1: Hero & Statistics */}
        <HeroSection
          onOpenInvestModal={handleGeneralInvestClick}
          onExploreEcosystem={() => handleNavigate("ecosystem")}
          onOpenAuthModal={(mode) => {
            if (mode === "login") {
              navigate("/login?redirect=/investment");
            } else {
              handleOpenAuth(mode);
            }
          }}
          tokenInfo={tokenInfo}
        />

        {/* Screen 1 & 6: Investment Packages (Silver, Gold, Black) */}
        <PackagesSection
          packages={packages}
          onSelectPackage={handleOpenInvestWithPackage}
        />

        {/* Screen 6 & 1: How It Works & ROI Timeline */}
        <HowItWorksSection
          onOpenInvestModal={handleGeneralInvestClick}
        />

        {/* Screen 2: About Us */}
        <AboutSection
          onOpenInvestModal={handleGeneralInvestClick}
        />

        {/* Screen 3: Ecosystem */}
        <EcosystemSection
          onOpenInvestModal={handleGeneralInvestClick}
        />

        {/* Screen 4: Token */}
        <TokenSection tokenInfo={tokenInfo} />

        {/* Screen 5: Tokenomics */}
        <TokenomicsSection tokenomics={tokenomics} />

        {/* Screen 7: Roadmap */}
        <RoadmapSection roadmap={roadmap} />

        {/* Screen 8: FAQ */}
        <FaqSection
          faqList={faqList}
          onNavigateToContact={() => handleNavigate("contact")}
        />

        {/* Screen 9: Documentation */}
        <DocsSection docsList={docsList} />

        {/* Screen 10: Contact / Support */}
        <ContactSection />
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenInvestModal={() => {
          setSelectedPackage(packages[1] || packages[0]);
          setIsInvestModalOpen(true);
        }}
      />

      {/* Wallet Connection Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
      />

      {/* Multi-Step Investment Flow Wizard Modal */}
      <InvestmentModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        packages={packages}
        initialPackage={selectedPackage}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onInvestmentSuccess={() => {
          wallet.connect();
        }}
      />

      {/* Sign Up & Log In Modal with Automated RGL Referral ID Generation */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        defaultSponsor={sponsorRef}
      />
    </div>
  );
}
