import Link from 'next/link';
import BlogPageShell from '@/components/blog-page-shell';
import { formatBlogDate, getBlogPostsSorted } from '@/lib/blog';
import { THEME_CARD_BORDER_CLASS } from '@/lib/theme';

export default function BlogPage() {
	const posts = getBlogPostsSorted();
	const borderColor = THEME_CARD_BORDER_CLASS;

	return (
		<BlogPageShell>
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
							<Link
								href={`/blog/${post.slug}`}
								className={`group block border-2 p-6 transition-colors duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white lg:p-8 ${borderColor}`}
							>
								<time
									dateTime={post.publishedAt}
									className='mb-2 block text-sm tracking-wide opacity-75 transition-opacity group-hover:opacity-100'
								>
									{formatBlogDate(post.publishedAt)}
								</time>
								<h2 className='text-2xl lg:text-3xl font-bold mb-3'>
									{post.title.toUpperCase()}
								</h2>
								<p className='opacity-90 leading-relaxed mb-4'>
									{post.excerpt}
								</p>
								<span className='text-sm font-bold tracking-wide uppercase underline underline-offset-4'>
									Read more
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</BlogPageShell>
	);
}
