import { createThirdwebClient } from "thirdweb";

// // Replace this with your client ID string
// // refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
// const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

// if (!clientId) {
// 	throw new Error('No client ID provided');
// }

export const client = createThirdwebClient({
  clientId: "c19938517f3772067fc91ef2c8d4b283", // dev test key
});
