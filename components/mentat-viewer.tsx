'use client';

import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import type { BufferGeometry, Group } from 'three';
import { MENTAT_MODEL_URL } from '@/lib/mentat';

/** STL is exported Z-up (base at z=0, height along +Z). */
const WORLD_UP: [number, number, number] = [0, 0, 1];

function prepareStlGeometry(geometry: BufferGeometry): {
	geo: BufferGeometry;
	fitScale: number;
} {
	const geo = geometry.clone();
	geo.computeBoundingBox();
	geo.center();
	geo.computeVertexNormals();

	const size = new THREE.Vector3();
	geo.boundingBox!.getSize(size);
	const maxDim = Math.max(size.x, size.y, size.z);
	const fitScale = maxDim > 0 ? 2.5 / maxDim : 1;

	return { geo, fitScale };
}

function CameraSetup() {
	const { camera } = useThree();

	useLayoutEffect(() => {
		camera.up.set(...WORLD_UP);
		camera.position.set(4.2, 0, 1.6);
		camera.lookAt(0, 0, 0);
		camera.updateProjectionMatrix();
	}, [camera]);

	return null;
}

type MentatModelProps = {
	isDark: boolean;
};

function MentatModel({ isDark }: MentatModelProps) {
	const geometry = useLoader(STLLoader, MENTAT_MODEL_URL) as BufferGeometry;
	const { geo, fitScale } = useMemo(
		() => prepareStlGeometry(geometry),
		[geometry],
	);

	return (
		<mesh geometry={geo} scale={fitScale}>
			<meshStandardMaterial
				color={isDark ? '#ef4444' : '#b91c1c'}
				metalness={0.25}
				roughness={0.45}
				side={THREE.DoubleSide}
			/>
		</mesh>
	);
}

type MentatSceneProps = {
	isDark: boolean;
	groupRef: React.RefObject<Group | null>;
};

function MentatScene({ isDark, groupRef }: MentatSceneProps) {
	useFrame((_, delta) => {
		if (!groupRef.current) return;
		groupRef.current.rotation.z += delta * 0.45;
	});

	return (
		<group ref={groupRef}>
			<CameraSetup />
			<ambientLight intensity={0.75} />
			<directionalLight position={[4, 6, 8]} intensity={1.05} />
			<directionalLight position={[-6, 2, -4]} intensity={0.45} />
			<directionalLight position={[0, -4, 2]} intensity={0.25} />
			<Suspense fallback={null}>
				<MentatModel isDark={isDark} />
			</Suspense>
		</group>
	);
}

type MentatViewerProps = {
	isDark: boolean;
	className?: string;
};

export default function MentatViewer({ isDark, className = '' }: MentatViewerProps) {
	const groupRef = useRef<Group>(null);

	return (
		<div className={`h-full w-full touch-none ${className}`}>
			<Canvas
				camera={{ fov: 38, near: 0.01, far: 1000 }}
				gl={{ alpha: true, antialias: true }}
				style={{ background: 'transparent' }}
			>
				<MentatScene isDark={isDark} groupRef={groupRef} />
			</Canvas>
		</div>
	);
}
