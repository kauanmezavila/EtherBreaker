 <div align="center">
  <h1>EtherBreaker</h1>
  <p><b>Exploring the Limits of Ethereum Wallet Security</b></p>
  <p><i>An experiment in cryptography, brute force, and the computational limits of wallet generation.</i></p>
</div>

## How Does Ethereum Actually Work?

Have you ever wondered how the Ethereum network works?

At its core, Ethereum is a decentralized blockchain that allows participants to agree on a shared state through a consensus mechanism. Transactions are executed and validated according to the network's rules, and the resulting state is maintained across a distributed network of nodes.

But this raises an interesting question: **if Ethereum is decentralized, how are wallets created, and how does the network prevent two people from generating the same wallet?**

The answer is surprisingly simple: **it doesn't check.**

## Generating a Wallet Without the Network

An Ethereum wallet can be generated entirely offline. Using a cryptographic library such as [ethers.js](https://docs.ethers.org/), a computer can generate a private key and derive its corresponding Ethereum address.

No internet connection is required. No registration is necessary. No central authority assigns the address.

A wallet can be generated independently, anywhere, at any time.

> But wait — doesn't the software check whether someone has already generated that wallet?

**Nope.**

Ethereum does not maintain a global registry of every wallet that has ever been generated. Since wallets can be created offline, checking every possible address before generating one would be impractical.

Instead, the system relies on cryptography and the immense size of the possible key space to make accidental duplication extraordinarily unlikely.

Two people could theoretically generate the same private key, but the probability of this happening independently with properly generated keys is astronomically small.

## So, What Protects the Chaos?

Here lies one of the fundamental principles behind modern cryptographic security:

**Computational infeasibility.**

Some mathematical operations are easy to perform in one direction but computationally impractical to reverse without additional information. Cryptographic hash functions, for example, are designed to make it infeasible to find an input that produces a specific output or to find two inputs with the same hash.

Ethereum wallet security relies on several related mechanisms, including secure random number generation, elliptic-curve cryptography, and cryptographic hashing.

The key space is so enormous that searching it through brute force is not a realistic way to discover someone else's private key.

But _computationally infeasible_ does not mean mathematically impossible. It means that, given current algorithms and realistic computational resources, the required effort is beyond practical reach.

Even powerful hardware cannot turn an astronomically large search space into a feasible task simply by performing more calculations per second.

## The Experiment

EtherBreaker explores the astronomical search space of Ethereum wallets through continuous wallet generation and balance verification.

The concept is simple: generate Ethereum wallets, derive their public addresses, and check whether those addresses hold any balance on the blockchain.

Theoretically, a randomly generated private key could correspond to an existing wallet with funds. In practice, however, the probability of finding one this way is extraordinarily small.

EtherBreaker illustrates the difference between what is mathematically possible and what is computationally feasible.

### How It Works

1. **Wallet Generation** — Generate cryptographically random Ethereum wallets locally.
2. **Address Derivation** — Derive the public Ethereum address associated with each private key.
3. **Balance Verification** — Query the Ethereum network to check the address balance.
4. **Result Recording** — Record the public address and corresponding private key when an address meets the experiment's criteria.

### The Mathematical Challenge

Ethereum's private-key space contains approximately 2^256 possible values before accounting for the small number of invalid scalars.

Even with continuous generation and automated balance checks, the probability of randomly discovering a funded wallet is negligible under realistic computational conditions.

**The experiment demonstrates a fundamental principle of cryptographic security: a possibility existing in mathematics does not make it practically discoverable through brute force.**

_EtherBreaker is an educational experiment exploring cryptographic key spaces, blockchain address generation, and the practical limits of brute-force search._

### Running it

First, install [pnpm](https://pnpm.io/installation) and [ProtonVPN](https://protonvpn.com/download) if you don't have it.

Then, clone the repo and enter the folder:

```bash
git clone https://github.com/kauanmezavila/EtherBreaker
cd etherbreaker
```

Install the dependencies and run:

```bash
pnpm install && pnpm run
```

Now see the threaded works trying the combinations and trying to find your _prize_.

## The Takeaway

Ethereum does not need to know every wallet that exists.

It relies on cryptographic algorithms, secure randomness, and the staggering number of possible private keys to make independent wallet generation practical without a central authority.

**The security doesn't come from checking every possibility. It comes from the fact that searching those possibilities is computationally infeasible.**

_EtherBreaker is an educational experiment exploring cryptographic security, brute-force search, and the practical limits of computation._
