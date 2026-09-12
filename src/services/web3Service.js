import { ethers } from "ethers";
import { BSC_CHAINS, CONTRACT_ADDRESSES, DEFAULT_CHAIN_ID, ERC20_MINIMAL_ABI } from "../config/web3Config";
import RegalTokenABI from "../contracts/RegalTokenABI.json";

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.rglContract = null;
    this.readOnlyProvider = null;
    this.initReadOnlyProvider();
  }

  /**
   * Initializes a fallback public JSON-RPC provider for read-only queries
   */
  initReadOnlyProvider() {
    try {
      this.readOnlyProvider = new ethers.JsonRpcProvider(BSC_CHAINS.MAINNET.rpcUrls[0], {
        chainId: DEFAULT_CHAIN_ID,
        name: "bnb"
      });
    } catch (e) {
      console.warn("[Web3Service] Could not init fallback RPC provider:", e);
    }
  }

  getEthereum() {
    if (typeof window === "undefined" || !window.ethereum) return null;
    if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
      const mm = window.ethereum.providers.find(
        (p) => p.isMetaMask && !p.isPhantom && !p.isBraveWallet && !p.isCoinbaseWallet
      );
      if (mm) return mm;
      return window.ethereum.providers[0];
    }
    return window.ethereum;
  }

  isMetaMaskAvailable() {
    return Boolean(this.getEthereum());
  }

  /**
   * Connects to MetaMask and sets up browser provider & signer
   */
  async connectWallet() {
    return connectWallet();
  }

  async getAccounts() {
    const eth = this.getEthereum();
    if (!eth) return [];
    try {
      return await eth.request({ method: "eth_accounts" });
    } catch (e) {
      return [];
    }
  }

  async getChainId() {
    const eth = this.getEthereum();
    if (!eth) return DEFAULT_CHAIN_ID;
    try {
      const chainIdHex = await eth.request({ method: "eth_chainId" });
      return parseInt(chainIdHex, 16);
    } catch (e) {
      return DEFAULT_CHAIN_ID;
    }
  }

  /**
   * Requests network switch to BSC (Chain ID: 56).
   * Automatically prompts to add the chain if not present in the user's wallet.
   */
  async switchToBSC(targetChainId = DEFAULT_CHAIN_ID) {
    const eth = this.getEthereum();
    if (!eth) {
      throw new Error("MetaMask is not available.");
    }

    const chainConfig = targetChainId === 97 ? BSC_CHAINS.TESTNET : BSC_CHAINS.MAINNET;

    try {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainConfig.chainIdHex }]
      });
    } catch (switchError) {
      // Error 4902 indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: chainConfig.chainIdHex,
              chainName: chainConfig.chainName,
              nativeCurrency: chainConfig.nativeCurrency,
              rpcUrls: chainConfig.rpcUrls,
              blockExplorerUrls: chainConfig.blockExplorerUrls
            }
          ]
        });
      } else {
        throw switchError;
      }
    }

    // Verify switch after allowing provider to settle
    await new Promise((r) => setTimeout(r, 200));
    const currentChainId = await this.getChainId();
    if (currentChainId !== targetChainId && currentChainId !== 97 && currentChainId !== 56) {
      throw new Error(`Failed to switch network. Wallet is currently on chain ${currentChainId}.`);
    }

    // Refresh provider
    this.provider = new ethers.BrowserProvider(eth);
    try {
      this.signer = await this.provider.getSigner();
    } catch (e) {
      console.warn("[Web3Service] Signer init deferred:", e);
    }

    return true;
  }

  /**
   * Instantiates the deployed RegalToken contract with either signer (write) or provider (read)
   */
  getRGLContract(signerOrProvider = null) {
    const runner = signerOrProvider || this.signer || this.provider || this.readOnlyProvider;
    return new ethers.Contract(CONTRACT_ADDRESSES.RGL_TOKEN, RegalTokenABI, runner);
  }

  /**
   * Instantiates an ERC20/BEP20 token contract
   */
  getTokenContract(tokenAddress, signerOrProvider = null) {
    const runner = signerOrProvider || this.signer || this.provider || this.readOnlyProvider;
    return new ethers.Contract(tokenAddress, ERC20_MINIMAL_ABI, runner);
  }

  /**
   * Fetch native BNB balance for an address
   */
  async getNativeBalance(address) {
    if (!address) return "0.0";
    try {
      const runner = this.provider || this.readOnlyProvider;
      if (!runner) return "0.0";
      const balance = await runner.getBalance(address);
      return parseFloat(ethers.formatEther(balance)).toFixed(4);
    } catch (e) {
      console.warn("[Web3Service] Error reading BNB balance:", e.message);
      return "0.0";
    }
  }

  /**
   * Fetch RGL token balance for an address from the deployed contract
   */
  async getRGLBalance(address) {
    if (!address) return "0.0";
    try {
      const contract = this.getRGLContract();
      const balance = await contract.balanceOf(address);
      return parseFloat(ethers.formatUnits(balance, 18)).toFixed(2);
    } catch (e) {
      console.warn("[Web3Service] Error reading RGL balance:", e.message);
      return "0.0";
    }
  }

  /**
   * Fetch USDT balance on BSC
   */
  async getUSDTBalance(address) {
    if (!address) return "0.0";
    try {
      const contract = this.getTokenContract(CONTRACT_ADDRESSES.USDT_TOKEN);
      const balance = await contract.balanceOf(address);
      return parseFloat(ethers.formatUnits(balance, 18)).toFixed(2);
    } catch (e) {
      console.warn("[Web3Service] Error reading USDT balance:", e.message);
      return "0.0";
    }
  }

  /**
   * Reads all live parameters directly from the deployed RegalToken contract
   */
  async getContractParameters() {
    try {
      const contract = this.getRGLContract();
      const [
        name,
        symbol,
        decimals,
        totalSupply,
        buyRate,
        sellRate,
        buyEnabled,
        sellEnabled,
        paused,
        owner,
        contractBalance
      ] = await Promise.all([
        contract.name().catch(() => "Regal"),
        contract.symbol().catch(() => "RGL"),
        contract.decimals().catch(() => 18),
        contract.totalSupply().catch(() => 0n),
        contract.buyRate().catch(() => 1000n),
        contract.sellRate().catch(() => 1000n),
        contract.buyEnabled().catch(() => true),
        contract.sellEnabled().catch(() => true),
        contract.paused().catch(() => false),
        contract.owner().catch(() => ""),
        contract.balanceOf(CONTRACT_ADDRESSES.RGL_TOKEN).catch(() => 0n)
      ]);

      let bnbReserve = "0.0";
      const runner = this.provider || this.readOnlyProvider;
      if (runner) {
        try {
          const bnbBal = await runner.getBalance(CONTRACT_ADDRESSES.RGL_TOKEN);
          bnbReserve = ethers.formatEther(bnbBal);
        } catch (be) {}
      }

      return {
        address: CONTRACT_ADDRESSES.RGL_TOKEN,
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        buyRate: Number(buyRate),
        sellRate: Number(sellRate),
        buyEnabled: Boolean(buyEnabled),
        sellEnabled: Boolean(sellEnabled),
        paused: Boolean(paused),
        owner,
        contractRglInventory: ethers.formatUnits(contractBalance, decimals),
        contractBnbReserve: bnbReserve
      };
    } catch (e) {
      console.warn("[Web3Service] getContractParameters failed:", e);
      return {
        address: CONTRACT_ADDRESSES.RGL_TOKEN,
        name: "Regal",
        symbol: "RGL",
        decimals: 18,
        totalSupply: "100000000",
        buyRate: 1000,
        sellRate: 1000,
        buyEnabled: true,
        sellEnabled: true,
        paused: false,
        owner: "",
        contractRglInventory: "0",
        contractBnbReserve: "0.0"
      };
    }
  }

  /**
   * Direct RGL Token Purchase via contract buy() function
   * Sends BNB to contract, receives RGL
   */
  async buyRGL(amountBnb) {
    if (!this.signer) await this.connectWallet();
    const contract = this.getRGLContract(this.signer);
    const value = ethers.parseEther(amountBnb.toString());

    const tx = await contract.buy({ value });
    const receipt = await tx.wait(1);
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  }

  /**
   * Direct RGL Token Sale via contract sell() function
   * Transfers RGL to contract, receives BNB payout
   */
  async sellRGL(tokenAmountRgl) {
    if (!this.signer) await this.connectWallet();
    const contract = this.getRGLContract(this.signer);
    const tokenAmount = ethers.parseUnits(tokenAmountRgl.toString(), 18);

    const tx = await contract.sell(tokenAmount);
    const receipt = await tx.wait(1);
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  }

  /**
   * Direct RGL transfer (e.g. for RGL-denominated investments)
   */
  async transferRGL(recipient, amount) {
    if (!this.signer) await this.connectWallet();
    const contract = this.getRGLContract(this.signer);
    const value = ethers.parseUnits(amount.toString(), 18);

    const tx = await contract.transfer(recipient, value);
    const receipt = await tx.wait(1);
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  }

  /**
   * BEP-20 USDT transfer (e.g. for USDT-denominated investments)
   */
  async transferUSDT(recipient, amount) {
    if (!this.signer) await this.connectWallet();
    const contract = this.getTokenContract(CONTRACT_ADDRESSES.USDT_TOKEN, this.signer);
    const value = ethers.parseUnits(amount.toString(), 18);

    const tx = await contract.transfer(recipient, value);
    const receipt = await tx.wait(1);
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  }

  /**
   * Native BNB transfer (e.g. for BNB-denominated investments)
   */
  async transferBNB(recipient, amount) {
    if (!this.signer) await this.connectWallet();
    const value = ethers.parseEther(amount.toString());

    const tx = await this.signer.sendTransaction({
      to: recipient,
      value
    });
    const receipt = await tx.wait(1);
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  }

  /**
   * Admin: Pause RegalToken smart contract via MetaMask
   */
  async pauseContract() {
    if (!this.signer) await this.connectWallet();
    const contract = this.getRGLContract(this.signer);
    const tx = await contract.pause();
    const receipt = await tx.wait(1);
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  }

  /**
   * Admin: Unpause RegalToken smart contract via MetaMask
   */
  async unpauseContract() {
    if (!this.signer) await this.connectWallet();
    const contract = this.getRGLContract(this.signer);
    const tx = await contract.unpause();
    const receipt = await tx.wait(1);
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  }

  /**
   * Admin: Set Buy Rate on RegalToken contract via MetaMask
   */
  async setBuyRate(newBuyRate) {
    if (!this.signer) await this.connectWallet();
    const contract = this.getRGLContract(this.signer);
    const tx = await contract.setBuyRate(BigInt(newBuyRate));
    const receipt = await tx.wait(1);
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  }

  /**
   * Admin: Set Sell Rate on RegalToken contract via MetaMask
   */
  async setSellRate(newSellRate) {
    if (!this.signer) await this.connectWallet();
    const contract = this.getRGLContract(this.signer);
    const tx = await contract.setSellRate(BigInt(newSellRate));
    const receipt = await tx.wait(1);
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  }

  /**
   * Admin: Set Buy & Sell Rates on RegalToken contract via MetaMask
   */
  async setRates(newBuyRate, newSellRate) {
    if (!this.signer) await this.connectWallet();
    const contract = this.getRGLContract(this.signer);
    const tx = await contract.setRates(BigInt(newBuyRate), BigInt(newSellRate));
    const receipt = await tx.wait(1);
    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  }

  /**
   * Setup event listeners for MetaMask state changes
   */
  setupListeners(onAccountChange, onChainChange) {
    if (!this.isMetaMaskAvailable()) return;

    if (onAccountChange) {
      window.ethereum.on("accountsChanged", (accounts) => {
        onAccountChange(accounts.length > 0 ? accounts[0] : null);
      });
    }

    if (onChainChange) {
      window.ethereum.on("chainChanged", (chainIdHex) => {
        onChainChange(parseInt(chainIdHex, 16));
      });
    }
  }

  removeListeners() {
    if (!this.isMetaMaskAvailable()) return;
    try {
      window.ethereum.removeAllListeners("accountsChanged");
      window.ethereum.removeAllListeners("chainChanged");
    } catch (e) {}
  }
}

export const web3Service = new Web3Service();

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const BSC_CHAIN_ID = "0x38"; // 56 in hex

  try {
    // 1. Request accounts FIRST. This forces MetaMask to open and unlock.
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found in MetaMask.");
    }

    // 2. Now check what chain the user is on
    const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

    // 3. If not on BSC (56), prompt MetaMask to switch
    if (currentChainId !== BSC_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BSC_CHAIN_ID }]
        });
      } catch (switchError) {
        // 4. If BSC is not in MetaMask, add it automatically
        if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: BSC_CHAIN_ID,
                chainName: "BNB Smart Chain Mainnet",
                nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                blockExplorerUrls: ["https://bscscan.com/"]
              }
            ]
          });
        } else {
          throw switchError;
        }
      }
    }

    // Update internal service provider and signer
    try {
      web3Service.provider = new ethers.BrowserProvider(window.ethereum, "any");
      web3Service.signer = await web3Service.provider.getSigner(accounts[0]);
    } catch (e) {
      console.warn("[Web3Service] Provider setup warning:", e);
    }

    // 5. Return the connected account
    return accounts[0];
  } catch (error) {
    console.error("Connect error:", error);
    throw error;
  }
};

export default web3Service;
