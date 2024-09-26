import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [transcript, setTranscript] = useState('');

  const startRecognition = () => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      console.log("finalTranscript", finalTranscript);
      setTranscript(finalTranscript);
      
    };

    recognition.start();
  };


  return (
    <>
      <div>
        <h2>Real-time Speech to Text</h2>
        <button onClick={startRecognition}>Start</button>
        <p class="font-xl">{transcript}</p>
      </div>
    </>
  )
}

export default App

