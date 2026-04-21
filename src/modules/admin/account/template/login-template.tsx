"use client"

import { Sparkles, MapPin, Lock } from "lucide-react"
import AdminLogin from "../component/login"

/**
 * Template principal de Autenticação.
 * Gerencia a troca entre Login e Registro utilizando Tabs para uma UX moderna.
 */
const LoginTemplate = () => {
    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-lg">

                    <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        <h2 className="font-display text-3xl md:text-4xl text-gradient-gold mb-2">
                            Santuário Interno
                        </h2>
                        <p className="text-sm text-zinc-400 font-medium tracking-wide">
                            Acesso Restrito · Segredos da Serpente
                        </p>
                    </div>

                    <AdminLogin />

                </div>
            </main>
        </div>
    )
}

export default LoginTemplate