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
	const meshRef = useRef<THREE.Mesh>(null!);
	const materialRef = useRef<THREE.MeshBasicMaterial>(null!);
	
	// Generate a grid texture
	const texture = useMemo(() => {
		if (typeof window === 'undefined') return null;
		const canvas = document.createElement('canvas');
		canvas.width = 128;
		canvas.height = 128;
		const ctx = canvas.getContext('2d')!;
		
		// Fill black
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, 128, 128);
		
		// Draw bright border for the grid lines
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 6;
		ctx.strokeRect(0, 0, 128, 128);
		
		const tex = new THREE.CanvasTexture(canvas);
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(60, 60); // Match the plane segments
		return tex;
	}, []);

	// Create a static, blocky plane geometry
	const geometry = useMemo(() => {
		const geo = new THREE.PlaneGeometry(120, 120, 60, 60);
		const vertices = geo.attributes.position.array;
		
		for (let i = 0; i < vertices.length; i += 3) {
			const x = vertices[i];
			const y = vertices[i + 1];
			
			// Blocky grid math (step every 4 units)
			const blockX = Math.floor(x / 4) * 4;
			const blockY = Math.floor(y / 4) * 4;
			
			let z = 0;
			z += Math.sin(blockX * 0.15 + blockY * 0.1) * 4;
			z += Math.cos(blockX * 0.1 - blockY * 0.15) * 4;
			
			// Step the height to make it "squarish/jagged"
			z = Math.floor(z);
			
			vertices[i + 2] = z;
		}
		
		geo.computeVertexNormals();
		return geo;
	}, []);

	useFrame((state, delta) => {
		if (texture) {
			// Scroll the texture to create forward movement illusion
			texture.offset.y -= delta * 0.4; // adjust speed
		}
	});

	return (
		<mesh 
			ref={meshRef} 
			geometry={geometry} 
			rotation={[-Math.PI / 2, 0, 0]} 
			position={[0, -4, 0]}
		>
			{texture && (
				<meshBasicMaterial 
					ref={materialRef}
					color={color} 
					map={texture}
					transparent={true} 
					opacity={1.0} // Maximum brightness
					blending={THREE.AdditiveBlending}
					depthWrite={false}
				/>
			)}
		</mesh>
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

export default function MeshTerrainBackground({ color = 'red', showPrism = true }: MeshTerrainProps) {
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
