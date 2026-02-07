"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@lib/utils"

/**
 * Root: O container principal do Avatar. 
 * Aplicamos um background suave (muted) para servir de base caso a imagem demore a carregar.
 */
const Avatar = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-emerald-900/20 bg-muted/10",
            className
        )}
        {...props}
    />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

/**
 * Image: A imagem do usuário. 
 * aspect-square garante que a imagem não distorça dentro do círculo.
 */
const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full object-cover", className)}
        {...props}
    />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

/**
 * Fallback: Exibido enquanto a imagem carrega ou se houver erro.
 * Aqui injetamos o toque "Dark Mystical": Um fundo escuro profundo com 
 * texto em dourado para manter a hierarquia visual premium.
 */
const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvatarPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-background text-secondary font-display text-sm font-medium",
            className
        )}
        {...props}
    />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }