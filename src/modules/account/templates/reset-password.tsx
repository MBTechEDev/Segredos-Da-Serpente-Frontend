"use client"

import { useState, useEffect } from "react"
import { Input } from "@components/ui/input"
import { Button } from "@components/ui/button"
import { useFormState } from "react-dom"
import { resetPassword } from "@lib/data/customer"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { useSearchParams, useRouter, useParams } from "next/navigation"

type ResetPasswordTemplateProps = {
    email: string
}

export default function ResetPasswordTemplate({
    email,
}: ResetPasswordTemplateProps) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const params = useParams()
    const countryCode = params.countryCode as string

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [token, setToken] = useState("")
    const [countdown, setCountdown] = useState(5)

    // Obtemos o token da URL no lado do cliente
    useEffect(() => {
        const t = searchParams.get("token")
        if (t) setToken(t)
    }, [searchParams])

    const [state, formAction] = useFormState(resetPassword, null)

    // Efeito para o contador e redirecionamento de sucesso
    useEffect(() => {
        if (state?.success) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        router.push(`/${countryCode}/store`)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [state?.success, router, countryCode])

    const isMismatch = password !== confirmPassword && confirmPassword.length > 0
    const isInvalid = isMismatch || !password || password.length < 6 || !token

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full p-8 rounded-lg border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-3xl font-display uppercase tracking-widest bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent">
                        Nova Senha
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2 font-body text-center">
                        Defina sua nova credencial de acesso para <br />
                        <span className="text-white font-medium">{email}</span>
                    </p>
                </div>

                <form action={formAction} className="space-y-4">
                    {/* Campos ocultos para a Server Action */}
                    <input type="hidden" name="email" value={email} />
                    <input type="hidden" name="token" value={token} />

                    <div className="space-y-2">
                        <Input
                            type="password"
                            name="password"
                            placeholder="Nova Senha"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Input
                            type="password"
                            name="confirm_password"
                            placeholder="Confirmar Nova Senha"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white"
                        />
                    </div>

                    {isMismatch && (
                        <div className="flex items-center gap-2 text-red-400 text-xs mt-1 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle size={14} />
                            As senhas não coincidem.
                        </div>
                    )}

                    {!token && (
                        <div className="flex items-center gap-2 text-amber-400 text-xs mt-1">
                            <AlertCircle size={14} />
                            Token de segurança não encontrado na URL.
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isInvalid || state?.success}
                        className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-6 transition-all duration-300 disabled:opacity-50 disabled:grayscale"
                    >
                        ATUALIZAR SENHA
                    </Button>

                    {/* Feedback de Sucesso */}
                    {state?.success && (
                        <div className="mt-4 p-5 rounded bg-black/60 border border-emerald-500/30 flex flex-col gap-3 text-emerald-400 animate-in zoom-in-95 backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-0.5" />
                                <p className="text-sm font-medium leading-relaxed">
                                    Senha alterada. O véu foi refeito e o segredo é só seu. As sombras o chamam de volta; cruze o portal novamente.
                                </p>
                            </div>
                            <div className="flex flex-col gap-1 mt-2 border-t border-emerald-500/20 pt-3 text-center">
                                <p className="text-xs text-emerald-500/80">
                                    Aguarde... As correntes do destino estão guiando você de volta ao início. Redirecionando em instantes.
                                </p>
                                <p className="text-lg font-display tracking-widest font-bold text-center mt-2 bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent">
                                    {countdown}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Feedback de Erro */}
                    {typeof state === "string" && (
                        <div className="mt-4 p-4 rounded bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 animate-in shake-1">
                            <AlertCircle size={18} />
                            <p className="text-sm">{state}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}