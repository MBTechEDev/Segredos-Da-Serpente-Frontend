import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Segredos da Serpente | Artefatos Místicos & Sabedoria Ancestral",
    description: "Explore o oculto. Onde o Arcano se torna Matéria.",
    openGraph: {
        title: "Segredos da Serpente | Loja Oficial",
        images: ["/og-image.jpg"],
    },
}

export default async function Home(props: {
    params: Promise<{ countryCode: string }>
}) {

    return (
        <h1>Hello Word</h1>
    )
}