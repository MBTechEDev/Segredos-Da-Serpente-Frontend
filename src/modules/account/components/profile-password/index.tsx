"use client"

import React, { useState } from "react"
import { Button } from "@components/ui/button"
import { toast } from "sonner"
import { Loader2, Send } from "lucide-react"
// Importamos a função de reset (ajuste o caminho conforme sua lib)
// Se não tiver, podemos usar o fetch direto para o endpoint de auth
import { sdk } from "@lib/config"

const ProfilePassword = ({ email }: { email?: string }) => {
  const [isSending, setIsSending] = useState(false)

  const handleResetRequest = async () => {
    if (!email) return

    setIsSending(true)
    try {
      // No Medusa v2, solicitamos o reset via auth provider
      await sdk.client.fetch(`/store/auth/emailpass/reset-password/token`, {
        method: "POST",
        body: { email }
      })

      toast.success("Um corvo foi enviado ao seu e-mail com as instruções para a nova chave!")
    } catch (error) {
      // Mesmo se falhar, por segurança, avisamos que se o e-mail existir, receberá o link
      toast.info("Se o seu e-mail estiver em nossos registros, você receberá um link de redefinição.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border border-gold/10 rounded-xl bg-background/40">
      <div>
        <p className="font-body text-emerald-50 font-medium">Chave de Acesso (Senha)</p>
        <p className="text-sm text-emerald-100/50">
          Por segurança, a troca de senha é feita através de um link de verificação enviado ao seu e-mail.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={handleResetRequest}
        disabled={isSending}
        className="border-gold/30 text-gold hover:bg-gold/10 transition-all min-w-[160px]"
      >
        {isSending ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Solicitar Reset
          </>
        )}
      </Button>
    </div>
  )
}

export default ProfilePassword