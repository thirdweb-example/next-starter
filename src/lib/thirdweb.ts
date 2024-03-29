'use client';

// Do not import the components/hooks directly from the `thirdweb` package in server components
// export them from here and import in server components so that they are tagged with "use client" directive

export { ThirdwebProvider, ConnectButton } from 'thirdweb/react';
