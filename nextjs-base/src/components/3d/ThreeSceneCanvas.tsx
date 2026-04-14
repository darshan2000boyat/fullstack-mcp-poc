"use client";

import { Canvas } from "@react-three/fiber";
import { ReactNode, Suspense } from "react";

interface ThreeSceneCanvasProps {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  dpr?: [number, number];
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
}

const ThreeSceneCanvas = ({
  children,
  className,
  fallback = null,
  dpr = [1, 1.75],
  camera = {
    position: [0, 0, 6],
    fov: 35,
  },
}: ThreeSceneCanvasProps) => {
  return (
    <div className={className}>
      <Canvas dpr={dpr} camera={camera} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={fallback}>{children}</Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeSceneCanvas;
