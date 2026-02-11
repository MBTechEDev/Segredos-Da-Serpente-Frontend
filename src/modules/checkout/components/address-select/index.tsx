"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition
} from "@headlessui/react"
import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { Fragment, useMemo } from "react"

import Radio from "@modules/common/components/radio"
import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"

type AddressSelectProps = {
  addresses: HttpTypes.StoreCustomerAddress[]
  addressInput: HttpTypes.StoreCartAddress | null
  onSelect: (
    address: HttpTypes.StoreCartAddress | undefined,
    email?: string
  ) => void
}

const AddressSelect = ({
  addresses,
  addressInput,
  onSelect,
}: AddressSelectProps) => {
  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id)
    if (savedAddress) {
      onSelect(savedAddress as HttpTypes.StoreCartAddress)
    }
  }

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, addressInput))
  }, [addresses, addressInput])

  return (
    <Listbox onChange={handleSelect} value={selectedAddress?.id}>
      <div className="relative">
        <ListboxButton
          className="relative w-full flex justify-between items-center px-4 py-[10px] text-left bg-background cursor-default focus:outline-none border border-ui-border-base rounded-rounded focus-visible:ring-2 focus-visible:ring-emerald-500 text-ui-fg-base"
          data-testid="shipping-address-select"
        >
          {({ open }) => (
            <>
              <span className="block truncate">
                {selectedAddress
                  ? selectedAddress.address_1
                  : "Escolha um endereço"}
              </span>
              <ChevronUpDown
                className={clx("transition-rotate duration-200 text-ui-fg-muted", {
                  "transform rotate-180": open,
                })}
              />
            </>
          )}
        </ListboxButton>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* CORREÇÃO: Usar ListboxOptions (plural) para o container */}
          <ListboxOptions
            className="absolute z-50 w-full overflow-auto text-small-regular bg-background border border-ui-border-base mt-1 max-h-60 focus:outline-none sm:text-sm rounded-rounded shadow-xl"
            data-testid="shipping-address-options"
          >
            {addresses.map((address) => {
              const isSelected = selectedAddress?.id === address.id

              return (
                <ListboxOption
                  key={address.id}
                  value={address.id}
                  className={clx(
                    "cursor-default select-none relative pl-6 pr-10 py-4 border-b border-ui-border-base last:border-b-0 transition-colors",
                    "hover:bg-neutral-900"
                  )}
                  data-testid="shipping-address-option"
                >
                  <div className="flex gap-x-4 items-start">
                    <Radio
                      checked={isSelected}
                      data-testid="shipping-address-radio"
                    />
                    <div className="flex flex-col text-ui-fg-base">
                      <span className="text-left font-semibold">
                        {address.first_name} {address.last_name}
                      </span>
                      {address.company && (
                        <span className="text-small-regular text-ui-fg-muted">
                          {address.company}
                        </span>
                      )}
                      <div className="flex flex-col text-left text-small-regular mt-2 text-ui-fg-subtle">
                        <span>
                          {address.address_1}
                          {address.address_2 && (
                            <span>, {address.address_2}</span>
                          )}
                        </span>
                        <span>
                          {address.postal_code}, {address.city}
                        </span>
                        <span>
                          {address.province && `${address.province}, `}
                          {address.country_code?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </ListboxOption>
              )
            })}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  )
}

export default AddressSelect