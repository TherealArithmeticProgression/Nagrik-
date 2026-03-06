"use client"

import { useState, lazy, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Calendar, User, Phone, Page, Send, WarningTriangle } from "iconoir-react"
import { useLanguage } from "@/context/LanguageContext"
import { Navbar } from "@/components/ui/navbar"
import { TricolourCursorTrail } from "@/components/TricolourCursorTrail"
import { Scene3DScroll } from "@/components/Scene3DScroll"

const AnimatedBackground3D = lazy(() =>
    import("@/components/AnimatedBackground3D").then(mod => ({ default: mod.AnimatedBackground3D }))
);

export default function CybercrimeComplaintPage() {
    const { t, language } = useLanguage()
    
    const [formData, setFormData] = useState({
        fullName: "",
        mobile: "",
        category: "",
        incidentDate: "",
        description: "",
        suspectDetails: ""
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsSubmitting(false)
        setIsSuccess(true)
    }

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    const categories = [
        "financial",
        "social",
        "identity",
        "hacking",
        "other"
    ]

    return (
        <div className="min-h-screen relative">
            <TricolourCursorTrail />
            <Suspense fallback={null}>
                <AnimatedBackground3D />
            </Suspense>
            <Navbar />
            
            <Scene3DScroll>
                <main className="container mx-auto px-4 pt-32 pb-24 relative z-10">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        className="max-w-3xl mx-auto"
                    >
                        {/* Header */}
                        <motion.div variants={fadeInUp} className="mb-12 text-center">
                            <motion.div 
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full glass-strong animate-float"
                            >
                                <ShieldCheck className="h-10 w-10 text-indigo-400" />
                            </motion.div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                {t("cybercrime.title")}
                            </h1>
                            <p className="text-white/40 text-lg">
                                {t("cybercrime.header_desc")}
                            </p>
                        </motion.div>

                        {/* Additional Alert */}
                        <motion.div 
                            variants={fadeInUp} 
                            className="mb-10 rounded-2xl glass-strong border-orange-500/20 p-5 flex items-start gap-4"
                        >
                             <WarningTriangle className="h-6 w-6 text-[#FF9933] mt-0.5 flex-shrink-0" />
                             <p className="text-sm text-white/70 leading-relaxed">
                                {t("cybercrime.alert")}
                             </p>
                        </motion.div>

                        {/* Active Form */}
                        <AnimatePresence mode="wait">
                            {!isSuccess ? (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onSubmit={handleSubmit}
                                    className="rounded-3xl glass-card p-8 md:p-10"
                                >
                                    <div className="grid gap-8 md:grid-cols-2">
                                        {/* Full Name */}
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="mb-2 block text-sm font-medium text-white/50">
                                                {t("cybercrime.full_name")}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                                    className="w-full glass-input rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none transition-all"
                                                />
                                                <User className="absolute left-4 top-3.5 h-5 w-5 text-white/30" />
                                            </div>
                                        </div>

                                        {/* Mobile Number */}
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="mb-2 block text-sm font-medium text-white/50">
                                                {t("cybercrime.mobile")}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.mobile}
                                                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                                    className="w-full glass-input rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none transition-all"
                                                />
                                                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-white/30" />
                                            </div>
                                        </div>

                                        {/* Complaint Category */}
                                        <div className="col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-white/50">
                                                {t("cybercrime.category")}
                                            </label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                    className="w-full appearance-none glass-input rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none transition-all"
                                                >
                                                    <option value="" className="bg-slate-900">{t("cybercrime.select_category")}</option>
                                                    {categories.map(cat => (
                                                        <option key={cat} value={cat} className="bg-slate-900">
                                                            {t(`cybercrime.categories.${cat}`)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <Page className="absolute left-4 top-3.5 h-5 w-5 text-white/30" />
                                                <div className="absolute right-4 top-4 pointer-events-none text-white/30">
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Incident Date & Time */}
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="mb-2 block text-sm font-medium text-white/50">
                                                {t("cybercrime.incident_date")}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="datetime-local"
                                                    required
                                                    value={formData.incidentDate}
                                                    onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                                                    className="w-full glass-input rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none transition-all"
                                                />
                                                <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-white/30" />
                                            </div>
                                        </div>

                                        {/* Incident Description */}
                                        <div className="col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-white/50">
                                                {t("cybercrime.description")}
                                            </label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                className="w-full glass-input rounded-xl p-4 text-white text-sm outline-none transition-all resize-none"
                                            />
                                        </div>

                                        {/* Suspect Details (Optional) */}
                                        <div className="col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-white/50">
                                                {t("cybercrime.suspect_details")}
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.suspectDetails}
                                                onChange={(e) => setFormData({...formData, suspectDetails: e.target.value})}
                                                placeholder={t("cybercrime.suspect_placeholder")}
                                                className="w-full glass-input rounded-xl py-3 px-4 text-white text-sm outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-10">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-4 text-sm font-bold text-white transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            ) : (
                                                <>
                                                    <Send className="h-5 w-5" />
                                                    {t("cybercrime.submit")}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="rounded-3xl glass-card p-12 text-center"
                                >
                                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                        <ShieldCheck className="h-12 w-12" />
                                    </div>
                                    <h2 className="mb-4 text-3xl font-bold text-white">{t("cybercrime.success_title")}</h2>
                                    <p className="mb-8 text-white/50 text-lg">
                                        {t("cybercrime.success_msg_1")} <span className="font-mono font-bold text-[#FF9933]">CYB-{Math.floor(Math.random() * 100000)}</span>. 
                                        <br />{t("cybercrime.success_msg_2")}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setIsSuccess(false)
                                            setFormData({
                                                fullName: "",
                                                mobile: "",
                                                category: "",
                                                incidentDate: "",
                                                description: "",
                                                suspectDetails: ""
                                            })
                                        }}
                                        className="rounded-xl glass px-10 py-3 text-sm font-bold text-white hover:bg-white/5 transition-all cursor-pointer"
                                    >
                                        {t("cybercrime.file_again")}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </main>
            </Scene3DScroll>
        </div>
    )
}
