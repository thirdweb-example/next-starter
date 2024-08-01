"use client";

import {
  ConnectButton,
  useActiveAccount,
  useActiveWalletChain,
  useSendAndConfirmTransaction,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { client } from "./client";
import { createWallet, inAppWallet, walletConnect } from "thirdweb/wallets";
import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { approve } from "thirdweb/extensions/erc20";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.trustwallet.app"),
  walletConnect(),
  inAppWallet({
    auth: {
      options: ["email", "google", "phone"],
    },
  }),
];

const contractChain = polygon;

const usdcContract = getContract({
  client,
  chain: polygon,
  address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
});

export default function Home() {
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            wallets={wallets}
            chain={contractChain}
          />
        </div>
        <Test />
      </div>
    </main>
  );
}

function Test() {
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const sendAndConfirmTxMutation = useSendAndConfirmTransaction();
  const switchChain = useSwitchActiveWalletChain();

  if (!account || !chain) {
    return <p> Wallet is not connected </p>;
  }

  if (chain.id !== contractChain.id) {
    return (
      <div className="flex justify-center">
        <button
          className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded"
          type="button"
          onClick={() => {
            switchChain(polygon);
          }}
        >
          Switch to Polygon
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <button
        className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded"
        type="button"
        onClick={async () => {
          const transaction = approve({
            amount: "1",
            contract: usdcContract,
            spender: account.address,
          });

          try {
            await sendAndConfirmTxMutation.mutateAsync(transaction);
            alert("Approved Successfully");
          } catch (e) {
            console.error(e);
            alert("Failed to approve");
          }
        }}
      >
        {sendAndConfirmTxMutation.isPending ? "Approving..." : "Approve"}
      </button>
    </div>
  );
}
