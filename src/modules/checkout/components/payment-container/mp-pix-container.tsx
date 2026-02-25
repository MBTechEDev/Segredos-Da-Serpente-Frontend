"use client"

import { useEffect, useRef } from "react"
import { initiatePaymentSession } from "@lib/data/cart"
import { loadMercadoPago } from "@mercadopago/sdk-js"

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

                await loadMercadoPago()
                const mp = new (window as any).MercadoPago(publicKey, { locale: "pt-BR" })

                // Obter tipos de documentos
                const getIdentificationTypes = async () => {
                    try {
                        const identificationTypes = await mp.getIdentificationTypes()
                        const identificationTypeElement = document.getElementById('form-checkout-pix__identificationType') as HTMLSelectElement

                        if (identificationTypeElement) {
                            createSelectOptions(identificationTypeElement, identificationTypes)
                        }
                    } catch (e) {
                        return console.error('Error getting identificationTypes: ', e)
                    }
                }

                getIdentificationTypes()

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

                        // Integração Next.js Seguro: prosseguimos no State
                        setError(null)

                        await initiatePaymentSession(cart, {
                            provider_id: "pp_mercadopago_mercadopago",
                            data: {
                                payment_method_id: "pix",
                                payer: {
                                    email: emailEl.value,
                                    first_name: firstNameEl.value,
                                    last_name: lastNameEl.value,
                                    identification: {
                                        type: identificationTypeEl.value,
                                        number: identificationNumberEl.value
                                    }
                                }
                            }
                        })

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
                formElement.addEventListener('submit', processPix)

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

            tempOptions.appendChild(opt)
        })

        elem.appendChild(tempOptions)
    }

    const inputClasses = "w-full min-h-[44px] px-3 py-2 bg-[#080c0a]/50 border border-[#27342f] text-[#ebe7d9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#d69e26] focus:border-[#d69e26] transition-all duration-300 placeholder:text-[#808f8a]"
    const labelClasses = "block text-sm font-medium text-[#ebe7d9] mb-1.5"

    return (
        <form id="form-checkout-pix" action="/process_payment" method="POST" className="w-full flex flex-col gap-5 max-w-[600px] font-body bg-transparent">

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="form-checkout-pix__payerFirstName" className={labelClasses}>Nome</label>
                    <input type="text" id="form-checkout-pix__payerFirstName" name="payerFirstName" className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="form-checkout-pix__payerLastName" className={labelClasses}>Sobrenome</label>
                    <input type="text" id="form-checkout-pix__payerLastName" name="payerLastName" className={inputClasses} required />
                </div>
            </div>

            <div>
                <label htmlFor="form-checkout-pix__email" className={labelClasses}>E-mail</label>
                <input type="email" id="form-checkout-pix__email" name="email" className={inputClasses} required defaultValue={cart?.email || ""} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="form-checkout-pix__identificationType" className={labelClasses}>Tipo de doc.</label>
                    <select id="form-checkout-pix__identificationType" name="identificationType" className={inputClasses} defaultValue="" required>
                        <option value="" disabled>Carregando...</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="form-checkout-pix__identificationNumber" className={labelClasses}>Número do doc.</label>
                    <input type="text" id="form-checkout-pix__identificationNumber" name="identificationNumber" className={inputClasses} required />
                </div>
            </div>

            <div className="pt-2">
                <input type="hidden" name="transactionAmount" id="transactionAmountPix" value={cart?.total ? (cart.total / 100).toString() : "0"} />
                <button type="submit" className="w-full bg-[#d69e26] hover:bg-[#b5851f] text-[#080c0a] font-display uppercase tracking-widest py-3 px-4 rounded-md font-semibold transition-colors duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    Pagar com Pix
                </button>
            </div>
        </form>
    )
}
