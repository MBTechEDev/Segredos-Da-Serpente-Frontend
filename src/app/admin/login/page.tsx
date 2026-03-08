import { Metadata } from "next"
import LoginTemplate from "../../../modules/admin/account/template/login-template"

export const metadata: Metadata = {
    title: "Santuario Interno | Segredos da Serpente",
    description: "Acesse a area interna dos segredos da serpente",
    openGraph: {
        title: "Entre no Círculo - Segredos da Serpente",
        description: "Portal de acesso exclusivo para Administração.",
        images: ["/og-image-auth.jpg"], // Certifique-se de ter esta imagem
    },
}

import { retrieveAdminUser } from "@lib/data/admin"
import { redirect } from "next/navigation"

export default async function LoginPage() {
    const adminUser = await retrieveAdminUser().catch(() => null)

    if (adminUser) {
        redirect('/admin')
    }

    return <LoginTemplate />
}