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

export default function LoginPage() {
  return <LoginTemplate />
}