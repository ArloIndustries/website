'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useState, useEffect, useRef } from 'react';
import { Typewriter } from '@/components/ui/typewriter';
import HomeCtaColumn from '@/components/home-cta-column';
import SiteHeader from '@/components/site-header';

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

const CAPABILITIES = [
	{
		index: '01',
		title: 'PASSIVE & UNDETECTABLE',
		body: 'Zero RF emissions. Nothing to jam, nothing to detect, nothing for anti-radiation weapons to home on. Your defenses see the sky without ever revealing themselves.',
	},
	{
		index: '02',
		title: 'REAL-TIME 3D TRACKING',
		body: 'Live 3D position, velocity, and heading for every target, from a single low-RCS drone to a full swarm. Low-latency data that feeds straight into your interceptors and effectors.',
	},
	{
		index: '03',
		title: 'RESILIENT & SCALABLE',
		body: 'No single point of failure: coverage holds even when nodes are lost. Man-portable, quick to deploy, GNSS-denied capable, and up to 10x cheaper than alternatives.',
	},
];

export default function Component() {
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);
	const [quoteIndex, setQuoteIndex] = useState(0);
	const initRef = useRef(false);

	const quotes = [
		'Track drones and missiles without radars',
		// 'Solving war from first principles',
		// 'Making Conflict concise and precise',
	];

	useEffect(() => {
		if (!initRef.current) {
			initRef.current = true;
			// Get current index, modulo by length just in case the list shortened
			const storedIndex = parseInt(
				localStorage.getItem('arlo_quote_index') || '0',
				10,
			);
			const validIndex = storedIndex % quotes.length;

			setQuoteIndex(validIndex);

			// Save the next index for the next refresh
			localStorage.setItem(
				'arlo_quote_index',
				((validIndex + 1) % quotes.length).toString(),
			);
		}
		setIsMounted(true);
	}, [quotes.length]);

	const handleNextQuote = () => {
		setQuoteIndex((prev) => {
			const nextIndex = (prev + 1) % quotes.length;
			// Sync with localStorage so next refresh continues sequentially from the manually selected quote
			localStorage.setItem(
				'arlo_quote_index',
				((nextIndex + 1) % quotes.length).toString(),
			);
			return nextIndex;
		});
	};

	const isDark = theme === 'dark';
	const bgColor = isDark ? 'bg-black' : 'bg-red-600';
	const textColor = isDark ? 'text-red-500' : 'text-black';
	const hoverColor = isDark ? 'hover:text-red-700' : 'hover:text-red-900';
	const buttonBorder = isDark ? 'border-red-500' : 'border-red-900';
	const buttonText = isDark ? 'text-red-500' : 'text-red-900';
	const buttonHover = isDark
		? 'hover:bg-red-500 hover:text-black hover:border-red-500'
		: 'hover:bg-white hover:text-black hover:border-white';
	const sectionBorder = isDark ? 'border-red-500/40' : 'border-black/30';
	const mutedText = isDark ? 'text-red-500/70' : 'text-black/70';

	if (!isMounted) {
		return null;
	}

	return (
		<div
			className={`min-h-screen flex flex-col ${bgColor} ${textColor} relative transition-colors duration-300`}
		>
			{/* Hero — full viewport with the live defense-grid simulation */}
			<section className='relative flex min-h-[100svh] flex-col overflow-hidden'>
				<DefenseGridBackground isDark={isDark} />

				<SiteHeader />

				<main className='relative z-10 flex-grow flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-0 px-6 lg:px-12 py-12 lg:py-24'>
					{/* Left Content - Title */}
					<div className='flex-1 max-w-2xl z-10'>
						<div
							className={`w-fit p-5 lg:p-7 backdrop-blur-md ${
								isDark
									? 'bg-black/60 shadow-[0_0_40px_rgba(0,0,0,0.6)]'
									: 'bg-red-600/60 shadow-[0_0_40px_rgba(0,0,0,0.2)]'
							}`}
						>
							<div className='cursor-pointer' onClick={handleNextQuote}>
								<h1 className='text-4xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight'>
									<Typewriter
										key={quoteIndex}
										text={quotes[quoteIndex]}
										speed={30}
									/>
								</h1>
							</div>
							<p
								className={`mt-6 max-w-xl text-base lg:text-lg leading-relaxed ${mutedText}`}
							>
								A decentralised grid of passive nodes delivering real-time 3D
								tracking of drones and missiles. Nothing to jam. Nothing to
								detect.
							</p>
							<div className='mt-8 flex flex-wrap items-center gap-4'>
								<Button
									variant='outline'
									size='lg'
									asChild
									className={`rounded-none font-bold tracking-wider text-sm lg:text-base bg-transparent transition-colors ${buttonBorder} ${buttonText} ${buttonHover}`}
								>
									<Link href='/simulator'>▸ PLAN YOUR COVERAGE</Link>
								</Button>
								<span className={`text-xs tracking-[0.25em] ${mutedText}`}>
									LIVE SIMULATION RUNNING ABOVE
								</span>
							</div>
						</div>
					</div>

					{/* Right Content — YC upvote + newsletter */}
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
			<section
				className={`relative z-10 border-t-2 ${sectionBorder} px-6 lg:px-12 py-16 lg:py-24`}
			>
				<div className={`text-xs tracking-[0.35em] ${mutedText}`}>
					THE ARLO GRID
				</div>
				<h2 className='mt-2 text-3xl lg:text-5xl font-black tracking-tight max-w-3xl'>
					Air defense as a network, not a silo.
				</h2>
				<div
					className={`mt-10 grid gap-px sm:grid-cols-3 border ${sectionBorder} ${
						isDark ? 'bg-red-500/30' : 'bg-black/30'
					}`}
				>
					{CAPABILITIES.map((c) => (
						<div
							key={c.index}
							className={`${bgColor} p-6 lg:p-8 transition-colors ${
								isDark ? 'hover:bg-red-950/40' : 'hover:bg-red-500'
							}`}
						>
							<div className={`text-sm font-bold ${mutedText}`}>/{c.index}</div>
							<h3 className='mt-3 text-xl lg:text-2xl font-black tracking-wide'>
								{c.title}
							</h3>
							<p
								className={`mt-3 text-sm lg:text-base leading-relaxed ${mutedText}`}
							>
								{c.body}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Simulator CTA */}
			<section
				className={`relative z-10 border-t-2 ${sectionBorder} px-6 lg:px-12 py-16 lg:py-24`}
			>
				<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8'>
					<div className='max-w-2xl'>
						<div className={`text-xs tracking-[0.35em] ${mutedText}`}>
							INTERACTIVE
						</div>
						<h2 className='mt-2 text-3xl lg:text-5xl font-black tracking-tight'>
							How many nodes to cover your site?
						</h2>
						<p className={`mt-4 text-base lg:text-lg leading-relaxed ${mutedText}`}>
							Draw any area on the map: an airfield, a port, a city district.
							The coverage planner instantly packs the grid for you with node
							count, spacing, and tracking redundancy.
						</p>
					</div>
					<Button
						variant='outline'
						size='lg'
						asChild
						className={`rounded-none font-bold tracking-wider text-base lg:text-lg px-8 py-6 bg-transparent transition-colors shrink-0 ${buttonBorder} ${buttonText} ${buttonHover}`}
					>
						<Link href='/simulator'>LAUNCH SIMULATOR</Link>
					</Button>
				</div>
			</section>

			{/* Simplified Footer */}
			<footer
				className={`relative z-10 border-t-2 ${sectionBorder} flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between w-full pt-8 pb-8 px-6 lg:px-12`}
			>
				<div className='flex flex-col gap-3'>
					<div className='flex flex-wrap items-center gap-2'>
						<a
							href='https://www.ycombinator.com/companies/arlo-industries'
							target='_blank'
							rel='noopener noreferrer'
							className={`group inline-flex items-center gap-2 border px-2 py-[5px] cursor-pointer transition-colors ${
								isDark
									? 'border-red-500/80 bg-red-950/30 hover:border-red-500 hover:bg-red-500'
									: 'border-white/25 bg-black/25 hover:border-red-500 hover:bg-red-500'
							}`}
						>
							<span
								className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center text-[11px] font-bold leading-none sm:text-[12px] bg-red-500 transition-colors ${
									isDark
										? 'text-black group-hover:text-black'
										: 'text-white group-hover:text-black'
								}`}
								aria-hidden
							>
								Y
							</span>
							<span
								className={`text-[12px] font-medium tracking-wide sm:text-[14px] transition-colors ${
									isDark
										? `${textColor} opacity-95 group-hover:text-black group-hover:opacity-100`
										: 'text-white/95 group-hover:text-black'
								}`}
							>
								Combinator
							</span>
						</a>
						<div
							className={`inline-flex items-center gap-2 border px-2 py-[5px] ${
								isDark
									? 'border-red-500/80 bg-red-950/30'
									: 'border-white/25 bg-black/25'
							}`}
						>
							<span
								className={`shrink-0 bg-red-500 px-[5px] py-0.5 text-[11px] font-bold leading-none tracking-tight sm:text-[12px] sm:px-[7px] ${
									isDark ? 'text-black' : 'text-white'
								}`}
							>
								NVIDIA
							</span>
							<span
								className={`text-[12px] font-medium tracking-wide sm:text-[14px] ${
									isDark ? `${textColor} opacity-95` : 'text-white/95'
								}`}
							>
								Inception
							</span>
						</div>
					</div>
					<p
						className={`text-sm lg:text-base font-medium ${
							isDark ? `opacity-60 ${textColor}` : 'text-white/65'
						}`}
					>
						© 2025 Arlo Industries Inc.
					</p>
				</div>

				<div className='flex items-center gap-4'>
					<a
						href='https://www.linkedin.com/in/deoarlo/'
						target='_blank'
						rel='noopener noreferrer'
						className={`transition-colors ${
							isDark
								? `${textColor} ${hoverColor}`
								: 'text-white hover:text-red-200'
						}`}
						aria-label='LinkedIn'
					>
						<svg
							width='22'
							height='22'
							viewBox='0 0 24 24'
							fill='currentColor'
							aria-hidden='true'
						>
							<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
						</svg>
					</a>
					<Button
						variant='outline'
						size='sm'
						asChild
						className={
							isDark
								? `${buttonBorder} ${buttonText} ${buttonHover} bg-transparent font-medium tracking-wide rounded-none transition-colors text-sm lg:text-base`
								: 'rounded-none font-medium tracking-wide text-sm !border-2 !border-white/90 !bg-black/30 !text-white transition-colors hover:!bg-black hover:!text-white hover:!border-black lg:text-base'
						}
					>
						<a
							href='https://www.linkedin.com/in/deoarlo/'
							target='_blank'
							rel='noopener noreferrer'
						>
							GET IN TOUCH
						</a>
					</Button>
				</div>
			</footer>
		</div>
	);
}
