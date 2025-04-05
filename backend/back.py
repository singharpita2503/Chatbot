from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import pyttsx3
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

app = Flask(__name__)
CORS(app)

# Initialize chatbot
chatbot = ChatBot("HindiBot")
trainer = ChatterBotCorpusTrainer(chatbot)
trainer.train("chatterbot.corpus.hindi")

# Initialize text-to-speech
engine = pyttsx3.init()
engine.setProperty("rate", 130)  # Adjust speaking speed
engine.setProperty("voice", "hi")  # Hindi voice

@app.route("/chat", methods=["POST"])
def chat():
    user_text = request.json.get("message")
    
    if not user_text:
        return jsonify({"response": "कृपया कुछ कहें।"})

    bot_response = str(chatbot.get_response(user_text))
    
    # Convert text to speech
    engine.say(bot_response)
    engine.runAndWait()

    return jsonify({"response": bot_response})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
