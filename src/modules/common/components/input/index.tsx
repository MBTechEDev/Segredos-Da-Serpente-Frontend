"use client"

import { Label } from "@medusajs/ui"
import React, { useEffect, useImperativeHandle, useState } from "react"
import { cn } from "@lib/utils"
import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, required, topLabel, className, disabled, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password") {
        setInputType(showPassword ? "text" : "password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className="flex flex-col w-full group">
        {topLabel && (
          <Label className="mb-2 txt-compact-medium-plus text-ui-fg-base font-display italic">
            {topLabel}
          </Label>
        )}
        <div className="flex relative z-0 w-full txt-compact-medium">
          <input
            type={inputType}
            name={name}
            id={name}
            placeholder=" "
            required={required}
            disabled={disabled}
            className={cn(
              // Estrutura Fixa: h-14 e paddings explícitos garantem o tamanho igual
              "block w-full h-14 px-4 pt-5 pb-1 mt-0 bg-background border rounded-md appearance-none transition-all duration-200 peer",
              // Estado Habilitado
              "border-border focus:outline-none focus:ring-1 focus:ring-secondary/50 focus:border-secondary hover:bg-ui-bg-field-hover",
              // Estado Desabilitado (Mantém h-14 e borda, muda opacidade e cursor)
              "disabled:bg-ui-bg-base disabled:border-border/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-background",
              className
            )}
            {...props}
            ref={inputRef}
          />

          <label
            htmlFor={name}
            className={cn(
              "absolute left-4 top-4 px-1 transition-all duration-300 -z-1 origin-0 text-ui-fg-subtle cursor-text",
              // Flutuação (Foco ou Preenchido)
              "peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-secondary",
              "peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px]",
              // Ajuste do Label quando desabilitado
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            )}
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>

          {type === "password" && !disabled && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-ui-fg-subtle px-4 focus:outline-none transition-all duration-150 outline-none focus:text-secondary absolute right-0 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input