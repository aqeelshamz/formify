"use client";
import Navbar from "../../components/Navbar";
import { FiEdit, FiTrash2, FiCopy, FiSave, FiPlusCircle } from "react-icons/fi";
import { FaRegFile } from "react-icons/fa";
import { TbPhone } from "react-icons/tb";
import { BsTextareaResize, BsCalendar2Date } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { BiSelectMultiple } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineShortText, MdOutlineNumbers, MdAttachMoney } from "react-icons/md";
import { useEffect, useState } from "react";
import WeaveDB from "weavedb-sdk";
import Link from "next/link";
import { bgColors } from "@/utils/util";

export default function Home({ params: { formId } }) {
	const temp = () => {
		document.getElementById("my_modal_2").showModal();
		document.getElementById("my_modal_1").close();
	};

	const [form, setForm] = useState();
	const [allForms, setAllForms] = useState();

	const [loadingFormData, setLoadingFormData] = useState(true);

	const [db, setDB] = useState();

	const [nftContractAddress, setNftContractAddress] = useState("");
	const [chain, setChain] = useState("polygon");

	const initDB = async () => {
		setLoadingFormData(true);
		const db = new WeaveDB({
			contractTxId: "oj9GzEHQDlK_VQfvGBKFXvyq_zDHdr5m8N0PAU8GysM",
		});
		await db.init();
		setDB(db);
		const form = (await db.get("forms", ["id", "==", formId]))[0];
		setNftContractAddress(form?.nftContractAddress);
		setChain(form?.chain);
		setForm(form);
		console.log((await db.get("forms", ["id", "==", formId]))[0]);
		setLoadingFormData(false);
		const allForms = await db.cget("forms");
		setAllForms(allForms);
	};

	useEffect(() => {
		initDB();
	}, []);

	const saveForm = async () => {
		// console.log(await db.update(form, "forms"));
		var docId = "";
		for (const form of allForms) {
			if (form?.data?.id === formId) {
				console.log(formId);
				console.log(form?.id);
				docId = form?.id;
			}
		}

		if (nftContractAddress !== "") {
			form.nftContractAddress = nftContractAddress;
			form.chain = chain;
		}

		console.log(await db.update(form, "forms", docId));
		toast.success("Form saved successfully!");
	};

	// const isContractIdValid = (contractId) => {
	//   if (!contractId || contractId.trim() === "") {
	//     return false;
	//   }
	//   const ethereumAddressRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
	//   return ethereumAddressRegExp.test(contractId);
	// };

	const deleteForm = async () => {
		var docId = "";
		for (const form of allForms) {
			if (form?.data?.id === formId) {
				console.log(formId);
				console.log(form?.id);
				docId = form?.id;
			}
		}

		console.log(await db.delete("forms", docId));
		toast.success("Form deleted successfully!");

		setTimeout(() => {
			window.location.href = "/home";
		}, 1500);
	};

	return (
		<>
			<Navbar />
			<div className="flex justify-between p-5">
				<div className="join">
					<button className="join-item btn btn-primary btn-lg">Editor</button>
					<Link href={"/responses/" + formId}><button className="join-item btn btn-lg">Responses</button></Link>
				</div>
				<div className="items-center flex p-2 bg-gray-200 rounded-xl">
					<p className="cursor-pointer underline text-lg px-3" onClick={() => window.open((new URL(window.location.href)).protocol + "//" + (new URL(window.location.href)).host + "/forms/" + formId)}>{(new URL(window.location.href)).protocol + "//" + (new URL(window.location.href)).host + "/forms/" + formId}</p>
					<button className="ml-2 btn btn-square btn-primary" onClick={() => {
						navigator.clipboard.writeText((new URL(window.location.href)).protocol + "//" + (new URL(window.location.href)).host + `/forms/${formId}`);
						toast.success("Copied to clipboard!");
					}}><FiCopy /></button>
				</div>
				<button className="btn btn-primary btn-lg" onClick={saveForm}><FiSave /> Save</button>
			</div>
			<main className="container mx-auto relative mt-6 ">
				{loadingFormData ? (
					<div>
						<span className="loading loading-spinner loading-lg"></span>
					</div>
				) : (
					<div className="flex flex-col">
						<div className="border-gray-300 w-full border-2 h-auto rounded-xl p-5 mb-5 flex flex-col">
							<span className="text-2xl font-semibold mb-5">🔑 Form Access Requirement</span>
							<label className="mb-2 text-md font-semibold">NFT Contract address</label>
							<input
								className="w-full input input-bordered"
								placeholder="NFT Contract Id"
								onChange={(e) => {
									setNftContractAddress(e.target.value);
								}}
								value={nftContractAddress}
								required
							></input>
							<label className="mt-5 mb-2 text-md font-semibold">Chain</label>
							<select
								className="select w-full input-bordered"
								onChange={(e) => {
									setChain(e.target.value);
								}}
								value={chain}
								required
							>
								<option value="polygon">Polygon</option>
								<option value="ethereum">Ethereum</option>
								<option value="sepolia">Sepolia</option>
							</select>
						</div>
						<div className="border-gray-300 w-full border-2 h-auto rounded-xl p-3 pl-8 mb-20 pb-20">
							<div className="row0 flex justify-end">
								<button
									onClick={deleteForm}
									className="btn  text-red-500 hover:bg-red-500 hover:border-white border-red-500 btn-outline"
								>
									<FiTrash2 className="h-6 w-6 " />
								</button>
							</div>
							<div className="row1 title">
								<div className="flex items-center gap-3">
									<span className="text-3xl font-bold ">📄 {form?.title}</span> <FiEdit />
								</div>
								<div className="flex items-center gap-3 mt-3">
									<span className="text-xl">{form?.description}</span> <FiEdit />
								</div>
							</div>
							<div className="inputs">
								{form?.fields?.map((field, index) => {
									return (
										<div className="inputrow" key={index}>
											<div className="flex items-center gap-3 mt-5">
												<label className="text-xl font-semibold">{field?.title}</label>
												<FiEdit />
											</div>
											<div className="flex items-center gap-3 mt-3">
												{field?.type === "multiplechoice" ? (
													<select
														className="w-full max-w-4xl select select-bordered"
														onChange={(e) => { }}
													>
														{field?.choices?.map((option, id) => {
															return <option key={id}>{option}</option>;
														})}
													</select>
												) : field?.type === "longtext" ? (
													<textarea
														disabled
														className="w-full max-w-4xl textarea textarea-bordered"
														placeholder={field?.title}
													></textarea>
												) : field?.type === "payment" ? (
													<button className="btn btn-primary">
														Pay {field?.amount} MATIC
													</button>
												) : (
													<input
														disabled
														className="w-full max-w-4xl input input-bordered"
														type={field?.type}
														placeholder={field?.title}
													/>
												)}
												<button
													className="btn btn-sm h-[45px] w-[45px] btn-square btn-outline"
													onClick={() => {
														//remove field from form
														form.fields.splice(index, 1);
														setForm({ ...form });
													}}
												>
													<FiTrash2 />
												</button>
											</div>
										</div>
									);
								})}
							</div>
							<button
								className="btn mt-10 mb-5 btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-black hover:bg-gray-700  text-white w-96 lg:w-[896px]"
								onClick={() => document.getElementById("my_modal_1").showModal()}
							>
								<FiPlusCircle /> Add Content
							</button>
						</div>
					</div>
				)}
			</main>
			{/* Modals */}
			{/* modal 1 */}
			<dialog id="my_modal_1" className="modal">
				<div className="modal-box max-w-[950px] max-h-[450px]">
					<h3 className="font-bold text-2xl">Choose form input</h3>
					<div className="flex flex-wrap mt-6 gap-5 text-2xl max-w-full overflow-hidden">
						<button className="flex btn btn-outline  w-[271px] h-[69px] " onClick={() => {
							form.fields.push({
								title: "Text Question",
								type: "text",
							});
							setForm({ ...form });
							document.getElementById("my_modal_1").close();
						}}>
							<MdOutlineShortText size={28} />
							Text
						</button>
						<button className="flex btn btn-outline  w-[271px] h-[69px] " onClick={() => {
							form.fields.push({
								title: "Long text Question",
								type: "long-text",
							});
							setForm({ ...form });
							document.getElementById("my_modal_1").close();
						}}>
							<BsTextareaResize size={28} />
							Long text
						</button>
						<button className="flex btn btn-outline  w-[271px] h-[69px] " onClick={() => {
							form.fields.push({
								title: "Email",
								type: "email",
							});
							setForm({ ...form });
							document.getElementById("my_modal_1").close();
						}}>
							<HiOutlineMail size={28} />
							Email
						</button>
						<button className="flex btn btn-outline  w-[271px] h-[69px] " onClick={() => {
							form.fields.push({
								title: "Multiple Choice Question",
								type: "multiple-choice",
								choices: ["Option 1", "Option 2", "Option 3"],
							});
							setForm({ ...form });
							document.getElementById("my_modal_1").close();
						}}>
							<BiSelectMultiple size={28} />
							Multiple Choice
						</button>
						<button className="flex btn btn-outline  w-[271px] h-[69px] " onClick={() => {
							form.fields.push({
								title: "Number Question",
								type: "number",
							});
							setForm({ ...form });
							document.getElementById("my_modal_1").close();
						}}>
							<MdOutlineNumbers size={28} />
							Number
						</button>
						<button className="flex btn btn-outline  w-[271px] h-[69px] " onClick={() => {
							form.fields.push({
								title: "Date",
								type: "date",
							});
							setForm({ ...form });
							document.getElementById("my_modal_1").close();
						}}>
							<BsCalendar2Date size={25} />
							Date
						</button>
						<button className="flex btn btn-outline  w-[271px] h-[69px] " onClick={() => {
							form.fields.push({
								title: "File Upload",
								type: "file",
							});
							setForm({ ...form });
							document.getElementById("my_modal_1").close();
						}}>
							<FaRegFile size={25} />
							File
						</button>
						<button className="flex btn btn-outline  w-[271px] h-[69px] " onClick={() => {
							form.fields.push({
								title: "Phone Number",
								type: "phone",
							});
							setForm({ ...form });
							document.getElementById("my_modal_1").close();
						}}>
							<TbPhone size={24} />
							Phone
						</button>
						<button className="flex btn btn-outline  w-[271px] h-[69px] " onClick={() => {
							form.fields.push({
								title: "Payment",
								type: "payment",
								amount: 0.005,
							});
							setForm({ ...form });
							document.getElementById("my_modal_1").close();
						}}>
							<MdAttachMoney size={27} className="-mt-1" />
							Cash
						</button>
					</div>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn">Close</button>
						</form>
					</div>
				</div>
			</dialog>
			<ToastContainer />
		</>
	);
}
