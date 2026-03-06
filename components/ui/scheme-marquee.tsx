"use client"

import { useState } from "react"
import { ArrowRight } from "iconoir-react/regular"
import { cn } from "@/lib/utils"
import { schemesData, type Scheme, type SchemeContent } from "@/lib/schemesData"
import { SchemeModal } from "./scheme-modal"
import { useLanguage } from "@/context/LanguageContext"
import { translations } from "@/lib/translations"
import { motion } from "framer-motion"

export function SchemeMarquee() {
    const { language } = useLanguage()
    const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const t = translations[language].schemes

    const handleSchemeClick = (scheme: Scheme) => {
        setSelectedScheme(scheme)
        setIsModalOpen(true)
    }

    return (
        <>
            <section className="w-full overflow-hidden py-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#138808]/60 mb-2 block">Schemes</span>
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">Government Schemes for You</h2>
                </motion.div>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[hsl(220,20%,6%)] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[hsl(220,20%,6%)] to-transparent z-10 pointer-events-none" />

                    <div className="group flex w-full overflow-hidden">
                        <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-6 group-hover:[animation-play-state:paused]">
                            {schemesData.map((scheme, index) => (
                                <SchemeCard
                                    key={`original-${index}`}
                                    scheme={scheme}
                                    content={scheme[language] as SchemeContent || scheme["en"]}
                                    onClick={() => handleSchemeClick(scheme)}
                                    buttonText={t.know_more}
                                />
                            ))}
                        </div>
                        <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-6 group-hover:[animation-play-state:paused] ml-6">
                            {schemesData.map((scheme, index) => (
                                <SchemeCard
                                    key={`duplicate-${index}`}
                                    scheme={scheme}
                                    content={scheme[language] as SchemeContent || scheme["en"]}
                                    onClick={() => handleSchemeClick(scheme)}
                                    buttonText={t.know_more}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <SchemeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                scheme={selectedScheme}
            />
        </>
    )
}

function SchemeCard({ scheme, content, onClick, buttonText }: { scheme: Scheme; content: SchemeContent; onClick: () => void; buttonText: string }) {
    return (
        <div
            onClick={onClick}
            className="relative flex h-[240px] w-[370px] flex-col justify-between rounded-2xl glass-card p-7 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer group/card"
        >
            {/* Subtle top accent line */}
            <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-[#FF9933]/0 via-[#FF9933]/30 to-[#FF9933]/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

            <div>
                <h3 className="mb-3 text-lg font-bold text-white group-hover/card:text-[#FF9933] transition-colors duration-300">{content.title}</h3>
                <div className="mb-3 inline-block rounded-full bg-[#FF9933]/10 px-3 py-1 text-xs font-bold text-[#FF9933]">
                    {content.highlight}
                </div>
                <p className="text-sm leading-relaxed text-white/40 line-clamp-2 group-hover/card:text-white/60 transition-colors duration-300">{content.desc}</p>
            </div>
            <button className="group/btn mt-4 flex items-center gap-2 text-sm font-semibold text-[#FF9933]/70 transition-colors hover:text-[#FF9933]">
                {buttonText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" strokeWidth={2.5} />
            </button>
        </div>
    )
}
