"use client";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { PiMagicWandFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import OpenAI from "openai";
import { formGenerationPrompt } from "../../utils/util";
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
			contractTxId: "oj9GzEHQDlK_VQfvGBKFXvyq_zDHdr5m8N0PAU8GysMco",
		});
		await db.init();
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
				) : (
					<button
						className="btn btn-primary btn-lg mb-5"
						onClick={() => document.getElementById("my_modal_1").showModal()}
					>
						+ New Form
					</button>
				)}
				{userNotLoggedIn ? (
					""
				) : loadingForms ? (
					<div>
						<span className="loading loading-spinner loading-lg"></span>
					</div>
				) : (
					<>
						<p className="text-xl my-4 font-semibold">My forms ({forms.length})</p>
						<div className="overflow-x-auto">
							<table className="table table-zebra border">
								{/* head */}
								<thead>
									<tr className="text-[1.2rem]">
										<th></th>
										<th>Name</th>
										<th>Responses</th>
										<th>View</th>
										<th>Edit</th>
										<th>Delete</th>
									</tr>
								</thead>
								<tbody>
									{/* row 1 */}
									{forms?.map((form, index) => {
										return (
											<tr key={index}>
												<th>{index + 1}</th>
												<td className="font-semibold text-[1rem]">{form?.data?.title}</td>
												<td className="font-semibold text-[1rem]">
													{
														responses?.filter(
															(response) => response?.data?.formId === form?.data?.id
														).length
													}
												</td>
												<td>
													<button
														className="btn btn-square btn-outline"
														onClick={() => window.open("/forms/" + form?.data?.id)}
													>
														<FiEye className="h-6 w-6" />
													</button>
												</td>
												<td>
													<button
														className="btn btn-square btn-outline"
														onClick={() =>
															(window.location.href = "/editor/" + form?.data?.id)
														}
													>
														<FiEdit className="h-6 w-6" />
													</button>
												</td>
												<td>
													<button
														className="btn text-red-500 hover:bg-red-500 hover:border-white border-red-500 btn-outline"
														onClick={async () => {
															console.log(await db.delete("forms", form?.id));
															toast.success("Form deleted successfully!");
														}}
													>
														<FiTrash2 className="h-6 w-6" />
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
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
