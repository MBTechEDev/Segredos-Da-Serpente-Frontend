import { cn } from "@lib/utils"

/**
 * Skeleton - Componente de carregamento (Shimmer effect)
 * Customizado para o tema Dark Mystical com brilho suave em vez de cinza chapado.
 */
function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                // Substituímos o bg-muted padrão por um tom que respeita o nosso background quase preto
                // Adicionamos um efeito de opacidade na pulsação para parecer uma névoa mística
                "animate-pulse rounded-md bg-white/[0.03] shadow-inner",
                className
            )}
            {...props}
        />
    )
}

export { Skeleton }