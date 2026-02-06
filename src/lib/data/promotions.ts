"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export async function listPublicPromotions() {
    /**
     * CORREÇÃO CRÍTICA: Na v2, promoções com regras de "Country" ou "Region" 
     * só retornam se passarmos o contexto na query, caso contrário o Medusa filtra como 'não aplicável'.
     */
    return await sdk.client
        .fetch<{ promotions: HttpTypes.StorePromotion[] }>(
            `/store/promotions`,
            {
                method: "GET",
                query: {
                    is_active: "true",
                    // Expandimos para garantir que tragamos a hierarquia completa
                    fields: "*application_method,*campaign",
                    // Forçamos o contexto para bater com a regra "Country Equals Brazil" da sua imagem
                    region_id: process.env.NEXT_PUBLIC_DEFAULT_REGION || "br",
                },
                cache: "no-store",
            }
        )
        .then(({ promotions }) => {
            return promotions;
        })
        .catch((err) => {
            console.error("ERRO SDK PROMOTIONS:", err);
            return [];
        })
}