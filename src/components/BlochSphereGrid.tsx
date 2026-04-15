import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useBlochSpheres, BlochSphereData } from '../hooks/useBlochSphere';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function BlochSphere({ data, size = 0.8 }: { data: BlochSphereData; size?: number }) {
  const arrowRef = useRef<THREE.Group>(null);
  const isX = data.player === 'X';
  const mainColor = isX ? '#0ea5e9' : '#eab308';

  const sphereGeom = useMemo(() => new THREE.SphereGeometry(size, 24, 24), [size]);
  const wireGeom = useMemo(() => new THREE.SphereGeometry(size * 1.001, 16, 16), [size]);

  const arrowEnd = useMemo(() => {
    const { x, y, z } = data.coords;
    return new THREE.Vector3(x * size * 0.9, z * size * 0.9, y * size * 0.9);
  }, [data.coords, size]);

  return (
    <group>
      {/* Translucent sphere */}
      <mesh geometry={sphereGeom}>
        <meshBasicMaterial color="#0a0a2a" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Wireframe */}
      <mesh geometry={wireGeom}>
        <meshBasicMaterial color="#64748b" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 0.98, size * 1.02, 48]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* State vector arrow */}
      <group ref={arrowRef}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, arrowEnd.x, arrowEnd.y, arrowEnd.z])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={mainColor} linewidth={2} />
        </line>
        {/* Arrow tip */}
        <mesh position={arrowEnd}>
          <sphereGeometry args={[size * 0.06, 8, 8]} />
          <meshBasicMaterial color={mainColor} />
        </mesh>
      </group>

      {/* Poles — labeled with actual cell numbers */}
      <Text position={[0, size * 1.15, 0]} fontSize={size * 0.14} color="#0ea5e9">
        {`|cell ${data.cells[0]}⟩`}
      </Text>
      <Text position={[0, -size * 1.15, 0]} fontSize={size * 0.14} color="#eab308">
        {`|cell ${data.cells[1]}⟩`}
      </Text>

      {/* Move label (e.g. X1) */}
      <Text position={[0, size * 1.45, 0]} fontSize={size * 0.2} color={mainColor} fontWeight="bold">
        {data.label}
      </Text>

      {/* Cell pair subtitle */}
      <Text position={[0, -size * 1.45, 0]} fontSize={size * 0.12} color="#888899">
        {`cells [${data.cells[0]}, ${data.cells[1]}]`}
      </Text>
    </group>
  );
}

export default function BlochSphereGrid() {
  const spheres = useBlochSpheres();
  const activeSpheres = spheres.filter(s => !s.collapsed).slice(0, 9);

  if (activeSpheres.length === 0) {
    return (
      <div className="glass-panel p-3 text-center">
        <p className="font-display text-xs text-white tracking-widest">
          BLOCH SPHERES
        </p>
        <p className="text-xs opacity-30 mt-1 font-body">No active superpositions</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-3">
      <p className="font-display text-xs tracking-widest text-center mb-1 text-white">
        BLOCH SPHERES
      </p>
      <div style={{ height: 320, width: '100%' }}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={0.5} />

          {activeSpheres.map((s, i) => {
            const cols = Math.min(activeSpheres.length, 3);
            const row = Math.floor(i / cols);
            const col = i % cols;
            const spacing = 2;
            const offsetX = -(cols - 1) * spacing / 2;
            const offsetY = activeSpheres.length > 3 ? 1 : 0;

            return (
              <group key={s.moveId} position={[offsetX + col * spacing, offsetY - row * spacing, 0]}>
                <BlochSphere data={s} size={0.6} />
              </group>
            );
          })}

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Legend under the 3D canvas */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1 px-1">
        {activeSpheres.map(s => {
          const isX = s.player === 'X';
          return (
            <div
              key={s.moveId}
              className="flex items-center gap-1 text-xs font-mono"
              style={{ color: isX ? '#0ea5e9' : '#eab308' }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: isX ? '#0ea5e9' : '#eab308', boxShadow: `0 0 4px ${isX ? '#0ea5e9' : '#eab308'}` }}
              />
              <span className="font-bold">{s.label}</span>
              <span className="opacity-50">
                [{s.cells[0]},{s.cells[1]}]
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
