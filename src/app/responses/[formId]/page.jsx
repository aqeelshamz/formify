"use client";
import Navbar from "../../components/Navbar";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaRegFilePdf } from "react-icons/fa";

import { useEffect, useState } from "react";
import WeaveDB from "weavedb-sdk";
import Link from "next/link";
import { FiCopy } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home({ params: { formId } }) {
	// const temp = () => {
	//   document.getElementById("my_modal_2").showModal();
	//   document.getElementById("my_modal_1").close();
	// };

	const [form, setForm] = useState();

	const [loadingFormData, setLoadingFormData] = useState(true);

	const [db, setDB] = useState();

	const [responses, setResponses] = useState([]);

	const temp = () => { };

	const initDB = async () => {
		setLoadingFormData(true);
		const db = new WeaveDB({
			contractTxId: "oj9GzEHQDlK_VQfvGBKFXvyq_zDHdr5m8N0PAU8GysM",
		});
		await db.init();
		setDB(db);
		const responses = await db.cget("responses");
		setResponses(responses);
		console.log(responses);
		setForm((await db.get("forms", ["id", "==", formId]))[0]);
		console.log((await db.get("forms", ["id", "==", formId]))[0]);
		setLoadingFormData(false);
	};

	useEffect(() => {
		initDB();
	}, []);

	return (
		<>
			<Navbar />
			<div className="flex justify-between p-5">
				<div className="join">
					<Link href={"/editor/" + formId}><button className="join-item btn btn-lg">Editor</button></Link>
					<button className="join-item btn btn-primary btn-lg">Responses</button>
				</div>
				<div className="items-center flex p-2 bg-gray-200 rounded-xl">
					<p className="cursor-pointer underline text-lg px-3" onClick={() => window.open((new URL(window.location.href)).protocol + "//" + (new URL(window.location.href)).host + "/forms/" + formId)}>{(new URL(window.location.href)).protocol + "//" + (new URL(window.location.href)).host + "/forms/" + formId}</p>
					<button className="ml-2 btn btn-square btn-primary" onClick={() => {
						navigator.clipboard.writeText((new URL(window.location.href)).protocol + "//" + (new URL(window.location.href)).host + `/forms/${formId}`);
						toast.success("Copied to clipboard!");
					}}><FiCopy /></button>
				</div>
				<button className="btn btn-primary btn-lg">Export</button>
			</div>
			<>
				<main className="container mx-auto relative mt-6 ">
					{loadingFormData ? (
						<div>
							<span className="loading loading-spinner loading-lg"></span>
						</div>
					) : (
						<>
							<div className="border-black w-full border-b h-auto  p-3 pl-8 mb-10 pb-10">
								<div className="row1 title">
									<div className="">
										<span className="text-3xl font-bold ">
											Responses for &apos;{form?.title}&apos;
										</span>{" "}
									</div>
								</div>
							</div>

							<div className="overflow-x-auto">
								<table className="table table-lg table-pin-rows table-pin-cols">
									<thead>
										<tr>
											<th>No.</th>
											{form?.fields?.map((field, index) => {
												return <th key={index}>{field?.title}</th>;
											})}
										</tr>
									</thead>
									<tbody>
										{responses?.map((response, index) => {
											return (
												<tr key={index}>
													<td>{index + 1}</td>
													{Object.keys(response?.data?.answers)?.map((key, i) => {
														return (
															<td key={i}>
																{response?.data?.answers[key]
																	.toString()
																	.includes("https://") ? (
																	<Link
																		className="cursor-pointer underline text-blue-500"
																		href={response?.data?.answers[key]}
																		target="_blank"
																	>
																		Download
																	</Link>
																) : (
																	response?.data?.answers[key]
																)}
															</td>
														);
													})}
												</tr>
											);
										})}
									</tbody>
									{/* <tfoot>
                    <tr>
                      {form?.fields?.map((field) => {
                        return <th>{field?.title}</th>;
                      })}
                    </tr>
                  </tfoot> */}
								</table>
							</div>
						</>
					)}
				</main>
				<ToastContainer />
			</>

			{/* modal 1 */}
			<dialog id="my_modal_1" className="modal">
				<div className="modal-box max-w-xl">
					<h3 className="font-bold text-2xl">Create form</h3>
					<div className="flex mt-6 max-w-fulloverflow-hidden">
						<button
							className="flex flex-col btn min-h-[200px] w-[48%]  text-green-500 hover:bg-green-500 hover:border-white border-green-500 btn-outline"
							onClick={temp}
						>
							<PiMicrosoftExcelLogoFill className="h-20 w-20" />
							Excel
						</button>
						<div className="w-[4%]"></div>
						<button
							className="flex flex-col btn min-h-[200px] w-[48%]  text-red-500 hover:bg-red-500 hover:border-white border-red-500 btn-outline"
							onClick={() => {
								document.getElementById("my_modal_3").showModal();
							}}
						>
							<FaRegFilePdf className="h-20 w-20" />
							PDF
						</button>
					</div>
					<div className="modal-action">
						<form method="dialog">
							<button className="btn">Close</button>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
}
