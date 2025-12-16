import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

type Props = { audioLevel: number }; 

export default function Avatar({ audioLevel }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  const headGeo = useMemo(() => new THREE.SphereGeometry(0.55, 32, 32), []);
  const mouthGeo = useMemo(() => new THREE.BoxGeometry(0.32, 0.12, 0.12), []);
  const headMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xffd8c2, roughness: 0.7, metalness: 0.05 }),
    []
  );
  const mouthMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.0 }),
    []
  );

  useFrame((_, delta) => {
    const v = Math.max(0, Math.min(1, audioLevel));

    if (mouthRef.current) {
      mouthRef.current.scale.y = 0.15 + v * 0.9;
      mouthRef.current.position.y = -0.15 - v * 0.05;
    }
    if (headRef.current) {
      headRef.current.rotation.y += delta * 0.2;
    }
  });

  return React.createElement(
    'group',
    { ref: groupRef, position: [0, -1.2, 0], scale: 1.2 },
    React.createElement('mesh', { ref: headRef, geometry: headGeo, material: headMat, position: [0, 0.2, 0] }),
    React.createElement('mesh', { ref: mouthRef, geometry: mouthGeo, material: mouthMat, position: [0, -0.15, 0.5] })
  );
}
