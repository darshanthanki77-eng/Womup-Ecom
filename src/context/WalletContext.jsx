import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_CHAIN_ID } from "../config/web3Config";
import web3Service from "../services/web3Service";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(DEFAULT_CHAIN_ID);
  const [connecting, setConnecting] = useState(false);
  const [balances, setBalances] = useState({
    bnb: "0.0000",
    rgl: "0.00",
    usdt: "0.00"
  });

  const isConnected = Boolean(account);
  const isCorrectChain = chainId === 56 || chainId === 97;

  // Refresh all balances for current account
  const refreshBalances = useCallback(async (targetAccount = account) => {
    if (!targetAccount) {
      setBalances({ bnb: "0.0000", rgl: "0.00", usdt: "0.00" });
      return;
    }
    try {
      const [bnb, rgl, usdt] = await Promise.all([
        web3Service.getNativeBalance(targetAccount),
        web3Service.getRGLBalance(targetAccount),
        web3Service.getUSDTBalance(targetAccount)
      ]);
      setBalances({ bnb, rgl, usdt });
    } catch (e) {
      console.warn("[WalletContext] Error refreshing balances:", e);
    }
  }, [account]);

  // Connect wallet
  const connect = useCallback(async (providerName = "metamask") => {
    setConnecting(true);
    try {
      const res = await web3Service.connectWallet();
      const connectedAccount = typeof res === "string" ? res : res?.account;
      const connectedChainId = res?.chainId || DEFAULT_CHAIN_ID;

      setAccount(connectedAccount);
      setChainId(connectedChainId);

      // Auto check if on BSC, if not prompt switch
      if (connectedChainId !== DEFAULT_CHAIN_ID) {
        try {
          await web3Service.switchToBSC(DEFAULT_CHAIN_ID);
          setChainId(DEFAULT_CHAIN_ID);
        } catch (switchErr) {
          console.warn("[WalletContext] Switch to BSC cancelled or failed:", switchErr);
        }
      }

      await refreshBalances(connectedAccount);

      // Synchronize real connected wallet address to user session
      try {
        const storedUser = localStorage.getItem("regal_user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.walletAddress = connectedAccount;
          parsed.shortAddress = `${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}`;
          localStorage.setItem("regal_user", JSON.stringify(parsed));
        }
      } catch (se) {}

      return res;
    } catch (err) {
      console.warn("[WalletContext] Connect notice:", err.message || err);
      if (err.message && (err.message.includes("locked") || err.message.includes("Unable to find any account"))) {
        alert(err.message);
      }
      throw err;
    } finally {
      setConnecting(false);
    }
  }, [refreshBalances]);

  // Disconnect / Reset state
  const disconnect = useCallback(() => {
    setAccount(null);
    setBalances({ bnb: "0.0000", rgl: "0.00", usdt: "0.00" });
  }, []);

  // Explicit switch network to BSC
  const switchNetwork = useCallback(async (targetId = DEFAULT_CHAIN_ID) => {
    try {
      await web3Service.switchToBSC(targetId);
      setChainId(targetId);
      if (account) await refreshBalances(account);
      return true;
    } catch (err) {
      console.error("[WalletContext] Network switch error:", err);
      throw err;
    }
  }, [account, refreshBalances]);

  // Check initial connection on load if already authorized
  useEffect(() => {
    async function checkExistingAuth() {
      if (web3Service.isMetaMaskAvailable()) {
        const accounts = await web3Service.getAccounts();
        const cid = await web3Service.getChainId();
        setChainId(cid);
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          refreshBalances(accounts[0]);
        }
      }
    }
    checkExistingAuth();

    // Subscribe to MetaMask account and chain change events
    const handleAccountChange = (newAcc) => {
      setAccount(newAcc);
      if (newAcc) {
        refreshBalances(newAcc);
      } else {
        disconnect();
      }
    };

    const handleChainChange = (newChainId) => {
      setChainId(newChainId);
      if (account) {
        refreshBalances(account);
      }
    };

    web3Service.setupListeners(handleAccountChange, handleChainChange);

    return () => {
      web3Service.removeListeners();
    };
  }, [disconnect, refreshBalances]);

  // Manual connect fallback (e.g. paste address if MetaMask extension has internal keyring issue)
  const connectManual = useCallback((manualAddress) => {
    if (!manualAddress || !manualAddress.startsWith("0x") || manualAddress.length !== 42) {
      alert("Please enter a valid 42-character BSC address (0x...)");
      return;
    }
    setAccount(manualAddress);
    setChainId(56);
    refreshBalances(manualAddress);
    try {
      const storedUser = localStorage.getItem("regal_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.walletAddress = manualAddress;
        parsed.shortAddress = `${manualAddress.slice(0, 6)}...${manualAddress.slice(-4)}`;
        localStorage.setItem("regal_user", JSON.stringify(parsed));
      }
    } catch (e) {}
  }, [refreshBalances]);

  const value = {
    account,
    address: account, // alias
    chainId,
    isConnected,
    connected: isConnected, // alias
    isCorrectChain,
    connecting,
    balances,
    connect,
    connectManual,
    disconnect,
    switchNetwork,
    refreshBalances
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return ctx;
}

export default WalletContext;
