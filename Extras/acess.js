import "dotenv/config";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

console.log("Exists:", !!process.env.PRIVATE_KEY);
console.log("Lenght:", process.env.PRIVATE_KEY?.length);
console.log("Starts with 0x:", process.env.PRIVATE_KEY?.startsWith("0x"));

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

console.log("Wallet:", wallet.address);

const balance = await provider.getBalance(wallet.address);

console.log("Balance:", ethers.formatEther(balance), "ETH");
