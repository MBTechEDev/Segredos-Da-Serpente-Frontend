import { listPublicPromotions } from "@lib/data/promotions"
import SaleBannerClient from "./sale-banner-client"

export const dynamic = "force-dynamic"

export default async function SaleBanner() {
    let promotions = []
    try {
        promotions = await listPublicPromotions()
    } catch (error) {
        console.error("Erro ao buscar promoções Medusa:", error)
        return null
    }

    // Regra de Ouro: Verifique se o Medusa v2 retornou a estrutura esperada
    // Se não houver promoções, retornamos um fragmento vazio ou null de forma segura
    if (!promotions || promotions.length === 0) {
        return <div className="hidden" /> // Evita problemas de renderização de componentes async retornando null puro
    }

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container px-4 mx-auto">
                <SaleBannerClient promotions={promotions} />
            </div>
        </section>
    )
}