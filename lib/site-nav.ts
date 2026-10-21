export type SiteNavLink = {
	href: string;
	label: string;
	external?: boolean;
};

export const MERCH_URL = 'https://arlo-industries-shop.fourthwall.com/';

export const SITE_NAV_LINKS: SiteNavLink[] = [
	{ href: '/careers', label: 'CAREERS' },
	{ href: '/blog', label: 'BLOG' },
	{ href: '/press', label: 'MEDIA' },
];
