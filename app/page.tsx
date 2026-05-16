'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { useState, useEffect, useRef } from 'react';
import { Typewriter } from '@/components/ui/typewriter';
import NewsletterSignup from '@/components/newsletter-signup';

// Dynamically import the Tetrahedron to avoid SSR issues
const Tetrahedron = dynamic(() => import('@/components/tetrahedron'), {
	ssr: false,
	loading: () => (
		<div className='w-full h-full flex items-center justify-center'>
			Loading...
		</div>
	),
});

export default function Component() {
	const { theme } = useTheme();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [quoteIndex, setQuoteIndex] = useState(0);
	const [logoVersion, setLogoVersion] = useState<'a' | 'b'>('a');
	const initRef = useRef(false);

	const quotes = [
		'“Solving war from first principles.”',
		// '“All warfare is based on deception.” — Sun Tzu',
		'“Making Conflict concise and precise.”',
		'“The eye that sees without being seen.”',
		// '"A society that separates its scholars from its warriors will have its thinking done by cowards and its fighting by fools.'
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

	// Toggle logo version every 0.5 seconds for blinking effect
	useEffect(() => {
		const interval = setInterval(() => {
			setLogoVersion((prev) => (prev === 'a' ? 'b' : 'a'));
		}, 500);

		return () => clearInterval(interval);
	}, []);

	const isDark = theme === 'dark';
	const bgColor = isDark ? 'bg-black' : 'bg-red-600';
	const textColor = isDark ? 'text-red-500' : 'text-black';
	const hoverColor = isDark ? 'hover:text-red-700' : 'hover:text-red-900';
	const buttonBorder = isDark ? 'border-red-500' : 'border-red-900';
	const buttonText = isDark ? 'text-red-500' : 'text-red-900';
	const buttonHover = isDark
		? 'hover:bg-red-500 hover:text-black hover:border-red-500'
		: 'hover:bg-white hover:text-black hover:border-white';
	const tetrahedronColor = isDark ? '#7f1d1d' : '#fca5a5'; // dark red for dark mode, reddish white for light mode

	if (!isMounted) {
		return null;
	}

	return (
		<div
			className={`min-h-screen flex flex-col ${bgColor} ${textColor} relative overflow-hidden transition-colors duration-300`}
		>
			{/* Tactical glitchy grid background with CRT effects - Full page coverage */}
			<div className='absolute inset-0 w-full h-full'>
				<svg
					className='w-full h-full min-h-screen'
					viewBox='0 0 1200 800'
					preserveAspectRatio='xMidYMid slice'
				>
					<defs>
						{/* Main tactical grid with flicker animation */}
						<pattern
							id='tacticalGrid'
							width='60'
							height='60'
							patternUnits='userSpaceOnUse'
						>
							<path
								d='M 60 0 L 0 0 0 60'
								fill='none'
								stroke={
									isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.25)'
								}
								strokeWidth='0.7'
								className='animate-pulse'
								style={{ animationDuration: '2s', animationDelay: '0s' }}
							/>
							<path
								d='M 30 0 L 30 60 M 0 30 L 60 30'
								fill='none'
								stroke={
									isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.15)'
								}
								strokeWidth='0.5'
								className='animate-pulse'
								style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
							/>
						</pattern>

						{/* Glitch overlay pattern with flicker */}
						<pattern
							id='glitchGrid'
							width='120'
							height='80'
							patternUnits='userSpaceOnUse'
						>
							<rect
								x='0'
								y='0'
								width='2'
								height='80'
								fill={
									isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.15)'
								}
								className='animate-pulse'
								style={{ animationDuration: '1.5s', animationDelay: '0.2s' }}
							/>
							<rect
								x='40'
								y='0'
								width='1'
								height='80'
								fill={
									isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.1)'
								}
								className='animate-pulse'
								style={{ animationDuration: '3s', animationDelay: '1s' }}
							/>
							<rect
								x='80'
								y='0'
								width='3'
								height='80'
								fill={
									isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255,255,255,0.12)'
								}
								className='animate-pulse'
								style={{ animationDuration: '2.2s', animationDelay: '0.8s' }}
							/>
							<rect
								x='0'
								y='20'
								width='120'
								height='1'
								fill={
									isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.1)'
								}
								className='animate-pulse'
								style={{ animationDuration: '3.5s', animationDelay: '0.6s' }}
							/>
							<rect
								x='0'
								y='60'
								width='120'
								height='2'
								fill={
									isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255,255,255,0.08)'
								}
								className='animate-pulse'
								style={{ animationDuration: '4s', animationDelay: '1.5s' }}
							/>
						</pattern>

						{/* Subtle scan lines with movement */}
						<pattern
							id='scanLines'
							width='4'
							height='4'
							patternUnits='userSpaceOnUse'
						>
							<rect
								x='0'
								y='0'
								width='4'
								height='1'
								fill={
									isDark ? 'rgba(239, 68, 68, 0.04)' : 'rgba(255,255,255,0.04)'
								}
								className='animate-pulse'
								style={{ animationDuration: '1s', animationDelay: '0.1s' }}
							/>
						</pattern>
					</defs>

					<rect width='100%' height='100%' fill='url(#tacticalGrid)' />
					<rect width='100%' height='100%' fill='url(#glitchGrid)' />
					<rect width='100%' height='100%' fill='url(#scanLines)' />
				</svg>
			</div>

			{/* 3D Tetrahedron as Background - Full page size */}
			<div className='absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-70'>
				<Tetrahedron color={tetrahedronColor} />
			</div>

			{/* Header */}
			<header className='relative z-10 flex items-center justify-between pt-8 pb-4 px-6 lg:px-12'>
				<Link
					href='/'
					className='flex items-center gap-3 hover:opacity-80 transition-opacity'
					aria-label='Arlo Industries – Home'
				>
					<Image
						src={
							isDark ? `/dark${logoVersion}.png` : `/light${logoVersion}.png`
						}
						alt=''
						width={120}
						height={40}
						className='h-8 w-auto'
					/>
				</Link>

				<nav className='hidden md:flex items-center gap-8'>
					<Link
						href='/manifesto'
						className={`${hoverColor} transition-colors font-medium tracking-wide text-sm lg:text-base`}
					>
						MANIFESTO
					</Link>
					<Link
						href='/careers'
						className={`${hoverColor} transition-colors font-medium tracking-wide text-sm lg:text-base`}
					>
						CAREERS
					</Link>
				</nav>

				<Button
					variant='ghost'
					size='icon'
					className='md:hidden'
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				>
					{mobileMenuOpen ? (
						<X className='w-6 h-6' />
					) : (
						<Menu className='w-6 h-6' />
					)}
				</Button>
			</header>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className='relative z-20 md:hidden'>
					<div
						className={`${bgColor} border-t ${
							isDark ? 'border-red-900' : 'border-red-800'
						} px-6 py-4`}
					>
						<Link
							href='/manifesto'
							className={`block ${hoverColor} transition-colors font-medium tracking-wide text-base py-2`}
							onClick={() => setMobileMenuOpen(false)}
						>
							MANIFESTO
						</Link>
						<Link
							href='/careers'
							className={`block ${hoverColor} transition-colors font-medium tracking-wide text-base py-2`}
							onClick={() => setMobileMenuOpen(false)}
						>
							CAREERS
						</Link>
					</div>
				</div>
			)}

			{/* Main Content - Full Screen */}
			<main className='relative z-10 flex-grow flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-0 px-6 lg:px-12 py-12 lg:py-24'>
				{/* Left Content - Title */}
				<div
					className='flex-1 max-w-2xl z-10 cursor-pointer'
					onClick={handleNextQuote}
				>
					<h1 className='text-4xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight'>
						<Typewriter key={quoteIndex} text={quotes[quoteIndex]} speed={30} />
					</h1>
				</div>

				{/* Right Content - Description */}
				<div className='flex-1 max-w-md z-10'>
					{/* <p className='text-base lg:text-lg leading-relaxed opacity-90 font-medium'>
						<Typewriter
							text="Europe is building the drone wall, America is building the golden dome, the world is preparing for the future of drone warfare. It's already here. The problem is, there are too many interceptor drones and too little sensing architecture. We are building Mentat - the world's first optical radar mesh which outperforms current solution by 2-3x the range while being multiple times more cost effective."
							speed={10}
							startDelay={1000} // Start after 1 second
						/>
					</p> */}

					{/* Newsletter Signup under description */}
					<div className='mt-8'>
						<NewsletterSignup />
					</div>
				</div>
			</main>

			{/* Simplified Footer */}
			<footer className='relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between w-full pt-8 pb-8 px-6 lg:px-12'>
				<div className='flex flex-col gap-3'>
					<div className='flex flex-wrap items-center gap-2'>
						<div
							className={`inline-flex items-center gap-2 border px-2 py-[5px] ${
								isDark
									? 'border-red-500/80 bg-red-950/30'
									: 'border-white/25 bg-black/25'
							}`}
						>
							<span
								className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center text-[11px] font-bold leading-none sm:text-[12px] bg-red-500 ${
									isDark ? 'text-black' : 'text-white'
								}`}
								aria-hidden
							>
								Y
							</span>
							<span
								className={`text-[12px] font-medium tracking-wide sm:text-[14px] ${
									isDark ? `${textColor} opacity-95` : 'text-white/95'
								}`}
							>
								Combinator
							</span>
						</div>
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
					{/* <a
						href='https://x.com/deoarlo'
						target='_blank'
						rel='noopener noreferrer'
						className={`${textColor} ${hoverColor} transition-colors`}
						aria-label='X (Twitter)'
					>
						<svg
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='currentColor'
						>
							<path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
						</svg>
					</a> */}
					<a href='mailto:hi@arlo1.com'>
						<Button
							variant='outline'
							size='sm'
							className={
								isDark
									? `${buttonBorder} ${buttonText} ${buttonHover} bg-transparent font-medium tracking-wide rounded-none transition-colors text-sm lg:text-base`
									: 'rounded-none font-medium tracking-wide text-sm !border-2 !border-white/90 !bg-black/30 !text-white transition-colors hover:!bg-black hover:!text-white hover:!border-black lg:text-base'
							}
						>
							GET IN TOUCH
						</Button>
					</a>
				</div>
			</footer>
		</div>
	);
}
