'use client';

import Link from 'next/link';
import Image from 'next/image';
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
		body: 'Not a single point of failure. System maintains coverage even when some nodes are impacted. Man-portable, quick to deploy, GNSS-denied capable, and up to 10x cheaper than alternatives.',
	},
];

export default function Component() {
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);
	const [quoteIndex, setQuoteIndex] = useState(0);
	const initRef = useRef(false);
	const [logoVersion, setLogoVersion] = useState<'a' | 'b'>('a');

	const quotes = [
		'Track drones and missiles without radars',
		// 'Solving war from first principles',
		// 'Making Conflict concise and precise',
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setLogoVersion((prev) => (prev === 'a' ? 'b' : 'a'));
		}, 500);

		return () => clearInterval(interval);
	}, []);

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
						<div className='relative w-fit'>
							<div
								aria-hidden
								className={`arlo-hero-veil absolute -inset-5 lg:-inset-8 backdrop-blur-md ${
									isDark ? 'bg-black/45' : 'bg-red-600/45'
								}`}
							/>
							<div className='relative cursor-pointer' onClick={handleNextQuote}>
								<h1 className='text-4xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight'>
									<Typewriter
										key={quoteIndex}
										text={quotes[quoteIndex]}
										speed={30}
									/>
								</h1>
							</div>
							<p
								className={`relative mt-6 max-w-xl text-base lg:text-lg leading-relaxed ${mutedText}`}
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
									className={`rounded-none font-bold tracking-wider text-sm lg:text-base bg-transparent transition-colors ${buttonBorder} ${buttonText} ${buttonHover}`}
								>
									<Link href='/simulator'>▸ PLAN YOUR COVERAGE</Link>
								</Button>
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
				className={`relative z-10 border-t-2 ${sectionBorder} px-6 lg:px-12 py-24 lg:py-32`}
			>
				<h2 className='mt-2 text-3xl lg:text-5xl font-black tracking-tight max-w-3xl'>
					Air defense as a network, not a silo.
				</h2>
				<div
					className={`mt-14 lg:mt-20 grid gap-px sm:grid-cols-3 border ${sectionBorder} ${
						isDark ? 'bg-red-500/30' : 'bg-black/30'
					}`}
				>
					{CAPABILITIES.map((c) => (
						<div
							key={c.index}
							className={`${bgColor} p-8 lg:p-12 transition-colors ${
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
							<Image
								src={`/logo${logoVersion.toUpperCase()}.png`}
								alt='Arlo Industries'
								width={120}
								height={40}
								className='h-8 w-auto'
							/>
						</Link>
						<div className={`text-xs font-black tracking-widest leading-relaxed uppercase ${mutedText}`}>
							Decentralised Aerial Defence
						</div>
					</div>

					{/* Middle: Links (3 columns) */}
					<div className='md:col-span-3 flex flex-col gap-3.5 font-black text-xs tracking-widest uppercase'>
						<Link href='/' className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-red-800'}`}>HOME</Link>
						<Link href='/simulator' className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-red-800'}`}>SIMULATOR</Link>
						<Link href='/press' className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-red-800'}`}>PRESS</Link>
						<a href='https://www.linkedin.com/in/deoarlo/' target='_blank' rel='noopener noreferrer' className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-red-800'}`}>CONTACT</a>
					</div>

					{/* Right: Key-Value Table (5 columns) */}
					<div className={`md:col-span-5 border-t md:border-t-0 border-b md:border-b-0 border-red-500/20 py-6 md:py-0 flex flex-col gap-2.5 text-xs font-black tracking-wider uppercase ${mutedText}`}>
						<div className={`flex items-center justify-between border-b ${sectionBorder} pb-2.5`}>
							<span>COMPANY</span>
							<span className={textColor}>ARLO INDUSTRIES</span>
						</div>
						<div className={`flex items-center justify-between border-b ${sectionBorder} py-2.5`}>
							<span>BACKED BY</span>
							<span className={textColor}>Y COMBINATOR</span>
						</div>
						<div className={`flex items-center justify-between pt-2.5`}>
							<span>OFFICES</span>
							<span className={textColor}>San Francisco · KYIV</span>
						</div>
					</div>
				</div>

				{/* Footer Bottom Bar */}
				<div className={`border-t ${sectionBorder} pt-8 text-xs font-black tracking-widest uppercase ${mutedText}`}>
					<div>
						© 2026 ARLO INDUSTRIES
					</div>
				</div>
			</footer>
		</div>
	);
}
