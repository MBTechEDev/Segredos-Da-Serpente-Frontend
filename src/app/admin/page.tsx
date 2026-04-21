import { Metadata } from "next"
import { retrieveAdminUser } from "@lib/data/admin"
import { listOrders } from "@lib/data/orders"
import { notFound } from "next/navigation"
import Button from "@modules/admin/account/component/logout"
import { cn } from "@lib/utils"
import { Activity, Package, Users, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
    title: "Santuário | Visão Geral",
    description: "Análise e segredos do dia a dia",
}

export default async function AdminDashboard() {
    const adminUser = await retrieveAdminUser().catch(() => null)

    if (!adminUser) {
        notFound()
    }

    // Fallback elegante caso o admin não tenha nome cadastrado
    const adminName = adminUser.first_name || "Guardião"

    return (
        <div className="min-h-screen bg-background text-foreground p-8 relative overflow-hidden font-body">
            {/* Efeitos de Ambiente Místico (Sutis para não atrapalhar a leitura) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">

                {/* Cabeçalho do Dashboard */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className={cn(
                            "text-3xl font-bold font-display tracking-wider",
                            "text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#D4AF37]"
                        )}>
                            Santuário Interno
                        </h1>
                        <p className="text-zinc-400 mt-1">
                            Bem-vindo(a) de volta, <span className="text-white font-medium">{adminName}</span>. Aqui estão as revelações de hoje.
                        </p>
                    </div>

                    {/* Botão de Logout posicionado no topo */}
                    <div className="flex items-center">
                        <Button />
                    </div>
                </div>

                {/* Grid de Métricas (Cards Tematizados) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Vendas */}
                    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-xl shadow-lg backdrop-blur-sm group hover:border-[#D4AF37]/30 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80 font-display">Vendas Totais</p>
                            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <p className="text-3xl font-bold text-white tracking-tight">R$ 0,00</p>
                    </div>

                    {/* Card 2: Pedidos Pendentes */}
                    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-xl shadow-lg backdrop-blur-sm group hover:border-[#D4AF37]/30 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80 font-display">Pedidos Pendentes</p>
                            <Package className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <p className="text-3xl font-bold text-white tracking-tight">0</p>
                    </div>

                    {/* Card 3: Novos Clientes */}
                    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-xl shadow-lg backdrop-blur-sm group hover:border-[#D4AF37]/30 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80 font-display">Iniciados (Clientes)</p>
                            <Users className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <p className="text-3xl font-bold text-white tracking-tight">0</p>
                    </div>

                    {/* Card 4: Taxa de Conversão / Atividade */}
                    <div className="p-6 bg-zinc-900/50 border border-white/5 rounded-xl shadow-lg backdrop-blur-sm group hover:border-[#D4AF37]/30 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80 font-display">Ritual de Conversão</p>
                            <Activity className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <p className="text-3xl font-bold text-white tracking-tight">0%</p>
                    </div>
                </div>

                {/* Área Principal de Gráficos e Tabelas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfico Placeholder */}
                    <div className="lg:col-span-2 p-8 bg-zinc-900/30 border border-white/5 rounded-xl min-h-[400px] flex flex-col items-center justify-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                        <Activity className="w-12 h-12 text-zinc-700 mb-4" />
                        <p className="text-zinc-500 text-center font-medium tracking-wide">
                            Visão de faturamento aguardando os dados do oráculo...
                        </p>
                    </div>

                    {/* Lista de Pedidos Recentes Placeholder */}
                    <div className="p-6 bg-zinc-900/30 border border-white/5 rounded-xl">
                        <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-[#D4AF37] font-display mb-6">
                            Últimos Movimentos
                        </h3>
                        <div className="space-y-4">
                            {/* Item de Lista Fake */}
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-white font-medium">Pedido #100{i}</span>
                                        <span className="text-xs text-zinc-500">Há algumas horas</span>
                                    </div>
                                    <span className="text-sm text-[#D4AF37] font-bold">R$ --,--</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}