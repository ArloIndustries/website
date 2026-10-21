'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = resolvedTheme === 'dark';
	const label = !mounted
		? 'Toggle color theme'
		: isDark
			? 'Switch to light mode'
			: 'Switch to dark mode';

	return (
		<button
			type='button'
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			disabled={!mounted}
			aria-label={label}
			className="relative isolate shrink-0 rounded-none p-2 text-black transition-colors hover:text-red-500 dark:text-red-500 dark:hover:text-red-700 dark:before:absolute dark:before:-inset-1 dark:before:-z-10 dark:before:bg-black/35 dark:before:backdrop-blur-md dark:before:content-['']"
		>
			{!mounted ? (
				<span className='block h-5 w-5' aria-hidden />
			) : isDark ? (
				<Sun className='h-5 w-5' aria-hidden />
			) : (
				<Moon className='h-5 w-5' aria-hidden />
			)}
		</button>
	);
}
