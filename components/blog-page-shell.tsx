'use client';

import SiteHeader from '@/components/site-header';
import { useTheme } from 'next-themes';
import { useEffect, useState, type ReactNode } from 'react';

type BlogPageShellProps = {
	children: ReactNode;
};

export default function BlogPageShell({ children }: BlogPageShellProps) {
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const isDark = theme === 'dark';
	const bgColor = isDark ? 'bg-black' : 'bg-red-600';
	const textColor = isDark ? 'text-red-500' : 'text-black';
	if (!isMounted) {
		return null;
	}

	return (
		<div
			className={`min-h-screen flex flex-col ${bgColor} ${textColor} relative overflow-hidden transition-colors duration-300`}
		>
			<SiteHeader />

			<div className='relative z-10 flex-grow px-6 py-8 lg:py-16 pb-16 lg:pb-24'>
				{children}
			</div>
		</div>
	);
}
