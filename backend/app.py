from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from openai import OpenAI

client = OpenAI(
    api_key="",
    base_url="https://api.groq.com/openai/v1"
)

app = Flask(__name__)
CORS(app)

def get_ingredients(dish_name):
    prompt = f'''
List only the **specific ingredients** needed to make the dish "{dish_name}".
- Do **not** include steps or quantities.
- Do **not** use vague terms like "toppings", "spices", or "seasonings".
- Instead, provide real examples like "pepperoni", "oregano", "onions", etc.
- Return the ingredients in a simple list, one per line, with no introduction.
'''
    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=300
    )
    content = response.choices[0].message.content
    return [line.strip("-• ").strip().lower() for line in content.split("\n") if line.strip()]

def load_inventory(file_path="inventory.json"):
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)

def display_matches(dish_ingredients, inventory):
    results = []
    for ingredient in dish_ingredients:
        matches = [key for key in inventory if ingredient in key or key in ingredient]
        match_items = []
        for match_key in matches:
            for item in inventory[match_key]:
                match_items.append(item)
        results.append({
            "ingredient": ingredient,
            "matches": match_items
        })
    return results

@app.route("/find_ingredients", methods=["POST"])
def find_ingredients():
    data = request.get_json()
    dish = data.get("dish")
    print("Received dish:", dish)
    if not dish:
        print("No dish provided")
        return jsonify({"error": "No dish provided"}), 400
    try:
        dish_ingredients = get_ingredients(dish)
        print("AI ingredients:", dish_ingredients)
        inventory = load_inventory()
        matches = display_matches(dish_ingredients, inventory)
        print("Matches:", matches)
        return jsonify({
            "ingredients": dish_ingredients,
            "matches": matches
        })
    except Exception as e:
        print("Error in backend:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)