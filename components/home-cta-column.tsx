import NewsletterSignup from '@/components/newsletter-signup';
import YcLaunchUpvote from '@/components/yc-launch-upvote';
import { HOME_CTA_WIDTH_CLASS } from '@/lib/yc';

type HomeCtaColumnProps = {
	className?: string;
};

export default function HomeCtaColumn({ className = '' }: HomeCtaColumnProps) {
	return (
		<div
			className={`${HOME_CTA_WIDTH_CLASS} mx-auto flex flex-col gap-3 ${className}`}
		>
			<YcLaunchUpvote />
			<NewsletterSignup />
		</div>
	);
}
