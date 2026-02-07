// src/modules/account/components/profile-client/index.tsx
"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { User, Mail, Phone, Save, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { Separator } from "@components/ui/separator"
import { Avatar, AvatarFallback } from "@components/ui/avatar"
import { updateCustomer } from "@lib/data/customer"
import { toast } from "sonner"
import ProfilePassword from "../profile-password"

const ProfileClient = ({ customer }: { customer: HttpTypes.StoreCustomer }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone: customer.phone || "",
    })

    const getInitials = () => {
        return `${customer.first_name?.charAt(0) || ""}${customer.last_name?.charAt(0) || ""}`.toUpperCase() || "S"
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Usando sua action do lib/data/customer.ts
            await updateCustomer(formData)
            setIsEditing(false)
            toast.success("Sua essência foi atualizada nos registros!")
        } catch (error) {
            toast.error("Erro ao atualizar perfil")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display text-gradient-gold">Meu Perfil</h1>
                    <p className="text-emerald-100/60 font-body">Gerencie sua identidade mística.</p>
                </div>

                {!isEditing ? (
                    <Button variant="cta" onClick={() => setIsEditing(true)}>
                        Editar Perfil
                    </Button>
                ) : (
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving} className="bg-gold text-background">
                            {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4 mr-2" />}
                            Salvar
                        </Button>
                    </div>
                )}
            </div>

            <div className="glass-dark rounded-2xl border border-emerald-500/20 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-emerald-900/40 via-gold/10 to-emerald-900/40" />
                <div className="px-6 pb-8">
                    <div className="relative -top-10 flex items-end gap-6">
                        <Avatar className="h-28 w-28 border-4 border-background shadow-2xl">
                            <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-gold text-3xl font-display text-white">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="pb-2">
                            <h3 className="text-xl font-display text-emerald-50">{customer.first_name} {customer.last_name}</h3>
                            <p className="text-emerald-100/40 text-sm flex items-center gap-1">
                                <ShieldCheck className="h-3 w-3 text-gold" />
                                Membro desde {new Date(customer.created_at ?? new Date()).getFullYear()}
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-4">
                        <div className="space-y-2">
                            <Label className="text-gold text-xs uppercase tracking-widest">Nome</Label>
                            {isEditing ? (
                                <Input
                                    className="bg-emerald-950/30 border-emerald-500/20 text-emerald-50"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                />
                            ) : (
                                <p className="text-emerald-100/80 font-medium">{customer.first_name || "—"}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gold text-xs uppercase tracking-widest">Sobrenome</Label>
                            {isEditing ? (
                                <Input
                                    className="bg-emerald-950/30 border-emerald-500/20 text-emerald-50"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                />
                            ) : (
                                <p className="text-emerald-100/80 font-medium">{customer.last_name || "—"}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gold text-xs uppercase tracking-widest">E-mail</Label>
                            <p className="text-emerald-100/80 font-medium">{customer.email}</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gold text-xs uppercase tracking-widest">Telefone</Label>
                            {isEditing ? (
                                <Input
                                    className="bg-emerald-950/30 border-emerald-500/20 text-emerald-50"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            ) : (
                                <p className="text-emerald-100/80 font-medium">{customer.phone || "—"}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-dark rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-950/50 to-transparent">
                <h3 className="text-lg font-display text-gold mb-4">Câmara de Segurança</h3>
                <ProfilePassword email={customer.email} />
            </div>
        </div>
    )
}

export default ProfileClient