"use client"

import { useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck
} from "lucide-react"

import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { Button } from "@components/ui/button"
import { Checkbox } from "@components/ui/checkbox"
import { signup } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Componente de Registro - Segredos da Serpente
 * Integração: Medusa v2 + Next.js 15 (React 19)
 */
const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // React 19 Action State para lidar com o retorno da Server Action
  const [errorMessage, formAction] = useActionState(signup, null)

  return (
    <div className="w-full animate-in fade-in duration-500">
      <form action={formAction} className="space-y-4">
        {errorMessage && (
          <div className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 p-3 rounded-md font-body flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-rose-500" />
            {errorMessage}
          </div>
        )}

        {/* Nome e Sobrenome */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-xs uppercase tracking-widest text-secondary/80">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="first_name"
                name="first_name"
                placeholder="Aura"
                className="pl-10 bg-background/40 border-white/10 focus:border-secondary/40 transition-all font-body"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-xs uppercase tracking-widest text-secondary/80">Sobrenome</Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Serpente"
              className="bg-background/40 border-white/10 focus:border-secondary/40 transition-all font-body"
              required
            />
          </div>
        </div>

        {/* E-mail */}
        <div className="space-y-2">
          <Label htmlFor="register-email" className="text-xs uppercase tracking-widest text-secondary/80">E-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="register-email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-10 bg-background/40 border-white/10 focus:border-secondary/40 font-body"
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs uppercase tracking-widest text-secondary/80">Telefone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              className="pl-10 bg-background/40 border-white/10 focus:border-secondary/40 font-body"
            />
          </div>
        </div>

        {/* Senha */}
        <div className="space-y-2">
          <Label htmlFor="register-password" className="text-xs uppercase tracking-widest text-secondary/80">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              className="pl-10 pr-10 bg-background/40 border-white/10 focus:border-secondary/40 font-body"
              required
              minLength={8}
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

        {/* Termos e Newsletter */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start space-x-2 group">
            <Checkbox id="terms" name="terms" required className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
            <label htmlFor="terms" className="text-[11px] text-muted-foreground leading-tight cursor-pointer group-hover:text-foreground transition-colors font-body">
              Concordo com os{" "}
              <LocalizedClientLink href="/terms" className="text-secondary hover:underline underline-offset-2">Termos de Uso</LocalizedClientLink> e a{" "}
              <LocalizedClientLink href="/privacy" className="text-secondary hover:underline underline-offset-2">Política de Privacidade</LocalizedClientLink>.
            </label>
          </div>

          <div className="flex items-start space-x-2 group">
            <Checkbox id="newsletter" name="newsletter" className="mt-1 border-white/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" />
            <label htmlFor="newsletter" className="text-[11px] text-muted-foreground leading-tight cursor-pointer group-hover:text-foreground transition-colors font-body">
              Desejo receber revelações, ofertas e novidades místicas por e-mail.
            </label>
          </div>
        </div>

        <SubmitButton />

        <p className="text-center text-[10px] text-muted-foreground/60 font-body flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="h-3 w-3" />
          Seus dados estão protegidos pela criptografia do Círculo.
        </p>
      </form>
    </div>
  )
}

/**
 * Sub-componente para gerenciar o estado de carregamento do formulário
 */
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] hover:brightness-110 text-black font-display font-bold tracking-widest h-12 mt-4 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all active:scale-[0.98]"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          Invocando Poderes...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Criar Conta <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </Button>
  )
}

export default Register