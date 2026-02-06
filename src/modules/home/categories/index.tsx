import { listCategories } from "@lib/data/categories"
import CategoriesCarousel from "@components/ui/categories-carousel"

export default async function Categories() {
    const allCategories = await listCategories()

    const rootCategories = allCategories.filter((c) => !c.parent_category_id)

    if (!rootCategories.length) return null

    return (
        <section className="py-16 md:py-24 bg-card/10">
            <div className="container px-4">
                <div className="text-center mb-12">
                    <span className="text-secondary font-medium text-sm uppercase tracking-widest block mb-2">
                        Explore
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl text-foreground">
                        Categorias Místicas
                    </h2>
                </div>

                <CategoriesCarousel categories={rootCategories} />
            </div>
        </section>
    )
}