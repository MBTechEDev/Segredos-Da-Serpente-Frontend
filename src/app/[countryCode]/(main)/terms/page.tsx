import { Metadata } from "next"

export const metadata: Metadata = {
    title: "O Pacto | Termos de Uso",
    description: "Os termos e condições, o pacto firmado com a Serpente. Leia antes de atravessar o véu.",
}

type Props = {
    params: Promise<{ countryCode: string }>
}

export default async function TermsPage({ params }: Props) {
    // Extract route params if necessary (like passing countryCode to Client Components for Links)
    const resolvedParams = await params
    const { countryCode } = resolvedParams

    return (
        <main className="min-h-screen relative py-24 bg-background">
            {/* Mystical Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#1a2e25]/40 to-transparent" />
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-[120px] mix-blend-screen" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-5xl">
                <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
                    <h1 className="font-cinzel text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#D4AF37] bg-clip-text text-transparent uppercase tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        O Pacto
                    </h1>
                    <p className="font-inter text-neutral-400 max-w-2xl text-lg leading-relaxed">
                        As leis da Serpente são absolutas. O véu escuro se abre para aqueles que compreendem os termos de nossa comunhão. Leia as inscrições com atenção.
                    </p>
                </div>

                {/* 
          Aqui entra nosso layout 70/30 (Side Nav + Content). 
          Fiz em um Server Component base, mas vamos extraí-lo componente a componente 
          conforme sua resposta às perguntas estratégicas abaixo. 
        */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative items-start">

                    {/* Navegação Lateral (Mock Inicial - Futuro Client Component) */}
                    <aside className="md:col-span-4 sticky top-28 z-20 glass-dark p-6 border border-white/5 rounded-xl shadow-2xl">
                        <h3 className="font-cinzel text-[#D4AF37] text-xl mb-6 tracking-wider uppercase border-b border-white/10 pb-4">
                            Conhecimento
                        </h3>
                        <ul className="space-y-4 font-inter text-sm text-neutral-400">
                            <li className="cursor-pointer hover:text-[#F1D06E] transition-colors">
                                <a href="#inicio" className="block w-full">I. A Iniciação (Uso e Prazos)</a>
                            </li>
                            <li className="cursor-pointer hover:text-[#F1D06E] transition-colors">
                                <a href="#privacidade" className="block w-full">II. O Véu (Privacidade)</a>
                            </li>
                            <li className="cursor-pointer hover:text-[#F1D06E] transition-colors">
                                <a href="#oferenda" className="block w-full">III. A Oferenda e o Envio (Logística)</a>
                            </li>
                            <li className="cursor-pointer hover:text-[#F1D06E] transition-colors">
                                <a href="#retorno" className="block w-full">IV. O Retorno (Devoluções)</a>
                            </li>
                        </ul>
                    </aside>

                    {/* Conteúdo Principal (Legal Text) */}
                    <section className="md:col-span-8 glass-dark p-8 md:p-12 border border-white/5 rounded-xl shadow-2xl text-neutral-300 font-inter space-y-12 leading-relaxed">
                        <div id="inicio" className="scroll-mt-32">
                            <h2 className="font-cinzel text-3xl font-bold text-[#D4AF37] mb-6">I. A Iniciação (Uso e Prazos)</h2>
                            <p className="mb-4">
                                Ao cruzar os portais de <strong>Segredos da Serpente</strong>, você aceita que nossas relíquias não pertencem ao tempo do mundo comum.
                            </p>
                            <p className="mb-4">
                                <strong>Alquimia Manual:</strong> Cada item é forjado artesanalmente. Por isso, a Serpente dispõe de 2 a 3 dias úteis para a preparação e consagração do seu pedido antes que ele deixe nosso covil.
                            </p>
                            <p>
                                <strong>A Jornada:</strong> Somente após esse período de preparo é que o prazo da transportadora escolhida começa a contar.
                            </p>
                        </div>

                        <div id="privacidade" className="scroll-mt-32">
                            <h2 className="font-cinzel text-3xl font-bold text-[#D4AF37] mb-6">II. O Véu (Privacidade)</h2>
                            <p>
                                Seus dados são as runas que permitem o envio das relíquias. Coletamos apenas o necessário para que o pacto de entrega seja cumprido, jamais partilhando sua essência com terceiros para fins obscuros.
                            </p>
                        </div>

                        <div id="oferenda" className="scroll-mt-32">
                            <h2 className="font-cinzel text-3xl font-bold text-[#D4AF37] mb-6">III. A Oferenda e o Envio (Pagamentos e Logística)</h2>
                            <p className="mb-4">
                                A transferência das relíquias envolve mensageiros externos.
                            </p>
                            <p className="mb-4">
                                <strong>Responsabilidade de Postagem:</strong> A Segredos da Serpente compromete-se com a entrega da mercadoria às mãos dos mensageiros (transportadoras/Correios) com zelo e proteção.
                            </p>
                            <p className="mb-4">
                                <strong>O Transporte:</strong> Uma vez que a relíquia cruza nosso portal e é postada, a jornada passa a ser de responsabilidade da empresa de transporte escolhida por você no ato da oferenda. Não realizamos o transporte direto, atuando apenas como intermediários na contratação desse serviço em seu nome.
                            </p>
                            <p>
                                <strong>Rastreio:</strong> Você receberá o código de vigilância (rastreio) para acompanhar a trajetória da sua relíquia através das terras intermediárias.
                            </p>
                        </div>

                        <div id="retorno" className="scroll-mt-32">
                            <h2 className="font-cinzel text-3xl font-bold text-[#D4AF37] mb-6">IV. O Retorno (Devoluções)</h2>
                            <p className="mb-4">
                                O destino pode ser incerto. Caso a relíquia chegue profanada (danificada) ou não seja o que sua alma buscava:
                            </p>
                            <p className="mb-4">
                                <strong>Arrependimento:</strong> Você tem 7 dias após o recebimento para solicitar o retorno ao nosso covil.
                            </p>
                            <p>
                                <strong>Defeitos:</strong> Itens com falha na forja devem ser reportados em até 30 dias.
                            </p>
                        </div>

                    </section>
                </div>
            </div>
        </main>
    )
}
