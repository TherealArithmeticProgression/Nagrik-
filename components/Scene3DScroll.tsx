"use client"

import { useEffect, useRef, useState, ReactNode, Children } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

interface Scene3DScrollProps {
    children: ReactNode
}

export function Scene3DScroll({ children }: Scene3DScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const childrenArray = Children.toArray(children)
    const count = childrenArray.length
    const anglePerSection = 360 / count
    const radius = 1000 // Distance from center of pillar

    // Smooth scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 70,
        damping: 30,
        restDelta: 0.001,
    })

    // Total rotation map: 0 to 360 degrees (or more if we want multiple turns)
    const rotationY = useTransform(smoothProgress, [0, 1], [0, -360])
    
    // Perspective shift — slightly pull back when moving between sections
    const z = useTransform(smoothProgress, (p) => {
        const sectionProgress = (p * count) % 1
        const zoom = Math.sin(sectionProgress * Math.PI) * 150 // Stronger zoom pulse
        return -radius - zoom
    })

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return <div ref={containerRef}>{children}</div>
    }

    return (
        <div 
            ref={containerRef} 
            className="relative" 
            style={{ height: `${count * 150}vh` }} // More scroll depth
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden perspective-[1500px]">
                <motion.div
                    style={{
                        rotateY: rotationY,
                        z,
                        transformStyle: "preserve-3d",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                    }}
                    className="flex justify-center items-center"
                >
                    {childrenArray.map((child, i) => {
                        const isLightSection = i % 2 !== 0
                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    width: "85%", // Slightly narrower so we see the roulette edges
                                    height: "90%",
                                    transform: `rotateY(${i * anglePerSection}deg) translateZ(${radius}px)`,
                                    backfaceVisibility: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    overflowY: "auto",
                                    padding: "4rem 2rem",
                                    // Alternating "vis-a-vis" themes
                                    background: isLightSection 
                                        ? "rgba(255, 255, 255, 0.05)" // Light tint
                                        : "rgba(0, 0, 0, 0.1)", // Dark tint
                                    borderRadius: "2rem",
                                    border: `1px solid ${isLightSection ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)"}`,
                                    boxShadow: isLightSection 
                                        ? "0 0 40px rgba(255,255,255,0.05)" 
                                        : "0 0 40px rgba(0,0,0,0.2)",
                                }}
                                className={`glass-section-container ${isLightSection ? 'light-section' : 'dark-section'}`}
                            >
                                <div className="max-w-6xl mx-auto w-full">
                                    {child}
                                </div>
                            </div>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    )
}
