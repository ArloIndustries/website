'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type AnimatedLogoProps = {
	srcA: string;
	srcB: string;
	alt: string;
	width: number;
	height: number;
	className?: string;
	wrapperClassName?: string;
	sizes?: string;
	priority?: boolean;
	unoptimized?: boolean;
};

/**
 * Keeps both logo frames loaded, then switches their visibility every 500ms.
 * This preserves the original dot/no-dot blink without a loading gap.
 */
export default function AnimatedLogo({
	srcA,
	srcB,
	alt,
	width,
	height,
	className,
	wrapperClassName,
	sizes,
	priority,
	unoptimized,
}: AnimatedLogoProps) {
	const [showFrameA, setShowFrameA] = useState(true);
	const imageProps = {
		width,
		height,
		className,
		sizes,
		priority,
		unoptimized,
	};

	useEffect(() => {
		const interval = window.setInterval(() => {
			setShowFrameA((current) => !current);
		}, 500);

		return () => window.clearInterval(interval);
	}, []);

	return (
		<span className={`inline-grid ${wrapperClassName ?? ''}`}>
			<Image
				{...imageProps}
				src={srcA}
				alt={alt}
				className={`col-start-1 row-start-1 ${
					showFrameA ? 'opacity-100' : 'opacity-0'
				} ${className ?? ''}`}
			/>
			<Image
				{...imageProps}
				src={srcB}
				alt=''
				aria-hidden
				className={`col-start-1 row-start-1 ${
					showFrameA ? 'opacity-0' : 'opacity-100'
				} ${className ?? ''}`}
			/>
		</span>
	);
}
