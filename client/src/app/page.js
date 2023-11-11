"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
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
    <main className="flex items-center w-[100vw] h-[100vh] overflow-hidden bg-gradient-to-tr from-[#dcd4ff] to-[#bdaeff]">
      <div className="backdrop-filter backdrop-blur-lg">
        <div className="flex">
          <h1 className="ml-20 relative text-black text-9xl font-bold">Formify</h1>
          <div className="bg-black p-5 ml-5 rounded-3xl">
            <h1 className="font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-[#ffcadf] to-[#c889ff]">AI</h1>
          </div>
        </div>
        <p className="text-black mt-5 text-3xl ml-20">An intelligent form creator for Web3</p>
        {domLoaded ? (
          <div className="ml-20 mt-10">
            {address ? (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => router.push("/home")}
              >
                Get Started
              </button>
            ) : (
              <ConnectButton />
            )}
          </div>
        ) : (
          <div className="ml-20 mt-10">
            <button
              className={"btn btn-primary btn-lg " + (domLoaded ? "" : "opacity-50")}
            >
              Get Started
            </button>
          </div>
        )}
        <div className="mt-20 flex ml-20">
          <div className="card w-96 backdrop-filter backdrop-blur-lg bg-opacity-30  bg-base-100 border-b border-gray-200 mr-2">
            <div className="card-body">
              <h2 className="card-title mb-5">📄 Forms</h2>
              <p className="font-semibold">🤖 AI-Generated Forms</p>
              <p className="font-semibold">⏰ Save time on form creation</p>
              <p className="font-semibold">🎯 Tailor forms to your specific needs</p>
            </div>
          </div>
          <div className="card w-96 backdrop-filter backdrop-blur-lg bg-opacity-30  bg-base-100 border-b border-gray-200 mr-2">
            <div className="card-body">
              <h2 className="card-title mb-5">📅 Events</h2>
              <p className="font-semibold">📲 Simplify event sign-ups</p>
              <p className="font-semibold">🔑 Access Validation using NFT</p>
              <p className="font-semibold">🎁 NFT Reward System (Future)</p>
            </div>
          </div>
          <div className="card w-96 backdrop-filter backdrop-blur-lg bg-opacity-30  bg-base-100 border-b border-gray-200 mr-2">
            <div className="card-body">
              <h2 className="card-title mb-5">👥 Surveys</h2>
              <p className="font-semibold">🔐 Immutable data</p>
              <p className="font-semibold">🌟 Collect honest feedback</p>
              <p className="font-semibold">🤝 Maintain trust in your survey data</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto">
        <Image src={"/forms.png"} width={500} height={500} />
      </div>
    </main>
  );
}
