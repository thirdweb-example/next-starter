import { atom, useAtom } from "jotai";

export const KADO_CLIENT_ID = process.env.NEXT_PUBLIC_KADO_CLIENT_ID ?? "";

export const kadoOnRampStepAtom = atom<
  "quote" | "buy" | "email" | "processing"
>("quote");
export const useKadoOnRampStep = () => useAtom(kadoOnRampStepAtom);
const KadoQuoteAtom = atom<KadoQuoteType | undefined>(undefined);
export const useKadoQuote = () => useAtom(KadoQuoteAtom);
const emailAtom = atom<string | undefined>(undefined);
export const useEmail = () => useAtom(emailAtom);

export type KadoQuoteType = {
  success: boolean;
  message: string;
  data: {
    request: {
      transactionType: string;
      fiatMethod: string;
      partner: string;
      amount: number;
      asset: string;
      blockchain: string;
      currency: string;
      reverse: boolean;
    };
    quote: {
      asset: string;
      baseAmount: {
        amount: number;
        currency: string;
      };
      price: {
        amount: number;
        price: number;
        symbol: string;
        unit: string;
      };
      processingFee: {
        originalAmount: number;
        amount: number;
        promotionModifier: number;
        currency: string;
      };
      bridgeFee: {
        amount: number;
        currency: string;
      };
      networkFee: {
        amount: number;
        currency: string;
      };
      smartContractFee: {
        amount: number;
        currency: string;
      };
      totalFee: {
        originalAmount: number;
        amount: number;
        currency: string;
      };
      receiveAmountAfterFees: {
        originalAmount: number;
        amount: number;
        currency: string;
      };
      receiveUnitCountAfterFees: {
        amount: number;
        currency: "USDC";
      };
      receive: {
        originalAmount: number;
        amount: number;
        unit: string;
        unitCount: number;
        symbol: string;
      };
      feeType: string;
      minValue: {
        amount: number;
        unit: string;
      };
      maxValue: {
        amount: number;
        unit: string;
      };
    };
  };
};
