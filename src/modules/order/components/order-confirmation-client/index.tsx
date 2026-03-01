"use client"

import { useEffect, useState } from "react"
import {
    CheckCircle2,
    Package,
    Truck,
    MapPin,
    Copy,
    Share2,
    ArrowRight,
    Star,
    Gift,
    Clock,
    ShoppingBag,
    Sparkles,
    QrCode,
} from "lucide-react"
import { Button } from "@components/ui/button"
// import { Badge } from "@components/ui/badge" // Commenting out if unused
import { Separator } from "@components/ui/separator"
import { Progress } from "@components/ui/progress"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"

type OrderConfirmationClientProps = {
    order: HttpTypes.StoreOrder
}

const OrderConfirmationClient = ({ order }: OrderConfirmationClientProps) => {
    const [showConfetti, setShowConfetti] = useState(true)

    // Mapping Medusa order data
    const orderId = order.display_id || order.id
    const orderDateObj = new Date(order.created_at)
    const date = orderDateObj.toLocaleDateString("pt-BR")
    const time = orderDateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

    const payment = order.payment_collections?.[0]?.payments?.[0]
    const paymentMethod = payment ? payment.provider_id.replace("pp_", "").toUpperCase() : "Cartão"
    const paymentDetails = payment?.data?.card_last4 ? `**** ${payment.data.card_last4}` : ""

    const isPix = payment?.data?.payment_method_id === "pix"
    const pixData = isPix ? {
        qr_code: payment?.data?.qr_code as string,
        qr_code_base64: payment?.data?.qr_code_base64 as string,
    } : null

    const [copiedPix, setCopiedPix] = useState(false)
    const handleCopyPix = () => {
        if (pixData?.qr_code) {
            navigator.clipboard.writeText(pixData.qr_code)
            setCopiedPix(true)
            setTimeout(() => setCopiedPix(false), 2000)
        }
    }

    const fulfillments = order.fulfillments || []
    // @ts-ignore - tracking_links may exist depending on the exact fulfillment data sent by the backend provider
    const trackingLink = fulfillments[0]?.labels?.[0]?.tracking_number || (fulfillments[0] as any)?.tracking_links?.[0]?.tracking_number
    const tracking = trackingLink || null

    const address = order.shipping_address

    useEffect(() => {
        // Esconder confetti após 3 segundos
        const timer = setTimeout(() => setShowConfetti(false), 3000)
        return () => clearTimeout(timer)
    }, [])

    const copyOrderId = () => {
        navigator.clipboard.writeText(orderId.toString())
    }

    const copyTracking = () => {
        navigator.clipboard.writeText(tracking)
    }

    return (
        <div className="bg-background relative overflow-hidden">
            {/* Confetti Animation */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-10%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                            }}
                        >
                            <Sparkles
                                className="text-secondary"
                                style={{
                                    width: `${10 + Math.random() * 20}px`,
                                    opacity: 0.6 + Math.random() * 0.4,
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Success Header */}
                    <div className="text-center mb-8 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 mb-4">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                        <h1 className="font-display text-3xl md:text-4xl text-gradient-gold mb-2">
                            {isPix ? "Pedido Reservado!" : "Pedido Confirmado!"}
                        </h1>
                        <p className="text-muted-foreground">
                            {isPix
                                ? "Obrigada por comprar conosco. Aguardando a aprovação do PIX para liberar o envio."
                                : "Obrigada por comprar conosco. Seu pedido foi processado com sucesso."}
                        </p>
                    </div>

                    {/* Order Summary Card */}
                    <div className="glass-card rounded-2xl p-6 md:p-8 border border-green-500/30 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg font-display text-foreground">Pedido #{orderId}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={copyOrderId}
                                    >
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Realizado em {date} às {time}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Compartilhar
                                </Button>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                                {[
                                    { icon: CheckCircle2, label: isPix ? "Reservado" : "Confirmado", active: true, done: true },
                                    { icon: Package, label: "Preparando", active: false, done: false },
                                    { icon: Truck, label: "Enviado", active: false, done: false },
                                    { icon: MapPin, label: "Entregue", active: false, done: false },
                                ].map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${step.done
                                                ? "bg-green-500 text-white"
                                                : step.active
                                                    ? "bg-secondary text-secondary-foreground"
                                                    : "bg-muted text-muted-foreground"
                                                }`}
                                        >
                                            <step.icon className="h-5 w-5" />
                                        </div>
                                        <span
                                            className={`text-xs ${step.done || step.active ? "text-foreground" : "text-muted-foreground"
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Progress value={25} className="h-1 bg-muted">
                                <div className="h-full bg-green-500 w-1/4 rounded-full" />
                            </Progress>
                        </div>

                        {/* PIX Payment Panel */}
                        {isPix && pixData && pixData.qr_code_base64 && (
                            <div className="mb-8 p-6 bg-secondary/10 border border-secondary/30 rounded-xl flex flex-col items-center animate-in fade-in duration-500 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                                <h3 className="text-secondary font-display uppercase tracking-widest text-lg mb-4 text-center">
                                    Pague agora via PIX
                                </h3>
                                <p className="text-ui-fg-subtle text-sm text-center mb-6 max-w-md">
                                    Escaneie o QR Code abaixo com o aplicativo do seu banco ou copie a chave para finalizar a compra do seu pedido.
                                </p>
                                <div className="relative p-2 bg-white rounded-xl mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                                    <img
                                        src={`data:image/jpeg;base64,${pixData.qr_code_base64}`}
                                        alt="PIX QR Code"
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>
                                <div className="w-full max-w-md bg-background/80 border border-border/50 p-3 rounded-md flex flex-col sm:flex-row justify-between items-center gap-3">
                                    <span className="text-xs text-ui-fg-muted font-mono truncate w-full sm:w-auto overflow-hidden text-center sm:text-left select-all">{pixData.qr_code}</span>
                                    <Button
                                        onClick={handleCopyPix}
                                        variant="secondary"
                                        size="sm"
                                        className="shrink-0 text-[10px] sm:text-xs uppercase tracking-widest font-bold w-full sm:w-auto"
                                    >
                                        {copiedPix ? <CheckCircle2 size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                                        {copiedPix ? "Copiado!" : "Copiar"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Delivery Info */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-muted/30 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Truck className="h-5 w-5 text-secondary" />
                                    <span className="font-medium text-foreground">Previsão de Entrega</span>
                                </div>
                                <p className="text-lg font-display text-secondary">A calcular</p>
                                {tracking ? (
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm text-muted-foreground">Código: {tracking}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={copyTracking}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="mt-2 text-sm text-muted-foreground italic">
                                        Código de rastreio em breve
                                    </div>
                                )}
                            </div>

                            {address && (
                                <div className="bg-muted/30 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin className="h-5 w-5 text-secondary" />
                                        <span className="font-medium text-foreground">Endereço de Entrega</span>
                                    </div>
                                    <p className="text-sm text-foreground">
                                        {address.first_name} {address.last_name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {address.address_1}
                                        {address.address_2 ? `, ${address.address_2}` : ""}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {address.city} - {address.province}
                                    </p>
                                    <p className="text-sm text-muted-foreground">CEP: {address.postal_code}</p>
                                </div>
                            )}
                        </div>

                        <Separator className="my-6" />

                        {/* Order Items */}
                        <div className="mb-6">
                            <h3 className="font-medium text-foreground mb-4">Itens do Pedido</h3>
                            <div className="space-y-3">
                                {order.items?.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 bg-muted/30 rounded-lg p-3"
                                    >
                                        <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.thumbnail || "/placeholder.svg"}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-foreground truncate">{item.product_title || item.title}</h4>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {item.variant_title} • Qtd: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-medium text-foreground">
                                            {convertToLocale({
                                                amount: item.unit_price * item.quantity,
                                                currency_code: order.currency_code,
                                            })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-muted/30 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-foreground">
                                    {convertToLocale({ amount: order.item_subtotal || 0, currency_code: order.currency_code })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-muted-foreground">Frete</span>
                                <span className="text-green-400">
                                    {order.shipping_total === 0
                                        ? "Grátis"
                                        : convertToLocale({ amount: order.shipping_total || 0, currency_code: order.currency_code })}
                                </span>
                            </div>
                            {!!order.discount_total && (
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-muted-foreground">Desconto</span>
                                    <span className="text-green-400">
                                        - {convertToLocale({ amount: order.discount_total || 0, currency_code: order.currency_code })}
                                    </span>
                                </div>
                            )}
                            {!!order.tax_total && (
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-muted-foreground">Taxas</span>
                                    <span className="text-muted-foreground">
                                        {convertToLocale({ amount: order.tax_total || 0, currency_code: order.currency_code })}
                                    </span>
                                </div>
                            )}
                            <Separator className="my-3" />
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-foreground">Total</span>
                                <span className="text-xl font-display text-secondary">
                                    {convertToLocale({ amount: order.total || 0, currency_code: order.currency_code })}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Pago via {paymentMethod} {paymentDetails}
                            </p>
                        </div>
                    </div>


                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                            <LocalizedClientLink href="/account/orders">
                                <Package className="h-4 w-4 mr-2" />
                                Acompanhar Pedido
                            </LocalizedClientLink>
                        </Button>
                        <Button variant="outline" asChild>
                            <LocalizedClientLink href="/store">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Continuar Comprando
                            </LocalizedClientLink>
                        </Button>
                    </div>


                </div>
            </main>
        </div>
    )
}

export default OrderConfirmationClient
