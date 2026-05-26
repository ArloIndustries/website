'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';
import BlogPageShell from '@/components/blog-page-shell';
import ManifestoBody from '@/components/blog/manifesto-body';
import { formatBlogDate, getBlogPost } from '@/lib/blog';

type BlogPostPageProps = {
	params: Promise<{ slug: string }>;
};

function BlogPostContent({ slug }: { slug: string }) {
	const post = getBlogPost(slug);

	if (!post) {
		notFound();
	}

	const highlightClass = 'font-bold';

	return (
		<div className='max-w-4xl mx-auto text-center'>
			<time
				dateTime={post.publishedAt}
				className='block text-sm lg:text-base opacity-75 mb-4 tracking-wide'
			>
				{formatBlogDate(post.publishedAt)}
			</time>
			<h1 className='text-4xl lg:text-6xl font-bold mb-12'>
				{post.title.toUpperCase()}
			</h1>

			{slug === 'manifesto' && (
				<ManifestoBody highlightClass={highlightClass} />
			)}
		</div>
	);
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = use(params);

	return (
		<BlogPageShell>
			<BlogPostContent slug={slug} />
		</BlogPageShell>
	);
}
