import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from recipe_generator.image_recognition import detect_ingredients
from recipe_generator.generate_recipe import generate_recipes_from_ingredients
from recipe_generator.nutrition_generator import get_nutrition_from_ingredients
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# ✅ Path to React build folder
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "../smartchef-ai-frontend/dist")

# ✅ Serve static assets (CSS, JS)

# Initialize FastAPI app
app = FastAPI(title="SmartChef AI API", description="AI-powered recipe generator 🍳")

# Upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠ Update this in production for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model for recipe generation
class IngredientRequest(BaseModel):
    ingredients: str

@app.get("/")
def home():
    return {"message": "✅ SmartChef AI backend is live!"}


# 🔹 Generate recipe from text ingredients
@app.post("/generate-recipe")
async def process_ingredients_to_full_data(data: IngredientRequest):
    try:
        raw_ingredient_input = data.ingredients.strip()
        if not raw_ingredient_input:
            return {"error": "Ingredients input cannot be empty."}

        # Step 1: Generate recipes using Cohere
        recipes = generate_recipes_from_ingredients(raw_ingredient_input)

        if isinstance(recipes, dict) and "error" in recipes:
            return recipes

        # Step 2: Add nutrition info
        for recipe in recipes:
            try:
                ingredients_list = recipe.get("ingredients", [])
                recipe["nutrition"] = get_nutrition_from_ingredients(ingredients_list)
            except Exception as e:
                recipe["nutrition"] = {"error": str(e)}

        return {
            "input": raw_ingredient_input,
            "recipes": recipes
        }

    except Exception as e:
        return {"error": f"Failed to generate recipe: {str(e)}"}

@app.post("/detect-ingredients")
async def detect(file: UploadFile = File(...)):
    try:
        # Step 1: Save uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename.replace(" ", "_"))
        with open(file_path, "wb") as out:
            out.write(await file.read())

        # Step 2: Detect ingredients from image
        ingredients_list = detect_ingredients(file_path)  # e.g. ["garlic", "onion"]
        ingredients_str = ", ".join(ingredients_list)

        # Step 3: Generate recipes from detected ingredients
        recipes = generate_recipes_from_ingredients(ingredients_str)

        if isinstance(recipes, dict) and "error" in recipes:
            return recipes

        # Step 4: Add nutrition info for each recipe
        for recipe in recipes:
            try:
                ing_list = recipe.get("ingredients", [])
                nutrition = get_nutrition_from_ingredients(ing_list)
                recipe["nutrition"] = nutrition
            except Exception as e:
                recipe["nutrition"] = {"error": str(e)}

        # ✅ Return only recipes as an array
        return recipes

    except Exception as e:
        return {"error": f"Failed to process image: {str(e)}"}



app.mount("/static", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="static")


# ✅ Catch-all route for React SPA
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "index.html not found"}
