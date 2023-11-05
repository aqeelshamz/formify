"use client";

import { useState } from "react";
import { environmentSetup } from "@/utils/hedera";
import {
  TokenCreateTransaction,
  TokenMintTransaction,
  TokenSupplyType,
} from "@hashgraph/sdk";

const HederaPage = () => {
  const [isMinting, setIsMinting] = useState(false);

  const mintNFT = async () => {
    setIsMinting(true);
    const client = await environmentSetup();

    // Create a new token
    const tokenCreateTx = await new TokenCreateTransaction()
      .setTokenName("My First Token")
      .setTokenSymbol("MFT")
      .setDecimals(0)
      .setInitialSupply(0)
      .setTreasuryAccountId(client.operatorAccountId)
      .setSupplyType(TokenSupplyType.INFINITE)
      .execute(client);

    // Get the receipt of the transaction
    const tokenCreateReceipt = await tokenCreateTx.getReceipt(client);

    const tokenId = tokenCreateReceipt.tokenId;

    console.log("Token ID:", tokenId.toString());
  };

  return (
    <div className="h-screen p-5 w-screen ">
      <h1>Hedera</h1>
      <button className="btn btn-square" onClick={mintNFT} disabled={isMinting}>
        Mint NFT
      </button>
    </div>
  );
};

export default HederaPage;
