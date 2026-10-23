import { ethers } from "ethers";
import fs from "fs";

const wallet = ethers.Wallet.createRandom();

console.log("Address:", wallet.address);

fs.writeFileSync(
  "wallet.json",
  JSON.stringify(
    {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    },
    null,
    2,
  ),
);

console.log("Wallet saved on wallet.json");
