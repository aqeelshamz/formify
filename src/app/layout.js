"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { getDefaultWallets, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const { chains, publicClient } = configureChains(
    [polygonMumbai, sepolia],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
  );

  var wagmiConfig;

  try {
    const { connectors } = getDefaultWallets({
      appName: "intelliform",
      projectId: "a938bee08643184fb038b8deec30437f",
      chains,
    });
    wagmiConfig = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    });
  } catch (err) {
    // console.log(err);
  }

  return (
    <html lang="en" data-theme="light">
      <head>
        <title>IntelliForm</title>
        <link rel="icon" href="/form.png" type="image/png" sizes="any" />
      </head>
      <body className={inter.className}>
        <WagmiConfig config={wagmiConfig} className="sticky top-0 z-50">
          <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </WagmiConfig >
      </body>
    </html>
  );
}
