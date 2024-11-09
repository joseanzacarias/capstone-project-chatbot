import { useRef, useState } from 'react';
import './App.css';



function App() {
  const [transcript, setTranscript] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const recognition = useRef<any>(null);
  const conversation = useRef<string[]>([]);

  // Testing constant for ElevenLabs TTS
  const testText: string = "I never thought it would feel this empty. Every corner of this room, once filled with laughter, now feels like a distant memory. Its strange how silence can feel so loud, echoing the moments that are now just memories.";

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    // setRecognition(new SpeechRecognition());
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    console.log("recognition 2", recognition);

    recognition.current.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      console.log("finalTranscript", finalTranscript);
      setTranscript(finalTranscript);
      conversation.current.push(finalTranscript);
      // fetchLLMResponse(transcript)

    };

    recognition.current.start();
  };

  const fetchLLMResponse = async (prompt: string) => {
    const apiUrl = "http://localhost:1234/v1/chat/completions";
    
    const data = {
      model: "local-model",
      // prompt: prompt,
      messages: [{ role: 'user', content: 'Hello how are you?' }],
      temperature: 0.7
    };

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer lm-studio`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const result = await res.json();
      setResponse(result.choices[0].message.content);
      conversation.current.push(result.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Failed to fetch the response");
    }
  };

  // Function to fetch audio from ElevenLabs
  const playGeneratedAudio = async () => {
    try {
      const res = await fetch('http://localhost:5000/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testText }), // replace with fetchLLMResponse output if needed
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);
    } catch (error) {
      console.error('Error fetching audio from ElevenLabs:', error);
    }
  };

  return (
    <>
      <div className='flex flex-col justify-center items-center p-8 gap-y-4'>
        <div className='h-[40rem] w-[70%] flex flex-col justify-end items-start border botder-gray-400 gap-y-4 p-4'>
          {conversation.current.map((item, index) => (
            <span className='bg-gray-600 p-2 rounded-lg' key={index}>{item}</span>
          ))}
        </div>
        <div className='flex justify-center gap-x-8'>
        <button onClick={() => startRecognition()}>Start</button>
        <button severity="danger" onClick={recognition.current && recognition.current.stop()}>Stop</button>
        <button onClick={() => fetchLLMResponse('Whats the capital of venezuela, give me a short answer')}>Get response</button>
          <button onClick={playGeneratedAudio}>Play Audio from ElevenLabs</button>
        </div>
        {audioSrc && <audio src={audioSrc} controls autoPlay />}
      </div>
    </>
  );
}

export default App;
