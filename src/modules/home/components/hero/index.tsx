import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative min-h-[93vh] md:h-[93vh] flex items-center justify-center overflow-hidden py-12 md:py-0">
      {/* Background Effects & Glassmorphism */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Serpent Pattern Overlay - SVG Sutil */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M0,50 Q25,30 50,50 T100,50"
            stroke="#D4AF37"
            strokeWidth="0.2"
            fill="none"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Container Principal - Adicionado pb-20 no mobile para não colidir com o scroll indicator */}
      <div className="container relative z-10 px-4 pb-24 md:pb-0">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge de Coleção */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/10 mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-xs md:text-sm text-secondary font-medium tracking-wider uppercase">
              Nova Coleção Lua Cheia
            </span>
          </div>

          {/* Main Heading - Cinzel Font */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Desperte o{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent font-bold">
              Poder
            </span>
            <br />
            Dentro de Você
          </h1>

          {/* Subheading - Cormorant Garamond */}
          <p className="font-mystical text-lg md:text-2xl text-foreground/70 mb-8 md:mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Produtos místicos e ritualísticos selecionados para transformar sua energia
            e conectar você ao seu eu mais profundo.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <LocalizedClientLink href="/store" className="w-full sm:w-auto">
              <Button className="cta-primary w-full px-8 py-6 md:py-7 text-base group">
                Explorar Coleção
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </LocalizedClientLink>

            <LocalizedClientLink href="/sale" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-foreground/20 text-foreground hover:border-secondary hover:text-secondary px-8 py-6 md:py-7 text-base transition-all duration-300">
                Ver Promoções
              </Button>
            </LocalizedClientLink>
          </div>

          {/* Trust Badges - Ajustado margem superior no mobile */}
          <div className="mt-10 md:mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-12 text-muted-foreground animate-in fade-in duration-1000 delay-700">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[10px] md:text-sm tracking-wide">Frete Grátis +R$150</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
              <span className="text-[10px] md:text-sm tracking-wide">Envio Discreto</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="text-[10px] md:text-sm tracking-wide">Produtos Energizados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Garantido no fundo sem sobreposição */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20">
        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-foreground/30 font-medium">Scroll</span>
        <div className="w-5 h-8 md:w-6 md:h-10 rounded-full border border-foreground/20 flex items-start justify-center p-1 md:p-1.5 animate-bounce">
          <div className="w-1 h-1.5 md:h-2 bg-secondary rounded-full" />
        </div>
      </div>
    </section>
  )
}

export default Hero