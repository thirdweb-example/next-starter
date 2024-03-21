# thirdweb SDK + Next.js starter

## Setup client id

Before you start, you need to replace the placeholder `clientId` with your client ID to use thirdweb SDK.

Refer to [Creating a client](https://portal.thirdweb.com/typescript/v5/client) guide to see how you can get a client id.

Go to `src/client.ts` file and replace the placeholder `clientId` with your client ID.

```ts
const clientId = "......";
```

## Usage with App Router

If you are using App router, You can not import client components/hooks directly from `thirdweb/react` package directly in server components.

You should export them from the `src/thirdweb.ts` file instead which has been marked with `"use client"` directive at the top of the file so that Next.js can process it properly.

```ts
// server component
import { ThirdwebProvider } from "thirdweb/react"; // ❌
import { ThirdwebProvider } from "@/app/thirdweb"; // ✅
```

## Usage

### Install dependencies

```bash
yarn
```

### Start development server

```bash
yarn dev
```

### Create a production build

```bash
yarn build
```

### Preview the production build

```bash
yarn start
```

## Resources

- [thirdweb SDK documentation](https://portal.thirdweb.com/typescript/v5)
- [React components and hooks](https://portal.thirdweb.com/typescript/v5/react)
- [thirdweb Dashboard](https://thirdweb.com/dashboard)

## Join our Discord!

For any questions or suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
