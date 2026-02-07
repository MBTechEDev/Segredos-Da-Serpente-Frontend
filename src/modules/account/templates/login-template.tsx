"use client"

import { Sparkles, MapPin, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import Login from "@modules/account/components/login"
import Register from "@modules/account/components/register"

/**
 * Template principal de Autenticação.
 * Gerencia a troca entre Login e Registro utilizando Tabs para uma UX moderna.
 */
const LoginTemplate = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-lg">

          {/* Cabeçalho de Boas-vindas */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-4">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm text-secondary font-mystical">Portal Místico</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-gradient-gold mb-2">
              Bem-vinda ao Círculo
            </h1>
            <p className="text-muted-foreground font-body">
              Acesse sua conta para revelar ofertas e segredos exclusivos.
            </p>
          </div>

          {/* Card Principal com Glassmorphism */}
          <div className="glass-dark rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-background/50 border border-white/5 p-1">
                <TabsTrigger
                  value="login"
                  className="font-display tracking-widest text-xs uppercase data-[state=active]:text-secondary transition-all"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="font-display tracking-widest text-xs uppercase data-[state=active]:text-secondary transition-all"
                >
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              {/* Conteúdo de Login */}
              <TabsContent value="login" className="mt-0 outline-none">
                <Login />
              </TabsContent>

              {/* Conteúdo de Registro */}
              <TabsContent value="register" className="mt-0 outline-none">
                <Register />
              </TabsContent>
            </Tabs>
          </div>

          {/* Benefícios do Membro */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center animate-in fade-in duration-1000 delay-300">
            {[
              { icon: Sparkles, text: "Ofertas Únicas" },
              { icon: MapPin, text: "Entrega Mística" },
              { icon: Lock, text: "Sigilo Total" },
            ].map((benefit, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center border border-secondary/10">
                  <benefit.icon className="h-4 w-4 text-secondary/70" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body font-medium">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginTemplate