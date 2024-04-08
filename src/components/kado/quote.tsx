"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import {
  KADO_CLIENT_ID,
  KadoQuoteType,
  useKadoOnRampStep,
  useKadoQuote,
} from "../../lib/kado";

export function KadoQuote() {
  const activeAccount = useActiveAccount();
  const [, setKadoStep] = useKadoOnRampStep();
  const [, setQuote] = useKadoQuote();

  const [amount, setAmount] = useState<string | undefined>();

  const [parent] = useAutoAnimate();

  const onClickNext = () => {
    setKadoStep("email");
  };

  const { data } = useQuery({
    queryKey: ["quote", amount],
    queryFn: async () => {
      if (!amount) return;
      const url = new URL("https://api.kado.money/v2/ramp/quote");

      url.searchParams.set("transactionType", "buy");
      url.searchParams.set("fiatMethod", "credit_card");
      url.searchParams.set("partner", "fortress");
      url.searchParams.set("asset", "USDC");

      // Modifiable
      // Amount is in USD $40.10 = 40.1
      url.searchParams.set("amount", (parseInt(amount) + 5).toString());
      // Same endpoint
      url.searchParams.set("blockchain", "polygon");
      // Currency I'll get to you
      url.searchParams.set("currency", "USD");

      const response = await fetch(url, {
        headers: {
          "X-Widget-Id": KADO_CLIENT_ID,
        },
      });
      const result: KadoQuoteType = await response.json();
      setQuote(result);
      return result;
    },
    enabled: !!amount,
  });

  console.log("quote data", data);
  const Result = (
    <>
      <div className="flex flex-col w-full">
        <div className="text-muted-foreground">Pay with</div>
        <RadioGroup defaultValue="card" className="flex gap-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="crypto" id="crypto" disabled />
            <Label htmlFor="crypto">Crypto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card">Card</Label>
          </div>
        </RadioGroup>

        <div className="flex flex-row justify-between">
          <div>USD</div>
          <div>{data?.data.quote.receiveAmountAfterFees.amount}</div>
        </div>
      </div>

      <div className="w-full">
        <div className="text-muted-foreground">Send to</div>
        <pre>{activeAccount?.address}</pre>
      </div>
      <Button onClick={onClickNext}>Continue</Button>
    </>
  );

  return (
    <div
      className="bg-muted rounded-lg max-w-96 flex flex-col gap-4 justify-start items-center p-5"
      ref={parent}
    >
      <h1 className="font-semibold">Buy</h1>
      <div className="flex items-center">
        <Input
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          pattern="^[0-9]*[.,]?[0-9]*$"
          inputMode="decimal"
          placeholder="0"
          type="text"
        />
        <div className="text-muted-foreground font-semibold">USDC</div>
      </div>
      {data && Result}
    </div>
  );
}
