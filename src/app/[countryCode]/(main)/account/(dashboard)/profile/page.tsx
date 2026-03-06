import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import ProfileClient from "@modules/account/components/profile-client"

export const metadata: Metadata = {
  title: "Perfil | Segredos da Serpente",
  description: "Gerencie suas informações místicas e dados de acesso.",
}

export default async function ProfilePage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  return <ProfileClient customer={customer} />
}