// src/modules/cart/templates/index.tsx
"use client"

import { HttpTypes } from "@medusajs/types"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import { useCartContext } from "@lib/context/CartContext" // Ajuste o path conforme seu projeto

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  // Usamos o contexto para refletir mudanças de estado imediatas (otimista)
  const { totalItems } = useCartContext()

  if (!cart || !cart.items?.length) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <ShoppingBag className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-gradient-gold mb-4">
          Seu Carrinho está Vazio
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto font-body">
          Explore nossa coleção de cristais e itens sagrados para encontrar o que ressoa com sua jornada.
        </p>
        <LocalizedClientLink href="/store">
          <button className="bg-primary hover:bg-primary/90 text-background px-8 py-3 rounded-md font-medium transition-all duration-300">
            Explorar Produtos
          </button>
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="w-full py-12 lg:px-16 bg-background min-h-content flex justify-center">

      <div className="content-container w-full max-w-7xl" data-testid="cart-container">
        <div className="mb-12">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center text-muted-foreground hover:text-secondary transition-colors mb-4 group font-body"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Continuar Comprando
          </LocalizedClientLink>
          <h1 className="font-display text-4xl md:text-5xl text-gradient-gold">
            Seu Carrinho
          </h1>
          <p className="text-muted-foreground mt-2 font-body">
            {totalItems} {totalItems === 1 ? "item" : "itens"} aguardando seu chamado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-x-6 gap-y-10">
          {/* Lado Esquerdo: Itens */}
          <div className="flex flex-col gap-y-6">
            <div className="glass-dark border border-white/5 rounded-xl p-6">
              <ItemsTemplate cart={cart} />
            </div>
          </div>
          <div className="relative">
            <div className="sticky top-24">
              <Summary cart={cart as any} />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CartTemplate