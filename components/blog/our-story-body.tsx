'use client';

type OurStoryBodyProps = {
	highlightClass: string;
};

const videoClass = 'my-8 h-auto w-full bg-black';

const blockDownload = {
	controlsList: 'nodownload',
	onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
};

export default function OurStoryBody({ highlightClass }: OurStoryBodyProps) {
	return (
		<div className='mx-auto max-w-3xl space-y-6 pb-8 text-left lg:text-justify text-lg leading-relaxed opacity-90 lg:pb-12'>
			<p>
				Arlo Industries began with a question shaped by lived experience:{' '}
				<span className={highlightClass}>
					how can people see a threat without becoming a target themselves?
				</span>
			</p>

			<p>
				Our founder, Deo Arlo, spent more than six years in Israel&apos;s
				research and high-tech ecosystem while living through repeated conflict.
				Aerial defence was never an abstract problem; it determined whether
				people had enough warning to act.
			</p>

			<video
				src='/about/chatBorderGuard.mp4'
				autoPlay
				muted
				loop
				playsInline
				preload='auto'
				className={videoClass}
				aria-label='Field work at the border'
				{...blockDownload}
			/>

			<p>
				The October 7 attack exposed how low and slow-flying threats exploit
				assumptions built around larger, more visible threats. The danger did
				not end that day, during our time in Ukraine, Shaheds built upon this
				strategy and showed how inexpensive low-and-slow attack drones could be
				deployed at scale and overwhelm centralised systems.
			</p>

			<video
				src='/about/rocket1.mp4'
				autoPlay
				muted
				loop
				playsInline
				preload='auto'
				className={videoClass}
				aria-label='Aerial defence field footage'
				{...blockDownload}
			/>

			<p>
				That insight became Arlo Industries: a passive, distributed aerial
				sensing mesh designed to track drones and missiles better than radar.
				Our team combines frontline experience with deep technical expertise.
			</p>

			<p>
				We have tested alongside various militaries on the frontlines and with
				operators across Europe and the United States. The standard is simple:
				technology must work outside the laboratory, survive disruption, and
				scale beyond a single protected site.
			</p>

			<p className='pt-4 text-center text-xl'>
				<span className={highlightClass}>
					Our origin is personal. Our mission is global.
				</span>
			</p>
		</div>
	);
}
