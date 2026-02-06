// src/modules/checkout/components/checkout-progress/index.tsx
import { cn } from "@lib/utils"
import { Check } from "lucide-react"

type Step = {
    num: number
    label: string
}

const steps: Step[] = [
    { num: 1, label: "Endereço" },
    { num: 2, label: "Entrega" },
    { num: 3, label: "Pagamento" },
    { num: 4, label: "Revisão" },
]

export default function CheckoutProgress({ activeStep }: { activeStep: number }) {
    return (
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 animate-in fade-in duration-700">
            {steps.map((s, index) => (
                <div key={s.num} className="flex items-center">
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-display text-xs sm:text-sm transition-all duration-300 border",
                                activeStep >= s.num
                                    ? "bg-secondary border-secondary text-background shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                                    : "bg-background border-border text-ui-fg-muted"
                            )}
                        >
                            {activeStep > s.num ? (
                                <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                            ) : (
                                <span className={activeStep === s.num ? "animate-pulse" : ""}>
                                    {s.num}
                                </span>
                            )}
                        </div>
                        <span
                            className={cn(
                                "text-xs sm:text-sm hidden md:block font-body uppercase tracking-wider",
                                activeStep >= s.num ? "text-ui-fg-base" : "text-ui-fg-muted"
                            )}
                        >
                            {s.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={cn(
                                "w-8 lg:w-16 h-[1px] mx-1 sm:mx-2 transition-colors duration-500",
                                activeStep > s.num ? "bg-secondary" : "bg-border"
                            )}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}