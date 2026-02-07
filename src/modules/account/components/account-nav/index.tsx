"use client"

import { useParams, usePathname } from "next/navigation"
import {
  User,
  MapPin,
  Package,
  LogOut,
  ChevronRight,
  LayoutDashboard
} from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import { cn } from "@lib/utils"

const AccountNav = ({ customer }: { customer: HttpTypes.StoreCustomer | null }) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

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
    <div className="glass-dark rounded-2xl p-4 border border-emerald-500/10">
      <nav className="flex flex-col gap-y-2">
        {menuItems.map((item) => {
          const active = route === `/${countryCode}${item.href}` || route === item.href

          return (
            <LocalizedClientLink
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                active
                  ? "bg-emerald-500/20 text-gold border border-gold/20"
                  : "text-emerald-100/60 hover:bg-emerald-500/10 hover:text-emerald-100"
              )}
            >
              <div className="flex items-center gap-x-3">
                <item.icon size={20} className={active ? "text-gold" : "text-emerald-500"} />
                <span className="font-body font-medium">{item.label}</span>
              </div>
              <ChevronRight size={16} className={cn("transition-transform", active ? "translate-x-1" : "opacity-0")} />
            </LocalizedClientLink>
          )
        })}

        <div className="h-px bg-emerald-500/10 my-4" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-x-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all w-full"
        >
          <LogOut size={20} />
          <span className="font-body font-medium">Encerrar Sessão</span>
        </button>
      </nav>
    </div>
  )
}

export default AccountNav