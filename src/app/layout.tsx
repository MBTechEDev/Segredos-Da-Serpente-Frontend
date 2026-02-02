import { Metadata } from "next"
import "styles/globals.css"
import { CartProvider } from "@lib/context/CartContext"
import Nav from "@modules/layout/templates/nav"
// import Footer from "@/modules/layout/templates/footer" // Descomenta quando criarmos o footer

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-mode="dark" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-secondary selection:text-secondary-foreground">
        <CartProvider>
          <main className="relative flex flex-col min-h-screen">

            <div className="flex-1">
              {props.children}
            </div>
          </main>
        </CartProvider>
      </body>
    </html>
  )
}