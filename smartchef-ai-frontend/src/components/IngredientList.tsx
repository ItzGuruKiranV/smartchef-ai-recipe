import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface IngredientListProps {
  ingredients: string[]
  title?: string
}

export const IngredientList = ({ ingredients, title = "Detected Ingredients" }: IngredientListProps) => {
  return (
    <Card className="shadow-card animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 text-sm bg-success/10 text-success-foreground border border-success/20 hover:bg-success/20 transition-smooth"
            >
              {ingredient}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} identified
        </p>
      </CardContent>
    </Card>
  )
}