"use client"

import React, { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import { Loader2 } from "lucide-react"
import { mapKeys } from "lodash"

import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import AddressSelect from "../address-select"
import CountrySelect from "../country-select"

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onChange: () => void
}) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false)

  // Inicialização inteligente: Cart > Customer > Vazio
  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": cart?.shipping_address?.first_name || customer?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || customer?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.address_2": cart?.shipping_address?.address_2 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code": cart?.shipping_address?.country_code || cart?.region?.countries?.[0]?.iso_2 || "br",
    "shipping_address.province": cart?.shipping_address?.province || "",
    "shipping_address.phone": cart?.shipping_address?.phone || customer?.phone || "",
    email: cart?.email || customer?.email || "",
  })

  // Sincroniza se o checkout carregar dados novos do servidor
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      "shipping_address.first_name": cart?.shipping_address?.first_name || customer?.first_name || prev["shipping_address.first_name"],
      "shipping_address.last_name": cart?.shipping_address?.last_name || customer?.last_name || prev["shipping_address.last_name"],
      "shipping_address.phone": cart?.shipping_address?.phone || customer?.phone || prev["shipping_address.phone"],
      email: cart?.email || customer?.email || prev.email,
    }))
  }, [cart, customer])

  const handleFetchCep = async (cep: string) => {
    const value = cep.replace(/\D/g, "")
    if (value.length !== 8) return

    setIsLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${value}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          "shipping_address.address_1": data.logradouro,
          "shipping_address.company": data.bairro,
          "shipping_address.city": data.localidade,
          "shipping_address.province": data.uf,
        }))
      }
    } catch (error) {
      console.error("Erro ViaCEP:", error)
    } finally {
      setIsLoadingCep(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "shipping_address.postal_code") {
      handleFetchCep(value)
    }
  }

  return (
    <>
      {customer && (customer.addresses?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5 glass-dark border-emerald-900/20 relative z-50">
          <p className="text-small-regular text-emerald-500 italic font-body">
            {`Saudações, ${customer.first_name}. Deseja utilizar um de seus destinos salvos?`}
          </p>
          <AddressSelect
            addresses={customer.addresses}
            addressInput={
              mapKeys(formData, (_, key) =>
                key.replace("shipping_address.", "")
              ) as HttpTypes.StoreCartAddress
            }
            onSelect={(address) => {
              if (address) {
                setFormData((prev) => ({
                  ...prev,
                  "shipping_address.first_name": address.first_name || "",
                  "shipping_address.last_name": address.last_name || "",
                  "shipping_address.address_1": address.address_1 || "",
                  "shipping_address.address_2": address.address_2 || "",
                  "shipping_address.company": address.company || "",
                  "shipping_address.postal_code": address.postal_code || "",
                  "shipping_address.city": address.city || "",
                  "shipping_address.province": address.province || "",
                  "shipping_address.phone": address.phone || prev["shipping_address.phone"],
                }))
              }
            }}
          />
        </Container>
      )}

      <div className="grid grid-cols-2 gap-4 font-body relative z-0">
        <Input
          label="Nome"
          name="shipping_address.first_name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Sobrenome"
          name="shipping_address.last_name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
        />
        <div className="col-span-2 relative">
          <Input
            label="CEP"
            name="shipping_address.postal_code"
            value={formData["shipping_address.postal_code"]}
            onChange={handleChange}
            required
            maxLength={8}
          />
          {isLoadingCep && <Loader2 className="absolute right-3 top-9 h-4 w-4 animate-spin text-emerald-500" />}
        </div>
        <Input
          label="Endereço (Rua/Av)"
          name="shipping_address.address_1"
          value={formData["shipping_address.address_1"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Número"
          name="shipping_address.address_2"
          value={formData["shipping_address.address_2"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Bairro"
          name="shipping_address.company"
          value={formData["shipping_address.company"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Cidade"
          name="shipping_address.city"
          value={formData["shipping_address.city"]}
          onChange={handleChange}
          required
        />
        <Input
          label="Estado (UF)"
          name="shipping_address.province"
          value={formData["shipping_address.province"]}
          onChange={handleChange}
          required
        />
        <CountrySelect
          name="shipping_address.country_code"
          region={cart?.region}
          value={formData["shipping_address.country_code"]}
          onChange={handleChange}
          required
        />
      </div>

      <div className="my-8">
        <Checkbox
          label="Endereço de cobrança é o mesmo de entrega"
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Celular"
          name="shipping_address.phone"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
        />
      </div>
    </>
  )
}

export default ShippingAddress