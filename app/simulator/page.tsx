'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import SiteHeader from '@/components/site-header';

// Leaflet touches `window` — client-only
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
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => setIsMounted(true), []);
	if (!isMounted) return null;

	const isDark = theme === 'dark';

	return (
		<div
			className={`flex h-[100dvh] flex-col overflow-hidden ${
				isDark ? 'bg-black text-red-500' : 'bg-red-600 text-black'
			}`}
		>
			<SiteHeader />
			<div className='px-6 pb-3 lg:px-12'>
				<h1 className='text-2xl font-black tracking-tight lg:text-3xl'>
					COVERAGE SIMULATOR
				</h1>
				<p className='my-4 max-w-3xl text-sm opacity-70 lg:text-base lg:my-6 relative z-[600]'>
					Draw the area you need to defend. The planner packs Arlo nodes
					<span className='relative group inline-block cursor-help text-red-500 font-bold px-0.5 ml-0.5'>
						*
						<span className='absolute left-1/2 bottom-full mb-2 w-72 -translate-x-1/2 scale-0 border border-red-500 bg-black/95 p-3 text-xs font-mono leading-normal text-red-400 opacity-0 transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 shadow-[0_0_10px_rgba(239,68,68,0.3)] pointer-events-none rounded-none normal-case tracking-normal'>
							Actual deployment uses a comprehensive positioning model considering terrain, elevations, and line-of-sight constraints, rather than a simplified equidistant grid.
						</span>
					</span>{' '}
					so every point of sky gets persistent, real-time 3D tracking of drones
					and missiles. No radar required.
				</p>
			</div>
			<div className='relative flex-1 border-t-2 border-red-500/60'>
				<CoverageSimulator />
			</div>
		</div>
	);
}
