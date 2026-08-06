export type BlogPostMeta = {
	slug: string;
	title: string;
	/** ISO date (YYYY-MM-DD) */
	publishedAt: string;
	excerpt: string;
};

export const blogPosts: BlogPostMeta[] = [
	{
		slug: 'yc-launch',
		title: 'Arlo Industries joins Y-Combinator',
		publishedAt: '2026-05-25',
		excerpt:
			'We officially launched as part of Y Combinator (P26). Distributed passive sensor networks that track drones and missiles in 3D, no radar, no emissions, no single point of failure.',
	},
	{
		slug: 'our-story',
		title: 'Our Story',
		publishedAt: '2026-05-24',
		excerpt:
			'How lived experience, frontline testing, and years inside the Israeli defence ecosystem shaped Arlo Industries.',
	},
	{
		slug: 'manifesto',
		title: 'Manifesto',
		publishedAt: '2025-10-07',
		excerpt:
			'Conflict is inevitable. We are building the battlefield immune system and solving war from first principles.',
	},
];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
	return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsSorted(): BlogPostMeta[] {
	return [...blogPosts].sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	);
}

export function formatBlogDate(isoDate: string): string {
	const date = new Date(`${isoDate}T12:00:00`);
	return new Intl.DateTimeFormat('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(date);
}
