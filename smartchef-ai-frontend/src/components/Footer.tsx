import { Heart } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border/40 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by SmartChef AI
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Transform your ingredients into delicious recipes with AI
          </p>
        </div>
      </div>
    </footer>
  )
}