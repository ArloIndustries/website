'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { formatPressLabel, pressAssetUrl } from '@/lib/press';

export default function PressPage() {
	const { theme } = useTheme();
	const [isMounted, setIsMounted] = useState(false);
	const [files, setFiles] = useState<string[]>([]);
	const [loadingFiles, setLoadingFiles] = useState(true);
	const [downloadingAll, setDownloadingAll] = useState(false);

	useEffect(() => {
		setIsMounted(true);
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

	const isDark = theme === 'dark';
	const bgColor = isDark ? 'bg-black' : 'bg-red-600';
	const textColor = isDark ? 'text-red-500' : 'text-black';
	const hoverColor = isDark ? 'hover:text-red-700' : 'hover:text-red-900';
	const borderColor = isDark ? 'border-red-900' : 'border-red-800';
	const cardBg = isDark ? 'bg-red-950/40' : 'bg-red-950/25';
	const previewBg = 'bg-white';

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

	if (!isMounted) {
		return null;
	}

	return (
		<div
			className={`min-h-screen flex flex-col ${bgColor} ${textColor} relative overflow-hidden transition-colors duration-300`}
		>
			<div className='relative z-10 pt-8 pb-4 px-6 lg:px-12 flex flex-wrap items-center justify-between gap-4'>
				<Link href='/'>
					<Button
						variant='ghost'
						className={`flex items-center gap-2 ${hoverColor} transition-colors rounded-none text-sm lg:text-base`}
					>
						<ArrowLeft className='w-4 h-4' />
						Back
					</Button>
				</Link>

				<Button
					type='button'
					onClick={downloadAll}
					disabled={loadingFiles || files.length === 0 || downloadingAll}
					className={`rounded-none border-2 font-bold tracking-wide uppercase text-sm ${
						isDark
							? 'bg-red-500 text-black border-red-500 hover:bg-white hover:text-red-500 hover:border-white disabled:opacity-50'
							: 'bg-black text-white border-black hover:bg-zinc-900 disabled:opacity-50'
					}`}
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
			</div>

			<div className='relative z-10 flex-grow px-6 pb-16 lg:px-12 lg:pb-24'>
				<div className='max-w-6xl mx-auto'>
					<header className='text-center mb-10 lg:mb-14'>
						<h1 className='text-4xl lg:text-6xl font-bold mb-4'>PRESS</h1>
						<p className='text-base lg:text-lg max-w-2xl mx-auto opacity-90 leading-relaxed'>
							Official Arlo Industries logos and brand assets. Download
							individual files or grab the full press kit as a ZIP.
						</p>
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
						<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
							{files.map((filename) => (
								<li
									key={filename}
									className={`flex flex-col border-2 ${borderColor} ${cardBg}`}
								>
									<div
										className={`relative aspect-[4/3] flex items-center justify-center p-6 ${previewBg}`}
									>
										<Image
											src={pressAssetUrl(filename)}
											alt={formatPressLabel(filename)}
											width={400}
											height={300}
											className='max-h-full w-auto h-auto object-contain'
											unoptimized
										/>
									</div>
									<div className='p-4 flex flex-col gap-3 flex-grow'>
										<div>
											<p className='font-bold text-sm lg:text-base leading-tight'>
												{formatPressLabel(filename)}
											</p>
											<p className='text-xs opacity-70 mt-1 break-all'>
												{filename}
											</p>
										</div>
										<a
											href={pressAssetUrl(filename)}
											download={filename}
											className={`mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold tracking-wide uppercase border-2 transition-colors ${
												isDark
													? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black'
													: 'border-black text-black hover:bg-black hover:text-white'
											}`}
										>
											<Download className='w-4 h-4' />
											Download
										</a>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
}
