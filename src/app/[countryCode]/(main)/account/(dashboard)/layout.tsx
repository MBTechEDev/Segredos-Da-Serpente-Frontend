import { retrieveCustomer } from "@lib/data/customer"
import AccountLayout from "@modules/account/templates/account-layout"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ countryCode: string }>
}) {
    // Busca o cliente no servidor
    const customer = await retrieveCustomer().catch(() => null)
    const { countryCode } = await params

    // Redireciona para o login se não estiver autenticado
    if (!customer) {
        redirect(`/${countryCode}/account/login`)
    }

    return (
        <AccountLayout customer={customer}>
            {children}
        </AccountLayout>
    )
}
