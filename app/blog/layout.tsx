import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Blog | Arlo Industries',
	description: 'Writing from Arlo Industries on conflict, defence, and first principles.',
};

export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
