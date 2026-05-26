'use client';

import { ArrowUpRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { YC_LAUNCH_URL } from '@/lib/yc';

type YcLaunchUpvoteProps = {
	className?: string;
};

export default function YcLaunchUpvote({ className = '' }: YcLaunchUpvoteProps) {
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <div className={`h-[42px] ${className}`} aria-hidden />;
	}

	const isDark = theme === 'dark';

	return (
		<a
			href={YC_LAUNCH_URL}
			target='_blank'
			rel='noopener noreferrer'
			className={`
				group flex w-full items-stretch border-2 transition-colors
				${
					isDark
						? 'border-red-500 bg-black hover:bg-red-500 hover:text-black'
						: 'border-white/90 bg-black/30 hover:border-red-500 hover:bg-red-500 hover:text-black'
				}
				${className}
			`}
			aria-label='Upvote Arlo Industries on Y Combinator Launch'
		>
			<span
				className={`flex shrink-0 items-center justify-center border-r-2 px-3 py-2.5 text-sm font-bold leading-none bg-red-500 text-black transition-colors ${
					isDark ? 'border-red-500' : 'border-white/90'
				}`}
				aria-hidden
			>
				Y
			</span>
			<span
				className={`flex min-w-0 flex-1 items-center justify-between gap-2 px-3 py-2.5 text-xs font-bold tracking-wide uppercase sm:text-sm transition-colors ${
					isDark ? 'text-red-500 group-hover:text-black' : 'text-white group-hover:text-black'
				}`}
			>
				<span className='truncate'>Upvote YC launch</span>
				<ArrowUpRight
					className='h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
					aria-hidden
				/>
			</span>
		</a>
	);
}
