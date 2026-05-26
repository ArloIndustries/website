/** Outline frame; hover fills red with black text (matches GET IN TOUCH). */
export function outlineCtaClass(isDark: boolean, extra = ''): string {
	const outline = isDark
		? 'border-2 border-red-500 bg-transparent text-red-500 hover:bg-red-500 hover:text-black hover:border-red-500'
		: 'border-2 border-white/90 bg-transparent text-white hover:bg-red-500 hover:text-black hover:border-red-500';

	return `${extra} transition-colors ${outline}`.trim();
}
