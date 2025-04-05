from flask import Flask, request, jsonify
from indicnlp.tokenize import indic_tokenize
from indicnlp import common
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



# Set resources path
INDIC_NLP_RESOURCES = r"C:\Users\singh\OneDrive\Desktop\A_CIPHER\bot\indic_nlp_resources"
common.set_resources_path(INDIC_NLP_RESOURCES)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")

    # Tokenize Hindi input
    tokens = list(indic_tokenize.trivial_tokenize(user_input, lang='hi'))

    # 💡 Rule-based response logic here:
    if any(tok in tokens for tok in ["क", "ख", "ग", "घ"]):
        response = "ये हिंदी के अक्षर हैं। अच्छा काम!"
    elif any(char in user_input.lower() for char in ["a", "b", "c", "d"]):
        response = "ये अंग्रेजी के अक्षर हैं!"
    elif any(num in user_input for num in ["1", "2", "3", "4"]):
        response = "यह संख्या है। बहुत बढ़िया!"
    else:
        response = "माफ़ कीजिए, मैं समझ नहीं पाया।"

    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
