import { parentPort, workerData } from "node:worker_threads";

import { generateName } from "./name.js";

const { workerId, shared } = workerData;

const state = new Int32Array(shared);

const workerName = generateName();

let counter = 0;
let mainCounter = 0;

console.log(`[${workerName}] Worker ${workerId} started.`);
console.log(`[${workerName}] Counter: 0`);

while (true) {
  if (Atomics.load(state, 0) === 1) {
    Atomics.wait(state, 0, 1);
  }

  counter++;

  if (counter >= 95) {
    const previousState = Atomics.compareExchange(state, 0, 0, 1);

    if (previousState === 0) {
      console.log(`[${workerName}] Quota reached.`);

      parentPort?.postMessage({
        type: "QUOTA_REACHED",
        workerId,
        counter,
      });

      Atomics.wait(state, 0, 1);

      console.log(`[${workerName}] Manager released. Continuing...`);

      counter = 0;
    }

    continue;
  }

  const wallet = ethers.Wallet.createRandom();

  const balance = await provider.getBalance(wallet.address);
  counter += 1;
  mainCounter += counter;

  mainCounter++;

  if (mainCounter % 100 === 0) {
    console.log(`[${workerName}] Processeds: ${mainCounter}`);
  }
}
