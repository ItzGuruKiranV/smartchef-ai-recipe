import { useState } from "react"
import { ArrowLeft, Sparkles, Send, Trash2 } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { VoiceInputBox } from "@/components/VoiceInputBox"
import { LoaderSpinner } from "@/components/LoaderSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import api from "../api"
import { useNavigate } from "react-router-dom"

interface Recipe {
  title: string 
  ingredients: string[]
  steps: string[]
  tips: string[]
  estimated_time: string
}

export const Manual = () => {
  const [ingredients, setIngredients] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "No ingredients entered",
        description: "Please enter your ingredients first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post("/generate-recipe", {
        ingredients: ingredients.trim(),
      })

      const resultArray = response?.data?.recipes
      console.log("✅ Raw API Response:", resultArray)

      if (!Array.isArray(resultArray) || resultArray.length === 0) {
        throw new Error("No recipes found in response.")
      }

      navigate("/results", {
        state: {
          data: resultArray,
          manualIngredients: ingredients.split(",").map(i => i.trim()),
        },
      })

    } catch (error) {
      console.error("❌ API Error:", error)
      toast({
        title: "API Error",
        description: "Failed to fetch recipe. Try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearIngredients = () => {
    setIngredients("")
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center animate-fade-in-up mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Manual Ingredient Entry
            </h1>
            <p className="text-muted-foreground">
              Tell us what ingredients you have and we’ll create a recipe for you
            </p>
          </div>

          <div className="space-y-6 animate-fade-in-up">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Your Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter your ingredients separated by commas. You can type or use voice input.
                </p>

                <VoiceInputBox
                  value={ingredients}
                  onChange={(newTextOrUpdater) =>
                    typeof newTextOrUpdater === "string"
                      ? setIngredients(newTextOrUpdater)
                      : setIngredients(prev => newTextOrUpdater(prev))
                  }
                  placeholder="e.g., tomatoes, rice, garlic, cheese"
                />

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Example: onion, paneer, spinach, cumin, oil
                  </p>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={clearIngredients}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="chef"
              size="xl"
              onClick={handleSubmit}
              disabled={!ingredients.trim() || isLoading}
              className="w-full"
            >
              <Send className="w-5 h-5 mr-2" />
              Generate Recipe
            </Button>
          </div>

          {isLoading && (
            <div className="my-10">
              <LoaderSpinner size="lg" text="Creating your recipe from ingredients..." />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
