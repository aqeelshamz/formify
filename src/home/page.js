"use client";

import NavBar from "@/components/NavBar";
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
	const [generatingForm, setGeneratingForm] = useState(false);
	const [forms, setForms] = useState([]);
	const [db, setDB] = useState();
	const [loadingForms, setLoadingForms] = useState(true);
	const { address } = useAccount();
	const [userNotLoggedIn, setUserNotLoggedIn] = useState(false);
	const [responses, setResponses] = useState([]);
	const [creatingForm, setCreatingForm] = useState(false);

	const initDB = async () => {
		setLoadingForms(true);
		const db = new WeaveDB({ contractTxId: "7clkUU59LOKc7cavJ7qvLvGmA1m-I3tJ3T4-ycoDAnk" });
		await db.init();
		console.log(`Address is: ` + address);

		if (address) {
			const responses = await db.cget("responses");
			setResponses(responses);
			setForms(await db.cget("forms", ["author"], ["author", "==", address.toLowerCase]));
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
			<NavBar />
			<main className="container mx-auto pt-5 mb-20">
				{loadingForms ? (
					""
				) : userNotLoggedIn ? (
					<div className="flex flex-col">
						<p className="text-xl my-4 font-semibold mb-5">Connect your wallet to continue</p>
						<ConnectButton />
					</div>
				) : (
					<button className="btn btn-primary btn-lg mb-5">+ New Form</button>
				)}
				{userNotLoggedIn ? (
					""
				) : loadingForms ? (
					<div>
						<span className="loading loading-spinner loading-lg"></span>
					</div>
				) : (
					<>
						<p className="text-xl my-4 font-semibold">My forms</p>
						<div className="overflow-x-auto"></div>
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
													onClick={() => (window.location.href = "/editor/" + form?.data?.id)}
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
					</>
				)}
			</main>
		</>
	);
}
