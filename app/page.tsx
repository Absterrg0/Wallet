import Image from "next/image";
import NavBar from "./components/navbar";
import Mnemonic from "./components/mnemonicgenerate";
import BlockChain from "./components/blockchains";
export default function Home() {
  return (
      <div>
          <NavBar></NavBar>
          <BlockChain></BlockChain>
      </div>
  );
}
