import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils"

/**
 * COMPONENTE: ProductPreview
 * Descrição: Card de produto para listagens (PLP).
 * Correção: Type casting de metadata para evitar erro de 'unknown'.
 */
export default function ProductPreview({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const variant = product.variants?.[0]
  const cheapestPrice = variant?.calculated_price

  // Solução para o erro TS(2322): Cast explícito de metadata
  const isNew = !!(product.metadata?.is_new as boolean)

  // Formatador de moeda seguro conforme Regras de Desenvolvimento
  const formatAmount = (amount: number | null | undefined, currency: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.toUpperCase() || "BRL",
    }).format(amount ?? 0)
  }

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block space-y-3"
    >
      <div className={cn(
        "relative aspect-[3/4] overflow-hidden rounded-sm bg-card border border-white/5",
        "glass-dark transition-all duration-300"
      )}>
        {/* Badge corrigida com verificação booleana explícita */}
        {isNew && (
          <span className="absolute top-2 left-2 z-10 bg-primary/80 px-2 py-0.5 text-[10px] uppercase tracking-tighter text-background font-bold shadow-lg">
            Novo
          </span>
        )}

        <img
          src={product.thumbnail || "/placeholder.svg"} // Fallback conforme Regras
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay místico no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-secondary text-[10px] font-display uppercase tracking-[0.2em]">
            Explorar Energia
          </span>
        </div>
      </div>

      <div className="space-y-1 px-1">
        <h3 className="font-display text-sm md:text-base text-foreground group-hover:text-secondary transition-colors line-clamp-1">
          {product.title}
        </h3>

        <div className="flex items-center gap-2">
          {cheapestPrice && cheapestPrice.calculated_amount !== null ? (
            <>
              <span className="text-primary font-medium text-sm">
                {formatAmount(cheapestPrice.calculated_amount, cheapestPrice.currency_code ?? "BRL")}
              </span>

              {cheapestPrice.original_amount !== null &&
                cheapestPrice.calculated_amount < cheapestPrice.original_amount && (
                  <span className="text-xs text-muted-foreground line-through opacity-50">
                    {formatAmount(cheapestPrice.original_amount, cheapestPrice.currency_code ?? "BRL")}
                  </span>
                )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic font-mystical">
              Sob consulta
            </span>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}