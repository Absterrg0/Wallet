"use client";
import { generateMnemonic } from "bip39";

interface MnemonicProps {
  setMnemonic: (mnemonic: string) => void;
}

export default function Mnemonic({ setMnemonic }: MnemonicProps) {
  const handleClick = () => {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic); // Pass the generated mnemonic to the parent component
    console.log(mnemonic);
  };

  return (
    <div className=" text-white bg-black flex flex-col items-center">
      <div className="flex justify-center items-center">
        <button className="p-3 m-3 bg-zinc-500 text-white rounded" onClick={handleClick}>
          Generate Seed Phrase
        </button>
      </div>
    </div>
  );
}
