import { readdir } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const CAREERS_DIR = path.join(process.cwd(), 'public', 'careers');
const ASSET_EXT = /\.(png|jpe?g|svg|webp|gif)$/i;

export async function GET() {
	try {
		const entries = await readdir(CAREERS_DIR, { withFileTypes: true });
		const files = entries
			.filter((e) => e.isFile() && ASSET_EXT.test(e.name))
			.map((e) => e.name)
			.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

		return NextResponse.json({ files });
	} catch {
		return NextResponse.json({ files: [] }, { status: 500 });
	}
}
