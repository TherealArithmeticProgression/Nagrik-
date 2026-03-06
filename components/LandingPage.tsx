"use client"

import { useState, useCallback, lazy, Suspense } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/ui/hero";
import { SchemeMarquee } from "@/components/ui/scheme-marquee";
import { BentoGrid } from "@/components/ui/bento-grid";
import { DemoInterface } from "@/components/ui/demo-interface";
import { Footer } from "@/components/ui/footer";
import { TricolourCursorTrail } from "@/components/TricolourCursorTrail";
import { Scene3DScroll } from "@/components/Scene3DScroll";

// Lazy load the 3D background for performance
const AnimatedBackground3D = lazy(() =>
    import("@/components/AnimatedBackground3D").then(mod => ({ default: mod.AnimatedBackground3D }))
);

export function LandingPage() {
    const [voiceTrigger, setVoiceTrigger] = useState<string | null>(null);

    const handleVoiceTriggerClear = useCallback(() => {
        setVoiceTrigger(null);
    }, []);

    return (
        <main className="min-h-screen relative">
            {/* Tricolour cursor trail — always on top */}
            <TricolourCursorTrail />

            {/* 3D animated background */}
            <Suspense fallback={null}>
                <AnimatedBackground3D />
            </Suspense>

            {/* Navbar — fixed, above everything */}
            <Navbar />

            {/* Main content with 3D scroll zoom effect */}
            <Scene3DScroll>
                <Hero onVoiceTrigger={setVoiceTrigger} />
                <SchemeMarquee />
                <BentoGrid />
                <DemoInterface voiceTrigger={voiceTrigger} onVoiceTriggerClear={handleVoiceTriggerClear} />
                <Footer />
            </Scene3DScroll>
        </main>
    );
}
