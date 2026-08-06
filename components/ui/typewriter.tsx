'use client';

import { useState, useEffect } from 'react';

interface TypewriterProps {
	text: string;
	speed?: number;
	className?: string;
	cursorClassName?: string;
	onFinished?: () => void;
	startDelay?: number;
}

export const Typewriter = ({
	text,
	speed = 50,
	className,
	cursorClassName = 'text-current',
	onFinished,
	startDelay = 0,
}: TypewriterProps) => {
	const [displayedText, setDisplayedText] = useState('');
	const [index, setIndex] = useState(0);
	const [isFinished, setIsFinished] = useState(false);
	const [isStarted, setIsStarted] = useState(false);

	useEffect(() => {
		const startTimeout = setTimeout(() => {
			setIsStarted(true);
		}, startDelay);

		return () => clearTimeout(startTimeout);
	}, [startDelay]);

	useEffect(() => {
		if (isStarted && index < text.length) {
			const timeoutId = setTimeout(() => {
				setDisplayedText((prev) => prev + text.charAt(index));
				setIndex((prev) => prev + 1);
			}, speed);
			return () => clearTimeout(timeoutId);
		}
		if (isStarted && !isFinished) {
			setIsFinished(true);
			if (onFinished) {
				onFinished();
			}
		}
	}, [isStarted, index, text, speed, onFinished, isFinished]);

	return (
		<span className={className}>
			{displayedText}
			<span
				className={`arlo-typewriter-cursor ml-0.5 inline-block font-mono font-black ${cursorClassName}`}
			>
				_
			</span>
		</span>
	);
};
