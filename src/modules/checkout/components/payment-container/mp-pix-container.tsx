"use client"

import { useEffect, useRef } from "react"
import { initiatePaymentSession } from "@lib/data/cart"
import { initMercadoPago, getIdentificationTypes } from "@mercadopago/sdk-react"
import Input from "@modules/common/components/input"
import NativeSelect from "@modules/common/components/native-select"

type MPPixContainerProps = {
    cart: any
    setPixComplete: (complete: boolean) => void
    setError: (error: string | null) => void
    onSuccess: () => void
}

export default function MPPixContainer({
    cart,
    setPixComplete,
    setError,
    onSuccess
}: MPPixContainerProps) {
    const isMounted = useRef(false)

    useEffect(() => {
        if (isMounted.current) return
        isMounted.current = true

        const initMP = async () => {
            try {
                const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
                if (!publicKey) {
                    setError("Chave pública do Mercado Pago não configurada.")
                    return
                }

                if (!(window as any).__MERCADOPAGO_INITIALIZED__) {
                    initMercadoPago(publicKey, { locale: "pt-BR" })
                        ; (window as any).__MERCADOPAGO_INITIALIZED__ = true
                }

                // Injeta manualmente o script da SDK V2 (pois initMercadoPago do React SDK não o faz no modo headless)
                await new Promise<void>((resolve, reject) => {
                    if ((window as any).MercadoPago) {
                        return resolve()
                    }

                    let script = document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]') as HTMLScriptElement
                    if (!script) {
                        script = document.createElement('script')
                        script.src = "https://sdk.mercadopago.com/js/v2"
                        script.async = true
                        document.body.appendChild(script)
                    }

                    const onScriptLoad = () => resolve()
                    const onScriptError = () => reject(new Error("Failed to load MercadoPago SDK script"))

                    script.addEventListener('load', onScriptLoad)
                    script.addEventListener('error', onScriptError)

                    const fallbackCheck = setInterval(() => {
                        if ((window as any).MercadoPago) {
                            clearInterval(fallbackCheck)
                            resolve()
                        }
                    }, 100)
                })

                // Injeta script de security para geração do device_id
                if (!document.querySelector('script[src="https://www.mercadopago.com/v2/security.js"]')) {
                    const securityScript = document.createElement('script')
                    securityScript.src = "https://www.mercadopago.com/v2/security.js"
                    securityScript.setAttribute('view', 'checkout')
                    securityScript.async = true
                    document.body.appendChild(securityScript)
                }


                const mp = new (window as any).MercadoPago(publicKey, { locale: "pt-BR" })

                if (!isMounted.current) return

                const fetchIdentificationTypes = async () => {
                    try {
                        const identificationTypes = await getIdentificationTypes()
                        const identificationTypeElement = document.getElementById('form-checkout-pix__identificationType') as HTMLSelectElement

                        if (identificationTypeElement && identificationTypes) {
                            createSelectOptions(identificationTypeElement, identificationTypes)
                        }
                    } catch (e) {
                        return console.error('Error getting identificationTypes: ', e)
                    }
                }

                fetchIdentificationTypes()

                // Finalizando Instrução: Enviando dados e validando
                const formElement = document.getElementById('form-checkout-pix') as HTMLFormElement

                const processPix = async (event: Event) => {
                    event.preventDefault()
                    try {
                        const firstNameEl = document.getElementById('form-checkout-pix__payerFirstName') as HTMLInputElement
                        const lastNameEl = document.getElementById('form-checkout-pix__payerLastName') as HTMLInputElement
                        const emailEl = document.getElementById('form-checkout-pix__email') as HTMLInputElement
                        const identificationTypeEl = document.getElementById('form-checkout-pix__identificationType') as HTMLSelectElement
                        const identificationNumberEl = document.getElementById('form-checkout-pix__identificationNumber') as HTMLInputElement

                        const firstName = firstNameEl.value.trim()
                        const lastName = lastNameEl.value.trim()
                        const docNumber = identificationNumberEl.value.replace(/\D/g, "")

                        if (!firstName || !lastName) {
                            throw new Error("Por favor, preencha o nome e sobrenome.")
                        }
                        if (!docNumber) {
                            throw new Error("Por favor, informe o número do documento.")
                        }

                        // Integração Next.js Seguro: prosseguimos no State
                        setError(null)

                        const payload = {
                            provider_id: "pp_mercadopago_mercadopago",
                            data: {
                                payment_method_id: "pix",
                                device_id: (window as any).MP_DEVICE_SESSION_ID || undefined,
                                payer: {
                                    email: emailEl.value.trim(),
                                    first_name: firstName,
                                    last_name: lastName,
                                    identification: {
                                        type: identificationTypeEl.value,
                                        number: docNumber
                                    },
                                    address: cart?.shipping_address ? {
                                        zip_code: cart.shipping_address.postal_code,
                                        street_name: cart.shipping_address.address_1,
                                        street_number: cart.shipping_address.address_2 || "S/N",
                                        city: cart.shipping_address.city,
                                        federal_unit: cart.shipping_address.province
                                    } : undefined
                                }
                            }
                        }

                        console.log("[MercadoPago Pix] Sending Payload:", JSON.stringify(payload, null, 2))

                        await initiatePaymentSession(cart, payload)

                        setPixComplete(true)
                        onSuccess()

                    } catch (e: any) {
                        console.error('error processing pix: ', e)
                        const errorMessage = e?.message || "Erro ao processar o formulário. Verifique os dados inseridos."
                        setError(errorMessage)
                    }
                }

                    // Salvar referência globalmente para o cleanup
                    ; (window as any).__mpPixSubmitCallback = processPix
                    ; (window as any).__mpPixFormElement = formElement
                if (formElement) formElement.addEventListener('submit', processPix)

            } catch (error) {
                console.error("SDK Load Error:", error)
                setError("Não foi possível carregar o módulo de pagamento.")
            }
        }

        initMP()

        return () => {
            const formElement = (window as any).__mpPixFormElement
            const submitCallback = (window as any).__mpPixSubmitCallback
            if (formElement && submitCallback) {
                formElement.removeEventListener('submit', submitCallback)
            }
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const createSelectOptions = (elem: HTMLSelectElement, options: any[], labelsAndKeys = { label: "name", value: "id" }) => {
        const { label, value } = labelsAndKeys

        elem.options.length = 0

        const tempOptions = document.createDocumentFragment()

        options.forEach(option => {
            const optValue = option[value]
            const optLabel = option[label]

            const opt = document.createElement('option')
            opt.value = optValue
            opt.textContent = optLabel
            opt.className = "bg-background text-foreground"

            tempOptions.appendChild(opt)
        })

        elem.appendChild(tempOptions)
    }

    const inputClasses = "w-full min-h-[44px] px-3 py-2 bg-[#080c0a]/50 border border-[#27342f] text-[#ebe7d9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#d69e26] focus:border-[#d69e26] transition-all duration-300 placeholder:text-[#808f8a]"
    const labelClasses = "block text-sm font-medium text-[#ebe7d9] mb-1.5"

    return (
        <form id="form-checkout-pix" action="/process_payment" method="POST" className="w-full flex flex-col gap-5 font-body bg-transparent">

            <div className="grid grid-cols-2 gap-4">
                <Input name="form-checkout-pix__payerFirstName" label="Nome" required />
                <Input name="form-checkout-pix__payerLastName" label="Sobrenome" required />
            </div>

            <Input type="email" name="form-checkout-pix__email" label="E-mail" defaultValue={cart?.email || ""} required />

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <NativeSelect id="form-checkout-pix__identificationType" name="identificationType" defaultValue="" required placeholder="Tipo Documento" />
                </div>
                <Input name="form-checkout-pix__identificationNumber" label="Número do doc." required />
            </div>

            <div className="pt-2">
                <input type="hidden" name="transactionAmount" id="transactionAmountPix" value={cart?.total ? (cart.total / 100).toString() : ""} />
                <button type="submit" className="w-full bg-[#d69e26] hover:bg-[#b5851f] text-[#080c0a] font-display uppercase tracking-widest py-3 px-4 rounded-md font-semibold transition-colors duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    Pagar com Pix
                </button>
            </div>
        </form>
    )
}
