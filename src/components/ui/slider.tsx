"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@lib/utils"

const Slider = React.forwardRef<
    React.ComponentRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
    // Determinamos a quantidade de seletores baseada no valor inicial ou prop
    const value = props.value || props.defaultValue || [0]

    return (
        <SliderPrimitive.Root
            ref={ref}
            className={cn(
                "relative flex w-full touch-none select-none items-center",
                className
            )}
            {...props}
        >
            {/* Trilho (Track) - Usando fundo escuro/muted para contraste */}
            <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted/30">
                {/* Intervalo Selecionado (Range) - Cor Esmeralda (Primary) */}
                <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>

            {/* Renderizamos um Thumb para cada valor no array. 
        Para filtros de preço [min, max], o Radix precisa de dois Thumbs.
      */}
            {value.map((_, index) => (
                <SliderPrimitive.Thumb
                    key={index}
                    className={cn(
                        "block h-5 w-5 rounded-full border-2 border-secondary bg-background", // Borda Dourada (Secondary)
                        "ring-offset-background transition-all duration-200",
                        "hover:scale-110 hover:border-secondary-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
                        "disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                    )}
                />
            ))}
        </SliderPrimitive.Root>
    )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }