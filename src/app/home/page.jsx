"use client";
import { FiEdit, FiEye, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { PiMagicWandFill } from "react-icons/pi";
import { CiCirclePlus } from "react-icons/ci";
import { useEffect, useState } from "react";
import OpenAI from "openai";
import { bgColors, formGenerationPrompt } from "../../utils/util";
import { v4 as uuidv4 } from "uuid";
import WeaveDB from "weavedb-sdk";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
	const [prompt, setPrompt] = useState("");

	const temp = () => {
		document.getElementById("my_modal_2").showModal();
		document.getElementById("my_modal_1").close();
	};

	const [generatingForm, setGeneratingForm] = useState(false);
	const [forms, setForms] = useState([]);

	const [db, setDB] = useState();

	const [loadingForms, setLoadingForms] = useState(true);

	const { address } = useAccount();

	const [userNotLoggedIn, setUserNotLoggedIn] = useState(false);

	const [responses, setResponses] = useState([]);

	const initDB = async () => {
		setLoadingForms(true);
		const db = new WeaveDB({
			contractTxId: "ExSUIcPw2dIpf81aN3H6wT6q19WspZ0oYQMPDrQI82g",
		});
		console.log("DB initing...")
		console.log(await db.init());
		console.log("Address is: " + address);

		if (address) {
			const responses = await db.cget("responses");
			setResponses(responses);
			setForms(await db.cget("forms", ["author"], ["author", "==", address.toLowerCase()]));
			setUserNotLoggedIn(false);
		} else {
			setUserNotLoggedIn(true);
		}
		setDB(db);
		setLoadingForms(false);
	};

	const generateForm = async () => {
		setGeneratingForm(true);
		const openai = new OpenAI({
			apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
			dangerouslyAllowBrowser: true,
		});

		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{ role: "system", content: formGenerationPrompt },
				{ role: "user", content: prompt },
			],
		});

		console.log("completion: ", completion);

		var data = JSON.parse(completion.choices[0].message.content);

		if (data) {
			//Save form to database
			const formId = uuidv4();
			const formData = {
				id: formId,
				author: db.signer(),
				title: data?.title,
				description: data?.description,
				fields: data?.fields,
				responses: 0,
			};

			const tx = await db.add(formData, "forms");
			console.log(tx);

			console.log("Saved to DB");

			document.getElementById("my_modal_1").close();

			setTimeout(() => {
				window.location.href = "/editor/" + formId;
			}, 5000);
		} else {
			console.log("Error generating form");
			s;
		}

		setGeneratingForm(false);
	};

	const [creatingForm, setCreatingForm] = useState(false);

	const createFormScratch = async () => {
		setCreatingForm(true);
		//Save form to database
		const formId = uuidv4();
		const formData = {
			id: formId,
			author: db.signer(),
			title: "Untitled form",
			description: "This is the description for the sample form",
			fields: [
				{ id: "a28b29", title: "Name", type: "text", required: true },
				{ id: "z2cx29", title: "Address", type: "longtext", required: true },
			],
			responses: 0,
		};

		const tx = await db.add(formData, "forms");
		console.log(tx);

		console.log("Saved to DB");

		setCreatingForm(false);

		document.getElementById("my_modal_1").close();

		setTimeout(() => {
			window.location.href = "/editor/" + formId;
		}, 5000);
	};

	useEffect(() => {
		initDB();
	}, []);

	useEffect(() => {
		console.log(forms);
	}, [forms]);

	useEffect(() => {
		if (!address) {
			window.location.href = "/";
		}
		initDB();
	}, [address]);

	return (
		<>
			<Navbar />
			<main className="container mx-auto pt-5 mb-20">
				{loadingForms ? (
					""
				) : userNotLoggedIn ? (
					<div className="flex flex-col">
						<p className="text-xl my-4 font-semibold mb-5">Connect your wallet to start creating forms.</p>
						<ConnectButton />
					</div>
				) : ""}
				{userNotLoggedIn ? (
					""
				) : loadingForms ? (
					<div>
						<span className="loading loading-spinner loading-lg"></span>
					</div>
				) : (
					<>
						<p className="text-xl my-4 mb-7 font-semibold">My forms ({forms.length})</p>
						<div className="flex flex-wrap">
							<div onClick={() => document.getElementById("my_modal_1").showModal()} className="hover:shadow-2xl duration-100 cursor-pointer border-2 flex flex-col min-h-[400px] min-w-[350px] mb-10 mr-10 rounded-3xl shadow-lg overflow-hidden">
								<div className="flex flex-col items-center justify-center w-full h-full">
									<CiCirclePlus className="h-40 w-40 mb-2" />
									<p>New Form</p>
								</div>
							</div>
							{
								forms?.map((form) => {
									return <div onClick={() => (window.location.href = "/editor/" + form?.data?.id)} className="hover:shadow-2xl duration-100 cursor-pointer border-2 flex flex-col min-h-[300px] min-w-[350px] mb-10 mr-10 rounded-3xl shadow-lg overflow-hidden">
										<div className={`w-full h-full bg-gradient-to-tl from-[` + bgColors[form?.data?.title.toString().toLowerCase()[0]][0] + `] to-[` + bgColors[form?.data?.title.toString().toLowerCase()[0]][1] + "]"}>
										</div>
										<div className="p-5 h-auto">
											<p className="font-semibold text-lg">{form?.data?.title}</p>
											<p>No responses</p>
										</div>
									</div>
								})
							}
						</div>
					</>
				)}
			</main>
			{/* Modals */}
			{/* modal 1 */}
			<dialog id="my_modal_1" className="modal">
				<div className="modal-box max-w-xl">
					<h3 className="font-bold text-2xl">Create form</h3>
					{creatingForm ? (
						"Creating form..."
					) : (
						<div className="flex mt-6 max-w-fulloverflow-hidden">
							<button className="flex flex-col btn min-h-[200px] w-[48%]" onClick={temp}>
								<PiMagicWandFill className="h-20 w-20" />
								using AI{" "}
							</button>
							<div className="w-[4%]"></div>
							<button className="flex flex-col btn min-h-[200px] w-[48%]" onClick={createFormScratch}>
								<FiEdit className="h-20 w-20" />
								from scratch
							</button>
						</div>
					)}
					<div className="modal-action">
						<form method="dialog">
							<button className="btn">Close</button>
						</form>
					</div>
				</div>
			</dialog>
			{/* modal 1 end */}
			{/* modal 2  */}

			{/* You can open the modal using document.getElementById('ID').showModal() method */}

			<dialog id="my_modal_2" className="modal">
				<div className="modal-box w-11/12 max-w-3xl">
					<form method="dialog">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
					</form>
					<h3 className="font-bold text-2xl">Create form using AI</h3>
					<textarea
						onChange={(x) => setPrompt(x.target.value)}
						placeholder="Tell us about your form..."
						className="my-5 textarea textarea-bordered textarea-lg min-h-[250px] w-full max-w-3xl"
					></textarea>
					<div className="modal-action mt-2 flex justify-center ">
						<button
							className={"btn btn-primary w-full " + (generatingForm ? "opacity-5" : "")}
							onClick={() => {
								if (generatingForm) {
									return;
								} else {
									generateForm();
								}
							}}
						>
							✨ Generate form
						</button>
					</div>
				</div>
			</dialog>
			<ToastContainer />
		</>
	);
}

export const dynamic = 'force-dynamic'