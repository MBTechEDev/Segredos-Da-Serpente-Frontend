import { Truck, Shield, CreditCard, Gift, Sparkles } from "lucide-react"
import { cn } from "@lib/utils"

const benefits = [
    {
        icon: Truck,
        title: "Frete Grátis",
        description: "Acima de R$ 299",
    },
    {
        icon: Shield,
        title: "Compra Segura",
        description: "Dados protegidos",
    },
    {
        icon: CreditCard,
        title: "Até 12x",
        description: "Sem juros no cartão",
    },
    {
        icon: Gift,
        title: "Brinde Místico",
        description: "Em pedidos +R$ 199",
    },
    {
        icon: Sparkles,
        title: "Cristais Energizados",
        description: "Prontos para uso",
    },
]

/**
 * BenefitsBar - Componente de Servidor
 * Exibe os diferenciais da loja com o tema Dark Mystical.
 */
const BenefitsBar = () => {
    return (
        <section
            className="w-full bg-card/40 backdrop-blur-sm border-y border-emerald-900/20 py-6"
            aria-label="Benefícios da loja"
        >
            <div className="container mx-auto px-4">
                <div
                    className={cn(
                        "flex items-center justify-between gap-8 overflow-x-auto pb-2 md:pb-0",
                        "scrollbar-hide no-scrollbar" // Utilitários para esconder scrollbar
                    )}
                >
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 min-w-[200px] group cursor-default shrink-0"
                        >
                            {/* Ícone com Aura Dourada */}
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/5 border border-secondary/10 group-hover:border-secondary/30 group-hover:bg-secondary/10 transition-all duration-300">
                                <benefit.icon className="h-6 w-6 text-secondary" strokeWidth={1.5} />
                            </div>

                            <div className="flex flex-col">
                                <span className="text-sm font-display font-bold uppercase tracking-wider text-foreground">
                                    {benefit.title}
                                </span>
                                <span className="text-xs text-muted-foreground font-body italic">
                                    {benefit.description}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BenefitsBar