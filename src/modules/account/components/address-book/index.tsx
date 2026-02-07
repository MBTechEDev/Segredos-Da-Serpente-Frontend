"use client"

import React, { useState } from "react"
import { MapPin, Plus, Loader2, Trash2, Edit2, Search } from "lucide-react"
import { HttpTypes } from "@medusajs/types"

import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { Badge } from "@components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog"

import {
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress
} from "@lib/data/customer"

interface AddressBookProps {
  customer: HttpTypes.StoreCustomer
  region: HttpTypes.StoreRegion
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [editingAddress, setEditingAddress] = useState<HttpTypes.StoreCustomerAddress | null>(null)

  const [cep, setCep] = useState("")
  const [addressData, setAddressData] = useState({
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    isLocked: false
  })

  const addresses = customer.addresses || []

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setCep(value)

    if (value.length === 8) {
      setIsLoadingCep(true)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`)
        const data = await response.json()

        if (!data.erro) {
          setAddressData({
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
            isLocked: true
          })
        }
      } catch (error) {
        console.error("Erro ViaCEP:", error)
      } finally {
        setIsLoadingCep(false)
      }
    } else {
      setAddressData(prev => ({ ...prev, isLocked: false }))
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    // Garante que o número não vá vazio (Medusa v2 usa address_2 para o número neste cenário)
    const number = formData.get("address_2") as string
    if (!number || number.trim() === "") {
      formData.set("address_2", "S/N")
    }

    try {
      if (editingAddress) {
        formData.append("address_id", editingAddress.id)
        // Chamada correta para Medusa v2 Server Action
        await updateCustomerAddress({}, formData)
      } else {
        // Chamada correta para Medusa v2 Server Action
        await addCustomerAddress({}, formData)
      }
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Erro ao guardar:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setEditingAddress(null)
    setCep("")
    setAddressData({ street: "", neighborhood: "", city: "", state: "", isLocked: false })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-emerald-900/30 pb-4">
        <h2 className="text-2xl font-display text-gradient-gold uppercase tracking-wider">Cofre de Endereços</h2>
        <Button
          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 font-body"
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
        >
          <Plus className="h-4 w-4" /> Novo Endereço
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className="glass-dark rounded-xl p-6 border border-emerald-900/20 hover:border-[#D4AF37]/40 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-900/20 flex items-center justify-center border border-emerald-500/20">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-display text-foreground text-lg leading-none">{address.first_name} {address.last_name}</p>
                </div>
              </div>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground font-body mb-6">
              <p className="text-white/80">{address.address_1}, {address.address_2}</p>
              <p>{address.company} • {address.city}, {address.province}</p>
            </div>
            <div className="flex gap-3 border-t border-emerald-900/10 pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remover
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-dark border-emerald-900/40 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display text-[#D4AF37]">Remover Morada?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-emerald-900/20">Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteCustomerAddress(address.id)} className="bg-red-900 hover:bg-red-800">Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-dark border-emerald-900/40 sm:max-w-[500px] text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-gradient-gold uppercase">
              {editingAddress ? "Aprimorar Destino" : "Novo Destino"}
            </DialogTitle>
            {/* SOLUÇÃO PARA O AVISO: Adicionando a descrição para acessibilidade */}
            <DialogDescription className="text-emerald-500/60 font-body text-xs italic">
              Insira as coordenadas para o envio de suas relíquias e artefatos.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 py-2 font-body">
            <div className="grid grid-cols-2 gap-4 bg-emerald-900/10 p-3 rounded-lg border border-emerald-500/10">
              <div className="space-y-1">
                <Label htmlFor="first_name" className="text-gold/70 text-[10px] uppercase">Nome</Label>
                <Input id="first_name" name="first_name" defaultValue={editingAddress?.first_name || customer.first_name || ""} required className="bg-black/40 border-emerald-900/30 h-8" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="last_name" className="text-gold/70 text-[10px] uppercase">Sobrenome</Label>
                <Input id="last_name" name="last_name" defaultValue={editingAddress?.last_name || customer.last_name || ""} required className="bg-black/40 border-emerald-900/30 h-8" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="postal_code" className="text-gold/70 text-[10px] uppercase flex items-center gap-2">
                CEP {isLoadingCep && <Loader2 className="h-3 w-3 animate-spin" />}
              </Label>
              <div className="relative">
                <Input id="postal_code" name="postal_code" value={cep} onChange={handleCepChange} required placeholder="00000000" maxLength={8} className="bg-black/40 border-emerald-900/30 h-9 pl-9 text-white" />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-emerald-500/50" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <Label htmlFor="address_1" className="text-gold/70 text-[10px] uppercase">Rua</Label>
                {/* SOLUÇÃO: Adicionado onChange nulo ou readOnly para calar o aviso do React */}
                <Input
                  id="address_1"
                  name="address_1"
                  value={addressData.street || editingAddress?.address_1 || ""}
                  readOnly={addressData.isLocked}
                  onChange={addressData.isLocked ? undefined : (e) => setAddressData(prev => ({ ...prev, street: e.target.value }))}
                  required
                  className="bg-black/40 border-emerald-900/30 h-9 text-white"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="address_2" className="text-gold/70 text-[10px] uppercase">Número</Label>
                <Input id="address_2" name="address_2" defaultValue={editingAddress?.address_2 || ""} placeholder="Ex: 123" className="bg-black/40 border-gold/40 h-9 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="company" className="text-gold/70 text-[10px] uppercase">Bairro</Label>
                <Input
                  id="company"
                  name="company"
                  value={addressData.neighborhood || editingAddress?.company || ""}
                  readOnly={addressData.isLocked}
                  onChange={addressData.isLocked ? undefined : (e) => setAddressData(prev => ({ ...prev, neighborhood: e.target.value }))}
                  className="bg-black/40 border-emerald-900/30 h-9 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="city" className="text-gold/70 text-[10px] uppercase">Cidade</Label>
                  <Input
                    id="city"
                    name="city"
                    value={addressData.city || editingAddress?.city || ""}
                    readOnly={addressData.isLocked}
                    onChange={addressData.isLocked ? undefined : (e) => setAddressData(prev => ({ ...prev, city: e.target.value }))}
                    required
                    className="bg-black/40 border-emerald-900/30 h-9 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="province" className="text-gold/70 text-[10px] uppercase">UF</Label>
                  <Input
                    id="province"
                    name="province"
                    value={addressData.state || editingAddress?.province || ""}
                    readOnly={addressData.isLocked}
                    onChange={addressData.isLocked ? undefined : (e) => setAddressData(prev => ({ ...prev, state: e.target.value }))}
                    required
                    className="bg-black/40 border-emerald-900/30 h-9 text-white"
                  />
                </div>
              </div>
            </div>

            <input type="hidden" name="country_code" value={region.countries?.[0].iso_2 || "br"} />

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-emerald-900/20">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-8" disabled={isSubmitting || isLoadingCep}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddressBook