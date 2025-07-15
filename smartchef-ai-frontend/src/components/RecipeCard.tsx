import { Clock, Users, ChefHat, Lightbulb, Download, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Recipe {
  title: string
  ingredients: string[]
  steps: string[]
  tips: string[]
  estimated_time: string
}

interface RecipeCardProps {
  recipe: Recipe
  videoUrl?: string
  onExportPDF?: () => void
  onExportTXT?: () => void
}

export const RecipeCard = ({ recipe, videoUrl, onExportPDF, onExportTXT }: RecipeCardProps) => {
  return (
    <Card className="shadow-card animate-fade-in-up">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl text-foreground mb-2">{recipe.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {recipe.estimated_time}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                2-4 servings
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {onExportPDF && (
              <Button variant="outline" size="sm" onClick={onExportPDF}>
                <Download className="w-4 h-4 mr-1" />
                PDF
              </Button>
            )}
            {onExportTXT && (
              <Button variant="outline" size="sm" onClick={onExportTXT}>
                <Download className="w-4 h-4 mr-1" />
                TXT
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Ingredients */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            Ingredients
          </h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
        
        <Separator />
        
        {/* Instructions */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Instructions</h3>
          <ol className="space-y-3">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <Badge variant="outline" className="min-w-[2rem] h-6 flex items-center justify-center text-xs">
                  {index + 1}
                </Badge>
                <p className="text-sm text-foreground leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
        
        {/* Tips */}
        {recipe.tips && recipe.tips.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Cooking Tips
              </h3>
              <ul className="space-y-2">
                {recipe.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        
        {/* Video Link */}
        {videoUrl && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Video Tutorial</h3>
              <Button variant="outline" asChild className="w-full">
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch Cooking Video
                </a>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}