import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains; preload',
	},
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
	{
		key: 'Permissions-Policy',
		value: 'camera=(), microphone=(), geolocation=()',
	},
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	turbopack: {
		root: projectRoot,
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: securityHeaders,
			},
		];
	},
};

export default nextConfig;
