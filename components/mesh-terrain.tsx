'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';

interface MeshTerrainProps {
	color?: string;
	showPrism?: boolean;
}

function Terrain({ color = 'white' }: { color: string }) {
	const mesh1Ref = useRef<THREE.Mesh>(null!);
	const mesh2Ref = useRef<THREE.Mesh>(null!);

	const texture = useMemo(() => {
		if (typeof window === 'undefined') return null;
		const canvas = document.createElement('canvas');
		canvas.width = 128;
		canvas.height = 128;
		const ctx = canvas.getContext('2d')!;

		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, 128, 128);

		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 6;
		ctx.strokeRect(0, 0, 128, 128);

		const tex = new THREE.CanvasTexture(canvas);
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(60, 60);
		return tex;
	}, []);

	const geo1 = useMemo(() => new THREE.PlaneGeometry(120, 120, 60, 60), []);
	const geo2 = useMemo(() => new THREE.PlaneGeometry(120, 120, 60, 60), []);

	const updateGeometry = (geo: THREE.PlaneGeometry, worldOffsetZ: number) => {
		const vertices = geo.attributes.position.array;
		for (let i = 0; i < vertices.length; i += 3) {
			const x = vertices[i];
			const localY = vertices[i + 1];
			// Plane is rotated -PI/2 on X, so local +Y points to world -Z
			const worldZ = worldOffsetZ - localY;

			const blockX = Math.floor(x / 4) * 4;
			const blockZ = Math.floor(worldZ / 4) * 4;

			let z = 0;
			z += Math.sin(blockX * 0.15 + blockZ * 0.1) * 4;
			z += Math.cos(blockX * 0.1 - blockZ * 0.15) * 4;

			z = Math.floor(z);
			vertices[i + 2] = z;
		}
		geo.computeVertexNormals();
		geo.attributes.position.needsUpdate = true;
	};

	// Initialize the two chunks
	useMemo(() => {
		updateGeometry(geo1, 0);
		updateGeometry(geo2, -120);
	}, [geo1, geo2]);

	const chunk1Z = useRef(0);
	const chunk2Z = useRef(-120);

	useFrame((state, delta) => {
		const speed = 4; // Speed of flying over the terrain
		chunk1Z.current += delta * speed;
		chunk2Z.current += delta * speed;

		if (chunk1Z.current > 120) {
			chunk1Z.current -= 240;
			updateGeometry(geo1, chunk1Z.current);
		}
		if (chunk2Z.current > 120) {
			chunk2Z.current -= 240;
			updateGeometry(geo2, chunk2Z.current);
		}

		if (mesh1Ref.current) mesh1Ref.current.position.z = chunk1Z.current;
		if (mesh2Ref.current) mesh2Ref.current.position.z = chunk2Z.current;
	});

	const material = useMemo(() => {
		if (!texture) return null;
		return new THREE.MeshBasicMaterial({
			color,
			map: texture,
			transparent: true,
			opacity: 0.6,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
		});
	}, [color, texture]);

	if (!texture || !material) return null;

	return (
		<group position={[0, -4, 0]}>
			<mesh
				ref={mesh1Ref}
				geometry={geo1}
				material={material}
				rotation={[-Math.PI / 2, 0, 0]}
			/>
			<mesh
				ref={mesh2Ref}
				geometry={geo2}
				material={material}
				rotation={[-Math.PI / 2, 0, 0]}
			/>
		</group>
	);
}

function SpinningPrism({ color = 'white' }: { color: string }) {
	const groupRef = useRef<Group>(null!);

	useFrame((state, delta) => {
		groupRef.current.rotation.x += delta * 0.4;
		groupRef.current.rotation.y += delta * 0.8;
		groupRef.current.rotation.z += delta * 0.2;

		groupRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.5;
	});

	const a = 2.0;
	const vertices: [number, number, number][] = [
		[a, a, a],
		[a, -a, -a],
		[-a, a, -a],
		[-a, -a, a],
	];

	const edges: [number, number, number][][] = [
		[vertices[0], vertices[1]],
		[vertices[0], vertices[2]],
		[vertices[0], vertices[3]],
		[vertices[1], vertices[2]],
		[vertices[1], vertices[3]],
		[vertices[2], vertices[3]],
	];

	return (
		<group ref={groupRef} position={[0, 0, 0]}>
			{edges.map((edge, index) => (
				<Line
					key={index}
					points={edge}
					color={color}
					lineWidth={2}
					transparent={false}
				/>
			))}
		</group>
	);
}

export default function MeshTerrainBackground({
	color = 'red',
	showPrism = true,
}: MeshTerrainProps) {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => setIsMounted(true), []);

	if (!isMounted) return null;

	return (
		<div className='absolute inset-0 w-full h-full pointer-events-none'>
			<Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
				<ambientLight intensity={1.0} />
				<Terrain color={color} />
				{showPrism && <SpinningPrism color={color} />}
			</Canvas>
		</div>
	);
}
