"use client"

import { useState, useEffect, useCallback } from "react"
import { Clock, Flame } from "lucide-react"
import { Button } from "@components/ui/button"
import { cn } from "@lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface PromoBannerClientProps {
    title: string
    description: string
    endsAt?: string
}

const PromoBannerClient = ({ title, description, endsAt }: PromoBannerClientProps) => {
    const calculateTimeLeft = useCallback(() => {
        const target = endsAt ? new Date(endsAt).getTime() : new Date().getTime() + 86400000
        const difference = target - new Date().getTime()

        if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 }

        return {
            hours: Math.floor((difference / (1000 * 60 * 60))),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        }
    }, [endsAt])

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)
        return () => clearInterval(timer)
    }, [calculateTimeLeft])

    const formatTime = (num: number) => num.toString().padStart(2, "0")

    return (
        <section className="py-12 md:py-20 relative overflow-hidden bg-background">
            {/* Background místico com vidro e gradiente conforme Regra 3 */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald/10 via-background to-emerald/10" />

            <div className="container relative z-10 px-4">
                <div className="max-w-4xl mx-auto text-center">

                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <Flame className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                            Promoção Ativa no Medusa
                        </span>
                        <Flame className="h-4 w-4 text-primary animate-pulse" />
                    </div>

                    <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
                        {/* Aplicando gradiente dourado da Regra 2 */}
                        <span className="bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent font-bold">
                            {title}
                        </span>
                    </h2>

                    <p className="font-mystical text-lg md:text-2xl text-foreground/60 mb-10 italic">
                        "{description}"
                    </p>

                    <div className="flex flex-col items-center gap-4 mb-10">
                        <div className="flex items-center gap-2 text-secondary/80 mb-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-widest font-medium">O portal se fecha em:</span>
                        </div>

                        <div className="flex gap-3 md:gap-5 items-center">
                            {[
                                { label: "Horas", value: timeLeft.hours },
                                { label: "Min", value: timeLeft.minutes },
                                { label: "Seg", value: timeLeft.seconds }
                            ].map((unit, index, arr) => (
                                <div key={unit.label} className="flex items-center gap-3 md:gap-5">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-card/40 backdrop-blur-md border border-secondary/20 rounded-xl p-4 md:p-6 min-w-[70px] md:min-w-[90px] glass-dark shadow-2xl">
                                            <span className="font-display text-3xl md:text-5xl text-secondary">
                                                {formatTime(unit.value)}
                                            </span>
                                        </div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-3 font-medium">
                                            {unit.label}
                                        </p>
                                    </div>
                                    {index < arr.length - 1 && (
                                        <span className="text-3xl md:text-4xl text-secondary/30 font-display animate-pulse">:</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <LocalizedClientLink href="/store">
                        <Button className={cn(
                            "cta-primary px-12 py-8 text-lg font-bold tracking-widest uppercase shadow-emerald",
                            "transition-all duration-500 hover:scale-105"
                        )}>
                            Reivindicar Oferta
                        </Button>
                    </LocalizedClientLink>
                </div>
            </div>
        </section>
    )
}

export default PromoBannerClient