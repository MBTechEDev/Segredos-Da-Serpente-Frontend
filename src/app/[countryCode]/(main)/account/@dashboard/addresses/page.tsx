import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
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
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-12">
        <h1 className="text-3xl font-display text-gradient-gold mb-2">Endereços de Envio</h1>
        <p className="text-muted-foreground font-body">
          Gerencie seus locais de entrega para uma experiência de checkout fluida e mística.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
