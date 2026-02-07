"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck
} from "lucide-react"

import { login } from "@lib/data/customer"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { Button } from "@components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Componente de Login - Segredos da Serpente
 * Focado em: Performance (Server Actions) e Estética Dark Mystical
 */
const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  // React 19: useActionState para gerenciar o retorno da Server Action do Medusa
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

        {/* Campo de E-mail */}
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
              className="pl-10 bg-background/40 border-white/10 focus:border-secondary/40 transition-all font-body"
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Campo de Senha */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-xs uppercase tracking-[0.2em] text-secondary/80 font-display"
            >
              Senha
            </Label>
            <LocalizedClientLink
              href="/account/forgot-password"
              className="text-[10px] uppercase tracking-wider text-secondary/60 hover:text-secondary transition-colors"
            >
              Esqueceu o segredo?
            </LocalizedClientLink>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 bg-background/40 border-white/10 focus:border-secondary/40 font-body"
              required
              autoComplete="current-password"
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

        {/* Botão de Submissão com Estado de Carregamento */}
        <SubmitButton />

        {/* Separador Visual */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
            <span className="bg-[#0a0a0a] px-4 text-muted-foreground/50">Ou continue com</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            type="button"
            className="border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all font-display text-[10px] uppercase tracking-widest"
          >
            Google
          </Button>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 font-body flex items-center justify-center gap-1.5 pt-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          Acesso seguro via Círculo Segredos da Serpente.
        </p>
      </form>
    </div>
  )
}

/**
 * Botão de submissão isolado para utilizar o useFormStatus do react-dom
 */
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
          Entrar no Círculo <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </Button>
  )
}

export default Login