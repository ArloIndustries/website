'use client';

import Link from 'next/link';
import BlogPageShell from '@/components/blog-page-shell';
import { formatBlogDate, getBlogPostsSorted } from '@/lib/blog';
import { useTheme } from 'next-themes';

export default function BlogPage() {
	const { theme } = useTheme();
	const posts = getBlogPostsSorted();
	const isDark = theme === 'dark';
	const borderColor = isDark ? 'border-red-900 hover:border-red-700' : 'border-red-800 hover:border-black';

	return (
		<BlogPageShell backHref='/' backLabel='Back'>
			<div className='max-w-3xl mx-auto'>
				<header className='text-center mb-12 lg:mb-16'>
					<h1 className='text-4xl lg:text-6xl font-bold mb-4'>BLOG</h1>
					<p className='text-base lg:text-lg opacity-90 leading-relaxed'>
						Updates and writing from Arlo Industries.
					</p>
				</header>

				<ul className='space-y-8'>
					{posts.map((post) => (
						<li key={post.slug}>
							<article
								className={`border-2 p-6 lg:p-8 transition-colors ${borderColor}`}
							>
								<time
									dateTime={post.publishedAt}
									className='block text-sm opacity-75 mb-2 tracking-wide'
								>
									{formatBlogDate(post.publishedAt)}
								</time>
								<h2 className='text-2xl lg:text-3xl font-bold mb-3'>
									<Link
										href={`/blog/${post.slug}`}
										className='hover:opacity-80 transition-opacity'
									>
										{post.title.toUpperCase()}
									</Link>
								</h2>
								<p className='opacity-90 leading-relaxed mb-4'>
									{post.excerpt}
								</p>
								<Link
									href={`/blog/${post.slug}`}
									className='text-sm font-bold tracking-wide uppercase underline underline-offset-4 hover:opacity-80 transition-opacity'
								>
									Read more
								</Link>
							</article>
						</li>
					))}
				</ul>
			</div>
		</BlogPageShell>
	);
}
