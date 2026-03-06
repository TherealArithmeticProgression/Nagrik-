"use client"

import { motion } from "framer-motion"
import { Microphone as MicrophoneSolid, Sparks as SparksSolid } from "iconoir-react/solid"
import { ShieldCheck, Translate } from "iconoir-react/regular"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/LanguageContext"
import { useRef } from "react"

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -8
        const rotateY = ((x - centerX) / centerX) * 8

        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
        if (!cardRef.current) return
        cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn("transition-transform duration-300 ease-out", className)}
            style={{ transformStyle: "preserve-3d" }}
        >
            {children}
        </div>
    )
}

export function BentoGrid() {
    const { t } = useLanguage()

    const features = [
        {
            title: t("bento.voiceNav.title"),
            description: t("bento.voiceNav.desc"),
            icon: MicrophoneSolid,
            className: "md:col-span-2 md:row-span-2",
            glowColor: "rgba(255, 153, 51, 0.08)",
            iconBg: "bg-[#FF9933]/10",
            iconColor: "text-[#FF9933]",
            borderGlow: "hover:shadow-[0_0_40px_rgba(255,153,51,0.1)]",
        },
        {
            title: t("bento.digilocker.title"),
            description: t("bento.digilocker.desc"),
            icon: ShieldCheck,
            className: "md:col-span-1 md:row-span-1",
            glowColor: "rgba(255, 255, 255, 0.05)",
            iconBg: "bg-white/5",
            iconColor: "text-white/80",
            borderGlow: "hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]",
        },
        {
            title: t("bento.autoFill.title"),
            description: t("bento.autoFill.desc"),
            icon: SparksSolid,
            className: "md:col-span-1 md:row-span-1",
            glowColor: "rgba(19, 136, 8, 0.08)",
            iconBg: "bg-[#138808]/10",
            iconColor: "text-[#138808]",
            borderGlow: "hover:shadow-[0_0_40px_rgba(19,136,8,0.1)]",
        },
        {
            title: t("bento.vernacular.title"),
            description: t("bento.vernacular.desc"),
            icon: Translate,
            className: "md:col-span-2 md:row-span-1",
            glowColor: "rgba(255, 153, 51, 0.06)",
            iconBg: "bg-[#FF9933]/10",
            iconColor: "text-[#FF9933]",
            borderGlow: "hover:shadow-[0_0_40px_rgba(255,153,51,0.08)]",
        },
    ]

    return (
        <section className="container py-24 relative z-10">
            <div className="mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#FF9933]/60 mb-4 block">Features</span>
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        {t("bento.heading")}
                    </h2>
                    <p className="mt-4 text-lg text-white/40 max-w-2xl mx-auto">
                        {t("bento.subheading")}
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:grid-rows-2">
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={feature.className}
                    >
                        <TiltCard className="h-full">
                            <div
                                className={cn(
                                    "group relative h-full overflow-hidden rounded-3xl glass-card p-8 transition-all duration-500",
                                    feature.borderGlow
                                )}
                            >
                                {/* Ambient gradient blob */}
                                <div
                                    className="absolute -right-20 -top-20 h-60 w-60 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150 opacity-0 group-hover:opacity-100"
                                    style={{ background: feature.glowColor }}
                                />

                                {/* Shimmer line on hover */}
                                <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                    <div className="absolute inset-0 tricolour-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                <div className="relative z-10 flex h-full flex-col justify-between" style={{ transform: "translateZ(20px)" }}>
                                    <div
                                        className={cn(
                                            "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                                            feature.iconBg,
                                            feature.iconColor
                                        )}
                                    >
                                        <feature.icon className="h-7 w-7" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#FF9933]">
                                            {feature.title}
                                        </h3>
                                        <p className="text-white/40 font-medium transition-colors duration-300 group-hover:text-white/60 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
