export function formatPressLabel(filename: string): string {
	const base = filename.replace(/\.[^.]+$/, '');
	return base
		.replace(/([a-z])([A-Z0-9])/g, '$1 $2')
		.replace(/([0-9])([A-Za-z])/g, '$1 $2')
		.replace(/[-_]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export function pressAssetUrl(filename: string): string {
	return `/press/${encodeURIComponent(filename)}`;
}
