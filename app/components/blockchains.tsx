"use client"
import { useState } from "react";
import Solana from "./SolanaWallet";
import Mnemonic from "./mnemonicgenerate";
import Card from "./ui/card";
import EtherWallet from "./EtherWallet";

export default function BlockChain() {
  const [mnemonic, setMnemonic] = useState<string>("");

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center">
      <Mnemonic setMnemonic={setMnemonic} />
      {mnemonic && (
        <div className="grid grid-cols-6 gap-4 mt-4">
          {mnemonic.split(" ").map((word, index) => (
            <Card key={index} word={word} />
          ))}
        </div>
      )}
      
      {/* Grid container for Solana and Ethereum wallets */}
      {mnemonic && (
        <div className="grid grid-cols-2 gap-8 mt-8 w-full px-8">
          {/* Solana Wallet - Left Side */}
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl mb-4 flex justify-center">Solana Wallets</h2>
            <Solana mnemonic={mnemonic} />
          </div>

          {/* Ethereum Wallet - Right Side */}
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl mb-4 items-center justify-center flex">Ethereum Wallets</h2>
            <EtherWallet mnemonic={mnemonic} />
          </div>
        </div>
      )}
    </div>
  );
}
