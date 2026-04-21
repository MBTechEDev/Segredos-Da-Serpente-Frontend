"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight
} from "lucide-react"
import { login } from "@lib/data/admin"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { Button } from "@components/ui/button"

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, formAction] = useActionState(login, null)

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <form action={formAction} className="space-y-5">
                {/* Mensagem de Erro Vinda do Servidor */}
                {errorMessage && (
                    <div className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-3 rounded-md font-body flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />
                        {errorMessage}
                    </div>
                )}
                <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className="text-xs uppercase tracking-[0.2em] text-secondary/80 font-display"
                    >
                        E-mail
                    </Label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-10 bg-background/40 border-white/10 focus:border-secondary/40 transition-all font-body text-white"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label
                            htmlFor="password"
                            className="text-xs uppercase tracking-[0.2em] text-secondary/80 font-display"
                        >
                            Senha
                        </Label>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 bg-background/40 border-white/10 focus:border-secondary/40 font-body text-white"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <SubmitButton />
            </form>
        </div>
    )
}


function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] hover:brightness-110 text-black font-display font-bold tracking-[0.2em] uppercase h-12 mt-6 shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all active:scale-[0.98]"
        >
            {pending ? (
                <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Validando...
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    Entrar no Santuario <ArrowRight className="h-4 w-4" />
                </span>
            )}
        </Button>
    )
}


export default AdminLogin
