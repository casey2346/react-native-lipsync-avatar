
import React from 'react';
import { Plane, OrbitControls } from '@react-three/drei';

const AmbientLight = 'ambientLight' as unknown as React.ComponentType<any>;
const DirectionalLight = 'directionalLight' as unknown as React.ComponentType<any>;
const MeshStandardMaterial = 'meshStandardMaterial' as unknown as React.ComponentType<any>;

export default function Environment() {
  return (
    <>
      <AmbientLight intensity={0.7} />
      <DirectionalLight position={[2, 5, 2]} intensity={1.2} />

      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <MeshStandardMaterial />
      </Plane>

      <OrbitControls enablePan={false} enableZoom={false} />
    </>
  );
}
