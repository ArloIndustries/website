'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface MeshTerrainProps {
	color?: string;
	additive?: boolean;
}

function FitCanvasToParent() {
	const { gl, setSize } = useThree();

	useEffect(() => {
		const parent = gl.domElement.parentElement;
		if (!parent) return;

		const fit = () => {
			const width = parent.clientWidth;
			const height = parent.clientHeight;
			if (width > 0 && height > 0) setSize(width, height);
		};

		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(parent);
		return () => observer.disconnect();
	}, [gl, setSize]);

	return null;
}

function Terrain({
	color = 'white',
	additive = true,
}: {
	color: string;
	additive?: boolean;
}) {
	const mesh1Ref = useRef<THREE.Mesh>(null!);
	const mesh2Ref = useRef<THREE.Mesh>(null!);

	const texture = useMemo(() => {
		if (typeof window === 'undefined') return null;
		const canvas = document.createElement('canvas');
		canvas.width = 128;
		canvas.height = 128;
		const ctx = canvas.getContext('2d')!;

		if (additive) {
			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, 128, 128);
			ctx.strokeStyle = '#ffffff';
		} else {
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, 128, 128);
			ctx.strokeStyle = '#ff0000';
		}
		ctx.lineWidth = 6;
		ctx.strokeRect(0, 0, 128, 128);

		const tex = new THREE.CanvasTexture(canvas);
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(60, 60);
		return tex;
	}, [additive]);

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

	useFrame((_state, delta) => {
		const speed = 4;
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
			opacity: additive ? 0.6 : 0.4,
			blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
			depthWrite: false,
		});
	}, [color, texture, additive]);

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

export default function MeshTerrainBackground({
	color = 'red',
	additive = true,
}: MeshTerrainProps) {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => setIsMounted(true), []);

	if (!isMounted) return null;

	return (
		<div className='arlo-mesh-terrain absolute inset-0 h-full w-full pointer-events-none'>
			<Canvas
				camera={{ position: [0, 2, 10], fov: 60 }}
				gl={{ antialias: true, alpha: true }}
				dpr={[1, 1.75]}
			>
				<FitCanvasToParent />
				<ambientLight intensity={1.0} />
				<Terrain color={color} additive={additive} />
			</Canvas>
		</div>
	);
}
