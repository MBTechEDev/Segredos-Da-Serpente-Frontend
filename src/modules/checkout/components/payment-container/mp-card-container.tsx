"use client"

import { useEffect, useState, useMemo } from "react"
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react"
import { initiatePaymentSession } from "@lib/data/cart"

type MPCardContainerProps = {
    cart: any
    setCardComplete: (complete: boolean) => void
    setError: (error: string | null) => void
    setCardBrand: (brand: string) => void
    onSuccess: () => void
}

export default function MPCardContainer({
    cart,
    setCardComplete,
    setError,
    setCardBrand,
    onSuccess
}: MPCardContainerProps) {
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
        if (publicKey) {
            initMercadoPago(publicKey, { locale: "pt-BR" })
        } else {
            setError("Chave pública do Mercado Pago não configurada.")
        }
    }, [setError])

    const initialization = useMemo(() => {
        return {
            amount: cart?.total || 0,
            payer: {
                email: cart?.email || "",
            },
        }
    }, [cart?.total, cart?.email])

    // Configuração Visual com cores HEX exatas do seu globals.css
    const customization = useMemo(() => {
        return {
            visual: {
                font: "Cinzel, sans-serif", // A fonte do seu site
                style: {
                    theme: "bootstrap" as const, // OBRIGATÓRIO: É este tema que ativa o "Floating Label" no Mercado Pago
                    customVariables: {
                        // --- FUNDOS ---
                        formBackgroundColor: "transparent",
                        inputBackgroundColor: "#080c0a", // Conversão exata de: hsl(var(--background) -> 160 20% 4%)

                        // --- CORES DE DESTAQUE ---
                        baseColor: "#d69e26", // Conversão exata de: hsl(var(--secondary) -> 38 70% 50%)
                        errorColor: "#c32222", // Erro (var(--destructive))

                        // --- TIPOGRAFIA DO FLOATING LABEL ---
                        textPrimaryColor: "#ebe7d9", // Cor do texto digitado (var(--foreground))
                        textSecondaryColor: "#808f8a", // Cor do label flutuante (var(--muted-foreground))

                        // --- BORDAS (Idênticas ao seu Input) ---
                        outlinePrimaryColor: "#27342f", // Borda inativa (var(--border))
                        outlineSecondaryColor: "#d69e26", // Borda acesa (var(--secondary))

                        // --- BOTÃO (Mimetizando o .cta-primary) ---
                        buttonTextColor: "#080c0a", // text-secondary-foreground

                        // --- ESTRUTURA E TAMANHOS ---
                        borderRadiusMedium: "8px", // Equivale ao rounded-md do Tailwind
                        formPadding: "0px", // Remove espaçamentos extras do iframe
                    }
                },
                texts: {
                    formSubmit: "CONTINUAR",
                },
            },
            paymentMethods: {
                maxInstallments: 12,
            }
        }
    }, [])

    const onSubmit = async (formData: any) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                setError(null)

                await initiatePaymentSession(cart, {
                    provider_id: "pp_mercadopago_mercadopago",
                    data: {
                        token: formData.token,
                        payment_method_id: formData.payment_method_id,
                        issuer_id: formData.issuer_id,
                        installments: formData.installments,
                        payer: formData.payer
                    }
                })

                setCardComplete(true)
                setCardBrand(formData.payment_method_id)

                resolve()
                onSuccess()
            } catch (err: any) {
                setError(err.message || "Erro ao processar os dados do cartão.")
                reject()
            }
        })
    }

    const onError = async (error: any) => {
        console.error(error)
        setError("Erro na renderização do formulário de pagamento.")
    }

    const onReady = async () => {
        setIsReady(true)
    }

    return (
        <div className="w-full font-body [&>div]:!p-0 [&>div]:!bg-transparent">
            <CardPayment
                initialization={initialization}
                customization={customization}
                onSubmit={onSubmit}
                onReady={onReady}
                onError={onError}
            />
        </div>
    )
}