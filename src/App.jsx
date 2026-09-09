import React, { useEffect, useState } from "react";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import DashboardView from "./components/DashboardView";
import DocsSection from "./components/DocsSection";
import EcosystemSection from "./components/EcosystemSection";
import FaqSection from "./components/FaqSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import InvestmentModal from "./components/InvestmentModal";
import Navbar from "./components/Navbar";
import PackagesSection from "./components/PackagesSection";
import RoadmapSection from "./components/RoadmapSection";
import RoiCenterView from "./components/RoiCenterView";
import TokenomicsSection from "./components/TokenomicsSection";
import TokenSection from "./components/TokenSection";
import WalletModal from "./components/WalletModal";

// Synchronous default fallbacks
import {
    docsData,
    faqData,
    packagesData,
    roadmapData,
    tokenData,
    tokenomicsData
} from "./data/mockData";

export default function App() {
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

  // Simulated Web3 Wallet State
  const [wallet, setWallet] = useState({
    connected: false,
    address: "0x82A4F19c8d3e4b7c8d9e0f1a2b3c4d5e7B91",
    shortAddress: "0x82A4...7B91",
    network: "BNB Smart Chain (56)",
    bnbBalance: "2.45",
    usdtBalance: "8,500.00",
    rglBalance: "15,000",
    connect: (provider = "metamask") => {
      setWallet((prev) => ({ ...prev, connected: true }));
    },
    disconnect: () => {
      setWallet((prev) => ({ ...prev, connected: false }));
    }
  });

  // Fetch live data from backend API
  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((d) => d.success && setPackages(d.data))
      .catch(() => {});

    fetch("/api/token")
      .then((r) => r.json())
      .then((d) => d.success && setTokenInfo(d.data))
      .catch(() => {});

    fetch("/api/tokenomics")
      .then((r) => r.json())
      .then((d) => d.success && setTokenomics(d.data))
      .catch(() => {});

    fetch("/api/roadmap")
      .then((r) => r.json())
      .then((d) => d.success && setRoadmap(d.data))
      .catch(() => {});

    fetch("/api/faq")
      .then((r) => r.json())
      .then((d) => d.success && setFaqList(d.data))
      .catch(() => {});

    fetch("/api/docs")
      .then((r) => r.json())
      .then((d) => d.success && setDocsList(d.data))
      .catch(() => {});
  }, []);

  const handleOpenInvestWithPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsInvestModalOpen(true);
  };

  const handleNavigate = (sectionId) => {
    if (currentView !== "website") {
      setCurrentView("website");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-deep-black)" }}>
      {/* Sticky Global Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenInvestModal={() => {
          setSelectedPackage(packages[1] || packages[0]);
          setIsInvestModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentView === "website" && (
          <>
            {/* Screen 1: Hero & Statistics */}
            <HeroSection
              onOpenInvestModal={() => {
                setSelectedPackage(packages[1] || packages[0]);
                setIsInvestModalOpen(true);
              }}
              onExploreEcosystem={() => handleNavigate("ecosystem")}
              tokenInfo={tokenInfo}
            />

            {/* Screen 1 & 6: Investment Packages */}
            <PackagesSection
              packages={packages}
              onSelectPackage={handleOpenInvestWithPackage}
            />

            {/* Screen 6 & 1: How It Works & ROI Timeline */}
            <HowItWorksSection
              onOpenInvestModal={() => {
                setSelectedPackage(packages[1] || packages[0]);
                setIsInvestModalOpen(true);
              }}
            />

            {/* Screen 2: About Us */}
            <AboutSection
              onOpenInvestModal={() => {
                setSelectedPackage(packages[1] || packages[0]);
                setIsInvestModalOpen(true);
              }}
            />

            {/* Screen 3: Ecosystem */}
            <EcosystemSection
              onOpenInvestModal={() => {
                setSelectedPackage(packages[1] || packages[0]);
                setIsInvestModalOpen(true);
              }}
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
          </>
        )}

        {/* Screen 12: User Dashboard (Bonus interactive wireframe view) */}
        {currentView === "dashboard" && (
          <DashboardView
            wallet={wallet}
            onOpenInvestModal={() => {
              setSelectedPackage(packages[1] || packages[0]);
              setIsInvestModalOpen(true);
            }}
            onSwitchToRoi={() => setCurrentView("roi-center")}
          />
        )}

        {/* Screen 13: ROI Center (Bonus interactive wireframe view) */}
        {currentView === "roi-center" && (
          <RoiCenterView
            wallet={wallet}
            onBackToDashboard={() => setCurrentView("dashboard")}
            onOpenInvestModal={() => {
              setSelectedPackage(packages[1] || packages[0]);
              setIsInvestModalOpen(true);
            }}
          />
        )}
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

      {/* Multi-Step Investment Flow Wizard Modal (Screen 11) */}
      <InvestmentModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        packages={packages}
        initialPackage={selectedPackage}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onInvestmentSuccess={(newInv) => {
          // Keep wallet state active and refresh
          wallet.connect();
        }}
      />
    </div>
  );
}
