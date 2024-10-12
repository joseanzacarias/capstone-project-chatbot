import { useRef, useState } from 'react'
import './App.css'
    


function App() {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<string>('');
  const recognition = useRef<any>(null);
  const conversation = useRef<string[]>([]);


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
  }

  const fetchLLMResponse = async (prompt) => {
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
      </div>
    </div>
    </>
  )
}

export default App

