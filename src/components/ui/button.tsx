import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost" | "link" | "training" | "care"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-slate-900 text-white hover:bg-slate-800 shadow-md", 
      
      // Nouveau variant TRAINING (Bleu Pop)
      training: "bg-training text-white hover:bg-training-dark shadow-lg shadow-training/30 hover:shadow-training/50 hover:-translate-y-0.5",
      
      // Nouveau variant CARE (Rose Pastel/Corail)
      care: "bg-care text-white hover:bg-care-dark shadow-lg shadow-care/30 hover:shadow-care/50 hover:-translate-y-0.5",
      
      outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700",
      ghost: "hover:bg-slate-100 hover:text-slate-900",
      link: "text-training underline-offset-4 hover:underline",
    }
    
    const sizes = {
      default: "h-10 px-6 py-2",
      sm: "h-9 rounded-full px-4",
      lg: "h-12 rounded-full px-8 text-base",
      icon: "h-10 w-10",
    }

    const activeVariant = variants[variant] || variants.default;
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