// src/app/[countryCode]/(main)/account/layout.tsx
import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  // Busca o cliente no servidor
  const customer = await retrieveCustomer().catch(() => null)

  // Caso 1: Usuário NÃO está logado
  // Renderizamos APENAS o componente de login, sem o AccountLayout (que tem a sidebar)
  if (!customer) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-background">
        <div className="w-full max-w-md p-4">
          {login}
          <Toaster />
        </div>
      </div>
    )
  }

  // Caso 2: Usuário ESTÁ logado
  // Renderizamos o AccountLayout (Sidebar + Header de Pontos) envolvendo o conteúdo
  return (
    <AccountLayout customer={customer}>
      {dashboard}
      <Toaster />
    </AccountLayout>
  )
}