"use client";

import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import { useLanguage } from "@/context/LanguageContext";
import { FireFlame, Check } from "iconoir-react";
import { cn } from "@/lib/utils";
import { TricolourCursorTrail } from "@/components/TricolourCursorTrail";
import { Scene3DScroll } from "@/components/Scene3DScroll";

const AnimatedBackground3D = lazy(() =>
    import("@/components/AnimatedBackground3D").then(mod => ({ default: mod.AnimatedBackground3D }))
);

export default function GasRefillPage() {
    const { t } = useLanguage();
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        registrationNo: "",
        orderDate: "",
        name: "",
        contactNo: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const providers = [
        {
            id: "indane",
            name: "Indane Gas",
            color: "from-orange-500 to-red-600",
            bg: "bg-orange-500/10",
            border: "border-orange-500/30",
            text: "text-orange-400",
            iconColor: "text-orange-500"
        },
        {
            id: "bharat",
            name: "Bharat Gas",
            color: "from-blue-500 to-yellow-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/30",
            text: "text-blue-400",
            iconColor: "text-blue-500"
        },
        {
            id: "hp",
            name: "HP Gas",
            color: "from-blue-600 to-red-600",
            bg: "bg-indigo-500/10",
            border: "border-indigo-500/30",
            text: "text-indigo-400",
            iconColor: "text-indigo-400"
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div className="min-h-screen relative">
            <TricolourCursorTrail />
            <Suspense fallback={null}>
                <AnimatedBackground3D />
            </Suspense>
            <Navbar />
            
            <Scene3DScroll>
                <main className="container mx-auto px-4 py-32 max-w-5xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center p-4 mb-6 rounded-2xl glass-strong animate-float">
                            <FireFlame className="h-10 w-10 text-[#FF9933]" strokeWidth={2} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
                            {t("gas.provider_title")}
                        </h1>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
                            Select your LPG provider and book your refill instantly. 
                            India&apos;s fastest digital gas booking experience.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {providers.map((provider, index) => (
                            <motion.button
                                key={provider.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedProvider(provider.id)}
                                className={cn(
                                    "relative group flex flex-col items-center p-10 rounded-[2.5rem] transition-all duration-500 cursor-pointer",
                                    selectedProvider === provider.id
                                        ? "glass-strong border-[#FF9933]/30 scale-105 z-10 shadow-[0_20px_40px_-15px_rgba(255,153,51,0.2)]"
                                        : "glass border-white/5 hover:border-white/10 hover:scale-[1.02]"
                                )}
                            >
                                {selectedProvider === provider.id && (
                                    <div className="absolute top-6 right-6 h-8 w-8 bg-[#138808] rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                                        <Check className="h-5 w-5" strokeWidth={3} />
                                    </div>
                                )}
                                <div className={cn(
                                    "h-24 w-24 rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500",
                                    provider.bg,
                                    selectedProvider === provider.id ? "ring-2 ring-white/10" : ""
                                )}>
                                    <FireFlame className={cn("h-12 w-12", provider.iconColor)} strokeWidth={2} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    {t(`gas.${provider.id}`)}
                                </h3>
                                <div className={cn(
                                    "h-1.5 w-16 rounded-full bg-gradient-to-r transition-all duration-500",
                                    provider.color,
                                    selectedProvider === provider.id ? "w-24" : "opacity-30"
                                )} />
                            </motion.button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {selectedProvider && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card rounded-[3rem] overflow-hidden"
                            >
                                <div className="p-10 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-4">
                                        <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#FF9933] text-white text-lg font-black italic">
                                            2
                                        </span>
                                        {t("gas.submit")}
                                    </h3>
                                    <div className="px-4 py-1 rounded-full glass text-xs font-bold text-white/40 uppercase tracking-widest">
                                        Secure Booking
                                    </div>
                                </div>
                                
                                <form onSubmit={handleSubmit} className="p-10 grid md:grid-cols-2 gap-x-10 gap-y-8">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-white/30 uppercase tracking-wider ml-1">
                                            {t("gas.registration_no")}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full h-14 px-6 rounded-2xl glass-input text-white focus:border-[#FF9933]/50 transition-all outline-none placeholder:text-white/10"
                                            placeholder={t("gas.placeholder_reg")}
                                            value={formData.registrationNo}
                                            onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-white/30 uppercase tracking-wider ml-1">
                                            {t("gas.order_date")}
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full h-14 px-6 rounded-2xl glass-input text-white focus:border-[#FF9933]/50 transition-all outline-none"
                                            value={formData.orderDate}
                                            onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-white/30 uppercase tracking-wider ml-1">
                                            {t("gas.name")}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full h-14 px-6 rounded-2xl glass-input text-white focus:border-[#FF9933]/50 transition-all outline-none placeholder:text-white/10"
                                            placeholder={t("gas.placeholder_name")}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-white/30 uppercase tracking-wider ml-1">
                                            {t("gas.contact_no")}
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            pattern="[0-9]{10}"
                                            className="w-full h-14 px-6 rounded-2xl glass-input text-white focus:border-[#FF9933]/50 transition-all outline-none placeholder:text-white/10"
                                            placeholder={t("gas.placeholder_mobile")}
                                            value={formData.contactNo}
                                            onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                                        />
                                    </div>

                                    <div className="md:col-span-2 pt-6">
                                        <button
                                            type="submit"
                                            className="w-full h-16 rounded-[1.25rem] bg-gradient-to-r from-[#FF9933] to-[#FF9933]/80 text-white font-bold text-lg shadow-2xl shadow-[#FF9933]/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
                                        >
                                            {isSubmitted ? (
                                                <>
                                                    <Check className="h-6 w-6 text-white" strokeWidth={3} />
                                                    {t("gas.success")}
                                                </>
                                            ) : (
                                                <>
                                                    <FireFlame className="h-6 w-6 text-white" />
                                                    {t("gas.submit")}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </Scene3DScroll>
        </div>
    );
}
