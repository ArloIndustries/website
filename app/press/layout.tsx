import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Media',
	description:
		'Media coverage of Arlo Industries, plus a press kit and merch shop.',
};

export default function PressLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
