import { cookies as nextCookies } from "next/headers"

import OnboardingCta from "@modules/order/components/onboarding-cta"
import { HttpTypes } from "@medusajs/types"
import OrderConfirmationClient from "@modules/order/components/order-confirmation-client"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="min-h-[calc(100vh-64px)] w-full">
      {isOnboarding && (
        <div className="content-container py-6 max-w-4xl mx-auto">
          <OnboardingCta orderId={order.id} />
        </div>
      )}
      <OrderConfirmationClient order={order} />
    </div>
  )
}
