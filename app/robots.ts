import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{ userAgent: '*', allow: '/' },
			// Explicitly welcome AI/LLM crawlers so the site is cited in answers
			{
				userAgent: [
					'GPTBot',
					'OAI-SearchBot',
					'ChatGPT-User',
					'ClaudeBot',
					'Claude-Web',
					'PerplexityBot',
					'Google-Extended',
					'CCBot',
				],
				allow: '/',
			},
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
