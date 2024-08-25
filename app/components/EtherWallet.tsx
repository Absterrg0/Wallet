'use client';
import { useState } from "react";
import { mnemonicToSeedSync } from "bip39";
import { ethers } from "ethers";
import { HDNode } from "@ethersproject/hdnode";
import utils from 'ethers'
const ETHEREUM_RPC_URL = "https://eth-mainnet.g.alchemy.com/v2/5mtxHg6xy0-tWQJtwt7bGXB7wqKUZ7bt"; // Replace with your Alchemy API Key

interface EtherProps {
  mnemonic: string;
}

export default function EtherWallet({ mnemonic }: EtherProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState<{ address: string; privateKey: string; balance?: string }[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Initialize Ethereum provider
  const provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);

  const handleClick = async () => {
    try {
      const seed = mnemonicToSeedSync(mnemonic);
      const hdNode = HDNode.fromSeed(seed);
      const derivationPath = `m/44'/60'/${currentIndex}'/0/0`;
      const childNode = hdNode.derivePath(derivationPath);
      const wallet = new ethers.Wallet(childNode.privateKey, provider);

      // Fetch balance
      const balance = await fetchBalance(wallet.address);

      setCurrentIndex(currentIndex + 1);
      setWallets((prevWallets) => [
        ...prevWallets,
        { address: wallet.address, privateKey: wallet.privateKey, balance }
      ]);
    } catch (error) {
      console.error("Error generating Ethereum wallet:", error);
    }
  };

  const handleToggleDetails = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const fetchBalance = async (address: string) => {
    try {
      const balance = await provider.getBalance(address);
      return utils.formatEther(balance); // Convert from wei to ether
    } catch (error) {
      console.error("Error fetching balance:", error);
      return "0";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert("Copied to clipboard!"))
      .catch(err => console.error("Failed to copy: ", err));
  };

  return (
    <div className="bg-gray-800 p-4 rounded shadow">
      <div className="flex justify-end">
        <button
          className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-600"
          onClick={handleClick}
        >
          Add Wallet
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {wallets.map((wallet, index) => (
          <div key={index} className="bg-zinc-900 p-4 rounded relative">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleToggleDetails(index)}
            >
              <span className="text-gray-300 text-sm truncate">{wallet.address}</span>
              <svg
                className={`w-4 h-4 transition-transform ${expandedIndex === index ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {expandedIndex === index && (
              <div className="mt-2 p-4 text-gray-400 text-sm flex flex-col items-start">
                <div className="flex items-center">
                  <strong className="mr-2">Private Key:</strong>
                  <span className="text-gray-300 truncate">
                    {wallet.privateKey.slice(0, 30) + '...'}
                  </span>
                  <button
                    className="ml-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => copyToClipboard(wallet.privateKey)}
                  >
                    Copy
                  </button>
                </div>
                <div className="mt-2 text-gray-400 text-sm">
                  <strong>Balance:</strong> {wallet.balance} ETH
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
