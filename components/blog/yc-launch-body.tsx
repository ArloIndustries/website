import Image from 'next/image';
import { YC_LAUNCH_URL } from '@/lib/yc';

type YcLaunchBodyProps = {
	highlightClass: string;
};

const YC_LINKEDIN_URL =
	'https://www.linkedin.com/posts/y-combinator_arlo-industries-yc-p26-builds-distributed-activity-7465084349344808960-uQ8I/';
const YC_X_URL = 'https://x.com/ycombinator/status/2059318651866476827';

/* Thumbnails are the actual link previews (og:image), self-hosted in
   public/about so they can't expire. X blocks metadata access → no image. */
const LAUNCH_LINKS = [
	{
		label: 'Official launch',
		platform: 'Y COMBINATOR',
		href: YC_LAUNCH_URL,
		thumbnail: '/about/launch-yc.png',
	},
	{
		label: 'Launch announcement',
		platform: 'LINKEDIN',
		href: YC_LINKEDIN_URL,
		thumbnail: '/about/launch-linkedin.jpg',
	},
	{
		label: 'Launch announcement',
		platform: 'X',
		href: YC_X_URL,
		thumbnail: null,
	},
];

export default function YcLaunchBody({ highlightClass }: YcLaunchBodyProps) {
	return (
		<div className='text-lg text-justify max-w-3xl mx-auto opacity-90 leading-relaxed space-y-6 pb-8 lg:pb-12'>
			<p>
				Arlo Industries has officially launched with Y Combinator (P26). The
				public start of a commitment formed long before it: to bring{' '}
				<span className={highlightClass}>
					decentralised sensing and aerial defence to every part of the world
				</span>
				.
			</p>

			<p>
				Safety should not depend on whether a community can afford a handful of
				exquisite systems. The future of defence is not a larger silo, it is a
				network: many independent nodes sharing awareness and continuing to
				operate when parts are lost. That is how advanced protection becomes
				scalable and broadly accessible.
			</p>

			<ul className='grid gap-4 pt-4 text-left sm:grid-cols-3'>
				{LAUNCH_LINKS.map((link) => (
					<li key={link.href}>
						<a
							href={link.href}
							target='_blank'
							rel='noopener noreferrer'
							className='group flex h-full flex-col border-2 border-current transition-colors duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white'
						>
							{link.thumbnail && (
								<span className='relative block aspect-video overflow-hidden'>
									<Image
										src={link.thumbnail}
										alt=''
										fill
										sizes='(max-width: 640px) 100vw, 33vw'
										className='object-cover transition-transform duration-300 group-hover:scale-105'
									/>
								</span>
							)}
							<span className='flex flex-grow flex-col justify-between gap-4 p-4'>
								<span className='text-xs font-black tracking-[0.16em] opacity-70 transition-opacity group-hover:opacity-100'>
									{link.platform}
								</span>
								<span className='flex items-end justify-between gap-3'>
									<span className='text-sm font-bold leading-tight'>
										{link.label}
									</span>
									<span aria-hidden>↗</span>
								</span>
							</span>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
