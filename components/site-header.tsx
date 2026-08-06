'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import AnimatedLogo from '@/components/animated-logo';
import { Button } from '@/components/ui/button';
import { useEffect, useState, type ReactNode } from 'react';
import { SITE_NAV_LINKS, type SiteNavLink } from '@/lib/site-nav';

type SiteHeaderProps = {
	/** Optional actions (e.g. press “Download all”) shown before the mobile menu button */
	trailing?: ReactNode;
};

function renderNavLink(
	link: SiteNavLink,
	className: string,
	onNavigate?: () => void,
) {
	const common = { className, onClick: onNavigate };
	if (link.external) {
		return (
			<a
				key={link.href}
				href={link.href}
				target='_blank'
				rel='noopener noreferrer'
				{...common}
			>
				{link.label}
			</a>
		);
	}
	return (
		<Link key={link.href} href={link.href} {...common}>
			{link.label}
		</Link>
	);
}

export default function SiteHeader({ trailing }: SiteHeaderProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		if (!mobileMenuOpen) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setMobileMenuOpen(false);
		};

		document.addEventListener('keydown', onKeyDown);
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('keydown', onKeyDown);
			document.body.style.overflow = '';
		};
	}, [mobileMenuOpen]);

	const navBackdropClass =
		"isolate before:absolute before:-inset-x-2 before:-inset-y-1 before:-z-10 before:backdrop-blur-md before:content-[''] before:bg-white/25 dark:before:bg-black/35";
	const navUnderlineClass =
		"relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100";
	const navLinkClass = `font-bold tracking-wide text-base lg:text-lg px-2 py-1 hover:text-red-900 dark:hover:text-red-700 transition-colors ${navBackdropClass} ${navUnderlineClass}`;
	const mobileNavItemClass =
		'text-white dark:text-red-500 hover:bg-red-500 hover:text-black dark:hover:bg-red-500 dark:hover:text-black';

	return (
		<>
			<header
				className={`relative flex items-center justify-between gap-4 pt-8 pb-4 px-6 lg:px-12 ${
					mobileMenuOpen ? 'z-40' : 'z-10'
				}`}
			>
				<Link
					href='/'
					className='flex shrink-0 items-center gap-3 hover:opacity-80 transition-opacity'
					aria-label='Arlo Industries – Home'
				>
					<AnimatedLogo
						srcA='/logoA.png'
						srcB='/logoB.png'
						alt=''
						width={120}
						height={40}
						priority
						unoptimized
						className='h-8 w-auto'
					/>
				</Link>

				<div className='flex min-w-0 flex-1 items-center justify-end gap-3 md:gap-8'>
					{trailing}

					<nav
						className='hidden md:flex items-center gap-8'
						aria-label='Main navigation'
					>
						{SITE_NAV_LINKS.map((link) =>
							renderNavLink(link, navLinkClass),
						)}
					</nav>

					<Button
						variant='ghost'
						size='icon'
						className='md:hidden shrink-0 rounded-none text-black dark:text-red-500 hover:bg-red-500/20'
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-expanded={mobileMenuOpen}
						aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
					>
						{mobileMenuOpen ? (
							<X className='w-6 h-6' />
						) : (
							<Menu className='w-6 h-6' />
						)}
					</Button>
				</div>
			</header>

			{mobileMenuOpen && (
				<>
					<button
						type='button'
						className='fixed inset-0 z-20 bg-black/60 md:hidden'
						aria-label='Close menu'
						onClick={() => setMobileMenuOpen(false)}
					/>
					<nav
						className='relative z-30 md:hidden px-4 pb-4'
						aria-label='Main navigation'
					>
						<div className='border-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)] border-white/90 bg-black/55 backdrop-blur-md dark:border-red-500 dark:bg-black/95 dark:backdrop-blur-none'>
							<ul className='flex flex-col gap-1 p-2'>
								{SITE_NAV_LINKS.map((link) => (
									<li key={link.href}>
										{renderNavLink(
											link,
											`block w-full py-3.5 px-4 text-left font-bold tracking-wide text-base transition-colors ${mobileNavItemClass}`,
											() => setMobileMenuOpen(false),
										)}
									</li>
								))}
							</ul>
						</div>
					</nav>
				</>
			)}
		</>
	);
}
