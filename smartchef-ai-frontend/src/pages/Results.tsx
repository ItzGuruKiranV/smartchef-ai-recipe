import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
  estimated_time: string;
  nutrition?: Nutrition;
  image?: string;
}

// Unsplash Access Key
const UNSPLASH_ACCESS_KEY = "HNhl-jrbsLqSuc09G0OulyZMmr8IUkGmNZ5SUS-92XE";

// Fetch image from Unsplash API
const fetchImageFromUnsplash = async (query: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&orientation=landscape`
    );
    const data = await response.json();
    return data.results?.[0]?.urls?.regular ?? null;
  } catch (err) {
    console.error("Error fetching image:", err);
    return null;
  }
};

export const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const initialData: Recipe[] = state?.data || [];
  const manualIngredients: string[] = state?.manualIngredients || [];

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateImages = async () => {
      const updated = await Promise.all(
        initialData.map(async (recipe) => {
          if (!recipe.image) {
            const img = await fetchImageFromUnsplash(recipe.title);
            return { ...recipe, image: img || "https://via.placeholder.com/600x400?text=No+Image" };
          }
          return recipe;
        })
      );
      setRecipes(updated);
      setLoading(false);
    };

    updateImages();
  }, [initialData]);

  if (!initialData.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-orange-100">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-rose-700">No Recipes Found</h1>
            <p className="text-gray-600">Please go back and enter ingredients.</p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-teal-50 dark:from-zinc-900 dark:to-zinc-800 flex flex-col">
      <Header />

      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 rounded-xl p-6 shadow-lg">
          <div>
            <h2 className="text-3xl font-bold text-white">✨ Your Custom Recipes</h2>
            <p className="text-sm text-white/80">
              Ingredients: <span className="font-semibold">{manualIngredients.join(", ")}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate("/")}
              className="bg-white text-pink-600 hover:bg-pink-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/manual")}
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading
          ? [...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-white rounded-2xl shadow-lg h-96"
              ></div>
            ))
          : recipes.map((recipe, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Image Section */}
                <div className="relative h-64">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Image failed to load for recipe: ${recipe.title}`);
                      (e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/600x400?text=Image+Not+Available";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 text-xs px-3 py-1 rounded-full shadow font-semibold text-pink-600">
                    ⏱ {recipe.estimated_time}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    {index + 1}. {recipe.title}
                  </h3>

                  {/* Nutrition Info */}
                  {recipe.nutrition && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {Object.entries(recipe.nutrition).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-gradient-to-r from-teal-100 via-emerald-50 to-green-100 rounded-xl p-3 text-center shadow"
                        >
                          <p className="text-gray-800 font-semibold text-lg">
                            {value}
                            {key !== "calories" && "g"}
                          </p>
                          <p className="text-xs uppercase text-gray-500">{key}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Ingredients */}
                  <div className="mb-4">
                    <h4 className="font-bold text-pink-600 mb-2">🧂 Ingredients</h4>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                      {recipe.ingredients.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps */}
                  <div className="mb-4">
                    <h4 className="font-bold text-orange-500 mb-2">👨‍🍳 Steps</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                      {recipe.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Tips */}
                  {recipe.tips.length > 0 && (
                    <div>
                      <h4 className="font-bold text-indigo-500 mb-2">💡 Tips</h4>
                      <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                        {recipe.tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>

      <Footer />
    </div>
  );
};
