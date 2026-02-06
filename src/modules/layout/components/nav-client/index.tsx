"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { Menu, ShoppingBag, Search, User, ChevronDown } from "lucide-react"

import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MobileMenu from "@modules/layout/components/mobile-menu"
import CartDrawer from "@modules/layout/components/cart-drawer"
import { useCartContext } from "@lib/context/CartContext"

type NavClientProps = {
    regions: HttpTypes.StoreRegion[]
    categories: HttpTypes.StoreProductCategory[]
}

const NavClient = ({ regions, categories }: NavClientProps) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname()
    const { totalItems } = useCartContext()

    // Efeito de Scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={`sticky top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${isScrolled
                ? "bg-background/95 backdrop-blur-md border-border shadow-md"
                : "bg-transparent border-transparent"
                }`}
        >
            <nav className="mx-auto max-w-[1440px] px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* 1. Mobile Menu (Sheet) */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-foreground hover:text-secondary hover:bg-transparent"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[85vw] sm:w-80 bg-background border-r border-border p-0">
                            <MobileMenu categories={categories} />
                        </SheetContent>
                    </Sheet>

                    {/* 2. Logo */}
                    <LocalizedClientLink href="/" className="flex items-center gap-2 group outline-none">
                        <div className="relative flex items-baseline select-none italic">
                            <span className="font-display text-2xl md:text-3xl font-bold tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent drop-shadow-sm">
                                Segredos
                            </span>
                            <span className="font-mystical text-lg md:text-xl text-white/90 italic ml-1.5 font-light tracking-wide">
                                da Serpente
                            </span>
                        </div>
                    </LocalizedClientLink>

                    {/* 3. Desktop Navigation (Com Dropdown) */}
                    <div className="hidden md:flex items-center gap-6">
                        <LocalizedClientLink
                            href="/"
                            className={`text-sm font-medium hover:text-secondary transition-colors duration-300 tracking-wide uppercase ${pathname === "/" ? "text-secondary font-semibold" : "text-foreground/80"
                                }`}
                        >
                            Início
                        </LocalizedClientLink>

                        {/* Mapeamento das Categorias */}
                        {categories && categories.map((cat) => {
                            const hasChildren = cat.category_children && cat.category_children.length > 0;

                            return (
                                <div key={cat.id} className="relative group h-16 md:h-20 flex items-center">
                                    <LocalizedClientLink
                                        href={`/categories/${cat.handle}`}
                                        className={`flex items-center gap-1 text-sm font-medium hover:text-secondary transition-colors duration-300 tracking-wide uppercase py-2 ${pathname?.includes(cat.handle) ? "text-secondary font-semibold" : "text-foreground/80"
                                            }`}
                                    >
                                        {cat.name}
                                        {hasChildren && <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />}
                                    </LocalizedClientLink>

                                    {/* Dropdown Menu - Só aparece se tiver filhos */}
                                    {hasChildren && (
                                        <div className="absolute top-full left-0 w-56 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out">
                                            <div className="bg-card/95 backdrop-blur-md border border-white/10 rounded-md shadow-xl overflow-hidden p-2 flex flex-col gap-1">
                                                {cat.category_children?.map((child) => (
                                                    <LocalizedClientLink
                                                        key={child.id}
                                                        href={`/categories/${child.handle}`}
                                                        className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-secondary hover:bg-white/5 rounded-sm transition-colors uppercase tracking-wide"
                                                    >
                                                        {child.name}
                                                    </LocalizedClientLink>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        <LocalizedClientLink
                            href="/about"
                            className="text-sm font-medium text-foreground/80 hover:text-secondary transition-colors duration-300 tracking-wide uppercase"
                        >
                            Sobre
                        </LocalizedClientLink>
                    </div>

                    {/* 4. Actions */}
                    <div className="flex items-center gap-1 md:gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`text-foreground/80 hover:text-secondary hover:bg-transparent ${isSearchOpen ? "text-secondary" : ""}`}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        <LocalizedClientLink href="/account">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-foreground/80 hover:text-secondary hover:bg-transparent hidden md:flex"
                            >
                                <User className="h-5 w-5" />
                            </Button>
                        </LocalizedClientLink>

                        <CartDrawer>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-foreground/80 hover:text-secondary hover:bg-transparent relative"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                {totalItems > 0 && (
                                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold text-black flex items-center justify-center animate-in zoom-in">
                                        {totalItems}
                                    </span>
                                )}
                            </Button>
                        </CartDrawer>
                    </div>
                </div>

                {/* 5. Search Bar */}
                {isSearchOpen && (
                    <div className="py-4 border-t border-white/10 animate-in slide-in-from-top-2">
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
                            <Input
                                type="text"
                                placeholder="O que sua alma procura hoje? (Ex: Velas, Cristais...)"
                                className="w-full bg-card/50 border-white/10 rounded-full py-6 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus-visible:ring-secondary/50 focus-visible:border-secondary/50"
                                autoFocus
                            />
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default NavClient