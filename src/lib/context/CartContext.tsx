"use client"

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"
import { toast } from "sonner"

import {
    addToCart as addToCartAction,
    deleteLineItem as deleteLineItemAction,
    updateLineItem as updateLineItemAction,
    retrieveCart,
    applyPromotions
} from "@lib/data/cart"

interface AddItemInput {
    variantId: string
    quantity: number
}

interface CartContextType {
    cart: HttpTypes.StoreCart | null
    items: HttpTypes.StoreCartLineItem[]
    totalItems: number
    subtotal: number
    total: number
    discountTotal: number
    isLoading: boolean
    addItem: (input: AddItemInput) => Promise<void>
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

    const params = useParams()
    const countryCode = (params?.countryCode as string) || "br"


    const fetchCart = useCallback(async () => {
        try {
            const cartData = await retrieveCart()
            setCart(cartData)
        } catch (error) {
            console.error("Erro ao buscar carrinho:", error)
            setCart(null)
        }
    }, [])

    useEffect(() => {
        const init = async () => {
            setIsLoading(true)
            await fetchCart()
            setIsLoading(false)
        }
        init()
    }, [fetchCart])

    const refreshCart = async () => {
        setIsLoading(true)
        await fetchCart()
        setIsLoading(false)
    }

    const addItem = async ({ variantId, quantity }: AddItemInput) => {
        if (!variantId) {
            toast.error("Erro: Variante não identificada.")
            return
        }

        setIsLoading(true)
        try {
            await addToCartAction({
                variantId,
                quantity,
                countryCode,
            })


            // Força a revalidação da página e busca o carrinho atualizado
            await fetchCart()

            // Abre o CartDrawer automaticamente para dar feedback visual
            // (Isso depende de como você controla o estado de abertura no Nav)

            toast.success("Artefato adicionado ao ritual")
        } catch (error: any) {
            console.error("Erro no CartContext:", error)
            toast.error(error.message || "Erro ao adicionar item")
        } finally {
            setIsLoading(false)
        }
    }

    const updateItem = async (lineId: string, quantity: number) => {
        setIsLoading(true)
        try {
            await updateLineItemAction({ lineId, quantity })
            await fetchCart()
        } catch (error: any) {
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
            toast.success("Item removido do ritual")
        } catch (error: any) {
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
            toast.success("Energia de desconto aplicada!")
        } catch (error: any) {
            toast.error("Cupom inválido ou expirado")
        } finally {
            setIsLoading(false)
        }
    }

    const items = useMemo(() => cart?.items || [], [cart])
    const totalItems = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items])

    return (
        <CartContext.Provider
            value={{
                cart,
                items,
                totalItems,
                subtotal: cart?.subtotal || 0,
                total: cart?.total || 0,
                discountTotal: cart?.discount_total || 0,
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