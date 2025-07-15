import { ChefHat } from "lucide-react"
import { Link } from "react-router-dom"

export const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-smooth">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-warm">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SmartChef AI</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Recipe Generator</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth"
            >
              Home
            </Link>
            <Link 
              to="/manual" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth"
            >
              Manual Entry
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}