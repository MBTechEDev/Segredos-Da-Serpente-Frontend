"use client"
import { signout } from "@lib/data/admin"
import { LogOut } from "lucide-react"

export default async function Button() {

    const handleLogout = async () => {
        await signout()
    }
    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-x-3 px-4 py-3 text-red-400/80 hover:bg-red-400/10 rounded-xl transition-all w-full group"
        >
            <LogOut size={20} />
            <span className="font-body font-medium">Encerrar Sessão</span>
        </button>
    )
}

