"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Truck
} from "lucide-react"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils"
import { convertToLocale } from "@lib/util/money" // Importando sua função mantida

type OrderOverviewProps = {
  orders: HttpTypes.StoreOrder[]
}

const OrderOverview = ({ orders }: OrderOverviewProps) => {
  const [filter, setFilter] = useState("todos")

  // Configuração de Status para o Tema Dark Mystical
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: "Pendente", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
      completed: { label: "Concluído", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle2 },
      canceled: { label: "Cancelado", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
      archived: { label: "Arquivado", color: "bg-zinc-800 text-zinc-400 border-zinc-700", icon: Package },
    }
    return configs[status] || { label: status, color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Truck }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === "todos") return true
    if (filter === "andamento") return ["pending", "requires_action"].includes(order.status)
    if (filter === "concluidos") return order.status === "completed"
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-display text-gradient-gold">Meus Pedidos</h2>
        <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
          <TabsList className="bg-background/50 border border-white/10 backdrop-blur-md">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
            <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 border border-white/5 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-zinc-200 mb-2">Nenhum pedido encontrado</h3>
          <p className="text-zinc-500 mb-6">Sua jornada mística ainda não começou.</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white">
            <LocalizedClientLink href="/store">Explorar Loja</LocalizedClientLink>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => {
            const status = getStatusConfig(order.status)
            const StatusIcon = status.icon

            return (
              <div
                key={order.id}
                className="glass-dark rounded-xl p-5 border border-white/5 hover:border-secondary/30 transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center group-hover:border-secondary/20 transition-colors">
                      <ShoppingBag className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-zinc-100 uppercase tracking-wider text-sm">
                          #{order.display_id}
                        </span>
                        <Badge variant="outline" className={cn("text-[10px] uppercase tracking-tighter", status.color)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {order.items?.length} {order.items?.length === 1 ? "item" : "itens"} •{" "}
                        {new Date(order.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                    <p className="text-xl font-display text-secondary">
                      {convertToLocale({
                        amount: order.total / 100, // Ajuste para decimais pois o Medusa v2 retorna centavos
                        currency_code: order.currency_code,
                        locale: "pt-BR"
                      })}
                    </p>
                    <Button variant="outline" size="sm" className="h-8 border-white/5 bg-white/5 hover:bg-white/10" asChild>
                      <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        Detalhes
                      </LocalizedClientLink>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderOverview