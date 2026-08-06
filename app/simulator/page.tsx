'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import SiteHeader from '@/components/site-header';
import { THEME_SURFACE_CLASS } from '@/lib/theme';

// Leaflet touches `window`, client-only
const CoverageSimulator = dynamic(
	() => import('@/components/coverage-simulator'),
	{
		ssr: false,
		loading: () => (
			<div className='flex h-full w-full items-center justify-center text-red-500'>
				<div className='animate-pulse tracking-[0.3em]'>
					INITIALIZING TACTICAL MAP…
				</div>
			</div>
		),
	},
);

export default function SimulatorPage() {
	const [isMethodNoteOpen, setIsMethodNoteOpen] = useState(false);

	return (
		<div
			className={`flex h-[100dvh] flex-col overflow-hidden ${THEME_SURFACE_CLASS}`}
		>
			<SiteHeader />
			<div className='px-6 pb-3 lg:px-12'>
				<div className='group relative z-[700] inline-block'>
					<button
						type='button'
						aria-expanded={isMethodNoteOpen}
						aria-describedby='coverage-method-note'
						onClick={() => setIsMethodNoteOpen((open) => !open)}
						className='cursor-help text-left'
					>
						<h1 className='text-2xl font-black tracking-tight lg:text-3xl'>
							COVERAGE SIMULATOR
						</h1>
					</button>
					<div
						id='coverage-method-note'
						role='note'
						className={`absolute left-0 top-full mt-3 w-[min(28rem,calc(100vw-3rem))] origin-top-left border-2 border-red-500 bg-black/95 p-4 text-sm font-mono leading-relaxed text-red-400 shadow-[0_0_18px_rgba(239,68,68,0.35)] backdrop-blur-md transition-all duration-200 ${
							isMethodNoteOpen
								? 'visible scale-100 opacity-100'
								: 'invisible scale-95 opacity-0 group-hover:visible group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100'
						}`}
					>
						<span className='mb-2 block text-xs font-black tracking-widest text-red-500'>
							SIMULATION NOTE
						</span>
						This simulator uses a simplified equidistant grid for rapid coverage
						estimates. Actual deployment uses a comprehensive positioning model
						that accounts for terrain, elevation, and line-of-sight constraints.
					</div>
				</div>
				<p className='relative z-[600] my-4 max-w-3xl text-sm opacity-70 lg:my-6 lg:text-base'>
					Draw the area you need to defend. The planner packs Arlo nodes so every
					point of sky gets persistent, real-time 3D tracking of drones and
					missiles. No radar required.
				</p>
			</div>
			<div className='relative flex-1 border-t-2 border-red-500/60'>
				<CoverageSimulator />
			</div>
		</div>
	);
}
