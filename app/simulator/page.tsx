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
				<p className='max-w-3xl text-sm opacity-70 lg:text-base'>
					Draw the area you need to defend. The planner packs Arlo nodes so
					every point of sky is watched by enough passive sensors to
					triangulate drones and missiles in 3D — no radar required.
				</p>
			</div>
			<div className='relative flex-1 border-t-2 border-red-500/60'>
				<CoverageSimulator />
			</div>
		</div>
	);
}
