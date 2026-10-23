import { Worker } from "node:worker_threads";
import { VPNManager } from "./vpn.js";

const vpn = new VPNManager();

const workers = 10;
const workerList = [];

const shared = new SharedArrayBuffer(8);
const state = new Int32Array(shared);

let managerBusy = false;
let shuttingDown = false;

await vpn.connect();

console.log(`[Manager] Started VPN.`);
console.log(`[Manager] ProtonVPN Status:
${await vpn.status()}\n`);

async function managerFunction(counter) {
  console.log(
    `=========================== QUOTE REACHED ===========================`,
  );

  try {
    console.log(`[Node Resolver] >>> Deleting node...`);

    try {
      await vpn.disconnect();
    } catch (error) {
      console.log("[Manager] No active connection or error on disconnecting.");
    }

    console.log(`[Manager] Connecting somewhere...`);

    const result = await vpn.connect();

    console.log("[Manager] Conected:");
    console.log(result);
  } catch (error) {
    console.error("[Manager] Error while node change:", error);
  }
  Atomics.add(state, 1, 1);

  Atomics.store(state, 0, 0);

  Atomics.notify(state, 0);
}

function stopAllWorkers(reason) {
  if (shuttingDown) return;

  shuttingDown = true;

  console.log(`[Manager] >>> Stopping all workers: ${reason}`);

  Atomics.store(state, 0, 3);
  Atomics.notify(state, 0);

  for (const worker of workerList) {
    worker.terminate();
  }
}

for (let i = 0; i < workers; i++) {
  const worker = new Worker("./break.js", {
    workerData: {
      workerId: i,
      shared,
    },
  });

  workerList.push(worker);

  worker.on("message", async (message) => {
    if (!message || typeof message !== "object") {
      console.log(`[Worker ${i}]`, message);
      return;
    }

    if (message.type === "QUOTA_REACHED") {
      if (managerBusy || shuttingDown) return;

      managerBusy = true;

      try {
        console.log(
          `[Manager] >>> Worker ${message.workerId} reached the quota: ${message.counter}`,
        );

        await managerFunction(message.counter);

        Atomics.store(state, 0, 0);
        Atomics.notify(state, 0);

        console.log(`[Manager] >>> Workers are free.`);
      } catch (error) {
        console.error(`[Manager] >>> Error while changing the node:`, error);

        stopAllWorkers("error on manager");
      } finally {
        managerBusy = false;
      }

      return;
    }

    if (message.type === "COMPLETED") {
      console.log(
        `========================== COMPLETED ==========================`,
      );

      console.log(`[Manager] >>> Worker ${message.workerId} finished the job.`);

      console.log(`[Manager] >>> Counter: ${message.counter}`);

      Atomics.store(state, 0, 2);

      Atomics.notify(state, 0);

      return;
    }

    if (message.type === "RESULT") {
      console.log(`[Worker ${message.workerId}] result:`, message.data);
    }
  });

  worker.on("error", (error) => {
    console.error(`[Manager] Worker ${i} died spelling:`, error);

    stopAllWorkers(`worker ${i} throwed an error`);
  });

  worker.on("exit", (code) => {
    console.log(`[Manager] Worker ${i} escaped with ${code}`);
  });
}
