from flask import Flask, request, jsonify
import json
import random
from indicnlp import common
from indicnlp.tokenize import indic_tokenize
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Set path to Indic NLP Resources
INDIC_RESOURCES_PATH = r"C:\\Users\\singh\\OneDrive\\Desktop\\A_CIPHER\\bot\\indic_nlp_resources"
common.set_resources_path(INDIC_RESOURCES_PATH)
LANG_CODE = 'hi'

# Load intents.json
with open("intents.json", "r", encoding="utf-8") as f:
    intents = json.load(f)["intents"]

# Tokenize text
def process_text(text):
    return list(indic_tokenize.trivial_tokenize(text.lower(), LANG_CODE))

# Generate response
def get_response(user_input):
    user_tokens = process_text(user_input)
    max_score = 0
    best_response = None

    for intent in intents:
        for pattern in intent["patterns"]:
            pattern_tokens = process_text(pattern)
            score = len(set(user_tokens) & set(pattern_tokens))

            if score > max_score:
                max_score = score
                best_response = random.choice(intent["responses"])

    return best_response or "माफ कीजिए, मैं समझ नहीं पाई। कृपया फिर से कहिए।"

# API route
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")
    if not user_input.strip():
        return jsonify({'response': "कृपया कुछ कहें।"})
    response = get_response(user_input)
    return jsonify({'response': response})

if __name__ == "__main__":
    app.run(debug=True)
