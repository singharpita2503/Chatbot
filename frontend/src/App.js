import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";

const App = () => {
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) {
        setTimeout(loadVoices, 100); // Retry until voices are loaded
      }
    };
    loadVoices();
  }, []);

  const startListening = () => {
    setListening(true);
    SpeechRecognition.startListening({ language: "hi-IN", continuous: true });
  };

  const stopListening = async () => {
    setListening(false);
    SpeechRecognition.stopListening();

    if (transcript.trim()) {
      try {
        const res = await axios.post("http://localhost:5000/chat", { message: transcript });
        const reply = res.data.response;
        setResponse(reply);
        speakResponse(reply);
      } catch (error) {
        setResponse("माफ कीजिए, सर्वर से संपर्क नहीं हो सका।");
      }
    }
  };

  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
  
    const speak = () => {
      const voices = synth.getVoices();
      
      // ✅ Prefer Kalpana voice if available
      const preferredVoice = voices.find(v => v.name.toLowerCase().includes("kalpana"))
        || voices.find(v => v.lang === "hi-IN");
  
      if (!preferredVoice) {
        console.warn("कोई उपयुक्त हिंदी आवाज़ नहीं मिली।");
        return;
      }
  
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = preferredVoice;
      utterance.lang = "hi-IN";
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
  
      utterance.onend = () => resetTranscript();
  
      synth.cancel(); // Just to be safe
      synth.speak(utterance);
    };
  
    if (!synth.getVoices().length) {
      // Just once to make sure voices are loaded
      window.speechSynthesis.onvoiceschanged = speak;
    } else {
      speak();
    }
  };
  
  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h2>🔊 हिंदी चैटबॉट - <span style={{ color: "#c0392b" }}>वाणी</span></h2>

      <div>
        <button onClick={startListening} disabled={listening}>🎤 बोलना शुरू करें</button>
        <button onClick={stopListening} disabled={!listening}>🛑 रोकें</button>
      </div>

      {listening && <p style={{ color: "green" }}>🟢 सुन रहा हूँ...</p>}
      {transcript && <p>👂 आपने कहा: {transcript}</p>}
      {response && <h3>🧕 वाणी: {response}</h3>}
    </div>
  );
};

export default App;
