// src/modules/account/templates/account-layout.tsx
"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import { Gift, Star } from "lucide-react"
import AccountNav from "../components/account-nav"
import { Progress } from "@components/ui/progress"
import { Badge } from "@components/ui/badge"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  // Mock de pontos (Em Medusa v2, buscaríamos de customer.metadata ou integração externa)
  const loyalty = {
    points: 1250,
    level: "Serpente Dourada",
    nextLevel: 2000,
  }

  return (
    <div className="flex-1 min-h-screen bg-background" data-testid="account-page">
      <div className="content-container max-w-7xl mx-auto py-12 px-4">

        {/* Header do Perfil - Estilo Dark Mystical */}
        <div className="glass-dark rounded-2xl p-6 mb-8 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-gold flex items-center justify-center text-3xl font-display text-white border-2 border-gold/30">
                {customer?.first_name?.charAt(0) || "S"}
              </div>
              <div>
                <h1 className="text-2xl font-display text-gradient-gold">
                  Olá, {customer?.first_name || "Viajante"}
                </h1>
                <p className="text-sm text-emerald-100/60">{customer?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-gold/10 text-gold border-gold/30">
                    <Star className="h-3 w-3 mr-1 fill-gold" />
                    {loyalty.level}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Navegação e Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          <aside className="sticky top-28">
            <AccountNav customer={customer} />
          </aside>
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout