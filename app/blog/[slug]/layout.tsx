import type { Metadata } from 'next';
import { blogPosts, getBlogPost } from '@/lib/blog';

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
		return { title: 'Post not found | Arlo Industries' };
	}

	return {
		title: `${post.title} | Arlo Industries`,
		description: post.excerpt,
	};
}

export default function BlogPostLayout({ children }: LayoutProps) {
	return children;
}
