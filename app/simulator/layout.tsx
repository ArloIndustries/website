import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
	title: 'Coverage Simulator — Arlo Industries',
	description:
		'Draw an area on the map and see how many Arlo sensor nodes it takes to blanket it with passive drone and missile tracking.',
};

export default function SimulatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
