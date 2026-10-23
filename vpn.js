import { execFile } from "node:child_process";

export class VPNManager {
  command(args = []) {
    return new Promise((resolve, reject) => {
      execFile("protonvpn", args, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
          return;
        }

        resolve(stdout.trim());
      });
    });
  }

  async connect(country) {
    const args = ["connect"];

    if (country) {
      args.push("--country", country);
    }

    return await this.command(args);
  }

  async disconnect() {
    return await this.command(["disconnect"]);
  }

  async status() {
    return await this.command(["status"]);
  }

  async countries() {
    return await this.command(["countries"]);
  }
}

const vpn = new VPNManager();

console.log(await vpn.status());
