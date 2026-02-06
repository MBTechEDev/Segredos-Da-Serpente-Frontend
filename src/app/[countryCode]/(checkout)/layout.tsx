import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import { Lock } from "lucide-react"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-background min-h-screen">
      <div className="h-20 bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-50">

        <nav className="flex h-full items-center content-container justify-between px-12">
          <LocalizedClientLink
            href="/cart"
            className="flex-1 basis-0 text-small-semi text-ui-fg-subtle hover:text-secondary transition-colors flex items-center gap-x-2 uppercase"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="hidden small:block">Voltar ao Carrinho</span>
            <span className="block small:hidden">Voltar</span>
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/"
            className="text-xl font-display text-gradient-gold tracking-widest"
          >
            <div className="relative flex items-baseline select-none">
              <span className="font-display italic text-2xl md:text-3xl font-bold tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent drop-shadow-sm">
                Segredos
              </span>
              <span className="font-mystical text-lg md:text-xl text-white/90 italic ml-1.5 font-light tracking-wide">
                da Serpente
              </span>
            </div>
          </LocalizedClientLink>

          <div className="flex-1 basis-1 flex justify-end">
            <div className="flex items-center gap-2 text-primary">
              <Lock size={16} />
              <span className="text-xs font-body uppercase tracking-tighter hidden small:block">
                Checkout Seguro
              </span>
            </div>
          </div>

        </nav>
      </div>

      <main className="relative" data-testid="checkout-container">
        {children}
      </main>

      <footer className="py-8 w-full flex flex-col items-center justify-center bg-card/20 border-t border-border mt-12">
        <p className="text-tiny tracking-widest mb-2 font-display italic bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent drop-shadow-sm">
          Segredos da Serpente © {new Date().getFullYear()} - Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}