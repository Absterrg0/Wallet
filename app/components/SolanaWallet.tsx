'use client';
import { useState, useEffect } from "react";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";  // Install this package for Base58 encoding/decoding
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key"; // Use a secure method to store and manage your secret key
const SOLANA_RPC_URL = "https://solana-mainnet.g.alchemy.com/v2/5mtxHg6xy0-tWQJtwt7bGXB7wqKUZ7bt"; // Adjust the URL as needed

interface SolanaProps {
  mnemonic: string;
}

export default function Solana({ mnemonic }: SolanaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState<{ publicKey: string; encryptedSecretKey: string; balance?: number }[]>([]);
  const [expandedKey, setExpandedKey] = useState<number | null>(null);

  // Initialize Solana connection
  const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

  const handleClick = () => {
    try {
      const seed = mnemonicToSeedSync(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const keypair = Keypair.fromSecretKey(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey);
      
      // Encode the private key in Base58 for consistency
      const privateKeyBase58 = bs58.encode(keypair.secretKey);

      // Encrypt the Base58 encoded private key
      const encryptedSecretKey = CryptoJS.AES.encrypt(privateKeyBase58, SECRET_KEY).toString();

      // Fetch the balance
      fetchBalance(keypair.publicKey.toBase58()).then(balance => {
        setCurrentIndex(currentIndex + 1);
        setPublicKeys((prevKeys) => [
          ...prevKeys,
          { publicKey: keypair.publicKey.toBase58(), encryptedSecretKey, balance }
        ]);
      }).catch(error => {
        console.error("Error fetching balance:", error);
      });
    } catch (error) {
      console.error("Error generating Solana wallet:", error);
    }
  };

  const handleToggleDetails = (index: number) => {
    setExpandedKey(expandedKey === index ? null : index);
  };

  const decryptSecretKey = (encryptedSecretKey: string) => {
    try {
      // Decrypt the encrypted secret key
      const bytes = CryptoJS.AES.decrypt(encryptedSecretKey, SECRET_KEY);
      
      // Convert the decrypted bytes to a UTF-8 string
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  
      // Decode the Base58 encoded string to a byte array
      const decoded = bs58.decode(decryptedText);
  
      // Convert the byte array to a hex string
      return Buffer.from(decoded).toString('hex');
    } catch (error) {
      console.error("Error decrypting secret key:", error);
      return "Error decrypting key";
    }
  };

  const fetchBalance = async (publicKey: string) => {
    try {
      const balance = await connection.getBalance(new PublicKey(publicKey));
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error("Error fetching balance:", error);
      return 0;
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
        {publicKeys.map((key, index) => (
          <div key={index} className="bg-zinc-900 p-4 rounded relative">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleToggleDetails(index)}
            >
              <span className="text-gray-300 text-sm truncate">{key.publicKey}</span>
              <svg
                className={`w-4 h-4 transition-transform ${expandedKey === index ? "rotate-180" : "rotate-0"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {expandedKey === index && (
              <div className="mt-2 p-4 text-gray-400 text-sm flex flex-col items-start">
                <div className="flex items-center">
                  <strong className="mr-2">Private Key:</strong>
                  <span className="text-gray-300 truncate">
                    {decryptSecretKey(key.encryptedSecretKey).slice(0, 30) + '...'}
                  </span>
                  <button
                    className="ml-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => copyToClipboard(decryptSecretKey(key.encryptedSecretKey))}
                  >
                    Copy
                  </button>
                </div>
                <div className="mt-2 text-gray-400 text-sm">
                  <strong>Balance:</strong> {key.balance} SOL
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
