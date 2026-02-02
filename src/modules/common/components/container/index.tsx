import { clx } from "@medusajs/ui"
import React from "react"

type ContainerProps = {
    className?: string
    children?: React.ReactNode
}

const Container = ({ children, className }: ContainerProps) => {
    return (
        <div
            className={clx(
                "mx-auto w-full max-w-[1440px] px-4 sm:px-6",
                className
            )}
        >
            {children}
        </div>
    )
}

export default Container