'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * For the rare component that needs the resolved theme as a JS value (e.g.
 * canvas colours). Prefer Tailwind `dark:` variants (see lib/theme.ts) so
 * content can be server-rendered.
 */
export function useMountedTheme() {
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return { isMounted, isDark: theme === 'dark' };
}
