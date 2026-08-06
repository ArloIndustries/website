export type PressCoverageLink = {
	label: string;
	href: string;
};

export type PressCoverage = {
	/** Unique id for React keys */
	id: string;
	outlet: string;
	title: string;
	/** ISO date (YYYY-MM-DD) */
	publishedAt: string;
	excerpt: string;
	previewImage?: string;
	links: PressCoverageLink[];
};

export const pressCoverage: PressCoverage[] = [
	{
		id: 'ignite-startups-ep285',
		outlet: 'Ignite Podcast, Ep. 285',
		title:
			'Passive Sensors, Drone Swarms, and the Future of Air Defence with Deo Arlo',
		publishedAt: '2026-07-27',
		excerpt:
			'Deo Arlo joins Ignite to discuss replacing 100-year-old radar assumptions with a passive sensor mesh, why sensing, not interceptors, is the real bottleneck in counter-drone defence, and what Ukraine teaches about battlefield innovation.',
		previewImage: '/about/ignite-preview.png',
		links: [
			{
				label: 'Read the article',
				href: 'https://www.teamignite.vc/blog/ignite-startups-passive-sensors-drone-swarms-and-the-future-of-air-defense-with-deo-arlo-or',
			},
			{
				label: 'Listen on Spotify',
				href: 'https://open.spotify.com/episode/4HLTu2v90VFzIIkdZlAhmh',
			},
		],
	},
];

export function getPressCoverageSorted(): PressCoverage[] {
	return [...pressCoverage].sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	);
}
