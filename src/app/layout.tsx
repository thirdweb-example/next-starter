'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { ThirdwebProvider } from '@/app/thirdweb';
import { createThirdwebClient } from 'thirdweb';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [clientId, setClientId] = useState('92bb0cd9e9055de30502c1501dc8c2fe');
	const client = createThirdwebClient({
		clientId: clientId,
	});

	return (
		<html lang='en'>
			<body className={inter.className}>
				<div className='flex items-center p-4 flex-col gap-3 max-w-screen-lg m-auto pt-10'>
					<label htmlFor='client-id' className='text-zinc-300'>
						{' '}
						Client ID{' '}
					</label>
					<input
						id='client-id'
						type='text'
						value={clientId}
						onChange={e => {
							setClientId(e.target.value);
						}}
						className='bg-zinc-900 border text-sm p-3 rounded-lg w-[400px] border-zinc-800 text-zinc-100 text-center'
					/>
				</div>
				<ThirdwebProvider client={client}>{children}</ThirdwebProvider>
			</body>
		</html>
	);
}
