import { ethers } from "ethers";
import fs from "fs";

const walletData = JSON.parse(fs.readFileSync("wallet.json", "utf8"));

const provider = new ethers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/public",
);

const wallet = new ethers.Wallet(walletData.privateKey, provider);

console.log("Conected!");
console.log("Address:", wallet.address);

const balance = await provider.getBalance(wallet.address);

console.log("Balance:", ethers.formatEther(balance), "ETH");
