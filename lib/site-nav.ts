export type SiteNavLink = {
	href: string;
	label: string;
	/** MENTAT, outline CTA style */
	emphasize?: boolean;
	external?: boolean;
};

export const SITE_NAV_LINKS: SiteNavLink[] = [
	{ href: '/mentat', label: 'MENTAT', emphasize: true },
	{ href: '/simulator', label: 'SIMULATOR' },
	{ href: '/careers', label: 'CAREERS' },
	{ href: '/blog', label: 'BLOG' },
	{ href: '/press', label: 'PRESS' },
	{
		href: 'https://arlo-industries-shop.fourthwall.com/',
		label: 'MERCH',
		external: true,
	},
];
