"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import { createWallet, walletConnect, inAppWallet } from "thirdweb/wallets";
import { polygon } from "thirdweb/chains";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  walletConnect(),
  inAppWallet({
    auth: {
      options: ["email", "google", "apple", "facebook", "phone"],
    },
    smartAccount: {
      chain: polygon,
      sponsorGas: true,
    },
  }),
  createWallet("com.trustwallet.app"),
  createWallet("io.zerion.wallet"),
  createWallet("app.phantom"),
];

export default function Home() {
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="">
        <div className="flex justify-center mb-20">
          <ConnectButton
            wallets={wallets}
            client={client}
            appMetadata={{
              name: "Example App",
              url: "https://example.com",
            }}
            theme={"dark"}
            connectButton={{ label: "Login" }}
            detailsButton={{
              displayBalanceToken: {
                [polygon.id]: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
              },
            }}
            connectModal={{
              size: "wide",
              title: "UltimateDeal",
              titleIcon: "https://ultimateDeal.net/images/logoOfWebsite.svg",
              welcomeScreen: {
                title: "UltimateDeal",
                subtitle:
                  "Make your first step to the journey of your life. Contribute to businesses anonymously and get shares in return and dividends. Open a Crowdfunding campaign and issue your business shares to the public. Get started by connecting your wallet.",
                img: {
                  src: "https://ultimateDeal.net/images/logoOfWebsite.svg",
                  width: 150,
                  height: 150,
                },
              },
              termsOfServiceUrl: "https://ultimateDeal.net/terms",
              privacyPolicyUrl: "https://ultimateDeal.net/privacy-policy",
              showThirdwebBranding: false,
            }}
            supportedTokens={{
              [polygon.id]: [
                {
                  address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
                  name: "USDT",
                  symbol: "USDT",
                },
              ],
            }}
            chain={polygon}
            switchButton={{
              label: "Switch Network",
              className: "my-custom-class",
            }}
          />
        </div>
      </div>
    </main>
  );
}
