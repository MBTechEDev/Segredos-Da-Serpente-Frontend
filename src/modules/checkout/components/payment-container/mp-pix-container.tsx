"use client"

import { useEffect, useState, FormEvent } from "react"
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

type IdentificationType = {
    id: string;
    name: string;
}

export default function MPPixContainer({
    cart,
    setPixComplete,
    setError,
    onSuccess
}: MPPixContainerProps) {
    // 1. Estados para controlar os dados do formulário
    const [isLoading, setIsLoading] = useState(true);
    const [docTypes, setDocTypes] = useState<IdentificationType[]>([]);

    // Estados dos campos (Controlados pelo React)
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState(cart?.email || "");
    const [docType, setDocType] = useState("");
    const [docNumber, setDocNumber] = useState("");

    // 2. Inicialização do Mercado Pago
    useEffect(() => {
        const initializeMP = async () => {
            const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

            if (!publicKey) {
                setError("Chave pública do Mercado Pago não configurada.");
                setIsLoading(false);
                return;
            }

            try {
                // Inicializa a SDK do React
                initMercadoPago(publicKey, { locale: "pt-BR" });

                // Busca os tipos de documento (CPF, CNPJ)
                const types = await getIdentificationTypes();
                if (types) {
                    setDocTypes(types as IdentificationType[]);
                    // Define o primeiro tipo como padrão, se existir
                    if (types.length > 0) setDocType(types[0].id);
                }
            } catch (error) {
                console.error("Erro ao inicializar MP:", error);
                setError("Não foi possível carregar as opções de pagamento.");
            } finally {
                setIsLoading(false);
            }
        };

        initializeMP();
    }, [setError]);

    // 3. Função de Submissão controlada pelo React
    const handleProcessPix = async (e: FormEvent) => {
        e.preventDefault(); // Evita o reload da página

        try {
            const cleanDocNumber = docNumber.replace(/\D/g, "");

            if (!firstName.trim() || !lastName.trim()) {
                throw new Error("Por favor, preencha o nome e sobrenome.");
            }
            if (!cleanDocNumber) {
                throw new Error("Por favor, informe o número do documento.");
            }

            setError(null);

            // Tenta pegar o device_id, mas não quebra se não existir
            const deviceId = typeof window !== 'undefined' ? (window as any).MP_DEVICE_SESSION_ID : undefined;

            const payload = {
                provider_id: "pp_mercadopago_mercadopago",
                data: {
                    payment_method_id: "pix",
                    device_id: deviceId,
                    payer: {
                        email: email.trim(),
                        first_name: firstName.trim(),
                        last_name: lastName.trim(),
                        identification: {
                            type: docType,
                            number: cleanDocNumber
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
            };

            console.log("[MercadoPago Pix] Sending Payload:", JSON.stringify(payload, null, 2));

            await initiatePaymentSession(cart, payload);

            setPixComplete(true);
            onSuccess();

        } catch (e: any) {
            console.error('Erro processando pix: ', e);
            setError(e?.message || "Erro ao processar o formulário. Verifique os dados inseridos.");
        }
    };

    if (isLoading) {
        return <div className="text-[#ebe7d9]">Carregando opções de pagamento...</div>;
    }

    return (
        // Usamos o onSubmit nativo do React aqui
        <form onSubmit={handleProcessPix} className="w-full flex flex-col gap-5 font-body bg-transparent">

            <div className="grid grid-cols-2 gap-4">
                <Input
                    name="firstName"
                    label="Nome"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <Input
                    name="lastName"
                    label="Sobrenome"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>

            <Input
                type="email"
                name="email"
                label="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <div className="grid grid-cols-2 gap-4">
                <div>
                    {/* Renderizamos as options com base no State, não manipulando o DOM */}
                    <NativeSelect
                        id="identificationType"
                        name="identificationType"
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        required
                        placeholder="Tipo Documento"
                    >
                        {docTypes.map((type) => (
                            <option key={type.id} value={type.id} className="bg-background text-foreground">
                                {type.name}
                            </option>
                        ))}
                    </NativeSelect>
                </div>
                <Input
                    name="identificationNumber"
                    label="Número do doc."
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    required
                />
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    className="w-full bg-[#d69e26] hover:bg-[#b5851f] text-[#080c0a] font-display uppercase tracking-widest py-3 px-4 rounded-md font-semibold transition-colors duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                    Pagar com Pix
                </button>
            </div>
        </form>
    )
}