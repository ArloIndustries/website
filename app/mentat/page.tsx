'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import BlogPageShell from '@/components/blog-page-shell';
import { MENTAT_LOGO_URL } from '@/lib/mentat';
import { useTheme } from 'next-themes';

const MentatViewer = dynamic(() => import('@/components/mentat-viewer'), {
	ssr: false,
	loading: () => (
		<div className='flex h-full w-full items-center justify-center text-sm opacity-60'>
			Loading model…
		</div>
	),
});

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
	const { theme } = useTheme();
	const isDark = theme === 'dark';

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
					<p className={`${bodyClass} max-w-2xl mx-auto`}>
						A passive aerial sensing node designed for distributed aerial
						tracking without radar emissions.
					</p>
				</header>

				<div className='relative mx-auto mb-8 lg:mb-12 h-[300px] sm:h-[380px] lg:h-[440px] max-w-2xl'>
					<MentatViewer isDark={isDark} />
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

					<section className='space-y-3 pb-4'>
						<h2 className={sectionHeadingClass}>WHY NOW</h2>
						<p className={bodyClass}>
							The need is most urgent today. Shahed and other stealthy drones
							are defining modern drone warfare, flooding contested airspace at
							low altitude in numbers and profiles that centralized radars were
							never built to handle.
						</p>
					</section>
				</div>
			</div>
		</BlogPageShell>
	);
}
