import type React from 'react';
import type { Metadata, Viewport } from 'next';
import { Share_Tech_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';
import './globals.css';

const shareTechMono = Share_Tech_Mono({
	weight: '400',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: SITE_TITLE,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	keywords: [
		'counter-drone',
		'counter-UAS',
		'passive sensing',
		'drone detection',
		'missile tracking',
		'air defence',
		'radar alternative',
		'distributed sensor mesh',
		'Arlo Industries',
	],
	// './' resolves per-route, giving every page a self-referencing canonical
	alternates: { canonical: './' },
	openGraph: {
		type: 'website',
		url: SITE_URL,
		siteName: SITE_NAME,
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		locale: 'en_GB',
	},
	twitter: {
		card: 'summary_large_image',
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
	},
	icons: {
		icon: '/box.png',
	},
};

export const viewport: Viewport = {
	themeColor: '#000000',
};

const organizationJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: SITE_NAME,
	url: SITE_URL,
	logo: `${SITE_URL}/logoA.png`,
	description: SITE_DESCRIPTION,
	founder: {
		'@type': 'Person',
		name: 'Deo Arlo',
		sameAs: 'https://www.linkedin.com/in/deoarlo/',
	},
	sameAs: [
		'https://www.ycombinator.com/companies/arlo-industries',
		'https://www.linkedin.com/in/deoarlo/',
	],
};

const webSiteJsonLd = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: SITE_NAME,
	url: SITE_URL,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en-GB' suppressHydrationWarning>
			<body className={shareTechMono.className}>
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: JSON.stringify([organizationJsonLd, webSiteJsonLd]),
					}}
				/>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
