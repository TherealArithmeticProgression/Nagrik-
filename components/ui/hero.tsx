"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Microphone as MicrophoneSolid } from "iconoir-react/solid"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/LanguageContext"

interface HeroProps {
    onVoiceTrigger?: (text: string) => void
}

export function Hero({ onVoiceTrigger }: HeroProps) {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const recognitionRef = useRef<any>(null)
    const { t } = useLanguage()

    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition()
                recognitionRef.current.continuous = true
                recognitionRef.current.interimResults = true
                recognitionRef.current.lang = "en-US"

                recognitionRef.current.onresult = (event: any) => {
                    let currentTranscript = ""
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        currentTranscript += event.results[i][0].transcript
                    }
                    setTranscript(currentTranscript)
                }

                recognitionRef.current.onend = () => {
                    setIsListening(false)
                }
            }
        }
    }, [])

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop()
            setIsListening(false)
            if (transcript && onVoiceTrigger) {
                onVoiceTrigger(transcript)
                const chatWidget = document.getElementById('nagrik-chat-widget')
                if (chatWidget) {
                    chatWidget.scrollIntoView({ behavior: 'smooth' })
                }
            }
        } else {
            setTranscript("")
            try {
                recognitionRef.current?.start()
                setIsListening(true)
            } catch (error) {
                console.error("Speech recognition error:", error)
                setIsListening(true)
            }
        }
    }

    return (
        <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden pt-20 text-center">
            {/* Ambient glow effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FF9933]/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#138808]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-white/3 blur-[100px] rounded-full pointer-events-none" />

            {/* Content */}
            <div className="container relative z-10 px-4">
                {/* Small glass badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.05 }}
                    className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full glass px-5 py-2.5"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#138808] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#138808]"></span>
                    </span>
                    <span className="text-sm font-medium text-white/70">Digital India Initiative</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="mx-auto max-w-5xl text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-8xl"
                >
                    {t("hero.title")} <br />
                    <span className="tricolour-text">{t("hero.subtitle")}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mx-auto mt-8 max-w-2xl text-lg text-white/50 sm:text-xl leading-relaxed"
                >
                    {t("hero.description")}
                </motion.p>

                {/* Microphone Interaction — Glassmorphic */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                    className="mt-16 flex flex-col items-center justify-center"
                >
                    <div className="relative">
                        <AnimatePresence>
                            {isListening && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 w-72 p-5 glass-strong rounded-2xl text-center z-20"
                                >
                                    <p className="text-sm font-medium text-white/90">{transcript || "Listening..."}</p>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 glass-strong rotate-45" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Animated pulse rings with tricolour */}
                        <AnimatePresence>
                            {isListening && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 1 }}
                                        animate={{ opacity: [0.15, 0.3, 0], scale: 2.5 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                        className="absolute inset-0 rounded-full border-2 border-[#FF9933]/30"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 1 }}
                                        animate={{ opacity: [0.15, 0.3, 0], scale: 2 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                                        className="absolute inset-0 rounded-full border-2 border-white/20"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 1 }}
                                        animate={{ opacity: [0.15, 0.3, 0], scale: 1.5 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                                        className="absolute inset-0 rounded-full border-2 border-[#138808]/30"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        {/* Main Button — glass orb */}
                        <button
                            onClick={toggleListening}
                            className={cn(
                                "relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500 focus:outline-none z-10",
                                isListening
                                    ? "bg-gradient-to-br from-[#FF9933] via-white/20 to-[#138808] text-white shadow-[0_0_60px_-10px_rgba(255,153,51,0.5)] scale-110"
                                    : "glass-card text-[#FF9933] hover:scale-105 pulse-glow cursor-pointer"
                            )}
                        >
                            {isListening ? (
                                <div className="flex items-center justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [8, 32, 8] }}
                                            transition={{
                                                duration: 0.5,
                                                repeat: Infinity,
                                                delay: i * 0.1,
                                                ease: "easeInOut"
                                            }}
                                            className="w-1.5 rounded-full bg-white shadow-sm"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <MicrophoneSolid className="h-12 w-12 drop-shadow-sm" />
                            )}
                        </button>
                    </div>
                    <p className="mt-8 text-sm font-semibold tracking-widest text-white/30 uppercase">
                        {isListening ? (
                            <span className="text-[#FF9933] animate-pulse">{t("hero.listening")}</span>
                        ) : (
                            t("hero.tapToSpeak")
                        )}
                    </p>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-20 flex flex-col items-center gap-2"
                >
                    <span className="text-xs text-white/20 uppercase tracking-widest">Scroll to explore</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1"
                    >
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1 h-2 rounded-full bg-[#FF9933]"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
