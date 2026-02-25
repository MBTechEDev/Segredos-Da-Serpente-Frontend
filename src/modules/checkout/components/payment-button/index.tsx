"use client"

import { isManual, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState, useEffect } from "react"
import { retrieveCart } from "@lib/data/cart"
import { Copy, CheckCircle2, Loader2 } from "lucide-react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  // Pega a sessão que está pendente ou precisando de mais dados (usado pelo MP)
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending" || s.status === "requires_more"
  )

  switch (true) {
    case paymentSession?.provider_id === "pp_mercadopago_mercadopago":
      return (
        <MercadoPagoPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return (
        <Button
          disabled
          className="w-full h-12 text-base uppercase tracking-widest font-display opacity-50"
        >
          Selecione um método de pagamento
        </Button>
      )
  }
}

// -------------------------------------------------------------
// O NOVO BOTÃO EXCLUSIVO DO MERCADO PAGO
// -------------------------------------------------------------
const MercadoPagoPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string } | null>(null)

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    try {
      // O placeOrder é uma Server Action do Next.js.
      // Em caso de sucesso de cartão de crédito, ela faz um "redirect" (o que lança um erro interno NEXT_REDIRECT).
      // Se a sessão for PIX, ela cria a intenção de PIX e retorna o "cart" com status "requires_more" ou "pending".
      const result = await placeOrder()

      // Se o código chegou aqui sem lançar NEXT_REDIRECT, significa que o pagamento falhou,
      // ou que precisa de mais validação (como pagar o código PIX).
      if (result) {
        const mpSession = result.payment_collection?.payment_sessions?.find(
          (s: any) => s.provider_id === "pp_mercadopago_mercadopago"
        )

        // Verifica se é PIX e temos o QRCode gerado!
        if (
          mpSession?.data?.payment_method_id === "pix" &&
          mpSession?.data?.qr_code_base64
        ) {
          setPixData({
            qr_code: mpSession.data.qr_code as string,
            qr_code_base64: mpSession.data.qr_code_base64 as string,
          })
          setSubmitting(false)
          return // Exibe o Painel PIX no lugar do botão, interrompendo o fluxo de erro!
        }

        setErrorMessage("Pagamento recusado. Verifique os dados do cartão, o saldo e o limite.")
      }
    } catch (err: any) {
      if (err.message && err.message.includes("NEXT_REDIRECT")) {
        throw err
      }
      setErrorMessage(err.message || "Ocorreu um erro de comunicação com o provedor.")
    } finally {
      if (!pixData) {
        setSubmitting(false)
      }
    }
  }

  if (pixData) {
    return <PixQRCodePanel pixData={pixData} cartId={cart.id!} />
  }

  return (
    <>
      <Button
        disabled={notReady}
        className="w-full cta-primary h-12 text-base uppercase tracking-widest font-display"
        size="large"
        onClick={handlePayment}
        isLoading={submitting}
        data-testid={dataTestId}
      >
        FINALIZAR PEDIDO
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="mp-payment-error-message"
      />
    </>
  )
}

// -------------------------------------------------------------
// PAINEL DE QR CODE PARA PIX - POLLING E EXIBIÇÃO
// -------------------------------------------------------------
function PixQRCodePanel({ pixData, cartId }: { pixData: { qr_code: string; qr_code_base64: string }; cartId: string }) {
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<"pending" | "authorized" | "error">("pending")

  const handleCopy = () => {
    navigator.clipboard.writeText(pixData.qr_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    const checkStatus = async () => {
      try {
        const cart = await retrieveCart(cartId)
        const session = cart?.payment_collection?.payment_sessions?.find(
          (s: any) => s.provider_id === "pp_mercadopago_mercadopago"
        )

        // Se o MPWebhook confirmou o pagamento, o status da session vai para authorized
        const isAuthorized = session?.status === "authorized" || session?.data?.status === "approved"

        if (isAuthorized) {
          setStatus("authorized")
          clearInterval(interval)

          // Pagamento confirmado. Reenviamos o `placeOrder` paramos seguir pro "Order Confirmation Payload"
          await placeOrder()
        }
      } catch (error) {
        console.error("Erro ao verificar status do PIX", error)
      }
    }

    interval = setInterval(checkStatus, 5000) // Poll a cada 5s
    return () => clearInterval(interval)
  }, [cartId])

  return (
    <div className="flex flex-col items-center p-6 bg-background/40 border border-secondary/50 rounded-lg animate-in fade-in zoom-in duration-500 mt-4">
      <h3 className="text-secondary font-display uppercase tracking-widest text-lg mb-4 text-center">
        Escaneie o QR Code
      </h3>
      <p className="text-ui-fg-subtle text-sm text-center mb-6">
        Para finalizar sua compra, abra o app do seu banco e escaneie o código abaixo. Estamos aguardando a confirmação automática do pagamento...
      </p>

      <div className="relative p-2 bg-white rounded-xl mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
        <img
          src={`data:image/jpeg;base64,${pixData.qr_code_base64}`}
          alt="PIX QR Code"
          className="w-48 h-48 object-contain"
        />
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="bg-background/80 border border-border/50 p-3 rounded-md flex pl-4 justify-between items-center gap-3">
          <span className="text-xs text-ui-fg-muted font-mono truncate select-all">{pixData.qr_code}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 text-secondary hover:text-secondary/80 focus:outline-none flex items-center gap-1 text-[10px] sm:text-xs uppercase tracking-widest font-bold bg-secondary/10 px-3 py-2 rounded-md"
          >
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            <span className="hidden sm:inline">{copied ? "Copiado!" : "Copiar"}</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 text-sm text-ui-fg-base italic font-body pt-2">
          {status === "authorized" ? (
            <>
              <CheckCircle2 className="text-green-500 animate-in zoom-in" size={20} />
              <span className="text-green-500 font-bold">Pagamento Aprovado! Redirecionando...</span>
            </>
          ) : (
            <>
              <Loader2 className="animate-spin text-secondary opacity-70" size={20} />
              Aguardando confirmação...
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// BOTÕES ORIGINAIS DO MEDUSA (STRIPE E MANUAL) MANTIDOS INTACTOS
// -------------------------------------------------------------

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
        className="w-full cta-primary h-12 text-base uppercase tracking-widest font-display"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
        className="w-full cta-primary h-12 text-base uppercase tracking-widest font-display"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton