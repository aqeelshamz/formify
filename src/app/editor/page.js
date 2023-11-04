import NavBar from "@/components/NavBar";
import Link from "next/link";
import { FiChevronLeft, FiCopy } from "react-icons/fi";

export default function Editor() {
  return (
    <div>
      {/* <NavBar /> */}
      <div className="items-center justify-between flex w-full p-7">
        <Link href={"/home"}><h1 className="flex items-center cursor-pointer font-semibold text-2xl"><FiChevronLeft className="mr-2" /> Sample Form</h1></Link>
        <div className="bg-gray-200 py-1 pl-3 pr-1 rounded-xl">https://formify.io/forms/1234567890 <button className="btn btn-primary ml-3"><FiCopy/></button></div>
        <button className="btn btn-primary btn-lg">Save</button>
      </div>
      <div className="w-full h-full bg-violet-200">
        {/* left */}
        <div></div>
        {/* main */}
        <div>
        sss
        </div>
        {/* right */}
        <div></div>
      </div>
    </div>
  )
}
