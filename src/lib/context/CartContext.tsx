"use client"

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"
import { toast } from "sonner" // Opcional: Para feedback visual

// Importamos as Server Actions que tu me mostraste
import {
    addToCart as addToCartAction,
    deleteLineItem as deleteLineItemAction,
    updateLineItem as updateLineItemAction,
    retrieveCart,
    applyPromotions
} from "@lib/data/cart"

interface CartContextType {
    cart: HttpTypes.StoreCart | null
    items: HttpTypes.StoreCartLineItem[]
    totalItems: number
    subtotal: number
    total: number
    discountTotal: number
    isLoading: boolean
    addItem: (variantId: string, quantity: number) => Promise<void>
    updateItem: (lineId: string, quantity: number) => Promise<void>
    removeItem: (lineId: string) => Promise<void>
    applyDiscount: (code: string) => Promise<void>
    refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

export const useCartContext = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCartContext deve ser usado dentro de um CartProvider")
    }
    return context
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Pegamos o countryCode da URL (ex: /br/produtos...)
    const params = useParams()
    const countryCode = (params?.countryCode as string) || "br"

    // Função para buscar o carrinho atualizado
    const fetchCart = useCallback(async () => {
        try {
            // retrieveCart lê o cookie automaticamente no server side
            const cartData = await retrieveCart()
            setCart(cartData)
        } catch (error) {
            console.error("Erro ao buscar carrinho:", error)
            setCart(null)
        }
    }, [])

    // Inicialização
    useEffect(() => {
        const init = async () => {
            setIsLoading(true)
            await fetchCart()
            setIsLoading(false)
        }
        init()
    }, [fetchCart])

    // --- Ações ---

    const refreshCart = async () => {
        setIsLoading(true)
        await fetchCart()
        setIsLoading(false)
    }

    const addItem = async (variantId: string, quantity: number) => {
        setIsLoading(true)
        try {
            // Chama a Server Action do teu arquivo cart.ts
            await addToCartAction({
                variantId,
                quantity,
                countryCode,
            })

            // Como a server action revalida a tag, buscamos o dado fresco
            await fetchCart()
            toast.success("Adicionado ao carrinho")
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Erro ao adicionar item")
        } finally {
            setIsLoading(false)
        }
    }

    const updateItem = async (lineId: string, quantity: number) => {
        setIsLoading(true)
        try {
            await updateLineItemAction({
                lineId,
                quantity,
            })
            await fetchCart()
        } catch (error: any) {
            console.error(error)
            toast.error("Erro ao atualizar quantidade")
        } finally {
            setIsLoading(false)
        }
    }

    const removeItem = async (lineId: string) => {
        setIsLoading(true)
        try {
            await deleteLineItemAction(lineId)
            await fetchCart()
            toast.success("Item removido")
        } catch (error: any) {
            console.error(error)
            toast.error("Erro ao remover item")
        } finally {
            setIsLoading(false)
        }
    }

    const applyDiscount = async (code: string) => {
        setIsLoading(true)
        try {
            await applyPromotions([code])
            await fetchCart()
            toast.success("Cupom aplicado!")
        } catch (error: any) {
            console.error(error)
            toast.error("Cupom inválido ou expirado")
        } finally {
            setIsLoading(false)
        }
    }

    // Cálculos derivados
    const items = useMemo(() => cart?.items || [], [cart])

    const totalItems = useMemo(() => {
        return items.reduce((acc, item) => acc + item.quantity, 0)
    }, [items])

    const subtotal = cart?.subtotal || 0
    const discountTotal = cart?.discount_total || 0
    const total = cart?.total || 0

    return (
        <CartContext.Provider
            value={{
                cart,
                items,
                totalItems,
                subtotal,
                total,
                discountTotal,
                isLoading,
                addItem,
                updateItem,
                removeItem,
                applyDiscount,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}