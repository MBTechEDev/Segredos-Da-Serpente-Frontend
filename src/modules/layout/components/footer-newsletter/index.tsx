"use client"

import { Button } from "@components/ui/button"
import { useState } from "react"

export default function FooterNewsletter() {
    const [email, setEmail] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Inscrito:", email)
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
            />
            <Button type="submit" className="cta-primary px-6 py-3">
                Inscrever
            </Button>
        </form>
    )
}