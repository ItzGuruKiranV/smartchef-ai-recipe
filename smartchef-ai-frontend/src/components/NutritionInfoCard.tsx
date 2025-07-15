import { Activity, Zap, Droplets, Wheat } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Nutrition {
  calories: number
  protein: string
  fats: string
  carbs: string
}

interface NutritionInfoCardProps {
  nutrition: Nutrition
}

export const NutritionInfoCard = ({ nutrition }: NutritionInfoCardProps) => {
  const nutritionItems = [
    {
      label: "Calories",
      value: nutrition.calories,
      unit: "kcal",
      icon: Zap,
      color: "text-orange-500"
    },
    {
      label: "Protein",
      value: nutrition.protein,
      unit: "",
      icon: Activity,
      color: "text-blue-500"
    },
    {
      label: "Carbs",
      value: nutrition.carbs,
      unit: "",
      icon: Wheat,
      color: "text-yellow-500"
    },
    {
      label: "Fats",
      value: nutrition.fats,
      unit: "",
      icon: Droplets,
      color: "text-green-500"
    }
  ]

  return (
    <Card className="shadow-card animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Nutrition Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {nutritionItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="text-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                <div className="text-lg font-bold text-foreground">
                  {item.value}{item.unit}
                </div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          * Nutritional values are estimates based on typical ingredient portions
        </p>
      </CardContent>
    </Card>
  )
}