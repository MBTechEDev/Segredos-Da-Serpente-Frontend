import { Metadata } from "next"
import { notFound } from "next/navigation"
import Hero from "@modules/home/components/hero"
import Categories from "@modules/home/categories"
import FeaturedProducts from "@modules/home/components/featured-products"
import { getRegion } from "@lib/data/regions"
import { listCollections } from "@lib/data/collections"

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
  const { countryCode } = await props.params


  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!region || !collections) {
    return notFound()
  }

  return (
    <main className="relative min-h-screen bg-background">
      <Hero />
      <Categories />
      <div className="py-12 md:py-16">
        <ul className="flex flex-col gap-y-24">
          <FeaturedProducts
            collections={collections}
            region={region}
          />
        </ul>
      </div>
    </main>
  )
}