"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import "@rainbow-me/rainbowkit/styles.css";

function Navbar() {
	return (
		<div className="pb-[80px]">
			<div className="z-50 fixed navbar backdrop-filter backdrop-blur-lg bg-opacity-30  bg-base-100 flex justify-between border-b border-gray-200 top-30 z-54">
				<Link href={"/home"} className="btn btn-ghost normal-case font-bold text-2xl">
					Formify AI
				</Link>
				<div className="m-2">
					<ConnectButton />
				</div>
			</div>
		</div>
	);
}

export default Navbar;
