from flask import Flask, request, jsonify
import json
import random
from indicnlp import common
from indicnlp.tokenize import indic_tokenize
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 🧠 Set path to Indic NLP Resources
INDIC_RESOURCES_PATH = r"C:\\Users\\singh\\OneDrive\\Desktop\\A_CIPHER\\bot\\indic_nlp_resources"
common.set_resources_path(INDIC_RESOURCES_PATH)
LANG_CODE = 'hi'

# 📁 Load intents.json (your data)
with open("intents.json", "r", encoding="utf-8") as f:
    intents = json.load(f)["intents"]

# 🔍 Process input
def process_text(text):
    return list(indic_tokenize.trivial_tokenize(text.lower(), LANG_CODE))

# 🧠 Match user input
def get_response(user_input):
    user_tokens = process_text(user_input)
    for intent in intents:
        for pattern in intent["patterns"]:
            pattern_tokens = process_text(pattern)
            if any(token in user_tokens for token in pattern_tokens):
                return random.choice(intent["responses"])
    return "माफ कीजिए, मैं समझ नहीं पाई। कृपया फिर से कहिए।"

# 🚀 Flask App Route
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")
    response = get_response(user_input)
    return jsonify({'response': response})  # ✅ FIXED HERE

if __name__ == "__main__":
    app.run(debug=True)
