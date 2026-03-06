import { Metadata } from "next"
import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Portal Místico | Segredos da Serpente",
  description: "Acesse sua conta no Círculo Segredos da Serpente. Ofertas exclusivas e rastreio de pedidos esotéricos.",
  openGraph: {
    title: "Entre no Círculo - Segredos da Serpente",
    description: "Portal de acesso exclusivo para membros.",
    images: ["/og-image-auth.jpg"], // Certifique-se de ter esta imagem
  },
}

import { retrieveCustomer } from "@lib/data/customer"
import { redirect } from "next/navigation"

export default async function LoginPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const customer = await retrieveCustomer().catch(() => null)
  const { countryCode } = await params

  if (customer) {
    redirect(`/${countryCode}/account`)
  }

  return <LoginTemplate />
}