"use client"

import React, { useState } from "react"
import { Button } from "@components/ui/button"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"
import { resetPasswordRequest } from "@lib/data/customer"

const ProfilePassword = ({ email }: { email?: string }) => {
  const [isSending, setIsSending] = useState(false)

  const handleResetRequest = async () => {
    if (!email) return

    setIsSending(true)
    try {
      await resetPasswordRequest(email)
      toast.success("Um corvo foi enviado ao seu e-mail com as instruções para a nova chave!")
    } catch (error: any) {
      toast.error(error.toString())
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