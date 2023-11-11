"use client";
import { createContext, useState, useEffect } from "react";
import Payable_abi from "../utils/abi.json";
import { ethers } from "ethers";

export const EthersContext = createContext(null);
const { ethereum } = window;
if (!ethereum) alert("Please install MetaMask.");

export default function Ethers({ children }) {  
  const contractAddress = "0xB28cbafcb69d18ad60Efe4E6183f02800C2e33FB";
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  const [contract, setContract] = useState(
    new ethers.Contract(contractAddress, Payable_abi, signer)
  );
  //   const [currentAccount, setCurrentAccount] = useState(null);

  const pay = (value) => {
    const options = { value: ethers.parseEther(value.toString()) };
    contract
      .register("0x179dad1E22CF3d6f90c43b2936072D121619cE43", options)
      .then((res) => {
        console.log(res);
      });
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      //   const accounts = await ethereum.request({ method: "eth_accounts" });

      //   if (accounts.length) {
      //     setCurrentAccount(accounts[0]);
      //     getName();
      //   } else {
      //     alert("No accounts found");
      //   }
    } catch (error) {
      console.log(error);
    }
  };

  const getContract = () => {
    try {
      if (contract == null) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const Contract = new Contract(
          "0xB28cbafcb69d18ad60Efe4E6183f02800C2e33FB",
          Payable_abi,
          signer
        );
        setContract(Contract);
      } else return contract;
    } catch (e) {
      alert(e);
      return null;
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <EthersContext.Provider
      value={{
        getContract,
        pay,
        contract,
      }}
    >
      {children}
    </EthersContext.Provider>
  );
}
