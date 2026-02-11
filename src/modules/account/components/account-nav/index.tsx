"use client"

import { useParams, usePathname } from "next/navigation"
import { LayoutDashboard, User, MapPin, Package, LogOut, ChevronRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signout } from "@lib/data/customer"
import { cn } from "@lib/utils"
import { HttpTypes } from "@medusajs/types"



interface AccountNavProps {
  customer: HttpTypes.StoreCustomer | null
}

const AccountNav = ({ customer }: AccountNavProps) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  // O 'customer' pode ser usado aqui para saudações ou verificações se necessário
  const customerName = customer?.first_name || "Místico"

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const menuItems = [
    { label: "Visão Geral", href: "/account", icon: LayoutDashboard },
    { label: "Perfil", href: "/account/profile", icon: User },
    { label: "Endereços", href: "/account/addresses", icon: MapPin },
    { label: "Pedidos", href: "/account/orders", icon: Package },
  ]

  return (
    <aside className="w-full relative">
      <div className="glass-dark rounded-2xl p-4 border border-emerald-500/10 shadow-2xl">
        {/* Saudação sutil usando o customer (resolve o erro de variável não lida) */}
        <div className="px-4 mb-4">
          <p className="text-xs font-body text-emerald-500/50 uppercase tracking-widest">Saudações,</p>
          <p className="text-sm font-display text-secondary">{customerName}</p>
        </div>

        <nav className="flex flex-col gap-y-1.5">
          {menuItems.map((item) => {
            const active = route === `/${countryCode}${item.href}` || route === item.href

            return (
              <LocalizedClientLink
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 relative",
                  active
                    ? "bg-emerald-500/15 text-secondary border border-secondary/30"
                    : "text-emerald-100/60 hover:bg-emerald-500/10 hover:text-emerald-100"
                )}
              >
                <div className="flex items-center gap-x-3">
                  <item.icon size={20} className={active ? "text-secondary" : "text-primary"} />
                  <span className="font-body font-medium">{item.label}</span>
                </div>
                <ChevronRight size={16} className={cn("transition-all", active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2")} />
              </LocalizedClientLink>
            )
          })}

          <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent my-4" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-x-3 px-4 py-3 text-red-400/80 hover:bg-red-400/10 rounded-xl transition-all w-full group"
          >
            <LogOut size={20} />
            <span className="font-body font-medium">Encerrar Sessão</span>
          </button>
        </nav>
      </div>
    </aside>
  )
}

export default AccountNav