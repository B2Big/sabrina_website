import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "link" | "warrior"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }

    // fallback for variants if standard colors aren't defined in globals.css yet (I only defined warrior colors)
    // I should update the "default" to use warrior colors or neutral.
    
    const activeVariant = variant === "default" ? "bg-white text-warrior-black hover:bg-gray-200" : 
                          variant === "warrior" ? "bg-warrior-red text-white hover:bg-warrior-crimson shadow-[0_0_15px_rgba(217,35,35,0.3)] uppercase tracking-wider font-bold border border-transparent hover:border-warrior-red/50 transition-all duration-300" :
                          variant === "outline" ? "border border-warrior-red/30 text-warrior-red hover:bg-warrior-red/10" :
                          variant === "ghost" ? "text-gray-300 hover:text-white hover:bg-white/5" :
                          "";

    const activeSize = sizes[size];

    return (
      <Comp
        className={cn(baseStyles, activeVariant, activeSize, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
