"use client"

import { useEffect, useState } from "react"

export default function AboutHeroContent({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <div className={`relative z-10 container mx-auto px-4 text-center max-w-4xl transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
            {children}
        </div>
    )
}