"use client"

import { useLanguage } from "@/context/LanguageContext"

export function Footer() {
    const { t } = useLanguage()

    return (
        <footer className="relative z-10 border-t border-white/5 py-16">
            <div className="container flex flex-col items-center justify-between gap-8 px-4 md:flex-row">
                <div className="flex flex-col items-center gap-3 md:items-start">
                    <span className="text-2xl font-bold tricolour-text">{t("navbar.logo")}</span>
                    <p className="text-sm text-white/30">
                        {t("footer.tagline")}
                    </p>
                </div>

                {/* Tricolour divider line */}
                <div className="hidden md:block h-12 w-px bg-gradient-to-b from-[#FF9933]/30 via-white/20 to-[#138808]/30" />

                <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
                    <p className="text-sm font-medium text-white/60">
                        {t("footer.madeWith")}
                        <span className="block text-xs font-normal text-white/30 mt-1">
                            (Krish, Avinash, Akshar)
                        </span>
                    </p>
                    <div className="flex items-center gap-3 justify-center md:justify-end">
                        <p className="text-xs text-white/20">
                            {t("footer.poweredBy")}
                        </p>
                        <img
                            src="https://www.digilocker.gov.in/assets/img/digilocker_logo.png"
                            alt="DigiLocker"
                            className="h-6 w-auto opacity-50 hover:opacity-80 transition-opacity"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom tricolour strip */}
            <div className="mt-12 h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF9933]/30 to-transparent" />
            <div className="mt-[1px] h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="mt-[1px] h-[2px] w-full bg-gradient-to-r from-transparent via-[#138808]/30 to-transparent" />
        </footer>
    )
}
