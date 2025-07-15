import { useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { ChefHat, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    )
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-4">
      <Card className="max-w-md w-full shadow-card animate-scale-in">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Recipe Not Found</h2>
            <p className="text-muted-foreground">
              Oops! This page seems to have gone missing from our cookbook.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild variant="chef" size="lg" className="w-full">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Kitchen
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full">
              <button onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            Error code: {location.pathname}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound
