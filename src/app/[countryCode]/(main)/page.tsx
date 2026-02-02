import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Segredos da Serpente | Artefatos Místicos & Sabedoria Ancestral",
  description:
    "Explore o oculto. Encontre produtos ritualísticos, cristais, ervas e ferramentas mágicas para despertar o poder dentro de você. Onde o Arcano se torna Matéria.",
  openGraph: {
    title: "Segredos da Serpente | Loja Oficial",
    description: "Desperte sua essência mística com nossos artefatos exclusivos.",
    images: ["/og-image.jpg"], // Recomendo criar uma imagem com o logo dourado
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
