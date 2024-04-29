"use client";

import Image from "next/image";
import { ConnectButton, PayEmbed } from "./thirdweb";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";

import { setThirdwebDomains } from "thirdweb/utils";
import { defaultTokens, useActiveAccount } from "thirdweb/react";

setThirdwebDomains({
  pay: "pay.thirdweb-dev.com",
  rpc: "rpc.thirdweb-dev.com",
  inAppWallet: "embedded-wallet.thirdweb-dev.com",
});

export default function Home() {
  const account = useActiveAccount();
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />

        <div className="flex justify-center mb-10">
          <ConnectButton client={client} />
        </div>

        <div className="h-10" />
        <h2 className="text-center mb-5"> Stripe TestMode </h2>

        <div className="flex justify-center mb-10">
          <ConnectButton
            client={client}
            detailsModal={{
              pay: {
                buyWithFiat: {
                  testMode: true,
                },
              },
            }}
          />
        </div>

        {account && (
          <>
            <div className="h-10" />
            <h2 className="text-center mb-5"> Pay Embed </h2>
            <div className="flex justify-center ">
              <div
                style={{
                  width: "360px",
                }}
              >
                <PayEmbed
                  client={client}
                  supportedTokens={defaultTokens}
                  theme="dark"
                />
              </div>
            </div>

            <div className="h-14" />
            <h2 className="text-center mb-5"> Pay Embed (Stripe Testmode) </h2>
            <div className="flex justify-center ">
              <div
                style={{
                  width: "360px",
                }}
              >
                <PayEmbed
                  client={client}
                  supportedTokens={defaultTokens}
                  theme="dark"
                  buyWithFiat={{
                    testMode: true,
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb SDK
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block -skew-x-6 text-blue-500"> Next.js </span>
      </h1>

      <p className="text-zinc-300 text-base">
        Read the{" "}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          README.md
        </code>{" "}
        file to get started.
      </p>
    </header>
  );
}
