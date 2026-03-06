import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { User, MapPin, ScrollText, ArrowRight } from "lucide-react"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const missingItems = getMissingProfileItems(customer)

  return (
    <div className="space-y-8" data-testid="overview-page-wrapper">
      <div className="flex flex-col gap-2">
        <h1 className="font-cinzel text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          Bem-vindo(a) às Sombras, {customer?.first_name || 'Iniciado'}
        </h1>
        <p className="text-neutral-400 font-inter text-sm md:text-base">
          Sua essência está atrelada ao portal sob: <span className="font-semibold text-[#D4AF37]">{customer?.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Lado Esquerdo: Essência e Moradas */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Sua Essência (Profile) */}
          <div className="glass-dark p-6 border border-white/5 rounded-xl shadow-2xl relative overflow-hidden group">
            {/* Efeito Glow Dourado */}
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-all duration-700 pointer-events-none" />

            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-black/40 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
                <User className="text-[#D4AF37] w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-xl text-neutral-200">Sua Essência</h3>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Alinhamento do Perfil</p>
              </div>
            </div>

            <div className="flex items-end gap-x-2 relative z-10">
              <span className="font-cinzel text-4xl font-bold bg-gradient-to-br from-[#D4AF37] to-[#F1D06E] bg-clip-text text-transparent">
                {getProfileCompletion(customer)}%
              </span>
              <span className="uppercase text-xs text-neutral-400 mb-1">
                Concluído
              </span>
            </div>

            {missingItems.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-black/40 border border-[#D4AF37]/20 relative z-10">
                <p className="text-xs text-neutral-400 mb-2">O ritual exige os seguintes fragmentos:</p>
                <ul className="text-xs text-[#F1D06E] space-y-1 list-disc list-inside">
                  {missingItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <LocalizedClientLink href="/account/profile" className="relative z-10 mt-6 flex items-center text-sm font-medium text-[#D4AF37] hover:text-[#F1D06E] transition-colors group/link w-fit">
              {missingItems.length === 0 ? "Administrar Essência" : "Aprimorar Essência"} <ArrowRight className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
            </LocalizedClientLink>
          </div>

          {/* Moradas (Addresses) */}
          <div className="glass-dark p-6 border border-white/5 rounded-xl shadow-2xl relative overflow-hidden group">
            {/* Efeito Glow Esmeralda */}
            <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-[#1a2e25]/20 rounded-full blur-2xl group-hover:bg-[#1a2e25]/30 transition-all duration-700 pointer-events-none" />

            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-full border border-emerald-900/50 flex items-center justify-center bg-black/40 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
                <MapPin className="text-emerald-500 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-cinzel text-xl text-neutral-200">Moradas</h3>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Destino das Relíquias</p>
              </div>
            </div>

            <div className="flex items-end gap-x-2 relative z-10">
              <span className="font-cinzel text-4xl font-bold text-emerald-400">
                {customer?.addresses?.length || 0}
              </span>
              <span className="uppercase text-xs text-neutral-400 mb-1">
                Registradas
              </span>
            </div>

            <LocalizedClientLink href="/account/addresses" className="relative z-10 mt-6 flex items-center text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors group/link w-fit">
              Gerenciar Moradas <ArrowRight className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
            </LocalizedClientLink>
          </div>
        </div>

        {/* Lado Direito: Pactos Forjados (Orders) */}
        <div className="xl:col-span-7 glass-dark p-6 md:p-8 border border-white/5 rounded-xl shadow-2xl flex flex-col h-full relative overflow-hidden group">
          {/* Subtle top gradient */}
          <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-black/40">
              <ScrollText className="text-[#D4AF37] w-6 h-6" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl text-neutral-200">Rituais Forjados</h3>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">Suas Oferendas Recentes</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 relative z-10">
            {orders && orders.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {orders.slice(0, 5).map((order) => (
                  <li key={order.id} className="relative group/order">
                    {/* Hover glow for each order */}
                    <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity blur-md pointer-events-none" />

                    <LocalizedClientLink href={`/account/orders/details/${order.id}`} className="block relative z-10">
                      <div className="p-4 md:p-5 rounded-xl bg-black/40 border border-white/5 group-hover/order:border-[#D4AF37]/30 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="font-cinzel text-[#F1D06E] text-base md:text-lg font-semibold tracking-wider">
                            Ritual #{order.display_id}
                          </span>
                          <span className="text-xs text-neutral-500 font-inter">
                            Forjado em: {new Date(order.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                          <span className="font-inter text-emerald-400 font-medium whitespace-nowrap bg-emerald-950/30 px-3 py-1 rounded-md border border-emerald-900/40">
                            {convertToLocale({
                              amount: order.summary.current_order_total,
                              currency_code: order.currency_code,
                            })}
                          </span>
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/order:bg-[#D4AF37]/10 transition-colors">
                            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover/order:text-[#D4AF37] transition-colors" />
                          </div>
                        </div>
                      </div>
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-black/20 rounded-xl border border-white/5 border-dashed">
                <ScrollText className="w-12 h-12 text-neutral-600 mb-4" />
                <p className="text-neutral-400 font-inter text-sm max-w-sm leading-relaxed">
                  Os pergaminhos estão em branco. O altar repousa no escuro aguardando a sua primeira oferenda.
                </p>
                <LocalizedClientLink href="/store" className="mt-6 px-6 py-2 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-cinzel tracking-wider text-sm transition-all duration-300">
                  Explorar o Covil
                </LocalizedClientLink>
              </div>
            )}

            {orders && orders.length > 0 && (
              <LocalizedClientLink href="/account/orders" className="mt-auto pt-4 flex items-center justify-center text-sm text-neutral-400 hover:text-[#D4AF37] transition-colors group/link">
                Inspecionar Todos os Pactos <ArrowRight className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
              </LocalizedClientLink>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

const getMissingProfileItems = (customer: HttpTypes.StoreCustomer | null) => {
  if (!customer) return []

  const missing: string[] = []

  if (!customer.first_name || !customer.last_name) {
    missing.push("Nome e Sobrenome")
  }
  if (!customer.phone) {
    missing.push("Telefone Místico")
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (!billingAddress) {
    missing.push("Morada Principal")
  }

  return missing
}

export default Overview
