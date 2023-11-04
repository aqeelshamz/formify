"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import abi from "../../../utils/balance.json";
import { ethers } from "ethers";

function Nftpage() {
  const { ethereum } = window;
  const { address } = useAccount();
  let provider = new ethers.BrowserProvider(window.ethereum);

  useEffect(() => {
    if (!ethereum) {
      alert("Please install MetaMask.");
    } else {
      // Check if the wallet is already connected
      ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length > 0) {
            // Wallet is already connected, no need to connect again
            console.log("Wallet is already connected.");
          } else {
            // Wallet is not connected, connect it
            connectWallet();
          }
        })
        .catch((error) => {
          console.error("Error checking accounts:", error);
        });
    }
  }, []);

  const connectWallet = async () => {
    try {
      // Request user's permission to connect the wallet
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        console.log("Wallet connected successfully.");
      } else {
        console.log("Wallet connection denied.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const validateNft = async () => {
    const contractAddress = formData.contractId;
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
      let balance = await contract.balanceOf(address);

      // the balance is in the this form '1n' how to convert it to a number?
      balance = balance.toString().split("n")[0];
      console.log(balance);

      if (balance > 0) {
        return true;
      } else {
        return false;
      }


    } catch (error) {
      console.error("Error fetching balance:", error);
      return false;
    }
  };

  const isContractIdValid = (contractId) => {
    if (!contractId || contractId.trim() === "") {
      return false;
    }
    const ethereumAddressRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
    return ethereumAddressRegExp.test(contractId);
  };

  const [formData, setFormData] = useState({
    contractId: "",
    chain: "",
  });

  return (
    <div className="bg-white rounded-lg p-5 w-full h-full flex justify-center items-center">
      <form
        className="input-group-md flex flex-col gap-y-2 w-1/2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!isContractIdValid(formData.contractId)) {
            alert("Invalid Contract Id");
            return;
          } else {
            const isValid = await validateNft();
            if (isValid) {
              alert("NFT is valid");
            } else {
              alert("NFT is not valid");
            }
            return;
          }
        }}
      >
        <label>Enter the NFT contract id</label>
        <input
          className="w-full input input-bordered"
          placeholder="NFT Contract Id"
          onChange={(e) => {
            setFormData((prev) => {
              return { ...prev, contractId: e.target.value };
            });
          }}
          required
        ></input>
        <label>Select the Chain</label>
        <select
          className="select w-full input-bordered"
          onChange={(e) => {
            setFormData((prev) => {
              return { ...prev, chain: e.target.value };
            });
          }}
          required
        >
          <option value="polygon">Polygon</option>
          <option value="ethereum">Ethereum</option>
          <option value="sepolia">Sepolia</option>
        </select>
        <button type="submit" className="btn btn-primary w-full ">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Nftpage;
