import requests
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("SPOONACULAR_API_KEY")

def get_nutrition_from_ingredients(ingredients: list[str]) -> dict:
    url = "https://api.spoonacular.com/recipes/parseIngredients"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    payload = {
        "ingredientList": "\n".join(ingredients),
        "servings": 1
    }

    params = {
        "apiKey": API_KEY,
        "includeNutrition": True
    }

    response = requests.post(url, headers=headers, params=params, data=payload)

    total = {"calories": 0.0, "protein": 0.0, "fat": 0.0, "carbs": 0.0}

    try:
        data = response.json()

        for item in data:
            if "nutrition" in item:
                for nutrient in item["nutrition"]["nutrients"]:
                    name = nutrient["name"].lower()
                    if name in total:
                        total[name] += nutrient["amount"]
            else:
                print(f"⚠️ No nutrition data for ingredient: {item.get('original', 'unknown')}")
    except Exception as e:
        print("❌ API error:", e)
        print("Raw response:", response.text)

    return {
        "calories": round(total["calories"], 2),
        "protein": round(total["protein"], 2),
        "fat": round(total["fat"], 2),
        "carbs": round(total["carbs"], 2),
    }




