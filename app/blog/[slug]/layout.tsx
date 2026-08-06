import type { Metadata } from 'next';
import { blogPosts, getBlogPost } from '@/lib/blog';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export function generateStaticParams() {
	return blogPosts.map((post) => ({ slug: post.slug }));
}

type LayoutProps = {
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({
	params,
}: LayoutProps): Promise<Metadata> {
	const { slug } = await params;
	const post = getBlogPost(slug);

	if (!post) {
		return { title: 'Post not found' };
	}

	return {
		title: post.title,
		description: post.excerpt,
		openGraph: {
			type: 'article',
			title: post.title,
			description: post.excerpt,
			url: `${SITE_URL}/blog/${post.slug}`,
			siteName: SITE_NAME,
			publishedTime: `${post.publishedAt}T12:00:00Z`,
		},
	};
}

export default async function BlogPostLayout({
	children,
	params,
}: LayoutProps) {
	const { slug } = await params;
	const post = getBlogPost(slug);

	const articleJsonLd = post && {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: post.title,
		description: post.excerpt,
		datePublished: post.publishedAt,
		url: `${SITE_URL}/blog/${post.slug}`,
		author: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL,
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME,
			logo: {
				'@type': 'ImageObject',
				url: `${SITE_URL}/logoA.png`,
			},
		},
	};

	return (
		<>
			{articleJsonLd && (
				<script
					type='application/ld+json'
					dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
				/>
			)}
			{children}
		</>
	);
}
