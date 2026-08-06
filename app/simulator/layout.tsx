import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Coverage Simulator',
	description:
		'Plan your air-defence coverage. Draw the area you need to defend and see how Arlo passive sensing nodes deliver persistent, real-time 3D tracking of drones and missiles, no radar required.',
};

export default function SimulatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
