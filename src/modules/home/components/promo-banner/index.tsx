import { sdk } from "@lib/config"
import PromoBannerClient from "./promo-banner-client"

/**
 * PromoBanner - Server Component
 * Busca a promoção real no Medusa v2 para extrair textos e validade.
 */
export default async function PromoBanner() {
    // Buscamos a promoção específica via SDK
    // Nota: No Medusa v2, promoções podem ser filtradas por código
    const { promotions } = await sdk.client.fetch<{ promotions: any[] }>(
        `/store/promotions`,
        {
            query: { code: "CRISTAIS50", is_active: "true" },
            cache: "force-cache",
            next: { tags: ["promotions"] }
        }
    ).catch(() => ({ promotions: [] }))

    const activePromo = promotions?.[0]

    // Se não houver promoção ativa no Medusa, não renderizamos o banner
    if (!activePromo) return null

    return (
        <PromoBannerClient
            title={activePromo.campaign?.name || "Oferta Especial"}
            description={activePromo.campaign?.description || "Aproveite o alinhamento dos astros."}
            // Na v2, podemos usar a data de término da campanha associada
            endsAt={activePromo.campaign?.ends_at}
        />
    )
}