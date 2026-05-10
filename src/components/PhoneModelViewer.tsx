import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2 } from 'lucide-react';

function PhoneModel({ brand, model }: { brand: string, model: string }) {
  const ref = useRef<THREE.Group>(null);
  const b = brand.toLowerCase();
  const m = model.toLowerCase();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = Math.sin(t / 4) / 4 + Math.PI; // Face the back initially
      ref.current.rotation.x = Math.cos(t / 4) / 10;
      ref.current.position.y = Math.sin(t / 1.5) / 5;
    }
  });

  const getBrandDetails = () => {
    if (b.includes('apple')) return { color: '#f0f0f0', text: '#555', dim: [3.2, 6.8, 0.35] as [number, number, number], radius: 0.5 };
    if (b.includes('samsung')) return { color: '#1a1a2e', text: '#888', dim: [3.3, 7.0, 0.4] as [number, number, number], radius: m.includes('ultra') ? 0.1 : 0.4 };
    if (b.includes('xiaomi')) return { color: '#e6e6e6', text: '#ff6600', dim: [3.25, 6.9, 0.42] as [number, number, number], radius: 0.35 };
    if (b.includes('google')) return { color: '#faeedb', text: '#888', dim: [3.2, 6.7, 0.4] as [number, number, number], radius: 0.4 };
    if (b.includes('tecno')) return { color: '#2a4b7c', text: '#fff', dim: [3.3, 6.9, 0.38] as [number, number, number], radius: 0.3 };
    if (b.includes('infinix')) return { color: '#0f4c3a', text: '#111', dim: [3.4, 7.1, 0.4] as [number, number, number], radius: 0.3 };
    return { color: '#333333', text: '#fff', dim: [3.2, 6.8, 0.4] as [number, number, number], radius: 0.4 };
  };

  const details = getBrandDetails();
  const { color: modelColor, text: textColor, dim, radius } = details;

  return (
    <group ref={ref} dispose={null}>
      {/* Phone Body */}
      <RoundedBox args={dim} radius={radius} smoothness={16}>
        <meshPhysicalMaterial 
          color={modelColor}
          metalness={b.includes('apple') ? 0.2 : 0.4} 
          roughness={b.includes('apple') ? 0.8 : 0.2} 
          clearcoat={b.includes('samsung') ? 1.0 : 0.4}
        />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox args={[dim[0]-0.15, dim[1]-0.15, dim[2]+0.02]} radius={radius-0.1} smoothness={16}>
        <meshPhysicalMaterial 
          color="#020202" 
          metalness={0.8} 
          roughness={0.1} 
          clearcoat={1}
        />
      </RoundedBox>

      {/* Camera Bump Variations */}
      <group position={[0, 0, -dim[2]/2 - 0.01]} rotation={[0, Math.PI, 0]}>
        
        {/* Apple Style */}
        {b.includes('apple') && (
          <group position={[-0.7, 2.3, 0]}>
            <RoundedBox args={[1.4, 1.4, 0.1]} radius={0.3} smoothness={8}>
               <meshPhysicalMaterial color={modelColor} metalness={0.1} roughness={0.5} transparent opacity={0.6} />
            </RoundedBox>
            <mesh position={[-0.3, 0.3, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.25, 0.25, 0.05, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0} /></mesh>
            <mesh position={[0.3, -0.3, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.25, 0.25, 0.05, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0} /></mesh>
            {m.includes('pro') && <mesh position={[-0.3, -0.3, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.25, 0.25, 0.05, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0} /></mesh>}
          </group>
        )}

        {/* Samsung Style */}
        {b.includes('samsung') && (
          <group position={[-1.0, 2.2, 0]}>
            <mesh position={[0, 0.6, 0.04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.06, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0.2} /></mesh>
            <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.06, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0.2} /></mesh>
            <mesh position={[0, -0.6, 0.04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.06, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0.2} /></mesh>
            {m.includes('ultra') && <mesh position={[0.5, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.06, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0.2} /></mesh>}
          </group>
        )}

        {/* Google Style (Visor) */}
        {b.includes('google') && (
          <group position={[0, 2.0, 0]}>
            <RoundedBox args={[dim[0], 0.8, 0.12]} radius={0.1} smoothness={8}>
               <meshPhysicalMaterial color="#222" metalness={0.8} roughness={0.2} />
            </RoundedBox>
            <mesh position={[-0.5, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.05, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0} /></mesh>
            <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.05, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0} /></mesh>
            {m.includes('pro') && <mesh position={[0.5, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.05, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0} /></mesh>}
          </group>
        )}

        {/* Xiaomi Style (Circle) */}
        {b.includes('xiaomi') && (
          <group position={[0, 1.8, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[1.2, 1.2, 0.1, 64]} /><meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.1} /></mesh>
            <mesh position={[-0.4, 0.4, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.02, 32]} /><meshPhysicalMaterial color="#222" metalness={1} roughness={0} /></mesh>
            <mesh position={[0.4, 0.4, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.02, 32]} /><meshPhysicalMaterial color="#222" metalness={1} roughness={0} /></mesh>
            <mesh position={[-0.4, -0.4, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.02, 32]} /><meshPhysicalMaterial color="#222" metalness={1} roughness={0} /></mesh>
            <mesh position={[0.4, -0.4, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.02, 32]} /><meshPhysicalMaterial color="#222" metalness={1} roughness={0} /></mesh>
          </group>
        )}

        {/* Generic/Others Style */}
        {(!b.includes('apple') && !b.includes('samsung') && !b.includes('google') && !b.includes('xiaomi')) && (
          <group position={[-0.6, 2.2, 0]}>
            <RoundedBox args={[1.2, 1.8, 0.1]} radius={0.2} smoothness={8}>
               <meshPhysicalMaterial color={modelColor} metalness={0.6} roughness={0.3} />
            </RoundedBox>
            <mesh position={[0, 0.5, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.25, 0.25, 0.05, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0} /></mesh>
            <mesh position={[0, -0.5, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.25, 0.25, 0.05, 32]} /><meshPhysicalMaterial color="#111" metalness={1} roughness={0} /></mesh>
          </group>
        )}

        {/* Brand Text on Back */}
        <Text
          position={[0, -1.0, 0.01]}
          fontSize={0.35}
          color={textColor}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          maxWidth={2.8}
          textAlign="center"
          material-toneMapped={false}
        >
          {model}
        </Text>
      </group>
    </group>
  );
}

export function PhoneModelViewer({ brand, model }: { brand: string, model: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-[3rem]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <PhoneModel brand={brand} model={model} />
        <Environment preset="city" />
        <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={15}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
