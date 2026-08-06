import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Press & Media',
	description:
		'Media coverage of Arlo Industries, plus official logos and brand assets for publication.',
};

export default function PressLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
