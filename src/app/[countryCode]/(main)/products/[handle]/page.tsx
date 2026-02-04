import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductByHandle } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/components"

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) return { title: "Produto não encontrado" }

  return {
    title: `${product.title} | Segredos da Serpente`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string, countryCode: string }> }) {
  const { handle, countryCode } = await params

  const region = await getRegion(countryCode)
  const product = await getProductByHandle(handle)

  if (!product || !region) {
    notFound()
  }

  return (
    <ProductTemplate
      product={product}
      region={region}
    />
  )
}