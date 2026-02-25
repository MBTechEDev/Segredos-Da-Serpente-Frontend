"use client"

import { useEffect, useRef } from "react"
import { initiatePaymentSession } from "@lib/data/cart"
import { loadMercadoPago } from "@mercadopago/sdk-js"

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

                await loadMercadoPago()
                const mp = new (window as any).MercadoPago(publicKey, { locale: "pt-BR" })

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
                            const { results } = await mp.getPaymentMethods({ bin })
                            const paymentMethod = results[0]

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

                const getIssuers = async (paymentMethod: any, bin: string) => {
                    try {
                        const { id: paymentMethodId } = paymentMethod
                        return await mp.getIssuers({ paymentMethodId, bin })
                    } catch (e) {
                        console.error('error getting issuers: ', e)
                    }
                }

                const updateIssuer = async (paymentMethod: any, bin: string) => {
                    const { additional_info_needed, issuer } = paymentMethod
                    let issuerOptions = [issuer]

                    if (additional_info_needed.includes('issuer_id')) {
                        issuerOptions = await getIssuers(paymentMethod, bin)
                    }

                    createSelectOptions(issuerElement, issuerOptions)
                }

                const updateInstallments = async (paymentMethod: any, bin: string) => {
                    try {
                        const amountElement = document.getElementById('transactionAmount') as HTMLInputElement

                        const installments = await mp.getInstallments({
                            amount: amountElement.value,
                            bin,
                            paymentTypeId: 'credit_card'
                        })

                        const installmentOptions = installments[0].payer_costs
                        const installmentOptionsKeys = { label: 'recommended_message', value: 'installments' }

                        createSelectOptions(installmentsElement, installmentOptions, installmentOptionsKeys)
                    } catch (error) {
                        console.error('error getting installments: ', error)
                    }
                }

                // Obter tipos de documentos
                const getIdentificationTypes = async () => {
                    try {
                        const identificationTypes = await mp.getIdentificationTypes()
                        const identificationTypeElement = document.getElementById('form-checkout__identificationType') as HTMLSelectElement

                        if (identificationTypeElement) {
                            createSelectOptions(identificationTypeElement, identificationTypes)
                        }
                    } catch (e) {
                        return console.error('Error getting identificationTypes: ', e)
                    }
                }

                getIdentificationTypes()

            } catch (error) {
                console.error("SDK Load Error:", error)
                setError("Não foi possível carregar o módulo de pagamento.")
            }
        }

        initMP()
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
                <input type="text" id="form-checkout__cardholderName" name="cardholderName" className={inputClasses} placeholder="Nome como está no cartão" />
            </div>

            <div>
                <label htmlFor="form-checkout__issuer" className={labelClasses}>Banco Emissor</label>
                <select id="form-checkout__issuer" name="issuer" className={inputClasses} defaultValue="">
                    <option value="" disabled>Selecione o banco emissor</option>
                </select>
            </div>

            <div>
                <label htmlFor="form-checkout__installments" className={labelClasses}>Parcelas</label>
                <select id="form-checkout__installments" name="installments" className={inputClasses} defaultValue="">
                    <option value="" disabled>Selecione a quantidade de parcelas</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="form-checkout__identificationType" className={labelClasses}>Tipo de Documento</label>
                    <select id="form-checkout__identificationType" name="identificationType" className={inputClasses} defaultValue="">
                        <option value="" disabled>Tipo</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="form-checkout__identificationNumber" className={labelClasses}>Número do Documento</label>
                    <input type="text" id="form-checkout__identificationNumber" name="identificationNumber" className={inputClasses} placeholder="Número do documento" />
                </div>
            </div>

            <div>
                <label htmlFor="form-checkout__email" className={labelClasses}>E-mail</label>
                <input type="email" id="form-checkout__email" name="email" className={inputClasses} placeholder="E-mail"
                    defaultValue={cart?.email || ""} />
            </div>

            {/* Campos ocultos necessários para o Mercado Pago */}
            <input id="token" name="token" type="hidden" />
            <input id="paymentMethodId" name="paymentMethodId" type="hidden" />
            <input id="transactionAmount" name="transactionAmount" type="hidden" value={cart?.total ? (cart.total / 100).toString() : "100"} />
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