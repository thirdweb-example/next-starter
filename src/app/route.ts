import { createThirdwebClient, getBuyWithCryptoQuote } from "thirdweb";
import { setThirdwebDomains } from "thirdweb/utils";

export const GET = async () => {
  setThirdwebDomains({
    pay: "pay-server-s25c-winston-clean-up--43ed0f.chainsaw-dev.zeet.app",
  });

  try {
    const result = await getBuyWithCryptoQuote({
      client: createThirdwebClient({
        clientId: "5574e050c33e91d4526218dc7c7d2af0",
      }),
      fromTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      fromAddress: "0xCF3D06a19263976A540CFf8e7Be7b026801C52A6",
      fromChainId: 137,
      fromAmount: "2",
      toChainId: 10,
      toTokenAddress: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
    });
    return Response.json({ result });
  } catch (error) {
    console.log("error", error);
    return Response.json({ error });
  }
};
