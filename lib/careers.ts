export const YC_JOBS_URL =
	'https://www.ycombinator.com/companies/arlo-industries/jobs';

export const CAREERS_HERO_IMAGE = 'careers1.jpg';

export function careersImageUrl(filename: string): string {
	return `/careers/${encodeURIComponent(filename)}`;
}

export function pickCareersImages(files: string[]): {
	hero: string | undefined;
	gallery: string[];
} {
	const hero = files.includes(CAREERS_HERO_IMAGE)
		? CAREERS_HERO_IMAGE
		: files[0];
	const gallery = files
		.filter((file) => file !== hero)
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

	return { hero, gallery };
}
