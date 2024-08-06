import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import {defineChain} from "thirdweb/chains"
import { client } from "./client";

export default function Home() {
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">


        <div className="flex justify-center mb-20">
          <ConnectButton
            client={client}
            chain={defineChain(1993)}
            accountAbstraction={{
              chain: defineChain(1993),
              sponsorGas: true,
            }}
          />
        </div>

        </div>
    </main>
  );
}

