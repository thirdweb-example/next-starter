"use client";

import { ConnectButton, PayEmbed } from "./thirdweb";
import { client } from "./client";

import { toWei } from "thirdweb/utils";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useDisconnect,
  useSendTransaction,
  useSwitchActiveWalletChain,
} from "thirdweb/react";
import { useState } from "react";
import {
  type Chain,
  prepareTransaction,
  waitForReceipt,
  getContract,
} from "thirdweb";
import {
  polygon,
  ethereum,
  optimism,
  base,
  arbitrum,
  avalanche,
} from "thirdweb/chains";
import { transfer } from "thirdweb/extensions/erc20";
import { useMutation } from "@tanstack/react-query";

// setThirdwebDomains({
//   pay: "pay.thirdweb-dev.com",
//   rpc: "rpc.thirdweb-dev.com",
//   inAppWallet: "embedded-wallet.thirdweb-dev.com",
// });

export default function Home() {
  const account = useActiveAccount();
  const { disconnect } = useDisconnect();
  const activeWallet = useActiveWallet();

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <h2 className="text-center font-semibold text-4xl mb-10">
          Fiat Onramp Test
        </h2>

        <div className="flex justify-center mb-10">
          <ConnectButton client={client} />
        </div>

        <TestingSetup />
      </div>
    </main>
  );
}

function TestingSetup() {
  const [tab, setTab] = useState<"pay-embed" | "send" | "modal">("modal");
  const [testMode, setTestMode] = useState(false);

  return (
    <div>
      <div className="flex flex-col items-center mb-10 gap-2">
        <p> Stripe Test Mode: {testMode ? "enabled" : "disabled"}</p>
        <button
          className="bg-zinc-300 px-3 py-2 rounded-lg text-zinc-900 font-semibold"
          onClick={() => {
            setTestMode((prev) => !prev);
          }}
        >
          Toggle TestMode
        </button>
      </div>

      {/* Tabs  */}
      <div className="flex gap-2 justify-center mb-10">
        {["modal", "pay-embed", "send"].map((t) => {
          return (
            <button
              key={t}
              onClick={() => {
                setTab(t as any);
              }}
              className={
                (tab === t
                  ? "bg-zinc-100 text-zinc-900"
                  : "bg-zinc-900 border border-zinc-800") +
                " p-2 rounded-lg font-semibold"
              }
            >
              {t}
            </button>
          );
        })}
      </div>

      {tab === "modal" && (
        <>
          <div className="flex justify-center mb-10">
            <ConnectButton
              client={client}
              detailsModal={{
                pay: {
                  buyWithFiat: {
                    testMode: testMode,
                  },
                },
              }}
            />
          </div>
        </>
      )}

      {tab === "pay-embed" && (
        <>
          <div className="flex justify-center ">
            <div
              style={{
                width: "360px",
              }}
            >
              <PayEmbed
                client={client}
                payOptions={{
                  buyWithFiat: {
                    testMode: testMode,
                  },
                }}
              />
            </div>
          </div>
        </>
      )}

      {tab === "send" && (
        <>
          <div className="flex justify-center">
            <div className="w-[400px]">
              <h2 className="text-xl mb-2"> Send Native Tokens </h2>
              <SendNativeFundsTest testMode={testMode} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const chainOptions = [polygon, ethereum, optimism, base, arbitrum, avalanche];

function SendNativeFundsTest(props: { testMode?: boolean }) {
  const [tokenAmount, setTokenAmount] = useState("0");
  const [toAddress, setToAddress] = useState("");

  const [chain, setChain] = useState<Chain>(chainOptions[0]);
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const sendTx = useSendToken(props.testMode);

  return (
    <div>
      <FormInput
        value={tokenAmount}
        setValue={setTokenAmount}
        id="tokenAmount"
        label="Amount"
        placeholder="0.0"
      />
      <FormInput
        value={toAddress}
        setValue={setToAddress}
        id="toAddress"
        label="Send To"
        placeholder="0x123..."
      />

      <div>
        <label htmlFor={"chain"} className="mb-2 block">
          {" "}
          Network{" "}
        </label>
        <select
          className="block p-3 border border-zinc-800 rounded-lg bg-zinc-900 text-zinc-100 w-full mb-4"
          id={"chain"}
          value={chain.id}
          onChange={(e) => {
            const chainId = e.target.value;
            const chain = chainOptions.find((c) => String(c.id) === chainId);
            if (chain) {
              setChain(chain);
            } else {
              setChain(chainOptions[0]);
            }
          }}
        >
          {chainOptions.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>

      {activeChain?.id === chain.id ? (
        <button
          type="button"
          className="bg-zinc-300 px-3 py-3 rounded-lg text-zinc-900 block w-full font-semibold"
          onClick={async () => {
            console.log("in progress....");
            await sendTx.mutateAsync({
              amount: tokenAmount,
              receiverAddress: toAddress,
            });
            console.log("sent");
          }}
        >
          {sendTx.isPending ? "Sending..." : "Send Token"}
        </button>
      ) : (
        <button
          type="button"
          className="bg-zinc-300 px-3 py-3 rounded-lg text-zinc-900 block w-full font-semibold"
          onClick={async () => {
            await switchChain(chain);
          }}
        >
          Switch Network
        </button>
      )}
    </div>
  );
}

function useSendToken(testMode?: boolean) {
  const sendTransaction = useSendTransaction({
    payModal: {
      buyWithFiat: {
        testMode,
      },
    },
  });
  const activeChain = useActiveWalletChain();

  return useMutation({
    async mutationFn(option: {
      tokenAddress?: string;
      receiverAddress: string;
      amount: string;
    }) {
      const { tokenAddress, receiverAddress, amount } = option;
      if (!activeChain) {
        throw new Error("No active chain");
      }

      // native token transfer
      if (!tokenAddress) {
        const sendNativeTokenTx = prepareTransaction({
          chain: activeChain,
          client,
          to: receiverAddress,
          value: toWei(amount),
        });

        const txHash = await sendTransaction.mutateAsync(sendNativeTokenTx);
        await waitForReceipt(txHash);
      }

      // erc20 token transfer
      else {
        const contract = getContract({
          address: tokenAddress,
          client,
          chain: activeChain,
        });

        const tx = transfer({
          amount,
          contract,
          to: receiverAddress,
        });

        const txHash = await sendTransaction.mutateAsync(tx);
        await waitForReceipt(txHash);
      }
    },
  });
}

function FormInput(props: {
  value: string;
  setValue: (value: string) => void;
  id: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={props.id} className="mb-2 block">
        {" "}
        {props.label}
      </label>
      <input
        className="block p-3 border border-zinc-800 rounded-lg bg-zinc-900 text-zinc-100 w-full mb-4"
        id={props.id}
        type="text"
        value={props.value}
        onChange={(e) => {
          props.setValue(e.target.value);
        }}
        placeholder={props.placeholder}
      />
    </div>
  );
}
