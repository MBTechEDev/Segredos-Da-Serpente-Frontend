"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
    getAuthHeaders,
    getCacheTag,
    setAuthToken,
    removeAuthToken,
} from "./cookies"

/**
 * Recupera o perfil do administrador logado.
 * Utilizamos "me" como ID para referenciar o usuário atual do token.
 */
export const retrieveAdminUser = async (): Promise<HttpTypes.AdminUser | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null

    const headers = {
        ...authHeaders,
    }

    return await sdk.client
        .fetch<{ user: HttpTypes.AdminUser }>('/admin/users/me', {
            method: "GET",
            headers,
            next: { revalidate: 0 },
            cache: "no-store"
        })
        .then(({ user }) => user)
        .catch(() => null)
}

/**
 * Login do administrador - Garante o actor 'user'
 */
export async function login(_currentState: unknown, formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log(email)
    try {
        await sdk.auth
            .login("user", "emailpass", { email, password })
            .then(async (token) => {
                await setAuthToken(token as string)
                const adminUserCacheTag = await getCacheTag("admin_users")
                revalidateTag(adminUserCacheTag)
                console.log(token)
                console.log(adminUserCacheTag)
            })

    } catch (error: any) {
        return error.toString() === "Error: Invalid email or password" ? "Erro: Email ou senha invalido" : error.toString()
    }

    try { }
    catch (error: any) {
        return error.toString()
    }
}

/**
 * Logout
 */
export async function signout() {
    await sdk.auth.logout()

    await removeAuthToken()

    const adminUserCacheTag = await getCacheTag("admin_users")
    revalidateTag(adminUserCacheTag)

    redirect("/admin/login")
}