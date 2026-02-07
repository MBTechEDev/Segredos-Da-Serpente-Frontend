"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
    React.ComponentRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            // Estética de linha minimalista em vez de bloco sólido
            "inline-flex h-12 items-center justify-start border-b border-white/10 w-full bg-transparent p-0 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
    React.ComponentRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            // Tipagem Cinzel e transição para o dourado no estado ativo
            "inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm font-display uppercase tracking-widest transition-all",
            "border-b-2 border-transparent",
            "hover:text-secondary/80",
            "data-[state=active]:border-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none",
            "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
            className
        )}
        {...props}
    />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ComponentRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-6 ring-offset-background focus-visible:outline-none animate-in fade-in-50 duration-500",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }