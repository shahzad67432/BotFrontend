"use client"
import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, CheckCircle, X, Loader, AlertCircle, ExternalLink } from 'lucide-react';

// Types
interface UserProfile {
  credits: number;
  email: string;
}

type WalletType = 'metamask' | 'phantom' | 'coinbase' | 'walletconnect';

// Multi-Chain Credit Purchase Component
const Web3CreditPurchase = ({ profile, onSuccess }: { profile: UserProfile | null, onSuccess: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallets are installed
  const detectWallets = () => {
    return {
      metamask: typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask,
      phantom: typeof window.solana !== 'undefined' && window.solana.isPhantom,
      coinbase: typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet,
    };
  };

  const [availableWallets, setAvailableWallets] = useState(detectWallets());

  useEffect(() => {
    setAvailableWallets(detectWallets());
  }, []);

  // Connect MetaMask (Ethereum)
  const connectMetaMask = async () => {
    setIsConnecting(true);
    setError(null);
    setWalletType('metamask');

    try {
      if (typeof window.ethereum === 'undefined') {
        setError('MetaMask is not installed');
        setIsConnecting(false);
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        await updateCreditsInBackend(accounts[0], 'ethereum', null);
      }
    } catch (err: any) {
      console.error('Error connecting MetaMask:', err);
      if (err.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError('Failed to connect MetaMask');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect Phantom (Solana)
  const connectPhantom = async () => {
    setIsConnecting(true);
    setError(null);
    setWalletType('phantom');

    try {
      if (typeof window.solana === 'undefined') {
        setError('Phantom Wallet is not installed');
        setIsConnecting(false);
        return;
      }

      const response = await window.solana.connect();
      const address = response.publicKey.toString();
      
      if (address) {
        setWalletAddress(address);
        await updateCreditsInBackend(address, 'solana', null);
      }
    } catch (err: any) {
      console.error('Error connecting Phantom:', err);
      if (err.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError('Failed to connect Phantom Wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect Coinbase Wallet
  const connectCoinbase = async () => {
    setIsConnecting(true);
    setError(null);
    setWalletType('coinbase');

    try {
      if (typeof window.ethereum === 'undefined' || !window.ethereum.isCoinbaseWallet) {
        setError('Coinbase Wallet is not installed');
        setIsConnecting(false);
        return;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        await updateCreditsInBackend(accounts[0], 'ethereum', null);
      }
    } catch (err: any) {
      console.error('Error connecting Coinbase:', err);
      if (err.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError('Failed to connect Coinbase Wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    if (walletType === 'phantom' && window.solana) {
      window.solana.disconnect();
    }
    setWalletAddress(null);
    setWalletType(null);
  };

  const updateCreditsInBackend = async (address: string, chain: string, txHash: string | null) => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No auth token');

    try {
      const response = await fetch('http://127.0.0.1:5000/update-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          walletAddress: address,
          chain,
          credits: 10,
          txHash: txHash || `wallet_connect_${Date.now()}`, // Temporary identifier
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update credits');
      }

      const data = await response.json();
      
      // Success - close modal and notify
      setTimeout(() => {
        onSuccess();
        setIsModalOpen(false);
        setWalletAddress(null);
        setWalletType(null);
      }, 2000);

      return data;
    } catch (error) {
      console.error('Error updating credits:', error);
      throw error;
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getWalletIcon = (type: WalletType) => {
    switch (type) {
      case 'metamask':
        return '🦊';
      case 'phantom':
        return '👻';
      case 'coinbase':
        return '💙';
      default:
        return '💼';
    }
  };

  const openWalletDownload = (type: WalletType) => {
    const urls = {
      metamask: 'https://metamask.io/download/',
      phantom: 'https://phantom.app/',
      coinbase: 'https://www.coinbase.com/wallet',
      walletconnect: 'https://walletconnect.com/',
    };
    window.open(urls[type], '_blank');
  };

  return (
    <>
      {/* Purchase Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-100 flex items-center justify-center gap-2 border-2 ${
          profile?.credits > 0
            ? "bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] text-white"
            : "bg-gradient-to-b from-gray-100 to-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
        }`}
      >
        <CreditCard size={18} />
        Get More Credits
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Get More Credits</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setError(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Offer Details */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-3">
                    <Sparkles className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">10 Credits</h3>
                  <p className="text-sm text-gray-600">Connect any wallet to claim</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Your Credits</span>
                    <span className="text-xl font-bold text-purple-600">
                      {profile?.credits || 0} → {(profile?.credits || 0) + 10}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Connection */}
              {!walletAddress ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium">
                      Connect any wallet to receive 10 credits instantly!
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      Choose Your Wallet
                    </h3>

                    {/* MetaMask */}
                    <button
                      onClick={availableWallets.metamask ? connectMetaMask : () => openWalletDownload('metamask')}
                      disabled={isConnecting}
                      className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 flex items-center justify-between group disabled:opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                          🦊
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">MetaMask</p>
                          <p className="text-xs text-gray-600">Ethereum & EVM chains</p>
                        </div>
                      </div>
                      {availableWallets.metamask ? (
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                          Installed
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-purple-600 text-sm font-medium">
                          Install <ExternalLink size={14} />
                        </div>
                      )}
                    </button>

                    {/* Phantom */}
                    <button
                      onClick={availableWallets.phantom ? connectPhantom : () => openWalletDownload('phantom')}
                      disabled={isConnecting}
                      className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 flex items-center justify-between group disabled:opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                          👻
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">Phantom</p>
                          <p className="text-xs text-gray-600">Solana & multi-chain</p>
                        </div>
                      </div>
                      {availableWallets.phantom ? (
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                          Installed
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-purple-600 text-sm font-medium">
                          Install <ExternalLink size={14} />
                        </div>
                      )}
                    </button>

                    {/* Coinbase Wallet */}
                    <button
                      onClick={availableWallets.coinbase ? connectCoinbase : () => openWalletDownload('coinbase')}
                      disabled={isConnecting}
                      className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 flex items-center justify-between group disabled:opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                          💙
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">Coinbase Wallet</p>
                          <p className="text-xs text-gray-600">Multi-chain support</p>
                        </div>
                      </div>
                      {availableWallets.coinbase ? (
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                          Installed
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-purple-600 text-sm font-medium">
                          Install <ExternalLink size={14} />
                        </div>
                      )}
                    </button>
                  </div>

                  {isConnecting && (
                    <div className="flex items-center justify-center gap-2 py-4">
                      <Loader className="animate-spin text-purple-600" size={20} />
                      <span className="text-sm text-gray-600">Connecting wallet...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Connected Wallet */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getWalletIcon(walletType!)}</span>
                        <span className="text-sm font-medium text-green-800">Wallet Connected</span>
                      </div>
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                    <p className="text-gray-900 font-mono text-sm mb-4 bg-white/60 px-3 py-2 rounded-lg">
                      {formatAddress(walletAddress)}
                    </p>
                    <button
                      onClick={disconnectWallet}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Disconnect Wallet
                    </button>
                  </div>

                  {/* Success Message */}
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Credits Added!</h3>
                    <p className="text-gray-600 mb-4">
                      10 credits have been added to your account
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg">
                      <Sparkles className="text-purple-600" size={20} />
                      <span className="font-bold text-gray-900">
                        Total Credits: {(profile?.credits || 0) + 10}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">
                  How it works
                </h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <p className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">1.</span>
                    Connect your preferred crypto wallet
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">2.</span>
                    Credits are instantly added to your account
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">3.</span>
                    Start sending emails right away
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <strong>Supported:</strong> MetaMask, Phantom, Coinbase Wallet, and more
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Add Sparkles icon component
const Sparkles = ({ className, size }: { className?: string, size?: number }) => (
  <svg
    className={className}
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" />
  </svg>
);

export default Web3CreditPurchase;