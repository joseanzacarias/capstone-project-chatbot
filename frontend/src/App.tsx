import { useRef, useState } from 'react'
import './App.css'
    


function App() {

  interface Message {
    role: 'user' | 'assistant';
    content: string;
  }

  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<string>('');
  const recognition = useRef<any>(null);
  const conversation = useRef<string[]>([]);

  // const [fullConversation, setFullConversation] = useState<Message[]>([]);
  // const fullConversation = useRef<Message[]>([]);
  const fullConversation = useRef<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);


  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;

    recognition.current.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      fullConversation.current.push({ role: 'user', content: finalTranscript });
      

      console.log('fullConversation', fullConversation);
      

      fetchLLMResponse(fullConversation.current)
      setLoading(true);
    };
    recognition.current.start();
  }

  const stopRecord = () => {
    if (!recognition.current) return
    recognition.current.stop();
  }

  const fetchLLMResponse = async (messages) => {
    const apiUrl = "http://localhost:1234/v1/chat/completions";
    
    const data = {
      model: "local-model",
      // prompt: prompt,
      messages,
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
      // -------
      const assistantMessage = result.choices[0].message.content;

      // Update conversation with the assistant's response
      // setFullConversation([
      //   ...messages,
      //   { role: 'assistant', content: assistantMessage },
      // ]);

      fullConversation.current.push({ role: 'assistant', content: assistantMessage });
      setUserInput('');
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Failed to fetch the response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className='flex flex-col justify-center items-center p-8 gap-y-4'>
      <div className='h-[40rem] w-[70%] flex flex-col justify-end items-start border botder-gray-400 gap-y-4 p-4'>
        {fullConversation.current.map((item, index) => (
          <span className='bg-gray-600 p-2 rounded-lg' key={index}>{item.content ?? 'nan'}</span>
        ))}
      </div>
      <div className='flex justify-center gap-x-8'>
        <button onClick={() => startRecognition()}>Start</button>
        <button className='btn-danger' onClick={() => stopRecord()}>Stop</button>
      </div>
    </div>
    </>
  )
}

export default App

