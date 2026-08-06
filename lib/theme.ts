/**
 * Theme styling via Tailwind `dark:` variants. next-themes sets the `dark`
 * class on <html> before first paint, so these render correctly on the server
 * with no mount-gating and no hydration mismatch.
 */

/** Page background + text colours shared by full-page surfaces */
export const THEME_SURFACE_CLASS =
	'bg-red-600 text-black dark:bg-black dark:text-red-500';

/** Card/figure border colour shared by blog, press, and careers pages */
export const THEME_CARD_BORDER_CLASS = 'border-red-800 dark:border-red-900';

/** Outline frame; hover fills red with black text (matches GET IN TOUCH). */
export const OUTLINE_CTA_CLASS =
	'transition-colors border-2 bg-transparent border-white/90 text-white hover:bg-red-500 hover:text-black hover:border-red-500 dark:border-red-500 dark:text-red-500';
