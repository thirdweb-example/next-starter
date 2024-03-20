'use client';

import Image from 'next/image';
import { ConnectButton, ThirdwebProvider } from '@/app/thirdweb';
import thirdwebIcon from '@public/thirdweb.svg';
import { useState, useEffect, useCallback } from 'react';
import { createThirdwebClient, defineChain } from 'thirdweb';
import { setThirdwebDomains } from 'thirdweb/utils';

const devClientID = '48812987432f90bb6bd9f9f1effda872';
const prodClientID = '1119b624529e89514e1c40c700af849c';

export default function Home() {
	// dev true by default
	const [isDevClient, setIsDevClient] = useState(true);
	const [clientId, setClientId] = useState(devClientID);

	const client = createThirdwebClient({
		clientId: clientId || (isDevClient ? devClientID : prodClientID),
	});

	const updateClient = useCallback((_isDevClient: boolean) => {
		if (_isDevClient) {
			setClientId(devClientID);
			setThirdwebDomains({
				pay: 'pay.thirdweb-dev.com',
				rpc: 'rpc.thirdweb-dev.com',
			});
		} else {
			setClientId(prodClientID);
			setThirdwebDomains({
				pay: 'pay.thirdweb.com',
				rpc: 'rpc.thirdweb.com',
			});
		}
	}, []);

	useEffect(() => {
		updateClient(isDevClient);
	}, [isDevClient, updateClient]);

	return (
		<ThirdwebProvider client={client}>
			<main className='p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto'>
				<div className='py-20'>
					<Header />

					<div className='flex items-center p-4 flex-col gap-3 max-w-screen-lg m-auto'>
						<label htmlFor='client-id' className='text-zinc-300'>
							Client ID
						</label>

						<div>
							<label htmlFor='dev'> is Dev? </label>
							<input
								id='dev'
								checked={isDevClient}
								type='checkbox'
								onChange={e => {
									const isDev = e.target.checked;
									setIsDevClient(isDev);
									updateClient(isDev);
								}}
							/>
						</div>

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

					<div className='flex justify-center mb-20 mt-10'>
						<ConnectButton chains={[1, 10, 137, 8453, 42161, 43114].map(defineChain)} />
					</div>

					<ThirdwebResources />
				</div>
			</main>
		</ThirdwebProvider>
	);
}

function Header() {
	return (
		<header className='flex flex-col items-center mb-20 md:mb-20'>
			<Image
				src={thirdwebIcon}
				alt=''
				className='size-[150px] md:size-[150px]'
				style={{
					filter: 'drop-shadow(0px 0px 24px #a726a9a8)',
				}}
			/>

			<h1 className='text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100'>
				thirdweb unified SDK
				<span className='text-zinc-300 inline-block mx-1'> + </span>
				<span className='inline-block -skew-x-6 text-blue-500'> Next.js </span>
			</h1>

			<p className='text-zinc-300 text-base'>
				Read the{' '}
				<code className='bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1'>README.md</code>{' '}
				file to get started.
			</p>
		</header>
	);
}

function ThirdwebResources() {
	return (
		<div className='grid gap-4 lg:grid-cols-3 justify-center'>
			<ArticleCard
				title='thirdweb unified SDK Docs'
				href='https://portal.thirdweb.com/typescript/v5'
				description='thirdweb TypeScript Unified SDK documentation'
			/>

			<ArticleCard
				title='Components and Hooks'
				href='https://portal.thirdweb.com/typescript/v5/react'
				description='Learn about the thirdweb React components and hooks in thirdweb unified SDK'
			/>

			<ArticleCard
				title='thirdweb Dashboard'
				href='https://thirdweb.com/dashboard'
				description='Deploy, configure, and manage your smart contracts from the dashboard.'
			/>
		</div>
	);
}

function ArticleCard(props: { title: string; href: string; description: string }) {
	return (
		<a
			href={props.href + '?utm_source=next-template'}
			target='_blank'
			className='flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700'
		>
			<article>
				<h2 className='text-lg font-semibold mb-2'>{props.title}</h2>
				<p className='text-sm text-zinc-400'>{props.description}</p>
			</article>
		</a>
	);
}
