import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Careers',
	description:
		'Join Arlo Industries to build the future of air defence. Small team, real hardware and software, problems owned end to end.',
};

export default function CareersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
