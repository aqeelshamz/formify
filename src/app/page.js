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
    <main className="relative flex justify-start items-center h-[100vh] overflow-hidden bg-gradient-to-tl  from-blue-500 to-blue-100">
      <div>
        <h1 className="ml-20 relative text-black text-8xl font-bold">
          IntelliForm
        </h1>
        <p className="text-black mt-5 text-2xl ml-20">
          An intelligent form creator for Web3
        </p>
        {domLoaded ? (
          <div className="ml-20 mt-10">
            {address ? (
              <button
                className="btn btn-primary text-xl"
                onClick={() => router.push("/home")}
              >
                ⚡️ Get Started
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
