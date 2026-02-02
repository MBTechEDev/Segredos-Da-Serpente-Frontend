// src/modules/layout/templates/footer/index.tsx
import { Instagram, Facebook, Youtube, Mail, MapPin, Phone, CreditCard, ShieldCheck } from "lucide-react"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FooterNewsletter from "@modules/layout/components/footer-newsletter"

export default async function Footer() {
  // Busca simultânea de Categorias e Coleções conforme o padrão Medusa v2
  const productCategories = await listCategories()
  const { collections } = await listCollections({
    fields: "*products",
  })

  return (
    <footer className="bg-card border-t border-border mt-20">
      {/* Newsletter - Identidade Segredos da Serpente */}
      <div className="border-b border-border glass-dark">
        <div className="container px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl text-gradient-gold mb-2">
              Receba Ofertas Exclusivas
            </h3>
            <p className="text-muted-foreground mb-6 font-body">
              Cadastre-se e ganhe 10% OFF na sua primeira descoberta.
            </p>
            <FooterNewsletter />
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Coluna 1: Brand & Social */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <span className="font-display text-xl text-gradient-gold tracking-wider">Segredos</span>
              <span className="font-mystical text-lg text-foreground/80 italic ml-1">da Serpente</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 font-body">
              Despertando o poder oculto através de artefatos e sabedoria ancestral.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Coluna 2: Categorias Dinâmicas (Inteligência Medusa) */}
          <div className="flex flex-col gap-y-2">
            <h4 className="font-display text-sm text-foreground uppercase tracking-widest mb-2">Categorias</h4>
            <ul className="grid grid-cols-1 gap-2" data-testid="footer-categories">
              {productCategories?.filter(c => !c.parent_category_id).slice(0, 6).map((category) => (
                <li key={category.id} className="text-sm">
                  <LocalizedClientLink
                    href={`/categories/${category.handle}`}
                    className="text-muted-foreground hover:text-secondary transition-colors"
                  >
                    {category.name}
                  </LocalizedClientLink>
                  {/* Subcategorias se houver (Recursividade) */}
                  {category.category_children && (
                    <ul className="ml-3 mt-1 flex flex-col gap-1 border-l border-border/50 pl-2">
                      {category.category_children.slice(0, 3).map(child => (
                        <li key={child.id}>
                          <LocalizedClientLink href={`/categories/${child.handle}`} className="text-xs text-muted-foreground/60 hover:text-primary">
                            {child.name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Coleções (Novo item útil do Medusa) */}
          <div className="flex flex-col gap-y-2">
            <h4 className="font-display text-sm text-foreground uppercase tracking-widest mb-2">Coleções</h4>
            <ul className="grid grid-cols-1 gap-2 text-sm">
              {collections?.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    href={`/collections/${c.handle}`}
                    className="text-muted-foreground hover:text-secondary transition-colors"
                  >
                    {c.title}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: Institucional */}
          <div className="flex flex-col gap-y-2">
            <h4 className="font-display text-sm text-foreground uppercase tracking-widest mb-2">Ajuda</h4>
            <ul className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              {["Minha Conta", "Pedidos", "Trocas", "Privacidade"].map((link) => (
                <li key={link}>
                  <LocalizedClientLink href={`/${link.toLowerCase()}`} className="hover:text-secondary transition-colors">
                    {link}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 5: Contato */}
          <div className="flex flex-col gap-y-2">
            <h4 className="font-display text-sm text-foreground uppercase tracking-widest mb-2">Contato</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-body">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> contato@segredosdaserpente.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> (11) 99999-9999
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-6 bg-background/40">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
            © {new Date().getFullYear()} Segredos da Serpente • Onde o Arcano se torna Matéria.
          </p>
          <div className="flex items-center gap-6 opacity-70">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="h-4 w-4 text-secondary" />
              <span>Checkout Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Proteção SSL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
