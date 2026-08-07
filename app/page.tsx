'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { Typewriter } from '@/components/ui/typewriter';
import AnimatedLogo from '@/components/animated-logo';
import HomeCtaColumn from '@/components/home-cta-column';
import SiteHeader from '@/components/site-header';
import { THEME_SURFACE_CLASS } from '@/lib/theme';
import { useMountedTheme } from '@/lib/use-mounted-theme';

// Dynamically import the 3D defense-grid scene to avoid SSR issues
const DefenseGridBackground = dynamic(
	() => import('@/components/defense-grid'),
	{
		ssr: false,
		loading: () => (
			<div className='w-full h-full flex items-center justify-center opacity-50'>
				<div className='animate-pulse'>Loading Environment...</div>
			</div>
		),
	},
);

const QUOTES = [
	'Track drones and missiles without radars',
	// 'Solving war from first principles',
	// 'Making Conflict concise and precise',
];

const CAPABILITIES = [
	{
		index: '01',
		title: 'PASSIVE & UNDETECTABLE',
		body: 'Zero RF emissions. Nothing to jam, nothing to detect, nothing for anti-radiation weapons to home on. Your defences see the sky without ever revealing themselves.',
	},
	{
		index: '02',
		title: 'REAL-TIME 3D TRACKING',
		body: 'Live 3D position, velocity, and heading for every target, from a single low-RCS drone to a full swarm. Low-latency data that feeds straight into your interceptors and effectors.',
	},
	{
		index: '03',
		title: 'RESILIENT & SCALABLE',
		body: 'Not a single point of failure. System maintains coverage even when some nodes are impacted. Man-portable, quick to deploy, GNSS-denied capable, and up to 10x more cost-effective than alternatives.',
	},
];

const FOOTER_LINKS = [
	{ label: 'HOME', href: '/' },
	{ label: 'SIMULATOR', href: '/simulator' },
	{ label: 'PRESS', href: '/press' },
	{
		label: 'CONTACT',
		href: 'https://www.linkedin.com/in/deoarlo/',
		external: true,
	},
];

/** Heights of the stepped red lines leading into the bottom brand mark */
const BRAND_MARK_STEPS = ['h-px', 'h-0.5', 'h-1', 'h-2', 'h-4', 'h-8', 'h-16'];

const SECTION_HEADING_CLASS =
	'text-[clamp(1.45rem,5vw,3rem)] font-black leading-tight tracking-tight lg:text-5xl';
const BODY_COPY_CLASS = 'text-base font-normal leading-relaxed lg:text-lg';

type TypewriterHeadingOnViewProps = {
	text: string;
	className: string;
	cursorClassName: string;
	threshold: number;
};

/** Section heading that types itself out the first time it scrolls into view */
function TypewriterHeadingOnView({
	text,
	className,
	cursorClassName,
	threshold,
}: TypewriterHeadingOnViewProps) {
	const ref = useRef<HTMLHeadingElement | null>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const heading = ref.current;
		if (!heading || inView) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					observer.disconnect();
				}
			},
			{ threshold },
		);

		observer.observe(heading);

		return () => observer.disconnect();
	}, [inView, threshold]);

	return (
		<h2 ref={ref} className={className}>
			{/* full text stays in the DOM for crawlers and screen readers */}
			<span className='sr-only'>{text}</span>
			<span aria-hidden>
				{inView ? (
					<Typewriter
						text={text}
						speed={30}
						cursorClassName={cursorClassName}
					/>
				) : (
					/* invisible placeholder keeps the height stable until typing starts */
					<span className='opacity-0'>{text}</span>
				)}
			</span>
		</h2>
	);
}

export default function Component() {
	const { isMounted, isDark } = useMountedTheme();
	const [quoteIndex, setQuoteIndex] = useState(0);
	const initRef = useRef(false);

	useEffect(() => {
		if (initRef.current) return;
		initRef.current = true;

		// Get current index, modulo by length just in case the list shortened
		const storedIndex = parseInt(
			localStorage.getItem('arlo_quote_index') || '0',
			10,
		);
		const validIndex = storedIndex % QUOTES.length;

		setQuoteIndex(validIndex);

		// Save the next index for the next refresh
		localStorage.setItem(
			'arlo_quote_index',
			((validIndex + 1) % QUOTES.length).toString(),
		);
	}, []);

	const handleNextQuote = () => {
		setQuoteIndex((prev) => {
			const nextIndex = (prev + 1) % QUOTES.length;
			// Sync with localStorage so next refresh continues sequentially from the manually selected quote
			localStorage.setItem(
				'arlo_quote_index',
				((nextIndex + 1) % QUOTES.length).toString(),
			);
			return nextIndex;
		});
	};

	const textColor = 'text-black dark:text-red-500';
	const sectionBorder = 'border-black/30 dark:border-red-500/40';
	const mutedText = 'text-black/70 dark:text-red-500/70';
	const footerLinkClass =
		'transition-colors hover:text-red-800 dark:hover:text-white';

	return (
		<div
			className={`min-h-screen flex flex-col ${THEME_SURFACE_CLASS} relative transition-colors duration-300`}
		>
			{/* Hero, full viewport with the live defense-grid simulation */}
			<section className='relative flex min-h-[100svh] flex-col overflow-hidden'>
				{isMounted && <DefenseGridBackground isDark={isDark} />}

				<SiteHeader />

				<main className='relative z-10 flex-grow flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-0 px-6 lg:px-12 py-12 lg:py-24'>
					{/* Left Content - Title */}
					<div className='flex-1 max-w-2xl z-10'>
						<div className='relative w-fit'>
							<div
								aria-hidden
								className='arlo-hero-veil absolute -inset-5 lg:-inset-8 backdrop-blur-md bg-red-600/45 dark:bg-black/45'
							/>
							<div
								className='relative cursor-pointer'
								onClick={handleNextQuote}
							>
								<h1 className='text-4xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight'>
									{/* full text stays in the DOM for crawlers and screen readers */}
									<span className='sr-only'>{QUOTES[quoteIndex]}</span>
									<span aria-hidden>
										<Typewriter
											key={quoteIndex}
											text={QUOTES[quoteIndex]}
											speed={30}
											cursorClassName='text-white'
										/>
									</span>
								</h1>
							</div>
							<p
								className={`relative mt-6 max-w-xl ${BODY_COPY_CLASS} ${mutedText}`}
							>
								A decentralised grid of passive nodes delivering real-time 3D
								tracking of drones and missiles. Nothing to jam. Nothing to
								detect.
							</p>
							<div className='relative mt-8 flex flex-wrap items-center gap-4'>
								<Button
									variant='outline'
									size='lg'
									asChild
									className='rounded-none font-bold tracking-wider text-sm lg:text-base bg-transparent transition-colors border-red-900 text-red-900 hover:bg-white hover:text-black hover:border-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-black dark:hover:border-red-500'
								>
									<Link href='/simulator'>▸ PLAN YOUR COVERAGE</Link>
								</Button>
							</div>
						</div>
					</div>

					{/* Right Content, YC upvote + newsletter */}
					<div className='flex-1 max-w-md z-10 flex flex-col items-center justify-center w-full'>
						<HomeCtaColumn />
					</div>
				</main>

				{/* scroll hint */}
				<div className='relative z-10 flex justify-center pb-6'>
					<div
						className={`animate-bounce text-2xl leading-none ${mutedText}`}
						aria-hidden
					>
						▾
					</div>
				</div>
			</section>

			{/* Capabilities */}
			<section className='relative z-10 border-t-2 border-white/30 bg-red-500 px-6 py-24 text-white lg:px-12 lg:py-32'>
				<p className='mb-4 text-sm tracking-[0.24em] text-black'>PHILOSOPHY</p>
				<TypewriterHeadingOnView
					text='Air defence as a network, not a target.'
					className={`mt-2 max-w-none lg:whitespace-nowrap ${SECTION_HEADING_CLASS}`}
					cursorClassName='text-black'
					threshold={0.1}
				/>
				<div className='mt-14 lg:mt-20 grid gap-px sm:grid-cols-3 border border-white/30 bg-white/30'>
					{CAPABILITIES.map((c) => (
						<div
							key={c.index}
							className='group bg-red-500 p-8 text-white transition-colors hover:bg-black lg:p-12'
						>
							<div className='text-sm font-bold text-white/75 transition-colors group-hover:text-red-500'>
								/{c.index}
							</div>
							<h3 className='mt-3 text-xl lg:text-2xl font-black tracking-wide transition-colors group-hover:text-red-500'>
								{c.title}
							</h3>
							<p className='mt-3 text-sm leading-relaxed text-white/75 transition-colors group-hover:text-red-500/80 lg:text-base'>
								{c.body}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* About */}
			<section className='relative z-10 border-t-2 border-red-500/40 bg-black px-6 py-24 text-white lg:px-12 lg:py-32'>
				<div className='mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 lg:gap-16'>
					<div className='relative aspect-[4/3] w-full max-w-md justify-self-center overflow-hidden md:aspect-auto md:h-full md:self-stretch md:justify-self-start'>
						<Image
							src='/about/YC.jpeg'
							alt='Deo Arlo at Y Combinator'
							fill
							draggable={false}
							sizes='(max-width: 768px) 100vw, 448px'
							className='object-cover object-[center_42%]'
						/>
					</div>

					<div>
						<p className='mb-4 text-sm font-black tracking-[0.24em] text-red-500'>
							ABOUT US
						</p>
						<TypewriterHeadingOnView
							text='Built from first-hand experience'
							className={SECTION_HEADING_CLASS}
							cursorClassName='text-red-500'
							threshold={0.2}
						/>
						<p className={`mt-6 max-w-xl text-white/75 ${BODY_COPY_CLASS}`}>
							Founder Deo Arlo spent six over years in Israel&apos;s research
							and high-tech ecosystem, studied at the Technion while living
							through repeated conflict. That first-hand experience shaped our
							mission: passive, decentralised sensing built to protect people,
							borders, and critical infrastructure.
						</p>
						<Link
							href='/blog/our-story'
							className='mt-8 inline-flex border-2 border-red-500 px-6 py-3 text-sm font-black tracking-widest text-red-500 transition-colors hover:bg-red-500 hover:text-black'
						>
							READ OUR STORY
						</Link>
					</div>
				</div>
			</section>

			{/* Simplified Footer */}
			<footer
				className={`relative z-10 border-t-2 ${sectionBorder} w-full pt-16 pb-16 px-6 lg:pt-24 lg:pb-20 lg:px-12 flex flex-col gap-12`}
			>
				{/* Footer Main */}
				<div className='grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-start'>
					{/* Left: Brand info (4 columns) */}
					<div className='md:col-span-4 flex flex-col gap-4'>
						<Link
							href='/'
							className='flex shrink-0 items-center gap-3 hover:opacity-80 transition-opacity w-fit'
							aria-label='Arlo Industries – Home'
						>
							<AnimatedLogo
								srcA='/logoA.png'
								srcB='/logoB.png'
								alt='Arlo Industries'
								width={120}
								height={40}
								unoptimized
								className='h-8 w-auto'
							/>
						</Link>
						<div
							className={`text-sm lg:text-base font-black tracking-widest leading-relaxed uppercase ${mutedText}`}
						>
							Decentralised Aerial Defence
						</div>
					</div>

					{/* Middle: Links (3 columns) */}
					<div className='md:col-span-3 flex flex-col gap-3.5 text-sm lg:text-base font-black tracking-widest uppercase'>
						{FOOTER_LINKS.map((link) =>
							link.external ? (
								<a
									key={link.href}
									href={link.href}
									target='_blank'
									rel='noopener noreferrer'
									className={footerLinkClass}
								>
									{link.label}
								</a>
							) : (
								<Link
									key={link.href}
									href={link.href}
									className={footerLinkClass}
								>
									{link.label}
								</Link>
							),
						)}
					</div>

					{/* Right: Key-Value Table (5 columns) */}
					<div
						className={`md:col-span-5 border-t md:border-t-0 border-b md:border-b-0 border-red-500/20 py-6 md:py-0 flex flex-col gap-2.5 text-sm lg:text-base font-black tracking-wider uppercase ${mutedText}`}
					>
						<div
							className={`flex items-center justify-between border-b ${sectionBorder} pb-2.5`}
						>
							<span>COMPANY</span>
							<span className={textColor}>ARLO INDUSTRIES</span>
						</div>
						<div
							className={`flex items-center justify-between border-b ${sectionBorder} py-2.5`}
						>
							<span>BACKED BY</span>
							<span className={textColor}>Y COMBINATOR</span>
						</div>
						<div className='flex items-center justify-between pt-2.5'>
							<span>OFFICES</span>
							<span className={textColor}>San Francisco · KYIV</span>
						</div>
					</div>
				</div>

				{/* Footer Bottom Bar */}
				<div
					className={`border-t ${sectionBorder} pt-8 text-sm lg:text-base font-black tracking-widest uppercase ${mutedText}`}
				>
					<div>© 2025 ARLO INDUSTRIES</div>
				</div>
			</footer>

			{/* Bottom brand mark */}
			<section className='relative z-10 w-full' aria-label='Arlo Industries'>
				<div className='flex flex-col gap-3 bg-black py-3' aria-hidden>
					{BRAND_MARK_STEPS.map((height) => (
						<div key={height} className={`${height} bg-red-500`} />
					))}
				</div>
				<div className='flex items-center justify-center bg-red-500 px-6 py-8 lg:px-12 lg:py-12'>
					<AnimatedLogo
						srcA='/arlo1ndustriesBlack2a.png'
						srcB='/arlo1ndustriesBlack2b.png'
						alt='Arlo Industries'
						width={7300}
						height={500}
						sizes='(max-width: 1600px) 100vw, 1600px'
						wrapperClassName='w-full max-w-[1600px]'
						className='h-auto w-full'
					/>
				</div>
			</section>
		</div>
	);
}
