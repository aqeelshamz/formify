"use client";
import { ethers, Contract } from "ethers";
import { useEffect, useState } from "react";
import Payable_abi from "../../../utils/abi.json"
import Navbar from "../../components/Navbar";

export default function Test() {
  const [contract, setContract] = useState();

  const updateContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract("0xB28cbafcb69d18ad60Efe4E6183f02800C2e33FB", Payable_abi, signer);
    setContract(contract);na
    console.log("Contract loaded: ", contract);
  }

  useEffect(() => {
    updateContract();
  }, []);

  const pay = ()=>{
    const options = {value: ethers.parseEther("0.0001")};
    contract.register("0x179dad1E22CF3d6f90c43b2936072D121619cE43", options).then((res)=>{
      console.log(res);
    });
  }

  return (
    <div>
      <Navbar />
      <h1>Payable</h1>
      <button className="btn btn-primary" onClick={()=>{
        pay()
      }}>Pay 0.0003 MATIC</button>
    </div>
  )
}
