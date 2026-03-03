import { Metadata } from "next"
import ResetPasswordTemplate from "@modules/account/templates/reset-password"

export const metadata: Metadata = {
    title: "Redefinir Senha | Segredos da Serpente",
    description: "Escolha uma nova senha para sua conta.",
}

type Props = {
    searchParams: Promise<{
        token: string
        email: string
    }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
    const { email } = await searchParams

    return <ResetPasswordTemplate email={email} />
}