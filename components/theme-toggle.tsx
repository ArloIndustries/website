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
			className='relative shrink-0 rounded-none p-2 text-red-500 transition-colors hover:text-white'
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
