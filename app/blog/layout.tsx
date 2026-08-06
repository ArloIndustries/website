import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
	title: {
		default: 'Blog',
		template: `%s | ${SITE_NAME}`,
	},
	description:
		'Writing from Arlo Industries on conflict, defence, and first principles.',
};

export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
