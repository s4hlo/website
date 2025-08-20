import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { BallCollider, Physics, RigidBody, RapierRigidBody } from '@react-three/rapier'
import { Box } from '@mui/material'

function ThreeDCubesScene() {
  const sphereCount = 125
  
  return (
    <Canvas flat shadows dpr={[1, 1.5]} gl={{ antialias: false }} camera={{ position: [0, 0, 30], fov: 17.5, near: 10, far: 40 }}>
      <color attach="background" args={['#141622']} />
      <Physics timeStep="vary" gravity={[0, 0, 0]}>
        <Pointer />
        {Array.from({ length: sphereCount }, (_, i) => (
          <Sphere key={i} />
        ))}
      </Physics>
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={100} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
          <Lightformer form="ring" color="#4060ff" intensity={80} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[10, 10, 0]} scale={10} />
        </group>
      </Environment>
    </Canvas>
  )
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef<RapierRigidBody>(null)
  useFrame(({ mouse, viewport }) => ref.current?.setNextKinematicTranslation(vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)))
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

function Sphere({ position, children }: { position?: [number, number, number]; children?: React.ReactNode }) {
  const api = useRef<RapierRigidBody>(null)
  const ref = useRef<THREE.Mesh>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])
  const r = THREE.MathUtils.randFloatSpread
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [position, r])
  
  useFrame(() => {
    if (api.current) {
      const translation = api.current.translation();
      api.current.applyImpulse(vec.copy(translation).negate().multiplyScalar(0.2), true);
    }
  })
  
  return (
    <RigidBody linearDamping={4} angularDamping={1} friction={0.1} position={pos as [number, number, number]} ref={api} colliders={false}>
      <BallCollider args={[0.5]} />
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial color="#4060ff" roughness={0.1} metalness={0.1} />
        {children}
      </mesh>
    </RigidBody>
  )
}

export default function ThreeDCubes() {
  return (
    <Box
      sx={{
        height: 'calc(100vh - var(--navbar-height))',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent'
      }}
    >
      <ThreeDCubesScene />
    </Box>
  )
} 