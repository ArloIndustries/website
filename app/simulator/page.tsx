'use client';

import dynamic from 'next/dynamic';
import { useEffect, useId, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import SiteHeader from '@/components/site-header';
import { THEME_SURFACE_CLASS } from '@/lib/theme';

// Leaflet touches `window`, client-only
const CoverageSimulator = dynamic(
	() => import('@/components/coverage-simulator'),
	{
		ssr: false,
		loading: () => (
			<div className='flex h-full w-full items-center justify-center text-red-500'>
				<div className='animate-pulse tracking-[0.3em] text-xs sm:text-sm'>
					INITIALIZING TACTICAL MAP…
				</div>
			</div>
		),
	},
);

export default function SimulatorPage() {
	const [isMethodNoteOpen, setIsMethodNoteOpen] = useState(false);
	const noteId = useId();
	const noteRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isMethodNoteOpen) return;

		const onPointerDown = (event: PointerEvent) => {
			if (!noteRef.current?.contains(event.target as Node)) {
				setIsMethodNoteOpen(false);
			}
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsMethodNoteOpen(false);
		};

		document.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('keydown', onKeyDown);
		};
	}, [isMethodNoteOpen]);

	return (
		<div
			className={`flex h-[100dvh] flex-col overflow-hidden ${THEME_SURFACE_CLASS}`}
		>
			<SiteHeader />
			<div className='shrink-0 px-4 pt-3 pb-2 sm:px-6 sm:pt-6 sm:pb-3 lg:px-12 lg:pt-10'>
				<div className='relative z-[700] flex items-center gap-1.5 sm:gap-2'>
					<h1 className='text-lg font-black tracking-tight sm:text-2xl lg:text-3xl'>
						COVERAGE SIMULATOR
					</h1>
					<div
						ref={noteRef}
						className='relative shrink-0'
						onMouseEnter={() => setIsMethodNoteOpen(true)}
						onMouseLeave={() => setIsMethodNoteOpen(false)}
					>
						<button
							type='button'
							aria-expanded={isMethodNoteOpen}
							aria-controls={noteId}
							aria-label='Simulation note'
							onClick={() => setIsMethodNoteOpen((open) => !open)}
							className='inline-flex h-8 w-8 items-center justify-center text-current opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'
						>
							<Info className='h-4 w-4 sm:h-5 sm:w-5' strokeWidth={2.25} aria-hidden />
						</button>
						<div
							id={noteId}
							role='note'
							className={`absolute left-0 top-full z-[700] mt-2 w-[min(22rem,calc(100vw-2rem))] origin-top-left border-2 border-red-500 bg-black/95 p-3 text-xs font-mono leading-relaxed text-red-400 shadow-[0_0_18px_rgba(239,68,68,0.35)] backdrop-blur-md transition-all duration-200 sm:mt-3 sm:w-[min(28rem,calc(100vw-3rem))] sm:p-4 sm:text-sm ${
								isMethodNoteOpen
									? 'visible scale-100 opacity-100'
									: 'invisible scale-95 opacity-0'
							}`}
						>
							<span className='mb-1.5 block text-[10px] font-black tracking-widest text-red-500 sm:mb-2 sm:text-xs'>
								SIMULATION NOTE
							</span>
							This simulator uses a simplified equidistant grid for rapid
							coverage estimates. Actual deployment uses a comprehensive
							positioning model that accounts for terrain, elevation, and
							line-of-sight constraints.
						</div>
					</div>
				</div>
				<p className='relative z-[600] mt-1.5 hidden max-w-3xl text-sm opacity-70 sm:mt-3 sm:block lg:my-4 lg:text-base'>
					Draw the area you need to defend. The planner packs Arlo nodes so every
					point of sky gets persistent, real-time 3D tracking of drones and
					missiles. No radar required.
				</p>
			</div>
			<div className='relative min-h-0 flex-1 border-t-2 border-red-500/60'>
				<CoverageSimulator />
			</div>
		</div>
	);
}
