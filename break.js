import { parentPort, workerData } from "node:worker_threads";
import { ethers } from "ethers";
import { generateName } from "./name.js";

const { workerId, shared } = workerData;

const state = new Int32Array(shared);

const workerName = generateName();

const provider = new ethers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/public",
);

const QUOTA = 95;

let counter = 0;
let mainCounter = 0;
let localResetVersion = Atomics.load(state, 1);

console.log(`[${workerName}] Worker ${workerId} borned!`);

console.log(`[${workerName}] Started on 0!`);

while (true) {
  const currentResetVersion = Atomics.load(state, 1);

  if (currentResetVersion !== localResetVersion) {
    counter = 0;
    mainCounter = 0;

    localResetVersion = currentResetVersion;

    console.log(`[${workerName}] >>> Counters reset.`);
  }

  const currentState = Atomics.load(state, 0);

  if (currentState === 2) {
    console.log(`[${workerName}] Work finished globaly.`);

    break;
  }

  if (currentState === 3) {
    console.log(`[${workerName}] Worker stop globaly.`);

    break;
  }

  if (currentState === 1) {
    Atomics.wait(state, 0, 1);
    continue;
  }

  counter++;

  if (counter >= QUOTA) {
    const previousState = Atomics.compareExchange(state, 0, 0, 1);

    if (previousState === 0) {
      console.log(`[${workerName}] >>> Quota reached ${counter}`);

      parentPort?.postMessage({
        type: "QUOTA_REACHED",
        workerId,
        counter,
      });

      Atomics.wait(state, 0, 1);

      const newState = Atomics.load(state, 0);

      if (newState === 2 || newState === 3) {
        break;
      }

      console.log(`[${workerName}] >>> Workers are free.`);

      continue;
    }

    continue;
  }

  const wallet = ethers.Wallet.createRandom();

  const balance = await provider.getBalance(wallet.address);
  counter += 1;
  mainCounter += counter;

  mainCounter++;

  if (balance > 0) {
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
    parentPort.postMessage("Wallet saved on wallet.json");

    const previousState = Atomics.compareExchange(state, 0, 0, 2);

    if (previousState === 0) {
      parentPort?.postMessage({
        type: "COMPLETED",
        workerId,
        counter,
      });

      break;
    }
  } else {
    console.log(
      `[${workerName}] ${wallet.address}: ${balance} FAIL ${counter}/${mainCounter}`,
    );
  }
}
