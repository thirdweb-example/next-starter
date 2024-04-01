"use client";

import Image from "next/image";
import { ConnectButton } from "@/app/thirdweb";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import { useState } from "react";
import { createWallet } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
import { polygon } from "thirdweb/chains";

const wallets = [
  createWallet("io.metamask"),
  createWallet("me.rainbow"),
  createWallet("com.coinbase.wallet"),
];

export default function Page() {
  const account = useActiveAccount();
  const [isSigning, setIsSigning] = useState(false);

  return (
    <>
      <div className="max-w-screen-md p-5 mx-auto pt-20">
        <div className="flex justify-center">
          <ConnectButton client={client} wallets={wallets} chain={polygon} />
        </div>

        <div className="h-20"> </div>

        {account && (
          <div className="flex justify-center">
            <button
              key="sign-in"
              className="bg-white text-black font-semibold px-3 py-2 rounded"
              disabled={isSigning}
              onClick={async () => {
                setIsSigning(true);
                try {
                  const sig = await account.signMessage({ message: "hello!" });
                  alert("signature: " + sig);
                } catch {
                  alert("failed to sign");
                }

                setIsSigning(false);
              }}
            >
              {isSigning ? "Signing..." : "Sign Message"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
