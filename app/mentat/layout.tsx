import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Mentat | Arlo Industries',
	description:
		'A passive aerial sensing node designed for distributed aerial tracking without radar emissions.',
};

export default function MentatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
