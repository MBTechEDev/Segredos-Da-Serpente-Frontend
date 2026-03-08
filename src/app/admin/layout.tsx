"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { sdk } from "@lib/config" // Importe seu SDK configurado

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkAuth = async () => {
            // Ignora a verificação se já estiver na página de login para evitar loop
            if (pathname === "/admin/login") {
                setIsAuthenticated(true)
                return
            }

            try {
                // No Medusa v2, verificamos se o usuário admin atual está logado
                const { user } = await sdk.admin

                if (user) {
                    setIsAuthenticated(true)
                } else {
                    router.push("/admin/login")
                }
            } catch (error) {
                console.error("Erro de autenticação:", error)
                router.push("/admin/login")
            }
        }

        checkAuth()
    }, [pathname, router])

    // Enquanto verifica, você pode mostrar um loading com o estilo da sua loja
    if (isAuthenticated === null && pathname !== "/admin/login") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        )
    }

    return (
        <section className="min-h-screen bg-gray-50 text-black">
            {/* Aqui você pode adicionar uma Sidebar ou Navbar de Admin futuramente */}
            {children}
        </section>
    )
}