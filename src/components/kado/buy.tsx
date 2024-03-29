"use client";

import { useEmail, useKadoQuote } from "@/lib/kado";
import { useEffect, useRef } from "react";
import { useActiveAccount } from "thirdweb/react";

export function KadoBuy() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const activeAccount = useActiveAccount();
  const [kadoQuote] = useKadoQuote();
  const [email] = useEmail();

  useEffect(() => {
    window.addEventListener("message", (event) => {
      console.log("event", event);
      if (event.origin !== "https://app.kado.money") return;
    });
  }, [kadoQuote]);

  if (!activeAccount || !kadoQuote || !email) {
    return <div>Connect your wallet to buy</div>;
  }

  const url = new URL("https://app.kado.money");
  url.searchParams.set("onPayAmount", kadoQuote.data.request.amount.toString());
  url.searchParams.set("onPayCurrency", kadoQuote.data.request.currency);
  url.searchParams.set("onRevCurrency", kadoQuote.data.request.asset);
  url.searchParams.set("cryptoList", kadoQuote.data.request.asset);
  url.searchParams.set("onToAddress", activeAccount?.address || "0x");
  url.searchParams.set("network", kadoQuote.data.request.blockchain);
  url.searchParams.set("networkList", kadoQuote.data.request.blockchain);
  url.searchParams.set("product", kadoQuote.data.request.transactionType);
  url.searchParams.set("productList", kadoQuote.data.request.transactionType);
  url.searchParams.set("mode", "minimal");
  url.searchParams.set("email", email);

  return <iframe ref={iframeRef} className="w-full h-[575px]" src={url.href} />;
}
