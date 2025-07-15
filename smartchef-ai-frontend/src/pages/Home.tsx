import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, PenTool, Sparkles } from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FileUploadCard } from "@/components/FileUploadCard"
import { LoaderSpinner } from "@/components/LoaderSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import heroImage from "@/assets/hero-cooking.jpg"

export const Home = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
  }

  const handleUploadAndGenerate = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image of your ingredients first.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('http://localhost:8000/detect-ingredients', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Navigate to results page with the data
      navigate('/results', { 
        state: { 
          data,
          imageFile: selectedFile
        } 
      })
    } catch (error) {
      console.error('Error processing image:', error)
      toast({
        title: "Processing failed",
        description: "Failed to process your image. Please try again or check if the backend is running.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualEntry = () => {
    navigate('/manual')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <LoaderSpinner size="lg" text="Analyzing your ingredients and generating recipe..." />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Fresh cooking ingredients" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Transform Your
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Ingredients </span>
                Into Magic
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Upload a photo of your ingredients and let our AI create personalized recipes, 
                complete with nutrition info and cooking videos.
              </p>
            </div>
            
            {/* Features Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up">
              <Card className="bg-background/50 backdrop-blur-sm border-border/40 shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Smart Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered ingredient detection from your photos
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-background/50 backdrop-blur-sm border-border/40 shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Personalized Recipes</h3>
                  <p className="text-sm text-muted-foreground">
                    Custom recipes tailored to your available ingredients
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-background/50 backdrop-blur-sm border-border/40 shadow-card">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <PenTool className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Nutrition Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed nutritional information for every recipe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Get Started</h2>
            <p className="text-muted-foreground">Upload your ingredient photo or enter them manually</p>
          </div>
          
          <div className="space-y-6">
            <FileUploadCard
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onFileRemove={handleFileRemove}
              isLoading={isLoading}
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="chef" 
                size="xl" 
                onClick={handleUploadAndGenerate}
                disabled={!selectedFile || isLoading}
                className="flex-1"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Recipe
              </Button>
              
              <Button 
                variant="outline" 
                size="xl" 
                onClick={handleManualEntry}
                className="flex-1"
              >
                <PenTool className="w-5 h-5 mr-2" />
                Manual Entry
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}