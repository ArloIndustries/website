'use client';

/**
 * DefenseGridBackground, animated hero scene.
 *
 * A distributed grid of Arlo sensor nodes tracks drones and missiles in the
 * sky: scan sweeps, tracking beams, lock reticles, telemetry tags and
 * intercept flashes, all rendered as a wireframe hologram.
 *
 * The node model is a procedural placeholder. Drop the real STL at
 * `public/models/node.stl` and it is picked up automatically (see
 * public/models/README.md).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

const NODE_COUNT = 5;
const NODE_RING_RADIUS = 13;
const NODE_RANGE = 22;
const DRONE_COUNT = 4;
const MISSILE_COUNT = 2;
const TRAIL_LENGTH = 48;
const LOCK_NODES = 2; // nodes required for a hard lock
const INTERCEPT_AFTER = 2.6; // seconds of hard lock before a missile is "intercepted"

export interface DefenseGridPalette {
	primary: string; // main hologram color
	accent: string; // soft-track color (amber)
	dim: string; // structure / grid color
	fog: string; // scene fog, should match page background
}

export const DARK_PALETTE: DefenseGridPalette = {
	primary: '#ff3b3b',
	accent: '#ffb020',
	dim: '#571414',
	fog: '#000000',
};

export const LIGHT_PALETTE: DefenseGridPalette = {
	primary: '#450a0a',
	accent: '#431407',
	dim: '#7f1d1d',
	fog: '#dc2626',
};

/* ------------------------------------------------------------------ */
/* Simulation types                                                    */
/* ------------------------------------------------------------------ */

type TargetKind = 'drone' | 'missile';

interface Target {
	kind: TargetKind;
	id: string;
	group: THREE.Group;
	position: THREE.Vector3;
	prevPosition: THREE.Vector3;
	trail: THREE.Line;
	trailPositions: Float32Array;
	trailInitialized: boolean;
	reticle: THREE.Group;
	label: THREE.Sprite;
	labelCanvas: HTMLCanvasElement;
	labelTexture: THREE.CanvasTexture;
	labelText: string;
	trackedBy: number;
	lockTime: number;
	spinners: THREE.Object3D[];
	// drone path params
	orbitRadius: number;
	orbitSpeed: number;
	orbitPhase: number;
	altitude: number;
	wobble: number;
	// missile path params
	from: THREE.Vector3;
	to: THREE.Vector3;
	apex: number;
	duration: number;
	progress: number;
}

interface SensorNode {
	group: THREE.Group;
	head: THREE.Group;
	position: THREE.Vector3;
	pulse: THREE.Mesh;
	pulsePhase: number;
	sweep: THREE.Group;
	sweepSpeed: number;
	placeholder: THREE.Group;
	stlMesh: THREE.Mesh | null;
}

interface Flash {
	mesh: THREE.Mesh;
	life: number; // 0 = inactive, counts down
}

interface Simulation {
	group: THREE.Group;
	nodes: SensorNode[];
	targets: Target[];
	beams: THREE.LineSegments;
	beamPositions: Float32Array;
	flashes: Flash[];
	setNodeGeometry: (geo: THREE.BufferGeometry) => void;
	update: (elapsed: number, dt: number, camera: THREE.Camera) => void;
	dispose: () => void;
}

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

function lineMaterial(color: string, opacity: number, additive: boolean) {
	return new THREE.LineBasicMaterial({
		color,
		transparent: true,
		opacity,
		blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
		depthWrite: false,
	});
}

function holoMaterial(color: string, opacity = 1) {
	return new THREE.MeshBasicMaterial({
		color,
		transparent: opacity < 1,
		opacity,
	});
}

function wireMaterial(color: string, opacity: number, additive: boolean) {
	return new THREE.MeshBasicMaterial({
		color,
		wireframe: true,
		transparent: true,
		opacity,
		blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
		depthWrite: false,
	});
}

/** Procedural stand-in for the real node STL: tripod, mast and sensor head. */
function buildNodePlaceholder(palette: DefenseGridPalette, additive: boolean) {
	const g = new THREE.Group();
	const solid = holoMaterial('#1a0505');
	const wire = wireMaterial(palette.primary, 0.85, additive);
	const dimWire = wireMaterial(palette.dim, 0.9, additive);

	// tripod legs
	for (let i = 0; i < 3; i++) {
		const a = (i / 3) * Math.PI * 2;
		const leg = new THREE.Mesh(
			new THREE.CylinderGeometry(0.035, 0.035, 1.1, 5),
			dimWire,
		);
		leg.position.set(Math.cos(a) * 0.42, 0.45, Math.sin(a) * 0.42);
		leg.rotation.z = Math.cos(a) * 0.55;
		leg.rotation.x = -Math.sin(a) * 0.55;
		g.add(leg);
	}

	// hexagonal body
	const body = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.5, 6), solid);
	body.position.y = 1.05;
	g.add(body);
	const bodyWire = new THREE.Mesh(new THREE.CylinderGeometry(0.345, 0.405, 0.51, 6), wire);
	bodyWire.position.y = 1.05;
	g.add(bodyWire);

	// sensor head (aimed at targets at runtime)
	const head = new THREE.Group();
	head.position.y = 1.55;
	const eye = new THREE.Mesh(new THREE.OctahedronGeometry(0.24), solid);
	head.add(eye);
	const eyeWire = new THREE.Mesh(new THREE.OctahedronGeometry(0.25), wire);
	head.add(eyeWire);
	const lens = new THREE.Mesh(
		new THREE.ConeGeometry(0.09, 0.28, 8),
		holoMaterial(palette.primary),
	);
	lens.rotation.x = Math.PI / 2;
	lens.position.z = 0.3;
	head.add(lens);
	g.add(head);

	return { group: g, head };
}

function buildDrone(palette: DefenseGridPalette, additive: boolean) {
	const g = new THREE.Group();
	const wire = wireMaterial(palette.accent, 0.9, additive);
	const solid = holoMaterial('#140a02');
	const spinners: THREE.Object3D[] = [];

	const core = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.34), solid);
	g.add(core);
	const coreWire = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.35), wire);
	g.add(coreWire);

	for (const [sx, sz] of [
		[1, 1],
		[1, -1],
		[-1, 1],
		[-1, -1],
	] as const) {
		const arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.05), wire);
		arm.position.set(sx * 0.3, 0.02, sz * 0.3);
		arm.rotation.y = Math.atan2(sz, sx);
		g.add(arm);

		const rotor = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.16, 12), wire);
		rotor.rotation.x = -Math.PI / 2;
		rotor.position.set(sx * 0.48, 0.08, sz * 0.48);
		g.add(rotor);
		spinners.push(rotor);
	}
	g.scale.setScalar(1.5);
	return { group: g, spinners };
}

function buildMissile(palette: DefenseGridPalette, additive: boolean) {
	const g = new THREE.Group();
	const wire = wireMaterial(palette.primary, 0.95, additive);
	const solid = holoMaterial('#170303');
	const spinners: THREE.Object3D[] = [];

	// body along +Z so lookAt() points the nose at the velocity vector
	const body = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 1.15, 8), solid);
	body.rotation.x = Math.PI / 2;
	g.add(body);
	const bodyWire = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.115, 1.16, 8), wire);
	bodyWire.rotation.x = Math.PI / 2;
	g.add(bodyWire);

	const nose = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.34, 8), wire);
	nose.rotation.x = Math.PI / 2;
	nose.position.z = 0.74;
	g.add(nose);

	for (let i = 0; i < 4; i++) {
		const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.22, 0.26), wire);
		const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
		fin.position.set(Math.cos(a) * 0.13, Math.sin(a) * 0.13, -0.48);
		fin.rotation.z = a;
		g.add(fin);
	}

	// exhaust glow
	const exhaust = new THREE.Mesh(
		new THREE.ConeGeometry(0.08, 0.5, 8),
		new THREE.MeshBasicMaterial({
			color: palette.accent,
			transparent: true,
			opacity: 0.8,
			blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
			depthWrite: false,
		}),
	);
	exhaust.rotation.x = -Math.PI / 2;
	exhaust.position.z = -0.85;
	g.add(exhaust);
	spinners.push(exhaust);

	g.scale.setScalar(1.35);
	return { group: g, spinners };
}

function buildReticle(palette: DefenseGridPalette, additive: boolean) {
	const g = new THREE.Group();
	const mat = lineMaterial(palette.primary, 0.9, additive);

	const ring = new THREE.LineLoop(
		new THREE.BufferGeometry().setFromPoints(
			Array.from({ length: 33 }, (_, i) => {
				const a = (i / 32) * Math.PI * 2;
				return new THREE.Vector3(Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0);
			}),
		),
		mat,
	);
	g.add(ring);

	// corner brackets
	const bracketPts: THREE.Vector3[] = [];
	const s = 1.15;
	const l = 0.35;
	for (const [cx, cy] of [
		[1, 1],
		[1, -1],
		[-1, 1],
		[-1, -1],
	] as const) {
		bracketPts.push(
			new THREE.Vector3(cx * s - cx * l, cy * s, 0),
			new THREE.Vector3(cx * s, cy * s, 0),
			new THREE.Vector3(cx * s, cy * s, 0),
			new THREE.Vector3(cx * s, cy * s - cy * l, 0),
		);
	}
	const brackets = new THREE.LineSegments(
		new THREE.BufferGeometry().setFromPoints(bracketPts),
		mat,
	);
	g.add(brackets);
	g.visible = false;
	return g;
}

function buildLabelSprite() {
	const canvas = document.createElement('canvas');
	canvas.width = 320;
	canvas.height = 72;
	const texture = new THREE.CanvasTexture(canvas);
	texture.anisotropy = 2;
	const sprite = new THREE.Sprite(
		new THREE.SpriteMaterial({
			map: texture,
			transparent: true,
			depthWrite: false,
		}),
	);
	sprite.scale.set(4.4, 1, 1);
	sprite.visible = false;
	return { sprite, canvas, texture };
}

function drawLabel(
	canvas: HTMLCanvasElement,
	texture: THREE.CanvasTexture,
	text: string,
	color: string,
) {
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = "26px 'Share Tech Mono', monospace";
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	ctx.globalAlpha = 0.9;
	ctx.strokeRect(4, 8, 12, 12);
	ctx.fillText(text, 28, 22);
	texture.needsUpdate = true;
}

/* ------------------------------------------------------------------ */
/* Simulation                                                          */
/* ------------------------------------------------------------------ */

function createSimulation(palette: DefenseGridPalette, additive: boolean): Simulation {
	const group = new THREE.Group();
	const rand = (min: number, max: number) => min + Math.random() * (max - min);

	/* ground grid */
	const grid = new THREE.GridHelper(90, 45, palette.dim, palette.dim);
	(grid.material as THREE.Material).transparent = true;
	(grid.material as THREE.Material).opacity = 0.32;
	group.add(grid);

	/* star field */
	const starPts: number[] = [];
	for (let i = 0; i < 350; i++) {
		const a = Math.random() * Math.PI * 2;
		const r = rand(45, 90);
		const y = rand(6, 55);
		starPts.push(Math.cos(a) * r, y, Math.sin(a) * r);
	}
	const stars = new THREE.Points(
		new THREE.BufferGeometry().setAttribute(
			'position',
			new THREE.Float32BufferAttribute(starPts, 3),
		),
		new THREE.PointsMaterial({
			color: palette.dim,
			size: 0.22,
			transparent: true,
			opacity: 0.8,
			depthWrite: false,
		}),
	);
	group.add(stars);

	/* sensor nodes on a pentagon */
	const nodes: SensorNode[] = [];
	for (let i = 0; i < NODE_COUNT; i++) {
		const a = (i / NODE_COUNT) * Math.PI * 2 + Math.PI / 2;
		const position = new THREE.Vector3(
			Math.cos(a) * NODE_RING_RADIUS,
			0,
			Math.sin(a) * NODE_RING_RADIUS,
		);

		const nodeGroup = new THREE.Group();
		nodeGroup.position.copy(position);

		const { group: placeholder, head } = buildNodePlaceholder(palette, additive);
		nodeGroup.add(placeholder);

		// base ring
		const base = new THREE.LineLoop(
			new THREE.BufferGeometry().setFromPoints(
				Array.from({ length: 25 }, (_, k) => {
					const t = (k / 24) * Math.PI * 2;
					return new THREE.Vector3(Math.cos(t) * 0.9, 0.01, Math.sin(t) * 0.9);
				}),
			),
			lineMaterial(palette.primary, 0.55, additive),
		);
		nodeGroup.add(base);

		// expanding range pulse
		const pulse = new THREE.Mesh(
			new THREE.RingGeometry(0.96, 1, 48).rotateX(-Math.PI / 2),
			new THREE.MeshBasicMaterial({
				color: palette.primary,
				transparent: true,
				opacity: 0.4,
				side: THREE.DoubleSide,
				blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
				depthWrite: false,
			}),
		);
		pulse.position.y = 0.02;
		nodeGroup.add(pulse);

		// rotating scan sweep (wedge on the ground)
		const sweep = new THREE.Group();
		const wedge = new THREE.Mesh(
			new THREE.CircleGeometry(NODE_RANGE * 0.55, 24, 0, 0.5).rotateX(-Math.PI / 2),
			new THREE.MeshBasicMaterial({
				color: palette.primary,
				transparent: true,
				opacity: 0.07,
				side: THREE.DoubleSide,
				blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
				depthWrite: false,
			}),
		);
		wedge.position.y = 0.03;
		sweep.add(wedge);
		nodeGroup.add(sweep);

		group.add(nodeGroup);
		nodes.push({
			group: nodeGroup,
			head,
			position,
			pulse,
			pulsePhase: (i / NODE_COUNT) * 4,
			sweep,
			sweepSpeed: rand(0.5, 1.1) * (i % 2 === 0 ? 1 : -1),
			placeholder,
			stlMesh: null,
		});
	}

	/* mesh-network links between neighbouring nodes */
	const linkPts: THREE.Vector3[] = [];
	for (let i = 0; i < NODE_COUNT; i++) {
		const a = nodes[i].position.clone().setY(0.35);
		const b = nodes[(i + 1) % NODE_COUNT].position.clone().setY(0.35);
		linkPts.push(a, b);
	}
	const links = new THREE.LineSegments(
		new THREE.BufferGeometry().setFromPoints(linkPts),
		lineMaterial(palette.dim, 0.5, additive),
	);
	group.add(links);

	/* targets */
	const targets: Target[] = [];

	const makeTarget = (kind: TargetKind, i: number): Target => {
		const built =
			kind === 'drone' ? buildDrone(palette, additive) : buildMissile(palette, additive);
		group.add(built.group);

		const trailPositions = new Float32Array(TRAIL_LENGTH * 3);
		const trailGeo = new THREE.BufferGeometry();
		trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
		// fade the trail out along its length via vertex colors
		const trailColors = new Float32Array(TRAIL_LENGTH * 3);
		const c = new THREE.Color(kind === 'drone' ? palette.accent : palette.primary);
		for (let k = 0; k < TRAIL_LENGTH; k++) {
			const f = 1 - k / TRAIL_LENGTH;
			trailColors[k * 3] = c.r * f;
			trailColors[k * 3 + 1] = c.g * f;
			trailColors[k * 3 + 2] = c.b * f;
		}
		trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
		const trail = new THREE.Line(
			trailGeo,
			new THREE.LineBasicMaterial({
				vertexColors: true,
				transparent: true,
				opacity: 0.75,
				blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
				depthWrite: false,
			}),
		);
		trail.frustumCulled = false;
		group.add(trail);

		const reticle = buildReticle(palette, additive);
		group.add(reticle);

		const { sprite, canvas, texture } = buildLabelSprite();
		group.add(sprite);

		return {
			kind,
			id: `${kind === 'drone' ? 'UAS' : 'MSL'}-0${i + 1}`,
			group: built.group,
			position: new THREE.Vector3(),
			prevPosition: new THREE.Vector3(),
			trail,
			trailPositions,
			trailInitialized: false,
			reticle,
			label: sprite,
			labelCanvas: canvas,
			labelTexture: texture,
			labelText: '',
			trackedBy: 0,
			lockTime: 0,
			spinners: built.spinners,
			orbitRadius: rand(7, 17),
			orbitSpeed: rand(0.12, 0.3) * (Math.random() > 0.5 ? 1 : -1),
			orbitPhase: rand(0, Math.PI * 2),
			altitude: rand(5.5, 11),
			wobble: rand(0.5, 1.6),
			from: new THREE.Vector3(),
			to: new THREE.Vector3(),
			apex: 0,
			duration: 1,
			progress: rand(0, 0.9),
		};
	};

	const resetMissile = (t: Target, initial = false) => {
		const a = rand(0, Math.PI * 2);
		const b = a + Math.PI + rand(-0.7, 0.7);
		t.from.set(Math.cos(a) * 42, 0.5, Math.sin(a) * 42);
		t.to.set(Math.cos(b) * 42, 0.5, Math.sin(b) * 42);
		t.apex = rand(11, 20);
		t.duration = rand(11, 17);
		t.progress = initial ? rand(0, 0.6) : 0;
		t.lockTime = 0;
		t.trailInitialized = false;
	};

	for (let i = 0; i < DRONE_COUNT; i++) targets.push(makeTarget('drone', i));
	for (let i = 0; i < MISSILE_COUNT; i++) {
		const m = makeTarget('missile', i);
		resetMissile(m, true);
		targets.push(m);
	}

	/* tracking beams */
	const maxPairs = NODE_COUNT * targets.length;
	const beamPositions = new Float32Array(maxPairs * 6);
	const beamGeo = new THREE.BufferGeometry();
	beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
	const beams = new THREE.LineSegments(
		beamGeo,
		lineMaterial(palette.primary, additive ? 0.33 : 0.5, additive),
	);
	beams.frustumCulled = false;
	group.add(beams);

	/* intercept flashes */
	const flashes: Flash[] = Array.from({ length: 3 }, () => {
		const mesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry(1, 1),
			wireMaterial(palette.primary, 0.9, additive),
		);
		mesh.visible = false;
		group.add(mesh);
		return { mesh, life: 0 };
	});

	const spawnFlash = (pos: THREE.Vector3) => {
		const f = flashes.find((fl) => fl.life <= 0) ?? flashes[0];
		f.life = 1;
		f.mesh.position.copy(pos);
		f.mesh.visible = true;
	};

	/* scratch objects */
	const v1 = new THREE.Vector3();
	const headTarget = new THREE.Vector3();
	let labelClock = 0;

	const update = (elapsed: number, dt: number, camera: THREE.Camera) => {
		labelClock += dt;
		const refreshLabels = labelClock > 0.25;
		if (refreshLabels) labelClock = 0;

		/* targets: move */
		for (const t of targets) {
			t.prevPosition.copy(t.position);
			if (t.kind === 'drone') {
				const a = elapsed * t.orbitSpeed + t.orbitPhase;
				t.position.set(
					Math.cos(a) * t.orbitRadius +
						Math.sin(elapsed * 0.7 * t.wobble + t.orbitPhase) * 1.6,
					t.altitude + Math.sin(elapsed * t.wobble + t.orbitPhase * 2) * 1.4,
					Math.sin(a) * t.orbitRadius +
						Math.cos(elapsed * 0.5 * t.wobble) * 1.6,
				);
				t.group.position.copy(t.position);
				t.group.rotation.y = -a - Math.PI / 2;
				for (const s of t.spinners) s.rotation.z += dt * 30;
			} else {
				t.progress += dt / t.duration;
				if (t.progress >= 1) resetMissile(t);
				const p = t.progress;
				t.position.lerpVectors(t.from, t.to, p);
				t.position.y += 4 * t.apex * p * (1 - p);
				t.group.position.copy(t.position);
				// aim the nose along the velocity vector
				v1.copy(t.position).sub(t.prevPosition);
				if (v1.lengthSq() > 1e-6) {
					headTarget.copy(t.position).add(v1);
					t.group.lookAt(headTarget);
				}
				const flicker = 0.75 + Math.sin(elapsed * 40 + t.orbitPhase) * 0.25;
				for (const s of t.spinners) s.scale.set(flicker, 1, flicker);
			}

			/* trail */
			const tp = t.trailPositions;
			if (!t.trailInitialized) {
				for (let k = 0; k < TRAIL_LENGTH; k++) {
					tp[k * 3] = t.position.x;
					tp[k * 3 + 1] = t.position.y;
					tp[k * 3 + 2] = t.position.z;
				}
				t.trailInitialized = true;
			} else {
				tp.copyWithin(3, 0, (TRAIL_LENGTH - 1) * 3);
				tp[0] = t.position.x;
				tp[1] = t.position.y;
				tp[2] = t.position.z;
			}
			(t.trail.geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
				true;
		}

		/* tracking: beams + per-target counts */
		let beamCount = 0;
		for (const t of targets) t.trackedBy = 0;
		for (const n of nodes) {
			let nearest: Target | null = null;
			let nearestDist = Infinity;
			for (const t of targets) {
				const d = n.position.distanceTo(t.position);
				if (d < NODE_RANGE) {
					t.trackedBy++;
					const i = beamCount * 6;
					beamPositions[i] = n.position.x;
					beamPositions[i + 1] = n.position.y + 1.55;
					beamPositions[i + 2] = n.position.z;
					beamPositions[i + 3] = t.position.x;
					beamPositions[i + 4] = t.position.y;
					beamPositions[i + 5] = t.position.z;
					beamCount++;
					if (d < nearestDist) {
						nearestDist = d;
						nearest = t;
					}
				}
			}
			/* aim the sensor head at the nearest tracked target */
			if (nearest && !n.stlMesh) {
				headTarget.copy(nearest.position).sub(n.position).sub(v1.set(0, 1.55, 0));
				const yaw = Math.atan2(headTarget.x, headTarget.z);
				const pitch = Math.atan2(
					headTarget.y,
					Math.hypot(headTarget.x, headTarget.z),
				);
				n.head.rotation.y += (yaw - n.head.rotation.y) * Math.min(1, dt * 6);
				n.head.rotation.x +=
					(-pitch - n.head.rotation.x) * Math.min(1, dt * 6);
			}
			if (n.stlMesh) n.placeholder.rotation.y += dt * 0.4;

			/* pulses + sweep */
			const pt = ((elapsed + n.pulsePhase) % 4) / 4;
			n.pulse.scale.setScalar(0.9 + pt * NODE_RANGE * 0.75);
			(n.pulse.material as THREE.MeshBasicMaterial).opacity = 0.38 * (1 - pt);
			n.sweep.rotation.y += dt * n.sweepSpeed;
		}
		beams.geometry.setDrawRange(0, beamCount * 2);
		(beams.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

		/* reticles, labels, intercepts */
		for (const t of targets) {
			const locked = t.trackedBy >= LOCK_NODES;
			t.reticle.visible = t.trackedBy > 0;
			if (t.reticle.visible) {
				t.reticle.position.copy(t.position);
				t.reticle.quaternion.copy(camera.quaternion);
				const pulse = 1 + Math.sin(elapsed * (locked ? 9 : 4)) * 0.08;
				t.reticle.scale.setScalar((locked ? 1 : 1.35) * pulse);
				t.reticle.rotation.z = locked ? 0 : elapsed * 0.8;
				for (const child of t.reticle.children) {
					const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
					mat.color.set(locked ? palette.primary : palette.accent);
				}
			}

			t.label.visible = t.trackedBy > 0;
			if (t.label.visible) {
				t.label.position.copy(t.position);
				t.label.position.y += 2.1;
				if (refreshLabels) {
					const status = locked ? 'LOCK' : 'TRK';
					const text = `${t.id} ${status} ALT ${(t.position.y * 120).toFixed(0)}M N${t.trackedBy}`;
					if (text !== t.labelText) {
						t.labelText = text;
						drawLabel(
							t.labelCanvas,
							t.labelTexture,
							text,
							locked ? palette.primary : palette.accent,
						);
					}
				}
			}

			/* missiles under hard lock get intercepted */
			if (t.kind === 'missile') {
				t.lockTime = locked ? t.lockTime + dt : Math.max(0, t.lockTime - dt);
				if (t.lockTime > INTERCEPT_AFTER) {
					spawnFlash(t.position);
					resetMissile(t);
				}
			}
		}

		/* flashes */
		for (const f of flashes) {
			if (f.life > 0) {
				f.life -= dt * 1.4;
				const k = 1 - Math.max(0, f.life);
				f.mesh.scale.setScalar(0.4 + k * 4.5);
				(f.mesh.material as THREE.MeshBasicMaterial).opacity =
					0.9 * Math.max(0, f.life);
				if (f.life <= 0) f.mesh.visible = false;
			}
		}
	};

	const setNodeGeometry = (geo: THREE.BufferGeometry) => {
		geo.computeBoundingBox();
		const box = geo.boundingBox!;
		const size = new THREE.Vector3();
		box.getSize(size);
		const scale = 1.7 / Math.max(size.x, size.y, size.z, 1e-6);
		geo.center();
		// STL files are usually Z-up; rotate to three.js Y-up
		geo.rotateX(-Math.PI / 2);

		for (const n of nodes) {
			n.placeholder.clear();
			const solid = new THREE.Mesh(geo, holoMaterial('#1a0505'));
			solid.scale.setScalar(scale);
			solid.position.y = (size.z * scale) / 2;
			const wire = new THREE.Mesh(geo, wireMaterial(palette.primary, 0.5, additive));
			wire.scale.setScalar(scale * 1.001);
			wire.position.y = (size.z * scale) / 2;
			n.placeholder.add(solid, wire);
			n.stlMesh = solid;
		}
	};

	const dispose = () => {
		group.traverse((obj) => {
			const mesh = obj as THREE.Mesh;
			if (mesh.geometry) mesh.geometry.dispose();
			const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
			if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
			else if (mat) mat.dispose();
		});
		for (const t of targets) t.labelTexture.dispose();
	};

	return {
		group,
		nodes,
		targets,
		beams,
		beamPositions,
		flashes,
		setNodeGeometry,
		update,
		dispose,
	};
}

/* ------------------------------------------------------------------ */
/* React wiring                                                        */
/* ------------------------------------------------------------------ */

function Scene({ palette, additive }: { palette: DefenseGridPalette; additive: boolean }) {
	const { scene } = useThree();
	const sim = useMemo(() => createSimulation(palette, additive), [palette, additive]);

	useEffect(() => {
		scene.fog = new THREE.Fog(palette.fog, 34, 95);
		return () => {
			scene.fog = null;
		};
	}, [scene, palette.fog]);

	// try to load the real node model; keep the placeholder otherwise
	useEffect(() => {
		let cancelled = false;
		fetch('/models/node.stl')
			.then((r) => {
				const type = r.headers.get('content-type') ?? '';
				if (!r.ok || type.includes('text/html')) return null;
				return r.arrayBuffer();
			})
			.then((buf) => {
				if (!buf || cancelled) return;
				const geo = new STLLoader().parse(buf);
				sim.setNodeGeometry(geo);
			})
			.catch(() => {
				/* no STL yet, placeholder stays */
			});
		return () => {
			cancelled = true;
		};
	}, [sim]);

	useEffect(() => () => sim.dispose(), [sim]);

	useFrame((state, dt) => {
		const t = state.clock.getElapsedTime();
		sim.update(t, Math.min(dt, 0.1), state.camera);
		// slow cinematic orbit
		const a = t * 0.045;
		state.camera.position.set(
			Math.sin(a) * 30,
			11 + Math.sin(t * 0.11) * 1.5,
			Math.cos(a) * 30,
		);
		state.camera.lookAt(0, 5, 0);
	});

	return <primitive object={sim.group} />;
}

export default function DefenseGridBackground({
	isDark = true,
	className = '',
}: {
	isDark?: boolean;
	className?: string;
}) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

	return (
		<div className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
			<Canvas
				camera={{ position: [0, 11, 30], fov: 55 }}
				gl={{ antialias: true, alpha: true }}
				dpr={[1, 1.75]}
			>
				<Scene palette={palette} additive={isDark} />
			</Canvas>
		</div>
	);
}
