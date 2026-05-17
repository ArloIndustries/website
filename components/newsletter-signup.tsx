'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface NewsletterSignupProps {
	className?: string;
}

export default function NewsletterSignup({
	className = '',
}: NewsletterSignupProps) {
	const { theme } = useTheme();
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle');
	const [errorMessage, setErrorMessage] = useState('');
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const isDark = theme === 'dark';

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

	if (!isMounted) {
		return null;
	}

	return (
		<div className={`w-full max-w-md mx-auto ${className}`}>
			{status === 'idle' && (
				<form
					onSubmit={handleSubmit}
					className='flex flex-col sm:flex-row gap-3'
				>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='your@email.com'
						required
						className={`
							flex-1 px-4 py-3 text-sm font-medium
							${
								isDark
									? 'bg-black text-white border-red-500 placeholder-gray-400'
									: 'bg-red-950/35 text-white border-red-900/40 placeholder-red-200/45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]'
							}
							border-2 focus:outline-none focus:ring-2 focus:ring-red-500
							transition-colors
						`}
						style={{ fontFamily: 'Inter, sans-serif' }}
					/>
					<button
						type='submit'
						className={`
							px-6 py-3 text-sm font-bold tracking-wide uppercase
							${
								isDark
									? 'bg-red-500 text-black border-2 border-red-500 hover:bg-white hover:text-red-500 hover:border-white'
									: 'bg-black text-white border-2 border-black hover:bg-zinc-900 hover:border-zinc-900'
							}
							transition-colors whitespace-nowrap
						`}
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
						className={`
							px-6 py-3 text-sm font-bold tracking-wide uppercase
							bg-red-500 text-white border-2 border-red-500
							opacity-75 cursor-not-allowed
						`}
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
						text-sm font-medium mb-3
						${isDark ? 'text-white' : 'text-black'}
					`}
						style={{ fontFamily: 'Inter, sans-serif' }}
					>
						Thanks! We'll be in touch!
					</p>
					<button
						onClick={handleReset}
						className={`
							text-sm font-medium underline hover:no-underline
							transition-all cursor-pointer bg-transparent border-none
							${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}
						`}
						style={{ fontFamily: 'Inter, sans-serif' }}
					>
						← Back
					</button>
				</div>
			)}

			{status === 'error' && (
				<div className='text-center'>
					<p
						className={`
						text-sm font-medium mb-3
						${isDark ? 'text-red-400' : 'text-red-600'}
					`}
						style={{ fontFamily: 'Inter, sans-serif' }}
					>
						{errorMessage || 'Oops! Something went wrong, please try again'}
					</p>
					<button
						onClick={handleReset}
						className={`
							text-sm font-medium underline hover:no-underline
							transition-all cursor-pointer bg-transparent border-none
							${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}
						`}
						style={{ fontFamily: 'Inter, sans-serif' }}
					>
						← Back
					</button>
				</div>
			)}
		</div>
	);
}
