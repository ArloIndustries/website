'use client';

/**
 * CoverageSimulator, interactive deployment planner.
 *
 * Draw an area on the satellite map and the planner computes how many Arlo
 * sensor nodes are needed to cover it: nodes are packed on a hexagonal
 * lattice sized so that every point in the area is seen by at least
 * `redundancy` nodes (2+ needed for 3D triangulation). Simplified web port
 * of the MILP planner in ArloIndustries/camera_based_tracking.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type LatLng = [number, number]; // [lat, lng]

const EARTH_R = 6371000;
const MAX_NODES = 3000;

const PRESETS: { label: string; center: LatLng; zoom: number; area: LatLng[] }[] = [
	{
		label: 'MOJAVE',
		center: [35.05, -118.15],
		zoom: 12,
		area: [
			[35.075, -118.19],
			[35.08, -118.115],
			[35.035, -118.1],
			[35.015, -118.16],
			[35.045, -118.2],
		],
	},
	{
		label: 'KYIV',
		center: [50.45, 30.523],
		zoom: 11,
		area: [
			[50.49, 30.44],
			[50.5, 30.56],
			[50.46, 30.63],
			[50.4, 30.6],
			[50.39, 30.48],
			[50.44, 30.42],
		],
	},
	{
		label: 'JFK',
		center: [40.6413, -73.7781],
		zoom: 13,
		area: [
			[40.665, -73.822],
			[40.667, -73.755],
			[40.63, -73.745],
			[40.618, -73.79],
			[40.64, -73.83],
		],
	},
	{
		label: 'KOREA',
		center: [37.83, 126.8],
		zoom: 11,
		// Entire polygon must stay on South Korean territory (Paju corridor,
		// south of the DMZ and the Imjin River), no nodes north of the border.
		area: [
			[37.885, 126.735],
			[37.87, 126.85],
			[37.8, 126.92],
			[37.75, 126.8],
			[37.79, 126.71],
		],
	},
];

/* ------------------------------------------------------------------ */
/* Geometry (local equirectangular projection, meters)                 */
/* ------------------------------------------------------------------ */

function project(points: LatLng[]): { xy: [number, number][]; toLatLng: (x: number, y: number) => LatLng } {
	const lat0 = points.reduce((s, p) => s + p[0], 0) / points.length;
	const lng0 = points.reduce((s, p) => s + p[1], 0) / points.length;
	const cos0 = Math.cos((lat0 * Math.PI) / 180);
	const xy = points.map(
		(p) =>
			[
				((p[1] - lng0) * Math.PI * EARTH_R * cos0) / 180,
				((p[0] - lat0) * Math.PI * EARTH_R) / 180,
			] as [number, number],
	);
	const toLatLng = (x: number, y: number): LatLng => [
		lat0 + (y * 180) / (Math.PI * EARTH_R),
		lng0 + (x * 180) / (Math.PI * EARTH_R * cos0),
	];
	return { xy, toLatLng };
}

function polygonAreaM2(xy: [number, number][]): number {
	let a = 0;
	for (let i = 0; i < xy.length; i++) {
		const [x1, y1] = xy[i];
		const [x2, y2] = xy[(i + 1) % xy.length];
		a += x1 * y2 - x2 * y1;
	}
	return Math.abs(a) / 2;
}

function pointInPolygon(x: number, y: number, poly: [number, number][]): boolean {
	let inside = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const [xi, yi] = poly[i];
		const [xj, yj] = poly[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
			inside = !inside;
		}
	}
	return inside;
}

function distToPolygon(x: number, y: number, poly: [number, number][]): number {
	if (pointInPolygon(x, y, poly)) return 0;
	let min = Infinity;
	for (let i = 0; i < poly.length; i++) {
		const [x1, y1] = poly[i];
		const [x2, y2] = poly[(i + 1) % poly.length];
		const dx = x2 - x1;
		const dy = y2 - y1;
		const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1)));
		const px = x1 + t * dx;
		const py = y1 + t * dy;
		min = Math.min(min, Math.hypot(x - px, y - py));
	}
	return min;
}

/**
 * Hexagonal covering lattice: circles of radius R centered on a hex grid
 * with pitch √3·R cover the plane with 1× redundancy. For K× redundancy the
 * pitch shrinks by ~√K. Lattice points further than R from the area are
 * dropped, every point of the area stays within R of a kept node.
 */
function planNodes(
	polygon: LatLng[],
	radiusM: number,
	redundancy: number,
): { nodes: LatLng[]; areaM2: number; spacingM: number; truncated: boolean } {
	const { xy, toLatLng } = project(polygon);
	const areaM2 = polygonAreaM2(xy);
	const spacing = (Math.sqrt(3) * radiusM) / Math.sqrt(redundancy);
	const rowH = (spacing * Math.sqrt(3)) / 2;

	const xs = xy.map((p) => p[0]);
	const ys = xy.map((p) => p[1]);
	const minX = Math.min(...xs) - radiusM;
	const maxX = Math.max(...xs) + radiusM;
	const minY = Math.min(...ys) - radiusM;
	const maxY = Math.max(...ys) + radiusM;

	const nodes: LatLng[] = [];
	let truncated = false;
	let row = 0;
	for (let y = minY; y <= maxY; y += rowH, row++) {
		const offset = row % 2 === 0 ? 0 : spacing / 2;
		for (let x = minX + offset; x <= maxX; x += spacing) {
			if (distToPolygon(x, y, xy) <= radiusM * 0.999) {
				nodes.push(toLatLng(x, y));
				if (nodes.length >= MAX_NODES) {
					truncated = true;
					return { nodes, areaM2, spacingM: spacing, truncated };
				}
			}
		}
	}
	return { nodes, areaM2, spacingM: spacing, truncated };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface Stats {
	nodeCount: number;
	areaKm2: number;
	spacingM: number;
	truncated: boolean;
}

export default function CoverageSimulator() {
	const mapDivRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<L.Map | null>(null);
	const draftLayerRef = useRef<L.LayerGroup | null>(null);
	const resultLayerRef = useRef<L.LayerGroup | null>(null);
	const drawingRef = useRef(false);
	const draftPointsRef = useRef<LatLng[]>([]);

	const [drawing, setDrawing] = useState(false);
	const [draftCount, setDraftCount] = useState(0);
	const [polygon, setPolygon] = useState<LatLng[] | null>(null);
	const [radiusKm, setRadiusKm] = useState(1.0);
	const [redundancy, setRedundancy] = useState(2);
	const [stats, setStats] = useState<Stats | null>(null);
	const [nodes, setNodes] = useState<LatLng[]>([]);

	/* ---------- map init ---------- */
	useEffect(() => {
		if (!mapDivRef.current || mapRef.current) return;

		const map = L.map(mapDivRef.current, {
			center: PRESETS[0].center,
			zoom: PRESETS[0].zoom,
			zoomControl: false,
			attributionControl: true,
			doubleClickZoom: false,
		});
		L.control.zoom({ position: 'bottomright' }).addTo(map);

		L.tileLayer(
			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			{
				maxZoom: 19,
				attribution:
					'Imagery &copy; Esri, Maxar, Earthstar Geographics | &copy; OpenStreetMap',
			},
		).addTo(map);
		L.tileLayer(
			'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
			{ maxZoom: 19, opacity: 0.85 },
		).addTo(map);

		draftLayerRef.current = L.layerGroup().addTo(map);
		resultLayerRef.current = L.layerGroup().addTo(map);

		map.on('click', (e: L.LeafletMouseEvent) => {
			if (!drawingRef.current) return;
			draftPointsRef.current = [...draftPointsRef.current, [e.latlng.lat, e.latlng.lng]];
			setDraftCount(draftPointsRef.current.length);
			renderDraft();
		});
		map.on('dblclick', () => {
			if (drawingRef.current) finishDrawingInternal();
		});

		mapRef.current = map;

		// demo: preload the first preset so the simulator shows a result immediately
		setPolygon(PRESETS[0].area);

		return () => {
			map.remove();
			mapRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ---------- drawing ---------- */
	const renderDraft = useCallback(() => {
		const layer = draftLayerRef.current;
		if (!layer) return;
		layer.clearLayers();
		const pts = draftPointsRef.current;
		for (const p of pts) {
			L.circleMarker(p, {
				radius: 5,
				color: '#ef4444',
				weight: 2,
				fillColor: '#000',
				fillOpacity: 1,
			}).addTo(layer);
		}
		if (pts.length >= 2) {
			L.polyline(pts, { color: '#ef4444', weight: 2, dashArray: '6 6' }).addTo(layer);
		}
	}, []);

	const finishDrawingInternal = useCallback(() => {
		drawingRef.current = false;
		setDrawing(false);
		const pts = draftPointsRef.current;
		if (pts.length >= 3) {
			setPolygon(pts);
		}
		draftPointsRef.current = [];
		setDraftCount(0);
		draftLayerRef.current?.clearLayers();
	}, []);

	const startDrawing = useCallback(() => {
		draftPointsRef.current = [];
		setDraftCount(0);
		setPolygon(null);
		setStats(null);
		setNodes([]);
		resultLayerRef.current?.clearLayers();
		draftLayerRef.current?.clearLayers();
		drawingRef.current = true;
		setDrawing(true);
	}, []);

	const cancelDrawing = useCallback(() => {
		drawingRef.current = false;
		setDrawing(false);
		draftPointsRef.current = [];
		setDraftCount(0);
		draftLayerRef.current?.clearLayers();
	}, []);

	const clearAll = useCallback(() => {
		cancelDrawing();
		setPolygon(null);
		setStats(null);
		setNodes([]);
		resultLayerRef.current?.clearLayers();
	}, [cancelDrawing]);

	const loadPreset = useCallback((i: number) => {
		cancelDrawing();
		const p = PRESETS[i];
		mapRef.current?.setView(p.center, p.zoom);
		setPolygon(p.area);
	}, [cancelDrawing]);

	/* ---------- solve + render result ---------- */
	useEffect(() => {
		const layer = resultLayerRef.current;
		const map = mapRef.current;
		if (!layer || !map) return;
		layer.clearLayers();
		if (!polygon) {
			setStats(null);
			setNodes([]);
			return;
		}

		const radiusM = radiusKm * 1000;
		const plan = planNodes(polygon, radiusM, redundancy);
		setStats({
			nodeCount: plan.nodes.length,
			areaKm2: plan.areaM2 / 1e6,
			spacingM: plan.spacingM,
			truncated: plan.truncated,
		});
		setNodes(plan.nodes);

		// coverage area
		L.polygon(polygon, {
			color: '#ef4444',
			weight: 2,
			fillColor: '#ef4444',
			fillOpacity: 0.08,
		}).addTo(layer);

		// coverage circles (skip when dense, markers still show placement)
		if (plan.nodes.length <= 400) {
			for (const n of plan.nodes) {
				L.circle(n, {
					radius: radiusM,
					color: '#f87171',
					weight: 1,
					opacity: 0.35,
					fillColor: '#ef4444',
					fillOpacity: 0.05,
					interactive: false,
				}).addTo(layer);
			}
		}

		// mesh links between neighbouring nodes
		if (plan.nodes.length <= 400) {
			const linkDist = plan.spacingM * 1.05;
			const { xy } = project(plan.nodes);
			for (let i = 0; i < plan.nodes.length; i++) {
				for (let j = i + 1; j < plan.nodes.length; j++) {
					const d = Math.hypot(xy[i][0] - xy[j][0], xy[i][1] - xy[j][1]);
					if (d <= linkDist) {
						L.polyline([plan.nodes[i], plan.nodes[j]], {
							color: '#ef4444',
							weight: 1,
							opacity: 0.3,
							interactive: false,
						}).addTo(layer);
					}
				}
			}
		}

		// node markers
		const icon = L.divIcon({
			className: '',
			html: '<div class="arlo-node-marker"><div class="arlo-node-core"></div></div>',
			iconSize: [14, 14],
			iconAnchor: [7, 7],
		});
		plan.nodes.forEach((n, i) => {
			L.marker(n, { icon, interactive: true, title: `NODE-${String(i + 1).padStart(3, '0')}` }).addTo(
				layer,
			);
		});

		map.fitBounds(L.latLngBounds(polygon.map((p) => L.latLng(p[0], p[1]))).pad(0.25));
	}, [polygon, radiusKm, redundancy]);

	/* ---------- export ---------- */
	/* ---------- UI ---------- */
	const panelBtn =
		'w-full border border-red-500/70 px-3 py-2 text-left text-sm font-bold tracking-wider text-red-500 transition-colors hover:bg-red-500 hover:text-black disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-red-500';

	return (
		<div className='relative h-full w-full overflow-hidden'>
			<div ref={mapDivRef} className='absolute inset-0 z-0 bg-black' />

			{/* control panel */}
			<div className='absolute left-4 top-4 z-[500] flex w-[300px] max-w-[calc(100vw-2rem)] flex-col gap-4 border-2 border-red-500 bg-black/85 p-4 text-red-500 backdrop-blur-sm max-h-[calc(100%-2rem)] overflow-y-auto'>
				<div>
					<div className='text-xs tracking-[0.3em] opacity-70'>ARLO INDUSTRIES</div>
					<div className='text-lg font-black tracking-wider'>COVERAGE PLANNER</div>
				</div>

				<div className='my-3 flex flex-col'>
					{!drawing ? (
						<button className={`${panelBtn} text-center`} onClick={startDrawing}>
							▸ DRAW COVERAGE AREA
						</button>
					) : (
						<div className='flex flex-col gap-2 border border-red-500/40 p-3 bg-black/40'>
							<div className='text-xs leading-relaxed opacity-85'>
								Click map to drop vertices ({draftCount} placed).
								Double-click or press FINISH to close the area.
							</div>
							<div className='flex gap-2'>
								<button
									className={`${panelBtn} text-center`}
									onClick={finishDrawingInternal}
									disabled={draftCount < 3}
								>
									FINISH
								</button>
								<button className={`${panelBtn} text-center`} onClick={cancelDrawing}>
									CANCEL
								</button>
							</div>
						</div>
					)}
				</div>

				<div className='flex flex-col gap-1.5'>
					<label className='flex items-center justify-between text-xs tracking-wider'>
						<span>DETECTION RADIUS</span>
						<span className='font-bold text-red-400'>{radiusKm.toFixed(2)} KM</span>
					</label>
					<input
						type='range'
						min={0.25}
						max={3}
						step={0.05}
						value={radiusKm}
						onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
						className='arlo-slider'
					/>
					<div className='text-xs leading-snug opacity-75'>
						Assured range against small UAS.
					</div>
				</div>

				<div className='flex flex-col gap-1.5'>
					<label className='flex items-center justify-between text-xs tracking-wider'>
						<span>REDUNDANCY</span>
						<span className='font-bold text-red-400'>{redundancy}×</span>
					</label>
					<input
						type='range'
						min={1}
						max={4}
						step={1}
						value={redundancy}
						onChange={(e) => setRedundancy(parseInt(e.target.value, 10))}
						className='arlo-slider'
					/>
					<div className='text-xs leading-snug opacity-75'>
						Overlapping nodes per target.
					</div>
				</div>

				<div className='flex flex-col gap-1.5'>
					<div className='text-xs tracking-wider opacity-70'>PRESET SCENARIOS</div>
					<div className='grid grid-cols-2 gap-1'>
						{PRESETS.map((p, i) => (
							<button
								key={p.label}
								className={`${panelBtn} !px-2 text-xs !text-center`}
								onClick={() => loadPreset(i)}
							>
								{p.label}
							</button>
						))}
					</div>
				</div>

				<button className={`${panelBtn} text-center`} onClick={clearAll}>
					CLEAR
				</button>
			</div>

			{/* stats readout */}
			<div className='absolute bottom-4 left-1/2 z-[500] w-[min(680px,calc(100vw-2rem))] -translate-x-1/2'>
				<div className='grid grid-cols-2 gap-px border-2 border-red-500 bg-red-500/60 sm:grid-cols-4'>
					{[
						{
							label: 'AREA',
							value: stats ? `${stats.areaKm2.toFixed(2)} KM²` : '--',
						},
						{
							label: 'NODES REQUIRED',
							value: stats
								? `${stats.nodeCount}${stats.truncated ? '+' : ''}`
								: '--',
							highlight: true,
						},
						{
							label: 'NODE SPACING',
							value: stats ? `${Math.round(stats.spacingM)} M` : '--',
						},
						{
							label: 'REDUNDANCY',
							value: stats ? `${redundancy}× / ${radiusKm.toFixed(2)} KM` : '--',
						},
					].map((s) => (
						<div key={s.label} className='bg-black/90 px-3 py-2 backdrop-blur-sm'>
							<div className='text-[10px] tracking-[0.2em] text-red-500/70'>
								{s.label}
							</div>
							<div
								className={`font-black tracking-wider ${
									s.highlight ? 'text-2xl text-red-400' : 'text-lg text-red-500'
								}`}
							>
								{s.value}
							</div>
						</div>
					))}
				</div>
				{stats?.truncated && (
					<div className='mt-1 bg-black/80 px-2 py-1 text-center text-[11px] text-red-400'>
						Area exceeds the {MAX_NODES}-node display limit. Shrink the area
						or increase detection radius.
					</div>
				)}
			</div>

		</div>
	);
}
