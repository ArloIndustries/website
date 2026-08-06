'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import BlogPageShell from '@/components/blog-page-shell';
import { careersImageUrl, pickCareersImages, YC_JOBS_URL } from '@/lib/careers';
import { THEME_CARD_BORDER_CLASS } from '@/lib/theme';
import { useEffect, useState } from 'react';

export default function CareersPage() {
	const [images, setImages] = useState<string[]>([]);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				const res = await fetch('/api/careers/files');
				const data = (await res.json()) as { files?: string[] };
				if (!cancelled && Array.isArray(data.files)) {
					setImages(data.files);
				}
			} catch {
				// Page works without photos
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	const highlightClass = 'font-bold';
	const borderColor = THEME_CARD_BORDER_CLASS;
	const { hero: heroImage, gallery: galleryImages } = pickCareersImages(images);
	const photoClass = 'object-cover grayscale';

	const ctaClass =
		'inline-flex items-center justify-center gap-2 px-8 py-4 text-sm lg:text-base font-bold tracking-wide uppercase border-2 transition-colors bg-black text-white border-black hover:bg-zinc-900 hover:border-zinc-900 dark:bg-red-500 dark:text-black dark:border-red-500 dark:hover:bg-white dark:hover:text-red-500 dark:hover:border-white';

	return (
		<BlogPageShell>
			<div className='max-w-4xl mx-auto'>
				<header className='text-center mb-10 lg:mb-14'>
					<h1 className='text-4xl lg:text-6xl font-bold leading-tight mb-20'>
						Join us to build the future of Air Defence.
					</h1>

					<a
						href={YC_JOBS_URL}
						target='_blank'
						rel='noopener noreferrer'
						className={ctaClass}
					>
						See open roles
						<ExternalLink className='w-4 h-4' aria-hidden />
					</a>

					<p className='mt-20 text-xl lg:text-2xl font-medium opacity-95 leading-relaxed max-w-2xl mx-auto'>
						Come work on world-changing problems that actually matter.
					</p>
				</header>

				{heroImage && (
					<figure className='w-full mb-14 lg:mb-20 text-center'>
						<div
							className={`relative w-full aspect-[16/10] border-2 overflow-hidden ${borderColor}`}
						>
							<Image
								src={careersImageUrl(heroImage)}
								alt='Arlo Industries team'
								fill
								className={photoClass}
								priority
								unoptimized
							/>
						</div>
						<figcaption className='mt-3 text-sm lg:text-base opacity-80'>
							<em>* men and women</em>
						</figcaption>
					</figure>
				)}

				<section className='max-w-2xl mx-auto space-y-4 text-base lg:text-lg text-center opacity-90 leading-relaxed mb-14 lg:mb-20'>
					<p>
						We&apos;re building <span className={highlightClass}>Mentat</span>,
						an optical mesh to track drones and missiles without traditional
						radar. Sensing at the{' '}
						<span className={highlightClass}>tactical edge.</span>
					</p>
					<p>
						<span className={highlightClass}>Small team</span>,{' '}
						<span className={highlightClass}>agile</span>,{' '}
						<span className={highlightClass}>scrappy</span>. We work hard, ship
						real hardware and software, and own problems end to end.
					</p>
				</section>

				{galleryImages.length > 0 && (
					<div
						className={`grid gap-6 mb-14 lg:mb-20 ${
							galleryImages.length === 1
								? 'grid-cols-1'
								: 'grid-cols-1 sm:grid-cols-2'
						}`}
					>
						{galleryImages.map((filename) => (
							<figure
								key={filename}
								className={`relative aspect-[4/3] border-2 overflow-hidden ${borderColor}`}
							>
								<Image
									src={careersImageUrl(filename)}
									alt=''
									fill
									className={photoClass}
									unoptimized
								/>
							</figure>
						))}
					</div>
				)}

				<div className='text-center pt-4 pb-8'>
					<a
						href={YC_JOBS_URL}
						target='_blank'
						rel='noopener noreferrer'
						className={ctaClass}
					>
						See open roles
						<ExternalLink className='w-4 h-4' aria-hidden />
					</a>
				</div>
			</div>
		</BlogPageShell>
	);
}
