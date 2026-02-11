import React from "react"
import { HttpTypes } from "@medusajs/types"
import AccountNav from "@modules/account/components/account-nav"
import Container from "@modules/common/components/container"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ customer, children }) => {
  return (
    <div className="bg-background min-h-screen" data-testid="account-page">
      <Container className="py-8 lg:py-12">
        {/* flex-col garante que no mobile os itens fiquem um SOB o outro, sem sobrepor */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-y-10 lg:gap-x-12">

          {/* Sidebar: h-auto e relative garantem que ela ocupe espaço real no DOM */}
          <aside className="w-full lg:w-[280px] lg:shrink-0 relative h-auto">
            <AccountNav customer={customer} />
          </aside>

          {/* Conteúdo: Ocupa o restante do espaço */}
          <main className="flex-1 w-full min-w-0 relative">
            {children}
          </main>

        </div>
      </Container>
    </div>
  )
}

export default AccountLayout