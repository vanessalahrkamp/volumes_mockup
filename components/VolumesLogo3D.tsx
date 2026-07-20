"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Vertices traced pixel-precisely from the real Volumes mark
// (volumes_stacked_white.PNG): an outer hexagon (apex, shoulder, a bend
// partway down, then in to the bottom apex) framing a smaller inner
// hexagon-ish boundary. The ring between the two is split into three
// facet plates — top, right, left — each sharing two vertices with its
// neighbors, leaving the inner boundary's interior fully open (no mesh
// there at all) so the video shows straight through the center.
const OUTER = {
  top: [0, 1],
  upperRight: [0.871, 0.509],
  lowerRight: [0.871, -0.497],
  bottom: [0, -1],
  lowerLeft: [-0.871, -0.497],
  upperLeft: [-0.871, 0.509],
} as const;

const INNER = {
  topRight: [0.869, 0.486],
  bendRight: [0.425, -0.497],
  bottom: [0, -1],
  bendLeft: [-0.425, -0.497],
  topLeft: [-0.869, 0.486],
} as const;

function pathFrom(points: readonly (readonly [number, number])[]) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1]);
  shape.closePath();
  return shape;
}

const EXTRUDE_SETTINGS = {
  depth: 0.12,
  bevelEnabled: true,
  bevelThickness: 0.035,
  bevelSize: 0.03,
  bevelSegments: 4,
  curveSegments: 1,
};

function Facet({
  points,
  color,
}: {
  points: readonly (readonly [number, number])[];
  color: string;
}) {
  const geometry = useMemo(
    () => new THREE.ExtrudeGeometry(pathFrom(points), EXTRUDE_SETTINGS),
    [points],
  );
  const edges = useMemo(
    () => new THREE.EdgesGeometry(geometry, 25),
    [geometry],
  );

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={color}
          metalness={0.85}
          roughness={0.28}
          envMapIntensity={1.3}
        />
      </mesh>
      {/* Crisp bright line along every edge, echoing the flat mark's
          polished bevel highlight, independent of environment reflections. */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </lineSegments>
    </group>
  );
}

function VolumesMark() {
  const topFace = [
    OUTER.top,
    OUTER.upperRight,
    INNER.topRight,
    INNER.topLeft,
    OUTER.upperLeft,
  ] as const;

  const rightFace = [
    OUTER.upperRight,
    OUTER.lowerRight,
    OUTER.bottom,
    INNER.bendRight,
    INNER.topRight,
  ] as const;

  const leftFace = [
    OUTER.upperLeft,
    INNER.topLeft,
    INNER.bendLeft,
    OUTER.bottom,
    OUTER.lowerLeft,
  ] as const;

  return (
    <group>
      <Facet points={topFace} color="#ffffff" />
      <Facet points={rightFace} color="#e2e4e8" />
      <Facet points={leftFace} color="#c9cbd1" />
    </group>
  );
}

// Procedural studio environment (no external HDR fetch) — brighter above,
// darker below, so the chrome naturally reads lighter at the top face and
// deepens toward the bottom, matching the brand mark's shading.
function StudioEnvironment() {
  return (
    <Environment resolution={64}>
      <mesh scale={20}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#c8cad0" side={THREE.BackSide} />
      </mesh>
      <mesh position={[0, 5, 3]} scale={[10, 5, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[0, -5, 1]} scale={[10, 4, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#4a4c52" toneMapped={false} />
      </mesh>
    </Environment>
  );
}

export function VolumesLogo3D() {
  return (
    <div className="h-36 w-40 cursor-grab touch-none active:cursor-grabbing sm:h-44 sm:w-48 md:h-52 md:w-56">
      <Canvas
        camera={{ position: [0, 0, 3.6], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[2, 5, 5]} intensity={1.7} />
          <directionalLight position={[-3, -1, 2]} intensity={0.5} />
          <StudioEnvironment />
          <group rotation={[0.08, -0.15, 0]}>
            <VolumesMark />
          </group>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.12}
            rotateSpeed={0.7}
            autoRotate
            autoRotateSpeed={0.6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
