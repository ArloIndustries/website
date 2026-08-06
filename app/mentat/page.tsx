'use client';

import Image from 'next/image';
import BlogPageShell from '@/components/blog-page-shell';
import { MENTAT_3D_GIF_URL, MENTAT_LOGO_URL, MENTAT_VID_URL } from '@/lib/mentat';

const FEATURES = [
	'Passive optical sensing',
	'Distributed mesh architecture',
	'Multi-node aerial tracking',
	'Designed for scalable low altitude coverage',
];

const titleRowClass =
	'flex items-center justify-center gap-3 lg:gap-4 text-4xl lg:text-6xl font-bold tracking-tight leading-none';
const sectionHeadingClass =
	'text-xl lg:text-2xl font-bold tracking-tight leading-tight';
const bodyClass = 'text-sm lg:text-base opacity-90 leading-relaxed text-justify';

export default function MentatPage() {
	return (
		<BlogPageShell>
			<div className='max-w-3xl mx-auto'>
				<header className='text-center mb-6 lg:mb-8'>
					<div className={`${titleRowClass} mb-16 lg:mb-24`}>
						<Image
							src={MENTAT_LOGO_URL}
							alt=''
							width={1466}
							height={700}
							className='h-[0.9em] w-auto shrink-0'
							unoptimized
						/>
						<h1>MENTAT</h1>
					</div>
					<p className={bodyClass}>
						A passive aerial sensing node designed for distributed aerial
						tracking without radar emissions.
					</p>
				</header>

				<div className='mx-auto mb-8 lg:mb-12 w-full'>
					<img
						src={MENTAT_VID_URL}
						alt='Mentat mesh visualization'
						className='w-full h-auto'
					/>
				</div>

				<div className='space-y-10 text-left'>
					<section className='space-y-3'>
						<h2 className={sectionHeadingClass}>THE PROBLEM</h2>
						<p className={bodyClass}>
							Traditional air defence is built around centralized radars
							protecting limited areas. These systems are expensive, emitting,
							and difficult to scale against dense low altitude threats.
						</p>
					</section>

					<section className='space-y-3'>
						<h2 className={sectionHeadingClass}>WHAT WE&apos;RE BUILDING</h2>
						<p className={bodyClass}>
							Mentat nodes are deployed across rooftops and elevated
							infrastructure as a distributed optical sensing mesh. Each node
							observes part of the sky, while the network combines observations
							into a larger shared air picture.
						</p>
						<p className={bodyClass}>
							Coverage expands as interconnected polygons of monitored airspace
							rather than isolated radar bubbles, allowing the system to scale
							across larger regions with many passive nodes working together.
						</p>
						<ul className={`list-disc pl-5 space-y-2 pt-1 ${bodyClass}`}>
							{FEATURES.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</section>

					<section className='space-y-3'>
						<h2 className={sectionHeadingClass}>WHY NOW</h2>
						<p className={bodyClass}>
							The need is most urgent today. Shahed and other stealthy drones
							are defining modern drone warfare, flooding contested airspace at
							low altitude in numbers and profiles that centralized radars were
							never built to handle.
						</p>
					</section>

					<div className='mx-auto w-full'>
						<img
							src={MENTAT_3D_GIF_URL}
							alt='Mentat node 3D model'
							className='w-full h-auto'
						/>
					</div>
				</div>
			</div>
		</BlogPageShell>
	);
}
