import cohere
import base64
import os
import re

co = cohere.ClientV2(os.getenv("COHERE_API_KEY"))

def detect_ingredients(image_path: str):
    # Convert image to Base64
    with open(image_path, "rb") as img:
        b64 = base64.b64encode(img.read()).decode()
        img_data = f"data:image/jpeg;base64,{b64}"

    # Very strict prompt to avoid extra text
    response = co.chat(
        model="c4ai-aya-vision-32b",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": img_data}},
                    {"type": "text", "text": "Return ONLY the ingredient names as a comma-separated list. No headings, no sentences, no numbering, no extra words. Example: cilantro, garlic, lime, ginger"}
                ]
            }
        ]
    )

    raw_text = response.message.content[0].text.strip()
    print(f"Raw API Response: {raw_text}")

    # ✅ Clean unwanted characters
    cleaned_text = re.sub(r"[^a-zA-Z,\s]", "", raw_text)  # Remove numbers and symbols
    cleaned_text = cleaned_text.lower()

    # ✅ Convert to list
    ingredients = [item.strip() for item in cleaned_text.split(",") if item.strip()]

    print(f"Final Ingredients: {ingredients}")
    return ingredients
