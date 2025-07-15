import cohere
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

co = cohere.Client(os.getenv("COHERE_API_KEY"))

def extract_json(text):
    # Remove markdown formatting like ```json ... ```
    json_match = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if json_match:
        return json_match.group(1).strip()
    return text.strip()

def generate_recipes_from_ingredients(ingredients: str):
    user_ingredients = [item.strip() for item in ingredients.split(",") if item.strip()]

    prompt = f"""
From the following ingredients: {', '.join(user_ingredients)}

Generate exactly 4 structured recipes.

Each recipe should include:
- title: string
- ingredients: list of strings (with quantities)
- steps: list of strings (numbered)
- tips: list of 2–3 short strings
- estimated_time: string

Respond only with a valid JSON array of 3 recipe objects. Do not include markdown, explanations, or extra text.
"""

    try:
        response = co.chat(
            chat_history=[],
            message=prompt,
            model="command-r-plus",
            temperature=0.7,
            max_tokens=1500,
        )

        if not response or not response.text:
            return {"error": "Empty response from Cohere"}

        raw_text = response.text.strip()
        print("🧾 Raw Cohere Response:", raw_text)

        # ✅ Extract valid JSON string from markdown if present
        clean_text = extract_json(raw_text)

        recipes = json.loads(clean_text)
        return recipes

    except Exception as e:
        print("❌ Error parsing or fetching recipes:", str(e))
        return {"error": str(e)}