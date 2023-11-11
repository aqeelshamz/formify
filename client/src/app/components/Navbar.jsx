"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import "@rainbow-me/rainbowkit/styles.css";
import { AiFillCheckCircle } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";

function Navbar() {
	return (
		<div className="pb-[80px]">
			<div className="z-50 fixed navbar backdrop-filter backdrop-blur-lg bg-opacity-30  bg-base-100 flex justify-between top-30 z-54">
				<Link href={"/home"} className="btn btn-ghost normal-case font-bold text-2xl">
					<FiFileText/> Formify AI
				</Link>
				<div className="m-2">
					<button className="btn btn-primary mr-5" onClick={() => document.getElementById('my_modal_x').showModal()}>🚀 Go Premium</button>
					<ConnectButton />
				</div>
			</div>
			{/* Premium Modal */}
			<dialog id="my_modal_x" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-2xl">🚀 Go Premium!</h3>
					<p className="py-4 font-semibold text-xl">Enjoy premium features for just $49/month!</p>
					<div className="flex items-center text-xl my-7"><AiFillCheckCircle className="mr-2 text-green-500" /> Create unlimited forms</div>
					<div className="flex items-center text-xl my-7"><AiFillCheckCircle className="mr-2 text-green-500" /> Accept response from unlimited users</div>
					<div className="flex items-center text-xl my-7"><AiFillCheckCircle className="mr-2 text-green-500" /> File upload size limit upto 1GB</div>
					<div className="flex items-center text-xl my-7"><AiFillCheckCircle className="mr-2 text-green-500" /> Accept unlimited amount of crypto payment</div>
					<div className="modal-action mt-10 flex justify-center ">
						<button
							className={"btn btn-lg btn-primary w-full"}
							onClick={() => document.getElementById('my_modal_x').close()}
						>
							Upgrade now 🚀
						</button>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
}

export default Navbar;
