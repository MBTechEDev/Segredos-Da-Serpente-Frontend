"use client"

import { ChevronUpDown } from "@medusajs/icons"
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { cn } from "@lib/utils"

export type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & SelectHTMLAttributes<HTMLSelectElement>

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    { placeholder = "Selecionar...", defaultValue, className, children, disabled, ...props },
    ref
  ) => {
    const innerRef = useRef<HTMLSelectElement>(null)
    const [isPlaceholder, setIsPlaceholder] = useState(false)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === "") {
        setIsPlaceholder(true)
      } else {
        setIsPlaceholder(false)
      }
    }, [innerRef.current?.value])

    return (
      <div className="w-full group">
        <div
          className={cn(
            // Altura H-14 exata para alinhar com os Inputs do tema
            // bg-background garante que o container seja escuro
            "relative flex items-center h-14 w-full bg-background border rounded-md transition-all duration-200",
            "border-border focus-within:ring-1 focus-within:ring-secondary/50 focus-within:border-secondary",
            "hover:bg-neutral-900", // Leve destaque no hover mantendo o dark
            disabled && "bg-ui-bg-base border-border/50 opacity-70 cursor-not-allowed",
            className
          )}
        >
          <select
            ref={innerRef}
            defaultValue={defaultValue}
            disabled={disabled}
            {...props}
            className={cn(
              // appearance-none remove o estilo nativo do SO
              // text-ui-fg-base puxa a cor clara do tema Medusa UI
              "appearance-none flex-1 bg-transparent border-none px-4 h-full w-full outline-none text-sm transition-colors cursor-pointer z-10",
              "text-white", // Garantindo contraste no tema Dark
              disabled && "cursor-not-allowed",
              isPlaceholder ? "text-muted-foreground" : "text-foreground"
            )}
          >
            <option value="" disabled className="bg-background text-foreground">
              {placeholder}
            </option>
            {/* Injetamos as classes de fundo escuro diretamente nos filhos 
                para mitigar o comportamento do navegador em componentes nativos.
            */}
            {Array.isArray(children)
              ? children.map((child: any) => {
                if (child.type === 'option') {
                  return {
                    ...child,
                    props: {
                      ...child.props,
                      className: cn("bg-background text-foreground", child.props.className)
                    }
                  }
                }
                return child
              })
              : children
            }
          </select>

          {/* Ícone posicionado com respiro lateral */}
          <span className="absolute right-4 flex items-center pointer-events-none text-muted-foreground z-0">
            <ChevronUpDown fontSize={16} />
          </span>
        </div>
      </div>
    )
  }
)

NativeSelect.displayName = "NativeSelect"

export default NativeSelect