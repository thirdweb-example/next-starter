import { createThirdwebClient } from "thirdweb";

// // Replace this with your client ID string
// // refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
// const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

// if (!clientId) {
// 	throw new Error('No client ID provided');
// }

export const client = createThirdwebClient({
  clientId: "1119b624529e89514e1c40c700af849c", // test key
});
