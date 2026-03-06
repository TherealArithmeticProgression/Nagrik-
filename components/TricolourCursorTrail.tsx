"use client"

import { useEffect, useRef } from "react"

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
    color: string
    opacity: number
}

const SAFFRON = "#FF9933"
const WHITE = "#FFFFFF"
const GREEN = "#138808"

const COLORS = [SAFFRON, SAFFRON, WHITE, GREEN, GREEN]

export function TricolourCursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const mouseRef = useRef({ x: 0, y: 0 })
    const prevMouseRef = useRef({ x: 0, y: 0 })
    const animFrameRef = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener("resize", resize)

        const handleMouseMove = (e: MouseEvent, targetOverride?: HTMLElement) => {
            const target = targetOverride || (e.target as HTMLElement)
            const isOnNavbar = target && (target.closest('.glass-navbar') || target.closest('.navbar'))

            prevMouseRef.current = { ...mouseRef.current }
            mouseRef.current = { x: e.clientX, y: e.clientY }

            if (isOnNavbar) return

            const dx = mouseRef.current.x - prevMouseRef.current.x
            const dy = mouseRef.current.y - prevMouseRef.current.y
            const speed = Math.sqrt(dx * dx + dy * dy)

            // Spawn particles based on speed
            const count = Math.min(Math.floor(speed / 3) + 1, 5)
            for (let i = 0; i < count; i++) {
                const color = COLORS[Math.floor(Math.random() * COLORS.length)]
                const angle = Math.random() * Math.PI * 2
                const velocity = Math.random() * 1.5 + 0.5

                particlesRef.current.push({
                    x: mouseRef.current.x + (Math.random() - 0.5) * 8,
                    y: mouseRef.current.y + (Math.random() - 0.5) * 8,
                    vx: Math.cos(angle) * velocity + dx * 0.1,
                    vy: Math.sin(angle) * velocity + dy * 0.1,
                    life: 0,
                    maxLife: 40 + Math.random() * 30,
                    size: Math.random() * 4 + 2,
                    color,
                    opacity: 1,
                })
            }
        }

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0]
            if (touch) {
                const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement
                const mouseEvent = new MouseEvent("mousemove", {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                })
                handleMouseMove(mouseEvent, target)
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("touchmove", handleTouchMove)

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particlesRef.current = particlesRef.current.filter((p) => {
                p.life++
                p.x += p.vx
                p.y += p.vy
                p.vx *= 0.97
                p.vy *= 0.97
                p.vy += 0.02 // slight gravity
                p.opacity = 1 - p.life / p.maxLife

                if (p.life >= p.maxLife) return false

                ctx.save()
                ctx.globalAlpha = p.opacity * 0.8
                ctx.fillStyle = p.color
                ctx.shadowBlur = 12
                ctx.shadowColor = p.color

                ctx.beginPath()
                const currentSize = p.size * (1 - p.life / p.maxLife * 0.5)
                ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
                ctx.fill()
                ctx.restore()

                return true
            })

            animFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", resize)
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("touchmove", handleTouchMove)
            cancelAnimationFrame(animFrameRef.current)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 9999,
            }}
        />
    )
}
