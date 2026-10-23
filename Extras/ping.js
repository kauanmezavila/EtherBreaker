import "dotenv/config";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

console.log("Network:", await provider.getNetwork());
console.log("Latest block:", await provider.getBlockNumber());
