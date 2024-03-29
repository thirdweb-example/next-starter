"use client";

import { useKadoOnRampStep } from "@/lib/kado";
import { KadoBuy } from "./buy";
import { KadoEmail } from "./email";
import { KadoQuote } from "./quote";

export function OnRamp() {
  const [kadoStep] = useKadoOnRampStep();

  if (kadoStep === "quote") return <KadoQuote />;
  if (kadoStep === "email") return <KadoEmail />;

  return <KadoBuy />;
}
