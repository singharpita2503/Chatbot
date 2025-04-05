import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";

const App = () => {
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);

  const { transcript, resetTranscript } = useSpeechRecognition();

  const startListening = () => {
    setListening(true);
    SpeechRecognition.startListening({ language: "hi-IN", continuous: true });
  };

  const stopListening = async () => {
    setListening(false);
    SpeechRecognition.stopListening();

    if (transcript) {
      try {
        const res = await axios.post("http://localhost:5000/chat", { message: transcript });
        setResponse(res.data.response);
        speakResponse(res.data.response);
      } catch (error) {
        setResponse("सर्वर से संपर्क नहीं हो सका।");
      }
    }
  };

  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    synth.speak(utterance);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🔊 हिंदी चैटबॉट</h2>
      <button onClick={startListening} disabled={listening}>
        🎤 बोलना शुरू करें
      </button>
      <button onClick={stopListening} disabled={!listening}>
        🛑 रोकें
      </button>
      <p>👂 आपने कहा: {transcript}</p>
      <h3>🤖 जवाब: {response}</h3>
    </div>
  );
};

export default App;
