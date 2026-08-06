'use client';

import { useState } from 'react';
import { OUTLINE_CTA_CLASS } from '@/lib/theme';

interface NewsletterSignupProps {
	className?: string;
}

const BACK_BUTTON_CLASS =
	'text-sm font-medium underline hover:no-underline transition-all cursor-pointer bg-transparent border-none text-white/70 hover:text-white dark:text-gray-400 dark:hover:text-white';

export default function NewsletterSignup({
	className = '',
}: NewsletterSignupProps) {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Rate limiting check
		const time = new Date();
		const timestamp = time.valueOf();
		const previousTimestamp = localStorage.getItem('loops-form-timestamp');

		if (previousTimestamp && Number(previousTimestamp) + 60000 > timestamp) {
			setStatus('error');
			setErrorMessage('Too many signups, please try again in a little while');
			return;
		}

		setStatus('loading');
		localStorage.setItem('loops-form-timestamp', timestamp.toString());

		try {
			const formBody = `userGroup=&mailingLists=&email=${encodeURIComponent(
				email
			)}`;

			const response = await fetch(
				'https://app.loops.so/api/newsletter-form/cmgtuv68n69gt5q0is0cska3l',
				{
					method: 'POST',
					body: formBody,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);

			if (response.ok) {
				setStatus('success');
				setEmail('');
			} else {
				const data = await response.json();
				setStatus('error');
				setErrorMessage(data.message || response.statusText);
			}
		} catch (error) {
			if (error instanceof Error && error.message === 'Failed to fetch') {
				setStatus('error');
				setErrorMessage('Too many signups, please try again in a little while');
			} else {
				setStatus('error');
				setErrorMessage(
					error instanceof Error ? error.message : 'Something went wrong'
				);
			}
			localStorage.setItem('loops-form-timestamp', '');
		}
	};

	const handleReset = () => {
		setStatus('idle');
		setErrorMessage('');
	};

	const submitClass = `${OUTLINE_CTA_CLASS} shrink-0 px-4 py-2.5 text-xs sm:text-sm font-bold tracking-wide uppercase whitespace-nowrap border-l-0`;

	return (
		<div className={`w-full ${className}`}>
			{status === 'idle' && (
				<form
					onSubmit={handleSubmit}
					className='flex w-full items-stretch'
				>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='your@email.com'
						required
						className='
							min-w-0 flex-1 px-3 py-2.5 text-sm font-medium
							bg-black/30 text-white placeholder-red-200/45
							dark:bg-black dark:placeholder-gray-400
							border-2 border-r-0 border-white/90 dark:border-red-500
							focus:outline-none focus:ring-2 focus:ring-red-500 focus:z-10
							transition-colors
						'
						style={{ fontFamily: 'Inter, sans-serif' }}
					/>
					<button
						type='submit'
						className={submitClass}
						style={{ fontFamily: 'Inter, sans-serif' }}
					>
						Stay Updated
					</button>
				</form>
			)}

			{status === 'loading' && (
				<div className='flex justify-center'>
					<button
						disabled
						className={`${OUTLINE_CTA_CLASS} w-full px-4 py-2.5 text-sm font-bold tracking-wide uppercase opacity-75 cursor-not-allowed`}
						style={{ fontFamily: 'Inter, sans-serif' }}
					>
						Please wait...
					</button>
				</div>
			)}

			{status === 'success' && (
				<div className='text-center'>
					<p
						className={`
						text-xs font-medium mb-2
						text-white
					`}
						style={{ fontFamily: 'Inter, sans-serif' }}
					>
						Thanks! We'll be in touch!
					</p>
					<button
						onClick={handleReset}
						className={BACK_BUTTON_CLASS}
						style={{ fontFamily: 'Inter, sans-serif' }}
					>
						← Back
					</button>
				</div>
			)}

			{status === 'error' && (
				<div className='text-center'>
					<p
						className='text-xs font-medium mb-2 text-red-100 dark:text-red-400'
						style={{ fontFamily: 'Inter, sans-serif' }}
					>
						{errorMessage || 'Oops! Something went wrong, please try again'}
					</p>
					<button
						onClick={handleReset}
						className={BACK_BUTTON_CLASS}
						style={{ fontFamily: 'Inter, sans-serif' }}
					>
						← Back
					</button>
				</div>
			)}
		</div>
	);
}
