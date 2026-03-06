import { Toaster } from "@medusajs/ui"

export default function AccountPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}