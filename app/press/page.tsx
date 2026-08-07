'use client';

import Image from 'next/image';
import { Download, Loader2 } from 'lucide-react';
import SiteHeader from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import { formatBlogDate } from '@/lib/blog';
import { getPressCoverageSorted } from '@/lib/press-coverage';
import { formatPressLabel, pressAssetUrl } from '@/lib/press';
import { THEME_CARD_BORDER_CLASS, THEME_SURFACE_CLASS } from '@/lib/theme';

const VISIBLE_ASSET_COUNT_MOBILE = 4;
const VISIBLE_ASSET_COUNT_DESKTOP = 6;

/** Outlined button that inverts on hover; matches page accent per theme */
const OUTLINE_BUTTON_COLOR_CLASS =
	'border-black text-black hover:bg-black hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-black';

export default function PressPage() {
	const [files, setFiles] = useState<string[]>([]);
	const [loadingFiles, setLoadingFiles] = useState(true);
	const [downloadingAll, setDownloadingAll] = useState(false);
	const [showAllAssets, setShowAllAssets] = useState(false);
	const [visibleAssetCount, setVisibleAssetCount] = useState(
		VISIBLE_ASSET_COUNT_DESKTOP,
	);

	const coverage = getPressCoverageSorted();

	useEffect(() => {
		const media = window.matchMedia('(min-width: 1024px)');
		const update = () => {
			setVisibleAssetCount(
				media.matches
					? VISIBLE_ASSET_COUNT_DESKTOP
					: VISIBLE_ASSET_COUNT_MOBILE,
			);
		};
		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	}, []);

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
	const cardBg = 'bg-red-950/25 dark:bg-red-950/40';

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
				'Could not build the download bundle. Try downloading files individually.',
			);
		} finally {
			setDownloadingAll(false);
		}
	}, [files, downloadingAll]);

	const downloadAllButtonClass =
		'rounded-none border-2 font-bold tracking-wide uppercase text-sm shrink-0 disabled:opacity-50 bg-black text-white border-black hover:bg-zinc-900 dark:bg-red-500 dark:text-black dark:border-red-500 dark:hover:bg-white dark:hover:text-red-500 dark:hover:border-white';

	const showAllButtonClass = `inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold tracking-wide uppercase border-2 transition-colors ${OUTLINE_BUTTON_COLOR_CLASS}`;

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
					Download all
				</>
			)}
		</Button>
	);

	const visibleFiles = showAllAssets
		? files
		: files.slice(0, visibleAssetCount);

	return (
		<div
			className={`min-h-screen flex flex-col ${THEME_SURFACE_CLASS} relative overflow-hidden transition-colors duration-300`}
		>
			<SiteHeader />

			<div className='relative z-10 flex-grow px-6 pt-8 pb-16 lg:px-12 lg:pt-16 lg:pb-24'>
				<div className='max-w-6xl mx-auto'>
					<header className='text-center mb-10 lg:mb-14'>
						<h1 className='text-4xl lg:text-6xl font-bold mb-4'>PRESS</h1>
						<p className='text-base lg:text-lg max-w-2xl mx-auto opacity-90 leading-relaxed'>
							Media coverage of Arlo Industries, plus official logos and brand
							assets for publication.
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

					{/* Brand assets */}
					<section
						aria-label='Brand assets'
						className='mt-20 pb-16 lg:mt-28 lg:pb-24'
					>
						<header className='text-center mb-10 lg:mb-14'>
							<h2 className='text-3xl lg:text-5xl font-bold mb-4'>
								BRAND ASSETS
							</h2>
							<p className='text-base lg:text-lg max-w-2xl mx-auto opacity-90 leading-relaxed'>
								Official Arlo Industries logos. Download individual files or
								grab the full press kit as a ZIP.
							</p>
							<div className='mt-6 flex justify-center'>{downloadAllButton}</div>
						</header>

						{loadingFiles && (
							<p className='text-center opacity-80 flex items-center justify-center gap-2'>
								<Loader2 className='w-5 h-5 animate-spin' />
								Loading assets…
							</p>
						)}

						{!loadingFiles && files.length === 0 && (
							<p className='text-center opacity-80'>
								No press assets found. Add images to{' '}
								<code className='opacity-100'>public/press</code>.
							</p>
						)}

						{!loadingFiles && files.length > 0 && (
							<>
								<ul className='grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6'>
									{visibleFiles.map((filename) => (
										<li
											key={filename}
											className={`flex min-w-0 flex-col ${cardBg}`}
										>
											<div className='relative aspect-square overflow-hidden bg-zinc-200 dark:bg-zinc-800 sm:aspect-[4/3]'>
												<Image
													src={pressAssetUrl(filename)}
													alt={formatPressLabel(filename)}
													fill
													draggable={false}
													sizes='(max-width: 1024px) 50vw, 33vw'
													className='object-contain p-3 sm:p-5 lg:p-6'
													unoptimized
												/>
											</div>
											<div className='flex flex-grow flex-col gap-2 p-3 sm:gap-3 sm:p-4'>
												<div className='min-w-0'>
													<p className='truncate text-xs font-bold leading-tight sm:text-sm lg:text-base'>
														{formatPressLabel(filename)}
													</p>
													<p className='mt-1 hidden truncate text-xs opacity-70 sm:block'>
														{filename}
													</p>
												</div>
												<a
													href={pressAssetUrl(filename)}
													download={filename}
													className={`mt-auto inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-[11px] font-bold tracking-wide uppercase border-2 transition-colors sm:gap-2 sm:px-4 sm:text-sm ${OUTLINE_BUTTON_COLOR_CLASS}`}
												>
													<Download className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
													Download
												</a>
											</div>
										</li>
									))}
								</ul>

								{files.length > visibleAssetCount && (
									<div className='mt-8 flex justify-center'>
										<button
											type='button'
											onClick={() => setShowAllAssets((prev) => !prev)}
											className={showAllButtonClass}
										>
											{showAllAssets
												? 'Show less'
												: `Show all (${files.length})`}
										</button>
									</div>
								)}
							</>
						)}
					</section>
				</div>
			</div>
		</div>
	);
}
