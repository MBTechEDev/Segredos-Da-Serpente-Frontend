"use client"

import { useEffect, useRef } from "react"
import { initiatePaymentSession } from "@lib/data/cart"
import { initMercadoPago, getIdentificationTypes, getPaymentMethods, getIssuers, getInstallments } from "@mercadopago/sdk-react"

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

                const mp = new (window as any).MercadoPago(publicKey, { locale: "pt-BR" })

                if (!isMounted.current) return

                // Inicializar campos do cartão com estilos do tema
                const style = {
                    color: "#ebe7d9",
                    placeholderColor: "#808f8a",
                    fontSize: "14px",
                    fontFamily: "Inter, sans-serif"
                }

                const cardNumberElement = mp.fields.create('cardNumber', {
                    placeholder: "Número do cartão",
                    style
                }).mount('form-checkout__cardNumber')

                const expirationDateElement = mp.fields.create('expirationDate', {
                    placeholder: "MM/YY",
                    style
                }).mount('form-checkout__expirationDate')

                const securityCodeElement = mp.fields.create('securityCode', {
                    placeholder: "CVC",
                    style
                }).mount('form-checkout__securityCode')

                // Update PCI Fields
                const updatePCIFieldsSettings = (paymentMethod: any) => {
                    const { settings } = paymentMethod

                    const cardNumberSettings = settings[0].card_number
                    cardNumberElement.update({
                        settings: cardNumberSettings
                    })

                    const securityCodeSettings = settings[0].security_code
                    securityCodeElement.update({
                        settings: securityCodeSettings
                    })
                }

                // Handle bin change behavior
                const paymentMethodElement = document.getElementById('paymentMethodId') as HTMLInputElement
                const issuerElement = document.getElementById('form-checkout__issuer') as HTMLSelectElement
                const installmentsElement = document.getElementById('form-checkout__installments') as HTMLSelectElement

                const issuerPlaceholder = "Banco emissor"
                const installmentsPlaceholder = "Parcelas"

                let currentBin: string | undefined

                cardNumberElement.on('binChange', async (data: any) => {
                    const { bin } = data
                    try {
                        if (!bin && paymentMethodElement.value) {
                            clearSelectsAndSetPlaceholders(issuerElement, issuerPlaceholder, installmentsElement, installmentsPlaceholder)
                            paymentMethodElement.value = ""
                        }

                        if (bin && bin !== currentBin) {
                            const methods = await getPaymentMethods({ bin })
                            if (!methods || !methods.results || methods.results.length === 0) return
                            const paymentMethod = methods.results[0]

                            paymentMethodElement.value = paymentMethod.id
                            updatePCIFieldsSettings(paymentMethod)

                            // 5º Instrução: Atualizar emissor
                            updateIssuer(paymentMethod, bin)

                            // As próximas funções virão nas instruções 5 e 6:
                            updateInstallments(paymentMethod, bin)
                        }

                        currentBin = bin
                    } catch (e) {
                        console.error('error getting payment methods: ', e)
                    }
                })

                const fetchIssuers = async (paymentMethod: any, bin: string) => {
                    try {
                        const { id: paymentMethodId } = paymentMethod
                        const issuers = await getIssuers({ paymentMethodId, bin })
                        return issuers || []
                    } catch (e) {
                        console.error('error getting issuers: ', e)
                    }
                }

                const updateIssuer = async (paymentMethod: any, bin: string) => {
                    const { additional_info_needed, issuer } = paymentMethod
                    let issuerOptions = [issuer]

                    if (additional_info_needed.includes('issuer_id')) {
                        issuerOptions = await fetchIssuers(paymentMethod, bin) || []
                    }

                    createSelectOptions(issuerElement, issuerOptions)
                }

                const updateInstallments = async (paymentMethod: any, bin: string) => {
                    try {
                        const amountElement = document.getElementById('transactionAmount') as HTMLInputElement

                        console.log("Fetching installments for amount:", amountElement.value, "bin:", bin)

                        const installments = await getInstallments({
                            amount: amountElement.value,
                            bin,
                            paymentTypeId: 'credit_card'
                        })
                        console.log("Installments response:", installments)

                        if (!installments || installments.length === 0) {
                            console.warn("No installments returned from Mercado Pago")
                            return
                        }

                        const installmentOptions = installments[0].payer_costs
                        console.log("Installments payer_costs:", installmentOptions)

                        const installmentOptionsKeys = { label: 'recommended_message', value: 'installments' }

                        createSelectOptions(installmentsElement, installmentOptions, installmentOptionsKeys)
                    } catch (error) {
                        console.error('error getting installments: ', error)
                    }
                }

                const fetchIdentificationTypes = async () => {
                    try {
                        const identificationTypes = await getIdentificationTypes()
                        const identificationTypeElement = document.getElementById('form-checkout__identificationType') as HTMLSelectElement

                        if (identificationTypeElement && identificationTypes) {
                            createSelectOptions(identificationTypeElement, identificationTypes)
                        }
                    } catch (e) {
                        return console.error('Error getting identificationTypes: ', e)
                    }
                }

                fetchIdentificationTypes()

                // Finalizando Instrução 7: Criando Token e validando
                const formElement = document.getElementById('form-checkout') as HTMLFormElement
                const createCardToken = async (event: Event) => {
                    try {
                        const tokenElement = document.getElementById('token') as HTMLInputElement
                        if (!tokenElement.value) {
                            event.preventDefault()

                            const cardholderNameEl = document.getElementById('form-checkout__cardholderName') as HTMLInputElement
                            const identificationTypeEl = document.getElementById('form-checkout__identificationType') as HTMLSelectElement
                            const identificationNumberEl = document.getElementById('form-checkout__identificationNumber') as HTMLInputElement

                            const nameParts = cardholderNameEl.value.trim().split(" ")
                            if (nameParts.length < 2) {
                                throw new Error("Por favor, informe o nome completo (nome e sobrenome) do titular do cartão.")
                            }
                            const firstName = nameParts[0]
                            const lastName = nameParts.slice(1).join(" ")

                            const docNumber = identificationNumberEl.value.replace(/\D/g, "")
                            if (!docNumber) {
                                throw new Error("Por favor, informe o número do documento.")
                            }

                            const token = await mp.fields.createCardToken({
                                cardholderName: cardholderNameEl.value.trim(),
                                identificationType: identificationTypeEl.value,
                                identificationNumber: docNumber,
                            })
                            tokenElement.value = token.id

                            // Integração Next.js Seguro: em vez de requestSubmit, prosseguimos no State
                            setError(null)
                            const paymentMethodElement = document.getElementById('paymentMethodId') as HTMLInputElement
                            const issuerElement = document.getElementById('form-checkout__issuer') as HTMLSelectElement
                            const installmentsElement = document.getElementById('form-checkout__installments') as HTMLSelectElement
                            const emailEl = document.getElementById('form-checkout__email') as HTMLInputElement

                            const payload = {
                                provider_id: "pp_mercadopago_mercadopago",
                                data: {
                                    token: token.id,
                                    payment_method_id: paymentMethodElement.value,
                                    issuer_id: issuerElement.value,
                                    installments: Number(installmentsElement.value),
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

                            console.log("[MercadoPago Card] Sending Payload:", JSON.stringify(payload, null, 2))

                            await initiatePaymentSession(cart, payload)

                            setCardComplete(true)
                            setCardBrand(paymentMethodElement.value)
                            onSuccess()
                        }
                    } catch (e: any) {
                        console.error('error creating card token: ', e)
                        const errorMessage = e?.[0]?.message || e?.message || "Erro ao processar o formulário. Verifique os dados inseridos."
                        setError(errorMessage)
                    }
                }

                    // Salvar referência globalmente para o cleanup
                    ; (window as any).__mpSubmitCallback = createCardToken
                    ; (window as any).__mpFormElement = formElement
                if (formElement) formElement.addEventListener('submit', createCardToken)

            } catch (error) {
                console.error("SDK Load Error:", error)
                setError("Não foi possível carregar o módulo de pagamento.")
            }
        }

        initMP()

        return () => {
            const formElement = (window as any).__mpFormElement
            const submitCallback = (window as any).__mpSubmitCallback
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

    const clearHTMLSelectChildrenFrom = (element: HTMLSelectElement) => {
        const currOptions = [...Array.from(element.children)]
        currOptions.forEach(child => child.remove())
    }

    const createSelectElementPlaceholder = (element: HTMLSelectElement, placeholder: string) => {
        const optionElement = document.createElement('option')
        optionElement.textContent = placeholder
        optionElement.setAttribute('selected', "")
        optionElement.setAttribute('disabled', "")

        element.appendChild(optionElement)
    }

    const clearSelectsAndSetPlaceholders = (
        issuerEl: HTMLSelectElement, issuerPlaceholder: string,
        installmentsEl: HTMLSelectElement, installmentsPlaceholder: string
    ) => {
        clearHTMLSelectChildrenFrom(issuerEl)
        createSelectElementPlaceholder(issuerEl, issuerPlaceholder)

        clearHTMLSelectChildrenFrom(installmentsEl)
        createSelectElementPlaceholder(installmentsEl, installmentsPlaceholder)
    }

    const inputClasses = "w-full min-h-[44px] px-3 py-2 bg-[#080c0a]/50 border border-[#27342f] text-[#ebe7d9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#d69e26] focus:border-[#d69e26] transition-all duration-300 placeholder:text-[#808f8a]"
    const containerClasses = "w-full min-h-[44px] px-3 py-2 bg-[#080c0a]/50 border border-[#27342f] rounded-md focus-within:ring-1 focus-within:ring-[#d69e26] focus-within:border-[#d69e26] transition-all duration-300 flex items-center"
    const labelClasses = "block text-sm font-medium text-[#ebe7d9] mb-1.5"

    return (
        <form id="form-checkout" action="/process_payment" method="POST" className="w-full flex flex-col gap-5 max-w-[600px] font-body bg-transparent">
            <div>
                <label htmlFor="form-checkout__cardNumber" className={labelClasses}>Número do Cartão</label>
                <div id="form-checkout__cardNumber" className={containerClasses}></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="form-checkout__expirationDate" className={labelClasses}>Data de Validade</label>
                    <div id="form-checkout__expirationDate" className={containerClasses}></div>
                </div>
                <div>
                    <label htmlFor="form-checkout__securityCode" className={labelClasses}>Cód. Segurança</label>
                    <div id="form-checkout__securityCode" className={containerClasses}></div>
                </div>
            </div>

            <div>
                <label htmlFor="form-checkout__cardholderName" className={labelClasses}>Titular do Cartão</label>
                <input type="text" id="form-checkout__cardholderName" name="cardholderName" className={inputClasses} placeholder="Nome como está no cartão" required />
            </div>

            <div>
                <label htmlFor="form-checkout__issuer" className={labelClasses}>Banco Emissor</label>
                <select id="form-checkout__issuer" name="issuer" className={inputClasses} defaultValue="" required>
                    <option value="" disabled>Selecione o banco emissor</option>
                </select>
            </div>

            <div>
                <label htmlFor="form-checkout__installments" className={labelClasses}>Parcelas</label>
                <select id="form-checkout__installments" name="installments" className={inputClasses} defaultValue="" required>
                    <option value="" disabled>Selecione a quantidade de parcelas</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="form-checkout__identificationType" className={labelClasses}>Tipo de Documento</label>
                    <select id="form-checkout__identificationType" name="identificationType" className={inputClasses} defaultValue="" required>
                        <option value="" disabled>Tipo</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="form-checkout__identificationNumber" className={labelClasses}>Número do Documento</label>
                    <input type="text" id="form-checkout__identificationNumber" name="identificationNumber" className={inputClasses} placeholder="Número do documento" required />
                </div>
            </div>

            <div>
                <label htmlFor="form-checkout__email" className={labelClasses}>E-mail</label>
                <input type="email" id="form-checkout__email" name="email" className={inputClasses} placeholder="E-mail"
                    defaultValue={cart?.email || ""} required />
            </div>

            {/* Campos ocultos necessários para o Mercado Pago */}
            <input id="token" name="token" type="hidden" />
            <input id="paymentMethodId" name="paymentMethodId" type="hidden" />
            <input id="transactionAmount" name="transactionAmount" type="hidden" value={cart?.total ? cart.total.toString() : ""} />
            <input id="description" name="description" type="hidden" value="Compra - Segredos da Serpente" />

            <button
                type="submit"
                id="form-checkout__submit"
                className="w-full h-12 mt-2 bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#D4AF37] text-[#080c0a] font-display font-medium text-sm tracking-widest rounded-md hover:brightness-110 transition-all duration-300 pointer-events-auto"
            >
                PAGAR
            </button>
        </form>
    )
}