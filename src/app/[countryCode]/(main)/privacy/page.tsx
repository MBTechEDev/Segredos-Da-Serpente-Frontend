import { Metadata } from "next"

export const metadata: Metadata = {
    title: "O Véu | Política de Privacidade",
    description: "No santuário de Segredos da Serpente, a guarda de sua identidade é um compromisso sagrado. Leia nossa Política de Privacidade.",
}

type Props = {
    params: Promise<{ countryCode: string }>
}

export default async function PrivacyPage({ params }: Props) {
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
                        O Véu
                    </h1>
                    <p className="font-inter text-neutral-400 max-w-2xl text-lg leading-relaxed">
                        No santuário de Segredos da Serpente, a guarda de sua identidade é um compromisso sagrado. Para que nossas relíquias cheguem até você, precisamos colher fragmentos de sua essência (dados pessoais). Este documento explica como protegemos esses segredos sob o véu de nossa proteção mística e legal.
                    </p>
                </div>

                {/* Grid Assimétrica (70/30) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative items-start">

                    {/* Navegação Lateral */}
                    <aside className="md:col-span-4 sticky top-28 z-20 glass-dark p-6 border border-white/5 rounded-xl shadow-2xl">
                        <h3 className="font-cinzel text-[#D4AF37] text-xl mb-6 tracking-wider uppercase border-b border-white/10 pb-4">
                            Sumário Místico
                        </h3>
                        <ul className="space-y-4 font-inter text-sm text-neutral-400">
                            <li className="cursor-pointer hover:text-[#F1D06E] transition-colors">
                                <a href="#colheita" className="block w-full">I. A Colheita de Runas</a>
                            </li>
                            <li className="cursor-pointer hover:text-[#F1D06E] transition-colors">
                                <a href="#proposito" className="block w-full">II. O Propósito do Ritual</a>
                            </li>
                            <li className="cursor-pointer hover:text-[#F1D06E] transition-colors">
                                <a href="#compartilhamento" className="block w-full">III. O Compartilhamento com os Mensageiros</a>
                            </li>
                            <li className="cursor-pointer hover:text-[#F1D06E] transition-colors">
                                <a href="#protecao" className="block w-full">IV. A Proteção do Covil</a>
                            </li>
                            <li className="cursor-pointer hover:text-[#F1D06E] transition-colors">
                                <a href="#direitos" className="block w-full">V. Os Direitos do Iniciado</a>
                            </li>
                            <li className="cursor-pointer hover:text-[#F1D06E] transition-colors">
                                <a href="#alteracoes" className="block w-full">VI. Alterações no Ritual</a>
                            </li>
                        </ul>
                    </aside>

                    {/* Conteúdo Principal (Legal Text) */}
                    <section className="md:col-span-8 glass-dark p-8 md:p-12 border border-white/5 rounded-xl shadow-2xl text-neutral-300 font-inter space-y-12 leading-relaxed">
                        <div id="colheita" className="scroll-mt-32">
                            <h2 className="font-cinzel text-3xl font-bold text-[#D4AF37] mb-6">I. A Colheita de Runas (Quais dados coletamos?)</h2>
                            <p className="mb-4">
                                Para que o ritual de comunhão seja selado, coletamos as seguintes informações:
                            </p>
                            <p className="mb-4">
                                <strong>Identidade:</strong> Nome completo e CPF (necessário para a emissão de notas fiscais e rituais de envio).
                            </p>
                            <p className="mb-4">
                                <strong>Localização:</strong> Endereço completo para que os mensageiros encontrem sua morada.
                            </p>
                            <p className="mb-4">
                                <strong>Contato:</strong> E-mail e telefone, para que possamos avisar quando sua relíquia deixar nosso covil.
                            </p>
                            <p>
                                <strong>Essência Digital:</strong> Cookies e dados de navegação, para que o portal se lembre de suas preferências em futuras visitas.
                            </p>
                        </div>

                        <div id="proposito" className="scroll-mt-32">
                            <h2 className="font-cinzel text-3xl font-bold text-[#D4AF37] mb-6">II. O Propósito do Ritual (Para que usamos seus dados?)</h2>
                            <p className="mb-4">
                                Seus dados não são mercadoria. Eles são usados estritamente para:
                            </p>
                            <p className="mb-4">
                                <strong>A Forja e Entrega:</strong> Processar sua oferenda (pagamento) e enviar o produto manufaturado.
                            </p>
                            <p className="mb-4">
                                <strong>Proteção:</strong> Garantir a segurança do portal contra invasores e fraudes.
                            </p>
                            <p>
                                <strong>Comunicação:</strong> Enviar mensagens sobre o status da sua ordem ou, caso você permita, novidades de nosso grimório (newsletter).
                            </p>
                        </div>

                        <div id="compartilhamento" className="scroll-mt-32">
                            <h2 className="font-cinzel text-3xl font-bold text-[#D4AF37] mb-6">III. O Compartilhamento com os Mensageiros</h2>
                            <p className="mb-4">
                                A Serpente não caminha sozinha. Para que o ritual se complete, compartilhamos fragmentos de seus dados com:
                            </p>
                            <p className="mb-4">
                                <strong>Intermediadores de Pagamento:</strong> Para validar sua oferenda de forma segura.
                            </p>
                            <p className="mb-4">
                                <strong>Empresas de Logística:</strong> Transportadoras e Correios recebem seu nome e endereço para realizar a entrega física.
                            </p>
                            <p>
                                <strong>Autoridades Legais:</strong> Caso sejamos convocados por leis do mundo material a prestar contas fiscais ou judiciais.
                            </p>
                        </div>

                        <div id="protecao" className="scroll-mt-32">
                            <h2 className="font-cinzel text-3xl font-bold text-[#D4AF37] mb-6">IV. A Proteção do Covil (Segurança)</h2>
                            <p>
                                Utilizamos proteções de alta magia digital (Criptografia SSL) para garantir que suas informações não sejam interceptadas por entidades mal-intencionadas. Seus dados de pagamento (cartões) são processados em ambiente seguro e não ficam armazenados em nossos caldeirões.
                            </p>
                        </div>

                        <div id="direitos" className="scroll-mt-32">
                            <h2 className="font-cinzel text-3xl font-bold text-[#D4AF37] mb-6">V. Os Direitos do Iniciado (Seus Direitos LGPD)</h2>
                            <p className="mb-4">
                                Como dono de sua própria essência, você detém os seguintes poderes sobre seus dados:
                            </p>
                            <p className="mb-4">
                                <strong>Acesso e Correção:</strong> Você pode solicitar ver o que sabemos sobre você e corrigir o que estiver incerto.
                            </p>
                            <p className="mb-4">
                                <strong>Revogação:</strong> Você pode pedir a destruição de seus dados de nossa base, desde que não tenhamos a obrigação legal de guardá-los (como para fins fiscais).
                            </p>
                            <p>
                                <strong>Oposição:</strong> Você pode silenciar nossas comunicações de marketing a qualquer momento.
                            </p>
                        </div>

                        <div id="alteracoes" className="scroll-mt-32">
                            <h2 className="font-cinzel text-3xl font-bold text-[#D4AF37] mb-6">VI. Alterações no Ritual</h2>
                            <p>
                                O véu pode mudar conforme novas leis surjam ou novos rituais sejam criados. Recomendamos que visite esta página periodicamente para manter-se ciente de como suas informações são protegidas.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}
