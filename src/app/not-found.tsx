import { ArrowRight } from "lucide-react"
import { Metadata } from "next"
// Removemos a importação do Link do next/link
import { cn } from "@lib/utils"

export const metadata: Metadata = {
  title: "404 - O Véu Permanece Fechado | Segredos da Serpente",
  description: "A página que você procura não existe ou foi consumida pelas sombras.",
}

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-background relative overflow-hidden font-body text-foreground">
      {/* Efeitos de Ambiente Místico */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-8xl md:text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] via-[#F1D06E] to-transparent opacity-90 drop-shadow-2xl">
          404
        </h1>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-display tracking-wider text-secondary drop-shadow-md">
            O Véu Permanece Fechado
          </h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto px-4 font-medium tracking-wide">
            A página que você busca foi consumida pelas sombras ou não pertence a este plano.
          </p>
        </div>

        {/* Substituímos <Link> por <a> para forçar hard navigation */}
        <a
          href="/"
          className={cn(
            "mt-10 inline-flex items-center gap-3 px-8 py-4 rounded-md",
            "text-sm font-bold uppercase tracking-[0.2em] font-display text-black",
            "bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515]",
            "hover:scale-[1.02] active:scale-[0.98] hover:brightness-110 transition-all duration-300",
            "shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]",
            "group"
          )}
        >
          Retornar à Luz
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
        </a>
      </div>
    </div>
  )
}