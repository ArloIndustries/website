import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Press | Arlo Industries',
	description:
		'Download official Arlo Industries logos and brand assets for press and media use.',
};

export default function PressLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
