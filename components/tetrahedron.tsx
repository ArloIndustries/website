import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import type { Group } from 'three';

interface TetrahedronProps {
	color?: string;
}

function TetrahedronMesh({ color = 'white' }: TetrahedronProps) {
	const groupRef = useRef<Group>(null!);

	useFrame((state, delta) => {
		groupRef.current.rotation.x += delta * 0.4;
		groupRef.current.rotation.y += delta * 0.8;
		groupRef.current.rotation.z += delta * 0.2;
	});

	// Regular tetrahedron vertices - all edges equal length, centered at origin
	const a = 2.5; // edge length factor
	const vertices: [number, number, number][] = [
		[a, a, a],
		[a, -a, -a],
		[-a, a, -a],
		[-a, -a, a],
	];

	// Tetrahedron edges - all 6 edges of equal length
	const edges: [number, number, number][][] = [
		[vertices[0], vertices[1]], // vertex 0 to 1
		[vertices[0], vertices[2]], // vertex 0 to 2
		[vertices[0], vertices[3]], // vertex 0 to 3
		[vertices[1], vertices[2]], // vertex 1 to 2
		[vertices[1], vertices[3]], // vertex 1 to 3
		[vertices[2], vertices[3]], // vertex 2 to 3
	];

	return (
		<group ref={groupRef}>
			{edges.map((edge, index) => (
				<group key={index}>
					{/* Core solid line */}
					<Line
						points={edge}
						color={color}
						lineWidth={4}
						transparent={false}
					/>
					{/* Outer glow line */}
					<Line
						points={edge}
						color={color}
						lineWidth={12}
						transparent={true}
						opacity={0.3}
					/>
					{/* Large faint glow */}
					<Line
						points={edge}
						color={color}
						lineWidth={24}
						transparent={true}
						opacity={0.1}
					/>
				</group>
			))}
		</group>
	);
}

export default function Tetrahedron({ color }: TetrahedronProps) {
	return (
		<div className='w-full h-full'>
			<Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
				<ambientLight intensity={1.0} />
				<pointLight position={[10, 10, 10]} intensity={1.2} />
				<TetrahedronMesh color={color} />
			</Canvas>
		</div>
	);
}
