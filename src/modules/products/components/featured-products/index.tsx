import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import MedusaProductCard from "@modules/products/components/medusa-product-card"
import { Button } from "@components/ui/button"
import { ArrowRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils"


export default async function FeaturedProducts({
    countryCode
}: {
    countryCode: string
}) {
    // Executa as buscas em paralelo para otimizar o tempo de carregamento no servidor
    const [data, region] = await Promise.all([
        listProducts({
            queryParams: { limit: 8 },
            countryCode,
        }),
        getRegion(countryCode),
    ])

    // Desestruturação seguindo a assinatura: { response: { products, count }, nextPage, ... }
    const { response: { products } = { products: [], count: 0 } } = data

    if (!products.length || !region) {
        return null
    }

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container px-4">
                {/* Section Header com Identidade Visual Dark Mystical */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <span className="text-secondary font-medium text-sm uppercase tracking-[0.3em] font-body">
                        Seleção Especial
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mt-3">
                        Produtos em Destaque
                    </h2>
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto mt-4" />
                    <p className="font-mystical text-lg md:text-xl text-muted-foreground mt-6 max-w-xl mx-auto italic leading-relaxed">
                        "Itens consagrados para potencializar sua jornada e despertar seu poder interior."
                    </p>
                </div>

                {/* Grid de Produtos - Utilizando o MedusaProductCard corrigido */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <MedusaProductCard product={product} region={region} />
                        </div>
                    ))}
                </div>

                {/* Botão de Chamada para Ação (CTA) */}
                <div className="text-center mt-16 animate-in fade-in duration-1000 delay-500">
                    <LocalizedClientLink href="/store">
                        <Button className={cn(
                            "cta-primary px-10 py-7 text-base group relative overflow-hidden transition-all duration-300",
                            "hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        )}>
                            <span className="relative z-10 flex items-center">
                                Ver Todo o Acervo
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </Button>
                    </LocalizedClientLink>
                </div>
            </div>
        </section>
    )
}