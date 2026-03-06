"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Send as SendSolid, Microphone as MicrophoneSolid, CheckCircle as CheckCircleSolid } from "iconoir-react/solid"
import { Refresh, SoundHigh, SoundOff, Sparks } from "iconoir-react/regular"
import { useLanguage } from "@/context/LanguageContext"
import { useState, useEffect, useRef } from "react"

interface DemoInterfaceProps {
    voiceTrigger?: string | null
    onVoiceTriggerClear?: () => void
}

export function DemoInterface({ voiceTrigger, onVoiceTriggerClear }: DemoInterfaceProps) {
    const { t, language } = useLanguage()
    const [inputValue, setInputValue] = useState("")
    const [isListening, setIsListening] = useState(false)
    const [isSpeechEnabled, setIsSpeechEnabled] = useState(true)
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [fileProcessing, setFileProcessing] = useState(false)
    const [processingStage, setProcessingStage] = useState(0)
    const [loadingMessage, setLoadingMessage] = useState("")
    const loadingMessages = [
        "Nagrik Assistant is preparing the answer...",
        "Consulting the government database...",
        "Finding relevant schemes for you...",
        "Translating the information...",
        "Almost ready..."
    ]

    const chatContainerRef = useRef<HTMLDivElement>(null)
    const lastMessageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading && !fileProcessing) {
            let index = 0;
            setLoadingMessage(loadingMessages[0]);
            interval = setInterval(() => {
                index = (index + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[index]);
            }, 4000);
        } else {
            setLoadingMessage("");
        }
        return () => clearInterval(interval);
    }, [isLoading, fileProcessing]);

    useEffect(() => {
        if (chatContainerRef.current) {
            setTimeout(() => {
                const chatBox = chatContainerRef.current;
                const lastUserMsg = chatBox?.querySelectorAll('.user-message');
                const targetMsg = lastUserMsg && lastUserMsg.length > 0 ? lastUserMsg[lastUserMsg.length - 1] : lastMessageRef.current;
                if (chatBox && targetMsg) {
                    const targetTop = (targetMsg as HTMLElement).offsetTop;
                    chatBox.scrollTo({ top: targetTop - 120, behavior: 'smooth' });
                }
            }, 300);
        }
    }, [messages]);

    useEffect(() => {
        if (voiceTrigger && voiceTrigger.trim() !== "") {
            setInputValue(voiceTrigger)
            setIsListening(false)
            const timer = setTimeout(() => {
                handleSend(voiceTrigger)
                if (onVoiceTriggerClear) onVoiceTriggerClear()
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [voiceTrigger, onVoiceTriggerClear])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileProcessing(true);
        setProcessingStage(0);
        const stageTimer = setInterval(() => {
            setProcessingStage(prev => {
                if (prev === 3) { clearInterval(stageTimer); return 3; }
                if (prev >= 2) { clearInterval(stageTimer); return 2; }
                return prev + 1;
            });
        }, 800);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await response.json();
            if (data.text) {
                setProcessingStage(3);
                setTimeout(() => {
                    const hiddenContent = `I have uploaded a file named ${file.name}. Here is its content:\n\n${data.text}\n\nAnalyze this document.`;
                    handleSend(hiddenContent);
                    setFileProcessing(false);
                }, 1000);
            } else {
                alert("Failed to process file. Please try again.");
                setFileProcessing(false);
            }
        } catch (error) {
            alert("Error uploading file.");
            setFileProcessing(false);
        } finally {
            e.target.value = "";
        }
    };

    const handleSend = async (manualText: string | null = null) => {
        const messageContent = (typeof manualText === 'string' && manualText.length > 0) ? manualText : inputValue
        if (!messageContent || !messageContent.trim()) return
        setInputValue("")
        setIsLoading(true);
        const displayContent = messageContent.startsWith("I have uploaded a file named") ? `📂 Uploaded Document` : messageContent;
        setMessages(prev => [...prev, { role: 'user', content: displayContent }])
        try {
            const response = await fetch('/api/Flask_APP/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: messageContent, language }),
            });
            const rawText = await response.text();
            let data;
            try { data = JSON.parse(rawText); } catch { data = { error: "Invalid server response." }; }
            if (data && data["AI-response"]) {
                setMessages(prev => [...prev, { role: 'assistant', content: data["AI-response"] }])
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Connection Error: Unable to reach the server." }])
        } finally {
            setIsLoading(false)
        }
    }

    const languageMap: Record<string, string> = {
        en: 'en-US', hi: 'hi-IN', gu: 'gu-IN', bho: 'hi-IN', ta: 'ta-IN',
        bn: 'bn-IN', mr: 'mr-IN', te: 'te-IN', ur: 'ur-IN', kn: 'kn-IN',
        or: 'or-IN', ml: 'ml-IN', pa: 'pa-IN', as: 'as-IN', mai: 'hi-IN', sa: 'sa-IN'
    }

    const inputRef = useRef<HTMLInputElement>(null)

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            const recognition = new SpeechRecognition()
            recognition.lang = languageMap[language] || 'en-US'
            recognition.continuous = false
            recognition.interimResults = false
            recognition.onstart = () => setIsListening(true)
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                if (transcript && transcript.trim().length > 0) {
                    handleSend(transcript)
                    setInputValue("")
                    setIsListening(false)
                    setTimeout(() => { inputRef.current?.focus() }, 100)
                } else {
                    alert("I didn't catch that. Please try again.")
                    setIsListening(false)
                }
            }
            recognition.onerror = (event: any) => {
                if (event.error === 'aborted' || event.error === 'no-speech') { setIsListening(false); return }
                alert("Speech recognition error. Please try again.")
                setIsListening(false)
            }
            recognition.onend = () => setIsListening(false)
            recognition.start()
        } else {
            alert("Speech recognition is not supported in this browser.")
        }
    }

    return (
        <section className="py-24 relative z-10" id="nagrik-chat-widget">
            <div className="container px-4">
                <div className="mb-12 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-white/30 mb-4 block">AI Assistant</span>
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            {t("demo.heading")}
                        </h2>
                        <p className="mt-4 text-lg text-white/40">
                            {t("demo.subheading")}
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-md overflow-hidden rounded-3xl glass-card"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-white/[0.02] backdrop-blur-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9933]/20 to-[#138808]/20 border border-white/10">
                                <span className="font-bold text-[#FF9933]">N</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{t("demo.assistantName")}</h3>
                                <p className="text-xs text-[#138808]">{t("demo.status")}</p>
                            </div>
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${isSpeechEnabled
                                ? "bg-[#138808]/10 text-[#138808] border border-[#138808]/20"
                                : "bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20"
                                }`}
                        >
                            {isSpeechEnabled ? (
                                <><SoundHigh className="h-3.5 w-3.5" strokeWidth={2.5} /><span>Speech On</span></>
                            ) : (
                                <><SoundOff className="h-3.5 w-3.5" strokeWidth={2.5} /><span>Enable Speech</span></>
                            )}
                        </motion.button>
                    </div>

                    {/* Chat Area */}
                    <div ref={chatContainerRef} className="flex h-[400px] flex-col gap-4 p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                            className="self-start rounded-2xl rounded-tl-none glass px-4 py-3 text-white/80 shadow-sm max-w-[80%]"
                        >
                            <p>{t("demo.chat1")}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
                            className="self-end rounded-2xl rounded-tr-none bg-gradient-to-r from-[#FF9933] to-[#FF9933]/80 px-4 py-3 text-white shadow-sm max-w-[80%]"
                        >
                            <p>{t("demo.chat2")}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 1.0 }}
                            className="self-start rounded-2xl rounded-tl-none glass px-4 py-3 text-white/80 shadow-sm max-w-[80%]"
                        >
                            <p>{t("demo.chat3")}</p>
                        </motion.div>

                        {/* Dynamic Messages */}
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                ref={idx === messages.length - 1 ? lastMessageRef : null}
                                className={`message-bubble self-${msg.role === 'user' ? 'end' : 'start'} rounded-2xl ${msg.role === 'user'
                                    ? 'user-message rounded-tr-none bg-gradient-to-r from-[#FF9933] to-[#FF9933]/80 text-white'
                                    : 'ai-message rounded-tl-none glass text-white/80'
                                    } px-4 py-3 shadow-sm max-w-[80%] ${language === 'ur' ? 'text-right' : ''}`}
                                dir={language === 'ur' ? 'rtl' : 'ltr'}
                            >
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        ))}

                        {/* File Processing */}
                        {fileProcessing && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="self-start rounded-2xl rounded-tl-none glass-strong p-4 max-w-xs w-full"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="relative flex items-center justify-center w-8 h-8">
                                        {processingStage === 3 ? (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                                                <CheckCircleSolid className="w-8 h-8 text-[#138808]" />
                                            </motion.div>
                                        ) : (
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                                <Refresh className="w-6 h-6 text-[#FF9933]" strokeWidth={2.5} />
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white/80">
                                            {processingStage === 0 && "Uploading..."}
                                            {processingStage === 1 && "Analyzing Text..."}
                                            {processingStage === 2 && "Extracting Details..."}
                                            {processingStage === 3 && "Extraction Complete!"}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${processingStage === 3 ? 'bg-[#138808]' : 'bg-[#FF9933]'}`}
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${((processingStage + 1) / 4) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Loading Indicator */}
                        {isLoading && !fileProcessing && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="self-start flex flex-col items-start gap-2 max-w-xs">
                                <div className="rounded-2xl rounded-tl-none glass px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex space-x-1">
                                            <motion.div className="w-2 h-2 bg-[#FF9933] rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
                                            <motion.div className="w-2 h-2 bg-white rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                                            <motion.div className="w-2 h-2 bg-[#138808] rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
                                        </div>
                                    </div>
                                </div>
                                <motion.p key={loadingMessage} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-white/30 italic ml-2 flex items-center gap-1.5">
                                    <Sparks className="w-3 h-3 text-[#FF9933]/60" />{loadingMessage}
                                </motion.p>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.4 }}
                            className="self-center mt-auto mb-2"
                        >
                            <div className="flex items-center gap-2 px-3 py-1 glass rounded-full text-xs text-white/40">
                                <MicrophoneSolid className="w-3 h-3 animate-pulse" /> {t("hero.listening")}
                            </div>
                        </motion.div>
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-white/5 bg-white/[0.02] backdrop-blur-xl p-4" dir={language === 'ur' ? 'rtl' : 'ltr'}>
                        <div className="flex items-center gap-2 rounded-full glass-input px-4 py-2">
                            <label className="cursor-pointer p-2 rounded-full hover:bg-white/5 text-white/30 transition-colors">
                                <input type="file" className="hidden" accept=".pdf,image/png,image/jpeg,image/jpg" onChange={handleFileUpload} disabled={fileProcessing || isLoading} />
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-45">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                </svg>
                            </label>
                            <button
                                onClick={startListening}
                                className={`rounded-full p-2 transition-colors cursor-pointer ${isListening ? 'bg-red-500/10 text-red-400' : 'hover:bg-white/5 text-white/30'}`}
                                title="Tap to speak"
                            >
                                <MicrophoneSolid className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
                                placeholder={t("demo.placeholder")}
                                className={`flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/20 ${language === 'ur' ? 'text-right' : ''}`}
                                suppressHydrationWarning={true}
                                disabled={fileProcessing}
                            />
                            <button
                                onClick={() => handleSend()}
                                className={`rounded-full bg-gradient-to-r from-[#FF9933] to-[#FF9933]/80 p-2 text-white transition-all hover:shadow-[0_0_20px_rgba(255,153,51,0.3)] disabled:opacity-30 cursor-pointer ${language === 'ur' ? 'rotate-180' : ''}`}
                                disabled={fileProcessing}
                            >
                                <SendSolid className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
