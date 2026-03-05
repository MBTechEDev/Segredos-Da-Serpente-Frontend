import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-6 font-body text-neutral-300">
      <Heading className="font-cinzel text-xl text-[#D4AF37] mb-4">A Busca por Respostas</Heading>
      <div className="text-sm md:text-base my-2">
        <ul className="gap-y-3 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact" className="hover:text-[#F1D06E] transition-colors">
              Falar com o Pactuante (Contato)
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact" className="hover:text-[#F1D06E] transition-colors">
              Rituais de Devolução
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
