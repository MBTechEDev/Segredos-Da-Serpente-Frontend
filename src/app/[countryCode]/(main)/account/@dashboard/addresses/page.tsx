import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"
import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Endereços | Segredos da Serpente",
  description: "Gerencie seus locais de entrega mística.",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full flex flex-col gap-y-8" data-testid="addresses-page-wrapper">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-4xl font-display uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent">
          Cofre de Endereços
        </h1>
        <p className="text-muted-foreground font-body text-sm max-w-[600px]">
          Gerencie seus pontos de destino. Um local de entrega preciso garante que seus artefatos cheguem com segurança através das sombras.
        </p>
      </div>

      <AddressBook customer={customer} region={region} />
    </div>
  )
}