import ethers from "ethers";
import abi from "../utils/balance.json";

export const nftValidate = async (address) => {
  // Create an Ethereum provider and signer
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    "0xe3A3bdF83dA6C3a3bde29897F538943EFbA13fF8",
    abi,
    signer
  );

  try {
    const balance = await contract.balanceOf(address);
    if (balance.gt(0)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching balance:", error);
    return false;
  }
};
