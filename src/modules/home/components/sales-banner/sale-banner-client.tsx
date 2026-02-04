"use client"

import React from "react"
import { Gift, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@components/ui/button"
import { HttpTypes } from "@medusajs/types"
import { cn } from "@lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SaleBannerClient = ({ promotions }: { promotions: any[] }) => {
    return (
        <div className="flex flex-col gap-12">
            {promotions.map((promo) => {
                // Mapeamento conforme documentação do modulo de Promotion
                const campaign = promo.campaign
                const method = promo.application_method

                // O valor vem como float (ex: 10.00), arredondamos para exibição
                const discountValue = method?.value ? Math.round(parseFloat(method.value)) : "10"

                return (
                    <div
                        key={promo.id}
                        className={cn(
                            "relative rounded-3xl border border-secondary/20 overflow-hidden",
                            "bg-gradient-to-br from-card via-background to-card glass-dark shadow-2xl"
                        )}
                    >
                        {/* Elementos Visuais de Background */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[120px] -z-10 animate-pulse" />

                        <div className="grid md:grid-cols-2 gap-8 p-10 md:p-20 items-center relative z-10">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 shadow-inner">
                                    <Sparkles className="h-3.5 w-3.5 text-secondary" />
                                    <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.25em]">
                                        {campaign?.identifier || "Revelação Mística"}
                                    </span>
                                </div>

                                <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[1.1]">
                                    {campaign?.name} <br />
                                    <span className="text-gradient-gold font-bold">
                                        {discountValue}% OFF
                                    </span>
                                </h2>

                                <p className="font-mystical text-xl md:text-2xl text-foreground/60 italic leading-relaxed max-w-lg">
                                    {campaign?.description}
                                </p>

                                <div className="pt-4">
                                    <LocalizedClientLink href="/store">
                                        <Button className="cta-primary h-16 px-10 text-base group">
                                            Ativar Cupom: <span className="ml-2 font-mono tracking-widest">{promo.code}</span>
                                            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </LocalizedClientLink>
                                </div>
                            </div>

                            {/* Lado Direito: Visual do Desconto Estilizado */}
                            <div className="hidden md:flex justify-center items-center">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    <div className="w-72 h-72 rounded-full border border-secondary/20 flex flex-col items-center justify-center backdrop-blur-sm animate-float">
                                        <span className="font-display text-8xl text-gradient-gold leading-none">
                                            {discountValue}
                                        </span>
                                        <span className="font-display text-2xl text-secondary/60 mt-2 tracking-[0.4em]">PERCENT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default SaleBannerClient