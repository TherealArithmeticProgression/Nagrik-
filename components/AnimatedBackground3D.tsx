"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Stars } from "@react-three/drei"
import * as THREE from "three"

function FloatingOrb({ position, color, size = 1, speed = 1 }: { position: [number, number, number]; color: string; size?: number; speed?: number }) {
    const meshRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<THREE.MeshStandardMaterial>(null)

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.003
            meshRef.current.position.x += Math.cos(state.clock.elapsedTime * speed * 0.5 + position[1]) * 0.002
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed
            meshRef.current.rotation.z = state.clock.elapsedTime * 0.15 * speed
        }
    })

    return (
        <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.8}>
            <mesh ref={meshRef} position={position}>
                <icosahedronGeometry args={[size, 1]} />
                <meshStandardMaterial
                    ref={materialRef}
                    color={color}
                    transparent
                    opacity={0.15}
                    wireframe
                    emissive={color}
                    emissiveIntensity={0.3}
                />
            </mesh>
        </Float>
    )
}

function GlowingSphere({ position, color, size = 0.3 }: { position: [number, number, number]; color: string; size?: number }) {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
        }
    })

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial
                color={color}
                transparent
                opacity={0.4}
                emissive={color}
                emissiveIntensity={0.8}
            />
        </mesh>
    )
}

function ParticleField() {
    const points = useMemo(() => {
        const positions = new Float32Array(300 * 3)
        const colors = new Float32Array(300 * 3)
        const tricolours = [
            new THREE.Color("#FF9933"),
            new THREE.Color("#FFFFFF"),
            new THREE.Color("#138808"),
        ]

        for (let i = 0; i < 300; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20

            const color = tricolours[i % 3]
            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b
        }
        return { positions, colors }
    }, [])

    const ref = useRef<THREE.Points>(null)

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.02
            ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
        }
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[points.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[points.colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                vertexColors
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    )
}

import { useTheme } from "@/context/ThemeContext"

function Scene({ theme }: { theme: string }) {
    const isDark = theme === "dark"

    return (
        <>
            <ambientLight intensity={isDark ? 0.2 : 0.8} />
            <pointLight position={[10, 10, 5]} intensity={isDark ? 0.5 : 0.8} color="#FF9933" />
            <pointLight position={[-10, -10, 5]} intensity={isDark ? 0.3 : 0.6} color="#138808" />
            <pointLight position={[0, 5, -5]} intensity={isDark ? 0.2 : 0.4} color="#FFFFFF" />

            <Stars 
                radius={100} 
                depth={50} 
                count={isDark ? 2000 : 500} 
                factor={4} 
                saturation={0} 
                fade 
                speed={1} 
            />

            <ParticleField />

            <FloatingOrb position={[-4, 2, -5]} color="#FF9933" size={1.5} speed={0.5} />
            <FloatingOrb position={[4, -1, -3]} color="#138808" size={1.2} speed={0.7} />
            <FloatingOrb position={[0, 3, -8]} color="#FFFFFF" size={1} speed={0.3} />
            <FloatingOrb position={[-3, -3, -6]} color="#FF9933" size={0.8} speed={0.9} />
            <FloatingOrb position={[5, 2, -10]} color="#138808" size={1.8} speed={0.4} />

            <GlowingSphere position={[-6, 4, -4]} color="#FF9933" size={0.2} />
            <GlowingSphere position={[6, -3, -6]} color="#138808" size={0.25} />
            <GlowingSphere position={[2, 5, -7]} color="#FFFFFF" size={0.15} />
            <GlowingSphere position={[-3, -5, -5]} color="#FF9933" size={0.18} />
        </>
    )
}

export function AnimatedBackground3D() {
    const { theme } = useTheme()

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "none",
                transition: "background 0.5s ease"
            }}
            className={theme === "light" ? "bg-slate-50/50" : ""}
        >
            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                style={{ background: "transparent" }}
                gl={{ alpha: true, antialias: true }}
            >
                <Scene theme={theme} />
            </Canvas>
        </div>
    )
}
