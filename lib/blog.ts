export type BlogPostMeta = {
	slug: string;
	title: string;
	/** ISO date (YYYY-MM-DD) */
	publishedAt: string;
	excerpt: string;
};

export const blogPosts: BlogPostMeta[] = [
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
