/**
 * Theme styling via Tailwind `dark:` variants. next-themes sets the `dark`
 * class on <html> before first paint, so these render correctly on the server
 * with no mount-gating and no hydration mismatch.
 */

/** Page background + text colours shared by full-page surfaces */
export const THEME_SURFACE_CLASS =
	'bg-white text-black dark:bg-black dark:text-red-500';

/** Card border colour shared by blog and press list cards */
export const THEME_CARD_BORDER_CLASS = 'border-black/20 dark:border-red-900';

/** Outline frame; hover fills red. Light: black on white. Dark: red on black. */
export const OUTLINE_CTA_CLASS =
	'transition-colors border-2 bg-transparent border-black text-black hover:bg-red-500 hover:text-white hover:border-red-500 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-black';
