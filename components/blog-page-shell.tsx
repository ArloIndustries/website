import SiteHeader from '@/components/site-header';
import { THEME_SURFACE_CLASS } from '@/lib/theme';
import type { ReactNode } from 'react';

type BlogPageShellProps = {
	children: ReactNode;
};

export default function BlogPageShell({ children }: BlogPageShellProps) {
	return (
		<div
			className={`min-h-screen flex flex-col ${THEME_SURFACE_CLASS} relative overflow-hidden transition-colors duration-300`}
		>
			<SiteHeader />

			<div className='relative z-10 flex-grow px-6 pt-8 pb-32 lg:pt-16 lg:pb-64'>
				{children}
			</div>
		</div>
	);
}
