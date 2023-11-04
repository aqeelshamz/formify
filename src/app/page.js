"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Home() {
	const router = useRouter();
	const { address } = useAccount();

	const [domLoaded, setDomLoaded] = useState(false);

	useEffect(() => {
		setDomLoaded(true);
	}, []);

	return (
		<main className="relative flex justify-start items-center h-[100vh] overflow-hidden bg-gradient-to-tr from-blue-100  to-blue-100">
			<div className="backdrop-filter backdrop-blur-lg">
				<div className="flex">
					<h1 className="ml-20 relative text-black text-8xl font-bold">Formify</h1>
					<div className="bg-black p-5 ml-5 rounded-3xl">
						<h1 className="text-7xl font-bold text-white">AI</h1>
					</div>
				</div>
				<p className="text-black mt-5 text-2xl ml-20">An intelligent form creator for Web3</p>
				{domLoaded ? (
					<div className="ml-20 mt-10">
						{address ? (
							<button
								className="btn bg-black text-white text-xl hover:border-black hover:bg-opacity-0 hover:text-black border-black"
								onClick={() => router.push("/home")}
							>
								Get Started
							</button>
						) : (
							<ConnectButton />
						)}
					</div>
				) : (
					""
				)}
			</div>
		</main>
	);
}
