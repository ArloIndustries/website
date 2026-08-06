import type { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
	const pages: MetadataRoute.Sitemap = [
		{ url: `${SITE_URL}/`, priority: 1 },
		{ url: `${SITE_URL}/mentat`, priority: 0.9 },
		{ url: `${SITE_URL}/simulator`, priority: 0.8 },
		{ url: `${SITE_URL}/blog`, priority: 0.7 },
		{ url: `${SITE_URL}/press`, priority: 0.6 },
		{ url: `${SITE_URL}/careers`, priority: 0.6 },
	];

	const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
		url: `${SITE_URL}/blog/${post.slug}`,
		lastModified: new Date(`${post.publishedAt}T12:00:00Z`),
		priority: 0.7,
	}));

	return [...pages, ...posts];
}
