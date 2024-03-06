import { MediaRenderer } from '@/app/thirdweb';

const medias = {
	videos: [
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/20.webm',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/0.3gp',
		'ipfs://QmZqLEvLjvHRQ8z62PUBkdsAHtHFpXxgAh2aViYqL5ntRb/29.m4v',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/10.mp4',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/8.mkv',
		'ipfs://Qmd8dN3cfEqCkPPUHJ2Bhd8EKVmBectfZhMEjDiyAcB9kV/30.mov',
		// 'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/13.ogv',
	],
	images: [
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/21.webp',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/6.jpeg',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/16.svg',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/18.tiff',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/7.jpg',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/3.gif',
	],
	audio: [
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/1.m4a',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/2.flac',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/9.mp3',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/11.oga',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/12.ogg',
		'ipfs://Qmf2Yg8CNG9mT5UF1cSFAhZxxEenNJrgj5mFGJufbZQe3r/28.wav',
	],
	model: ['ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/4.glb'],
	html: ['ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/5.html'],
	others: [
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/14.pdf',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/17.txt',
		'ipfs://QmfYtQW1Pr6dqx9iyK4B4cPjpt43PnkZmy858MMcBDssoF/19.usdz',
	],
};

export default function Home() {
	return (
		<main className='p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto'>
			<div className='py-20'>
				<h1 className='text-5xl xl:text-8xl mb-12 font-semibold tracking-tighter'>
					{' '}
					MediaRenderer{' '}
				</h1>
				<div className='flex flex-col gap-20'>
					<Category title='Videos' medias={medias.videos} />
					<Category title='Images' medias={medias.images} />
					<Category title='Audio' medias={medias.audio} />
					<Category title='3D Model' medias={medias.model} />
					<Category title='HTML' medias={medias.html} />
					<Category title='Others' medias={medias.others} />
				</div>
			</div>
		</main>
	);
}

function Category(props: { title: string; medias: string[] }) {
	return (
		<div>
			<h2 className='text-4xl md:text-7xl my-10 font-semibold tracking-tighter'> {props.title} </h2>
			<div className='grid md:grid-cols-2 xl:grid-cols-3 gap-6'>
				{props.medias.map(mediaUrl => {
					const split = mediaUrl.split('.');
					const extension = split[split.length - 1];
					return (
						<div
							key={mediaUrl}
							className='border border-zinc-800 p-4 rounded-lg'
							style={{
								background: `linear-gradient(120deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.01))`,
							}}
						>
							<p className='mb-6 font-medium text-2xl text-zinc-400'>{extension}</p>
							<div className='flex justify-center'>
								<MediaRenderer
									src={mediaUrl}
									className='!rounded-lg !overflow-hidden'
									width='250px'
									height='250px'
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
