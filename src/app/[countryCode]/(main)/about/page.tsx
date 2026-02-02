import { Metadata } from "next"
import { ShieldCheck, Leaf, Eye, Moon, Zap, UserCheck } from "lucide-react"
import { Button } from "@components/ui/button"
import { Card, CardContent } from "@components/ui/card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AboutHeroContent from "@modules/about-hero-content"

export const metadata: Metadata = {
    title: "Nosso Saber | Segredos da Serpente",
    description: "Resgatando o saber ancestral da natureza e da bruxaria natural com responsabilidade e ética.",
}

const values = [
    {
        icon: Leaf,
        title: "Respeito à Natureza",
        description: "Honramos a Terra e seus ciclos. Toda prática nasce do cuidado com o equilíbrio natural e elementos ancestrais."
    },
    {
        icon: UserCheck,
        title: "Respeito às Pessoas",
        description: "Acreditamos no livre-arbítrio e na responsabilidade. Não compactuamos com práticas de manipulação ou dominação."
    },
    {
        icon: ShieldCheck,
        title: "Ética Animal",
        description: "Animais são seres sagrados. Nossos produtos não incentivam exploração e priorizam práticas conscientes."
    },
    {
        icon: Eye,
        title: "Responsabilidade Espiritual",
        description: "Tratamos a espiritualidade com seriedade, sem promessas vazias ou substituição de cuidados profissionais."
    },
    {
        icon: Moon,
        title: "Sabedoria Ancestral",
        description: "Valorizamos o conhecimento das ervas e rituais transmitidos pelo tempo, sem apropriação ou superficialidade."
    },
    {
        icon: Zap,
        title: "Consciência",
        description: "A magia começa no interior. Incentivamos o fortalecimento pessoal, a presença e a maturidade espiritual."
    },
]

export default async function AboutPage({ params }: { params: { countryCode: string } }) {
    const { countryCode } = await params

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* SECTION 1: HERO - O MANIFESTO (Já centralizado nativamente) */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?q=80&w=2070&auto=format&fit=crop"
                        alt="Natureza Ancestral"
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
                </div>

                <AboutHeroContent>
                    <span className="text-secondary font-display tracking-[0.3em] uppercase text-xs mb-4 block text-center">Manifesto</span>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-gradient-gold leading-tight mb-8 text-center">
                        A serpente não seduz — <br /> ela desperta.
                    </h1>
                    <p className="font-mystical text-xl md:text-3xl text-foreground/90 italic max-w-3xl mx-auto leading-relaxed text-center">
                        "A verdadeira magia nasce do saber, do cuidado e da consciência. Honramos a Terra, guardamos o saber antigo e caminhamos com responsabilidade entre o visível e o invisível."
                    </p>
                </AboutHeroContent>
            </section>

            {/* SECTION 2: A MARCA E MISSÃO */}
            <section className="py-20 border-y border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="font-display text-3xl md:text-4xl text-gradient-gold mb-8">Nossa Essência</h2>
                    <p className="font-body text-base md:text-xl text-muted-foreground leading-relaxed">
                        A **Segredos da Serpente** resgata o saber ancestral da natureza e da bruxaria natural com profundidade.
                        Oferecemos produtos ritualísticos que auxiliam no autoconhecimento e equilíbrio energético.
                    </p>
                    <div className="mt-12 flex justify-center">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
                    </div>
                </div>
            </section>

            {/* SECTION 3: O SÍMBOLO (Refatorado para alinhar center no mobile e left no desktop) */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
                        <div className="relative group max-w-[300px] lg:max-w-none mx-auto lg:mx-0">
                            <div className="absolute -inset-4 border border-secondary/20 rounded-full animate-pulse-slow" />
                            <img
                                src="https://images.unsplash.com/photo-1567344473783-690847798361?q=80&w=1974&auto=format&fit=crop"
                                alt="Simbolismo Oculto"
                                className="w-full aspect-square object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 rounded-full bg-secondary/10 mix-blend-overlay" />
                        </div>

                        <div className="space-y-8 text-center lg:text-left">
                            <h2 className="font-display text-3xl md:text-4xl text-gradient-gold">🍎🐍 Maçã & Serpente</h2>
                            <div className="space-y-6 text-foreground/80 font-body leading-relaxed text-base md:text-lg">
                                <p>
                                    <strong className="text-secondary font-display">A Maçã:</strong> Representa o fruto do conhecimento oculto, o portal entre os mundos.
                                </p>
                                <p>
                                    <strong className="text-secondary font-display">A Serpente:</strong> Guardiã dos mistérios e senhora dos ciclos. Ela ensina que o verdadeiro
                                    saber é conquistado com tempo, silêncio e troca de pele.
                                </p>
                                <blockquote className="border-l-2 lg:border-l-2 border-secondary/50 pl-6 italic font-mystical text-lg md:text-xl text-foreground text-left lg:text-left mx-auto lg:mx-0">
                                    "Na Segredos da Serpente, a serpente não devora o fruto: ela o guarda."
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: NOSSOS VALORES (Grid centralizado) */}
            <section className="py-24 bg-card/20 backdrop-blur-sm">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="font-display text-3xl md:text-4xl mb-16">Pilares de Responsabilidade</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {values.map((v, i) => (
                            <Card key={i} className="bg-background/40 border-white/5 hover:border-secondary/30 transition-all duration-500 group">
                                <CardContent className="p-8 flex flex-col items-center text-center">
                                    <v.icon className="w-10 h-10 text-secondary mb-6 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-display text-xl mb-4 text-white/90">{v.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">{v.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 5: FUNDADORA */}
            <section className="py-24 text-center px-6">
                <div className="max-w-2xl mx-auto">
                    <p className="font-mystical text-2xl md:text-3xl text-secondary mb-2">Joice Nascimento Gonçalves</p>
                    <p className="text-muted-foreground uppercase tracking-[0.2em] text-xs mb-8">Fundadora & Curadora</p>
                    <p className="font-body italic text-foreground/70 text-sm md:text-base">
                        "Honramos os ciclos naturais, o tempo do corpo, da alma e do espírito, entendendo que magia é processo, não atalho."
                    </p>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="py-32 relative text-center px-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-80 h-64 md:h-80 bg-secondary/10 rounded-full blur-[100px]" />
                <h2 className="relative z-10 font-display text-3xl md:text-5xl mb-8">Caminhe com Responsabilidade.</h2>
                <LocalizedClientLink href="/store">
                    <Button variant="outline" className="w-full md:w-auto border-secondary text-secondary hover:bg-secondary/10 font-display px-10 py-7 text-base md:text-lg tracking-widest transition-all">
                        Explorar Saberes Ancestrais
                    </Button>
                </LocalizedClientLink>
            </section>

        </div>
    )
}