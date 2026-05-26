import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Careers | Arlo Industries',
	description:
		'Join Arlo Industries to build the future of air defence. Work on world-changing problems with a small, agile team.',
};

export default function CareersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
