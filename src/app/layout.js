import { Inter } from "next/font/google";
import "./globals.css";

import { WagmiConfig, configureChains } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { polygonMumbai } from "viem/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Formify AI",
	description: "Decentralized Intelligent AI Form Creator",
};

export default function RootLayout({ children }) {
	const { chains, publicClient } = configureChains(
		[polygonMumbai, sepolia],
		[alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
	);

	var wagmiConfig;

	return (
		<html lang="en" data-theme="light">
			<head>
				<title>Formify AI</title>
				<link rel="icon" href="/form.png" type="image/png" sizes="any" />
			</head>
			<body className={inter.className}>
				<WagmiConfig config={wagmiConfig} className="sticky top-0 z-50">
					<RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
				</WagmiConfig>
			</body>
		</html>
	);
}
