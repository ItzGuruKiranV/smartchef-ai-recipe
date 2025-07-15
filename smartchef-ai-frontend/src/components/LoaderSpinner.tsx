import { ChefHat, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export const LoaderSpinner = ({ size = "md", text, className }: LoaderSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        <ChefHat className={cn("text-primary animate-pulse", sizeClasses[size])} />
        <Loader2 className={cn("absolute top-0 left-0 text-primary-glow animate-spin", sizeClasses[size])} />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  )
}