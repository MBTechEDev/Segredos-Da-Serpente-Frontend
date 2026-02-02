import type { Config } from "tailwindcss"
import medusaUi from "@medusajs/ui-preset"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}", // Essencial para o Medusa UI
  ],
  presets: [medusaUi], // Mantém a base do Medusa
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      // Fontes Personalizadas
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Substitui a padrão do Medusa pela tua
        display: ["Cinzel", "serif"],
        mystical: ["Cormorant Garamond", "serif"],
        body: ["Inter", "sans-serif"],
      },
      // Tuas Cores Personalizadas (Adicionadas ao lado das do Medusa)
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cores Específicas do Tema
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          dark: "hsl(var(--gold-dark))",
        },
        emerald: {
          DEFAULT: "hsl(var(--emerald))",
          light: "hsl(var(--emerald-light))",
          dark: "hsl(var(--emerald-dark))",
        },
        burgundy: "hsl(var(--burgundy))",
        obsidian: "hsl(var(--obsidian))",
        smoke: "hsl(var(--smoke))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Tuas Animações Personalizadas
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px hsl(var(--accent) / 0.5)" },
          "50%": { opacity: "0.8", boxShadow: "0 0 30px hsl(var(--accent) / 0.8)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        shimmer: "shimmer 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, hsl(var(--gold)), hsl(var(--gold-dark)))",
        "gradient-serpent": "linear-gradient(180deg, hsl(var(--emerald)), hsl(var(--emerald-dark)))",
        "gradient-mystical": "linear-gradient(135deg, hsl(var(--background)), hsl(var(--card)))",
      },
      boxShadow: {
        gold: "0 4px 30px hsl(var(--gold) / 0.2)",
        serpent: "0 10px 40px hsl(var(--emerald) / 0.3)",
        card: "0 4px 20px hsl(0 0% 0% / 0.4)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-radix") // Mantemos o radix que já estava no teu package.json original
  ],
}

export default config