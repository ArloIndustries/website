import { readdir } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const PRESS_DIR = path.join(process.cwd(), 'public', 'press');
const ASSET_EXT = /\.(png|jpe?g|svg|webp)$/i;

export async function GET() {
	try {
		const entries = await readdir(PRESS_DIR, { withFileTypes: true });
		const files = entries
			.filter((e) => e.isFile() && ASSET_EXT.test(e.name))
			.map((e) => e.name)
			.sort((a, b) => b.localeCompare(a));

		return NextResponse.json({ files });
	} catch {
		return NextResponse.json({ files: [] }, { status: 500 });
	}
}
