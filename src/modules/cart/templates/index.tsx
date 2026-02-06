"use client"

import { HttpTypes } from "@medusajs/types"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ItemsTemplate from "./items"
import Summary from "./summary"
import { useCartContext } from "@lib/context/CartContext"
import { cn } from "@lib/utils"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const { totalItems } = useCartContext()

  // Estado Vazio (Empty State)
  if (!cart || !cart.items?.length) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <ShoppingBag className="h-10 w-10 md:h-12 md:w-12 text-primary" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-gradient-gold mb-4">
          Seu Carrinho está Vazio
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto font-body leading-relaxed">
          Explore nossa coleção de cristais e itens sagrados para encontrar o que ressoa com sua jornada.
        </p>
        <LocalizedClientLink href="/store">
          <button className="bg-primary hover:bg-emerald-400 text-background px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/20">
            Explorar Produtos
          </button>
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Container Principal com padding responsivo */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">

        {/* Cabeçalho do Carrinho */}
        <div className="mb-8 md:mb-12">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-secondary transition-colors mb-6 group font-body"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Continuar Comprando
          </LocalizedClientLink>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gradient-gold">
            Seu Carrinho
          </h1>
          <p className="text-muted-foreground mt-3 font-body text-sm md:text-base">
            {totalItems} {totalItems === 1 ? "item" : "itens"} aguardando seu chamado.
          </p>
        </div>

        {/* Grid Responsiva: 1 coluna no mobile, 2 colunas no desktop (lg) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">

          {/* Lado Esquerdo: Itens do Carrinho */}
          <div className="flex flex-col gap-y-6 w-full">
            <div className="glass-dark border border-white/5 rounded-2xl overflow-hidden">
              {/* O padding é interno ao ItemsTemplate ou controlado aqui conforme necessidade */}
              <div className="p-4 sm:p-6 md:p-8">
                <ItemsTemplate cart={cart} />
              </div>
            </div>
          </div>

          {/* Lado Direito: Sumário de Preços (Sticky no Desktop) */}
          <aside className="relative w-full">
            <div className="lg:sticky lg:top-[100px] space-y-4">
              <div className="glass-dark border border-white/5 rounded-2xl p-6 shadow-xl">
                <Summary cart={cart as any} />
              </div>

              {/* Nota Adicional (Opcional - Estilo Mystical) */}
              <p className="text-[10px] uppercase tracking-widest text-center text-muted-foreground/50 font-body px-4">
                Energizado e preparado sob as fases da lua.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}

export default CartTemplate