"use client";

import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";

interface ThreeOrbitShowcaseSceneProps {
  enableControls?: boolean;
  accentColor?: string;
}

const ThreeOrbitShowcaseScene = ({
  enableControls = true,
  accentColor = "#f6b54d",
}: ThreeOrbitShowcaseSceneProps) => {
  return (
    <>
      <color attach="background" args={["#0b1220"]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 4, 6]} intensity={2.2} />
      <directionalLight position={[-4, -3, -2]} intensity={0.45} />
      <Float speed={1.6} rotationIntensity={0.8} floatIntensity={1.1}>
        <group rotation={[-0.25, 0.6, 0]}>
          <RoundedBox args={[2.5, 2.5, 2.5]} radius={0.26} smoothness={8}>
            <MeshTransmissionMaterial
              thickness={0.65}
              roughness={0.15}
              transmission={1}
              ior={1.15}
              chromaticAberration={0.06}
              distortion={0.2}
              color={accentColor}
            />
          </RoundedBox>
          <mesh position={[0, 0, 0]}>
            <torusKnotGeometry args={[0.72, 0.22, 180, 28]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.18}
              metalness={0.35}
            />
          </mesh>
        </group>
      </Float>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]}>
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial color="#121c2d" roughness={1} />
      </mesh>
      <Environment preset="city" />
      {enableControls ? (
        <OrbitControls
          enablePan={false}
          minDistance={4.5}
          maxDistance={8}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.9}
        />
      ) : null}
    </>
  );
};

export default ThreeOrbitShowcaseScene;
