"use client";

import { useState } from "react";
import {
  TokenCreateTransaction,
  TokenMintTransaction,
  TokenSupplyType,
  TokenType,
  Hbar,
  Client,
  PrivateKey,
  AccountId,
} from "@hashgraph/sdk";
import dotenv from "dotenv";
dotenv.config();

const HederaPage = () => {
  const [isMinting, setIsMinting] = useState(false);

  const mintNFT = async () => {
    setIsMinting(true);

    const myAccountId = process.env.NEXT_PUBLIC_MY_ACCOUNT_ID;
    const myPrivateKey = process.env.NEXT_PUBLIC_MY_PRIVATE_KEY;

    const client = Client.forTestnet();

    //Set your account as the client's operator
    client.setOperator(myAccountId, myPrivateKey);

    //Set the default maximum transaction fee (in Hbar)
    client.setDefaultMaxTransactionFee(new Hbar(100));

    //Set the maximum payment for queries (in Hbar)
    client.setMaxQueryPayment(new Hbar(50));

    // If we weren't able to grab it, we should throw a new error
    if (!myAccountId || !myPrivateKey) {
      throw new Error(
        "Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present"
      );
    }

    const treasuryKey = PrivateKey.generate();
    const supplyKey = PrivateKey.generate();

    const treasuryId = AccountId.fromString(
      process.env.NEXT_PUBLIC_MY_ACCOUNT_ID
    );

    // Create a new token
    //Create the NFT
    const nftCreate = await new TokenCreateTransaction()
      .setTokenName("diploma")
      .setTokenSymbol("GRAD")
      .setTokenType(TokenType.NonFungibleUnique)
      .setDecimals(0)
      .setInitialSupply(0)
      .setTreasuryAccountId(treasuryId)
      .setSupplyType(TokenSupplyType.Finite)
      .setMaxSupply(250)
      .setSupplyKey(supplyKey)
      .freezeWith(client);

    //Sign the transaction with the treasury key
    const nftCreateTxSign = await nftCreate.sign(treasuryKey);

    //Submit the transaction to a Hedera network
    const nftCreateSubmit = await nftCreateTxSign.execute(client);

    //Get the transaction receipt
    const nftCreateRx = await nftCreateSubmit.getReceipt(client);

    //Get the token ID
    const tokenId = nftCreateRx.tokenId;

    //Log the token ID
    console.log(`- Created NFT with Token ID: ${tokenId} \n`);

    // Max transaction fee as a constant
    const maxTransactionFee = new Hbar(20);

    // const data = await fetch(
    //   "https://bafybeidyp5tc6vfjsis7rziok4o6j6ckjajpug4wceavcyujm6bsiqqk4m.ipfs.dweb.link/"
    // );
    // const json = await data.json();


    //IPFS content identifiers for which we will create a NFT
    const CID = [
      Buffer.from(
        "https://bafybeidyp5tc6vfjsis7rziok4o6j6ckjajpug4wceavcyujm6bsiqqk4m.ipfs.dweb.link/"
      ),
    ];

    // MINT NEW BATCH OF NFTs
    const mintTx = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata(CID) //Batch minting - UP TO 10 NFTs in single tx
      .setMaxTransactionFee(maxTransactionFee)
      .freezeWith(client);

    //Sign the transaction with the supply key
    const mintTxSign = await mintTx.sign(supplyKey);

    //Submit the transaction to a Hedera network
    const mintTxSubmit = await mintTxSign.execute(client);

    //Get the transaction receipt
    const mintRx = await mintTxSubmit.getReceipt(client);

    //Log the serial number
    console.log(
      `- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`
    );
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
