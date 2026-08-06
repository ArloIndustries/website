import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/site';

export const alt = `${SITE_NAME} — Track drones and missiles without radar`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					backgroundColor: '#000000',
					padding: 72,
					fontFamily: 'monospace',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 20,
					}}
				>
					<div
						style={{
							width: 28,
							height: 28,
							backgroundColor: '#ff0000',
						}}
					/>
					<div
						style={{
							color: '#ff0000',
							fontSize: 36,
							letterSpacing: 10,
						}}
					>
						ARLO INDUSTRIES
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 24,
					}}
				>
					<div
						style={{
							color: '#ffffff',
							fontSize: 76,
							fontWeight: 700,
							lineHeight: 1.1,
							maxWidth: 1000,
						}}
					>
						Track drones and missiles without radars
					</div>
					<div
						style={{
							color: '#ff0000',
							fontSize: 30,
							letterSpacing: 4,
						}}
					>
						PASSIVE · DECENTRALISED · REAL-TIME 3D
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<div style={{ color: '#ffffff', fontSize: 26, opacity: 0.8 }}>
						arlo1.com
					</div>
					<div style={{ color: '#ff0000', fontSize: 26 }}>
						BACKED BY Y COMBINATOR
					</div>
				</div>
			</div>
		),
		size,
	);
}
