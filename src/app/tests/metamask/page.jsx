"use client";

import { useState } from "react";
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

export default function Metamask() {

  const [user, setUser] = useState();

  const connectWallet = async () => {
    if (window.ethereum == null) {
      alert("Install MetaMask");
    }
    else {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setUser(accounts[0]);
    }
  }

  const { chains, publicClient } = configureChains(
    [polygon],
    [
      alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
      publicProvider()
    ]
  );
  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: 'a938bee08643184fb038b8deec30437f',
    chains
  });
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })

  return (

    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div className="m-5">
         <ConnectButton/>

        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  ) 
}
