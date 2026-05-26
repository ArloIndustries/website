'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState, type ReactNode } from 'react';

type BlogPageShellProps = {
	backHref?: string;
	backLabel?: string;
	children: ReactNode;
};

export default function BlogPageShell({
	backHref = '/blog',
	backLabel = 'Back to blog',
	children,
}: BlogPageShellProps) {
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const isDark = theme === 'dark';
	const bgColor = isDark ? 'bg-black' : 'bg-red-600';
	const textColor = isDark ? 'text-red-500' : 'text-black';
	const hoverColor = isDark ? 'hover:text-red-700' : 'hover:text-red-900';

	if (!isMounted) {
		return null;
	}

	return (
		<div
			className={`min-h-screen flex flex-col ${bgColor} ${textColor} relative overflow-hidden transition-colors duration-300`}
		>
			<div className='relative z-10 pt-8 pb-4 px-6 lg:px-12'>
				<Link href={backHref}>
					<Button
						variant='ghost'
						className={`flex items-center gap-2 ${hoverColor} transition-colors rounded-none text-sm lg:text-base`}
					>
						<ArrowLeft className='w-4 h-4' />
						{backLabel}
					</Button>
				</Link>
			</div>

			<div className='relative z-10 flex-grow px-6 py-8 lg:py-16 pb-16 lg:pb-24'>
				{children}
			</div>
		</div>
	);
}
