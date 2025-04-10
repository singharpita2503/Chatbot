import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";

const App = () => {
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);

  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);
  

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
        setResponse(res.data.response); // ✅ use 'answer' instead of 'response'
        speakResponse(res.data.response);
      } catch (error) {
        setResponse("सर्वर से संपर्क नहीं हो सका।");
      }
    }
  };

  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
  
    console.log("Available voices:", voices);
  
    const swaraVoice = voices.find(
      (voice) => voice.name.includes("Swara") && voice.lang === "hi-IN"
    );
  
    if (!swaraVoice) {
      console.warn("Swara voice not found, using default Hindi voice.");
    }
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = swaraVoice || voices.find((v) => v.lang === "hi-IN");
    utterance.lang = "hi-IN";
    synth.speak(utterance);
  };
  
  

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🔊 हिंदी चैटबॉट - <span style={{ color: "#c0392b" }}>वाणी</span></h2>
      <button onClick={startListening} disabled={listening}>
        🎤 बोलना शुरू करें
      </button>
      <button onClick={stopListening} disabled={!listening}>
        🛑 रोकें
      </button>
      <p>👂 आपने कहा: {transcript}</p>
      <h3>🧕 वाणी: {response}</h3>
    </div>
  );
};

export default App;
