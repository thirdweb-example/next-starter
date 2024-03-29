"use client";

import { useEmail, useKadoOnRampStep } from "@/lib/kado";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function KadoEmail() {
  const [email, setEmail] = useEmail();
  const [, setKadoStep] = useKadoOnRampStep();
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <Button
        onClick={() => {
          setKadoStep("buy");
        }}
        className="w-full"
      >
        Next
      </Button>
    </div>
  );
}
