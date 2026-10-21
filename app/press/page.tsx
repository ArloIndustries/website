'use client';

import Image from 'next/image';
import { Download, Loader2 } from 'lucide-react';
import SiteHeader from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { formatBlogDate } from '@/lib/blog';
import { getPressCoverageSorted } from '@/lib/press-coverage';
import { pressAssetUrl } from '@/lib/press';
import { MERCH_URL } from '@/lib/site-nav';
import { THEME_CARD_BORDER_CLASS, THEME_SURFACE_CLASS } from '@/lib/theme';

export default function PressPage() {
	const [files, setFiles] = useState<string[]>([]);
	const [loadingFiles, setLoadingFiles] = useState(true);
	const [downloadingAll, setDownloadingAll] = useState(false);

	const coverage = getPressCoverageSorted();

	useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
				const res = await fetch('/api/press/files');
				const data = (await res.json()) as { files?: string[] };
				if (!cancelled && Array.isArray(data.files)) {
					setFiles(data.files);
				}
			} finally {
				if (!cancelled) setLoadingFiles(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	const borderColor = THEME_CARD_BORDER_CLASS;

	const downloadAll = useCallback(async () => {
		if (files.length === 0 || downloadingAll) return;

		setDownloadingAll(true);
		try {
			const { default: JSZip } = await import('jszip');
			const zip = new JSZip();

			await Promise.all(
				files.map(async (filename) => {
					const res = await fetch(pressAssetUrl(filename));
					if (!res.ok) throw new Error(`Failed to fetch ${filename}`);
					zip.file(filename, await res.blob());
				}),
			);

			const blob = await zip.generateAsync({ type: 'blob' });
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement('a');
			anchor.href = url;
			anchor.download = 'arlo-industries-press-kit.zip';
			anchor.click();
			URL.revokeObjectURL(url);
		} catch {
			window.alert(
				'Could not build the download bundle. Try again in a moment.',
			);
		} finally {
			setDownloadingAll(false);
		}
	}, [files, downloadingAll]);

	const downloadAllButtonClass =
		'rounded-none border-2 font-bold tracking-wide uppercase text-sm shrink-0 disabled:opacity-50 bg-red-500 text-white border-red-500 hover:bg-black hover:border-black dark:bg-red-500 dark:text-black dark:border-red-500 dark:hover:bg-white dark:hover:text-red-500 dark:hover:border-white';

	const downloadAllButton = (
		<Button
			type='button'
			onClick={downloadAll}
			disabled={loadingFiles || files.length === 0 || downloadingAll}
			className={downloadAllButtonClass}
		>
			{downloadingAll ? (
				<>
					<Loader2 className='w-4 h-4 mr-2 animate-spin' />
					Preparing…
				</>
			) : (
				<>
					<Download className='w-4 h-4 mr-2' />
					Download media kit
				</>
			)}
		</Button>
	);

	return (
		<div
			className={`min-h-screen flex flex-col ${THEME_SURFACE_CLASS} relative overflow-hidden transition-colors duration-300`}
		>
			<SiteHeader />

			<div className='relative z-10 flex-grow px-6 pt-8 pb-16 lg:px-12 lg:pt-16 lg:pb-24'>
				<div className='max-w-6xl mx-auto'>
					<header className='text-center mb-10 lg:mb-14'>
						<h1 className='text-4xl lg:text-6xl font-bold mb-4'>MEDIA</h1>
						<p className='text-base lg:text-lg max-w-2xl mx-auto opacity-90 leading-relaxed'>
							Media coverage of Arlo Industries.
						</p>
					</header>

					{/* Media coverage */}
					<section aria-label='Media coverage' className='w-full'>
						<ul className='space-y-5'>
							{coverage.map((item) => (
								<li key={item.id}>
									<article
										className={`group overflow-hidden border-2 transition-colors duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] ${borderColor}`}
									>
										{item.previewImage && (
											<div className='relative aspect-[1200/630] overflow-hidden md:aspect-auto md:min-h-full'>
												<Image
													src={item.previewImage}
													alt=''
													fill
													draggable={false}
													sizes='(max-width: 768px) 100vw, 256px'
													className='object-cover transition-transform duration-300 group-hover:scale-[1.02]'
												/>
											</div>
										)}
										<div className='p-4 lg:p-5'>
											<div className='mb-2 flex flex-wrap items-baseline justify-between gap-2'>
												<span className='text-xs font-bold tracking-widest uppercase opacity-75'>
													{item.outlet}
												</span>
												<time
													dateTime={item.publishedAt}
													className='text-xs tracking-wide opacity-75'
												>
													{formatBlogDate(item.publishedAt)}
												</time>
											</div>
											<h2 className='text-lg lg:text-xl font-bold mb-2'>
												{item.title.toUpperCase()}
											</h2>
											<p className='text-xs lg:text-sm opacity-90 leading-relaxed mb-3'>
												{item.excerpt}
											</p>
											<div className='flex flex-wrap gap-x-6 gap-y-2'>
												{item.links.map((link) => (
													<a
														key={link.href}
														href={link.href}
														target='_blank'
														rel='noopener noreferrer'
														className='text-xs font-bold tracking-wide uppercase underline underline-offset-4 hover:opacity-80 transition-opacity'
													>
														{link.label} ↗
													</a>
												))}
											</div>
										</div>
									</article>
								</li>
							))}
						</ul>
					</section>

					<section
						aria-label='Media kit'
						className='mt-16 border-t border-black/20 pt-10 dark:border-red-500/40 lg:mt-20'
					>
						<h2 className='text-xl lg:text-2xl font-bold tracking-wide'>
							MEDIA KIT
						</h2>
						<p className='mt-2 max-w-xl text-sm lg:text-base opacity-80 leading-relaxed'>
							Official logos and brand assets, packed as a ZIP.
						</p>
						<div className='mt-5'>{downloadAllButton}</div>
					</section>

					<section
						aria-label='Merch'
						className='mt-16 border-t border-black/20 pt-10 pb-16 dark:border-red-500/40 lg:mt-20 lg:pb-24'
					>
						<h2 className='text-xl lg:text-2xl font-bold tracking-wide'>
							MERCH
						</h2>
						<p className='mt-2 max-w-xl text-sm lg:text-base opacity-80 leading-relaxed'>
							Official Arlo Industries shop.
						</p>
						<a
							href={MERCH_URL}
							target='_blank'
							rel='noopener noreferrer'
							className='mt-5 inline-flex items-center justify-center rounded-none border-2 px-4 py-2 text-sm font-bold tracking-wide uppercase border-black text-black hover:bg-red-500 hover:text-white hover:border-red-500 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-black'
						>
							Visit shop ↗
						</a>
					</section>
				</div>
			</div>
		</div>
	);
}
