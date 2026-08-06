import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Mentat — Passive Aerial Sensing Node',
	description:
		'Mentat is a passive aerial sensing node for distributed drone and missile tracking without radar emissions. Nodes form an optical mesh that scales across regions as interconnected coverage.',
};

export default function MentatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
