import { useRef, useState } from 'react';
import './App.css';
import {TEST_SCENARIO} from './scenarios/prompts';
import React, { useEffect } from 'react';


function App() {

  interface Message {
    role: 'user' | 'system' | 'assistant';
    content: string;
  }

  const [response, setResponse] = useState<string>('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const recognition = useRef<any>(null);
  const conversation = useRef<string[]>([]);
  const isRecording = useRef(false);
  const currentTranscript = useRef('');


  // const [fullConversation, setFullConversation] = useState<Message[]>([]);
  // const fullConversation = useRef<Message[]>([]);
  const fullConversation = useRef<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Testing constant for ElevenLabs TTS
  const testText: string = "I never thought it would feel this empty. Every corner of this room, once filled with laughter, now feels like a distant memory. Its strange how silence can feel so loud, echoing the moments that are now just memories.";
  
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  useEffect(() => {

    if (fullConversation.current.length > 0) return
    console.log("Component did mount");
    
    fullConversation.current.push({ role: 'system', content: TEST_SCENARIO });
    fetchLLMResponse(fullConversation.current)

    // return () => {
    //   console.log("Component will unmount");
    // };
  }, []); // Empty dependency array ensures it only runs once


  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    recognition.current = new SpeechRecognition();
    console.log(recognition.current)
    recognition.current.continuous = true;
    recognition.current.interimResults = true;


    recognition.current.onresult = async (event) => {
      if (isRecording.current) return
      currentTranscript.current = '';

      console.log("event.results", event.results);
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        console.log("event.results[i][0].transcript", event.results[i][0].transcript);
        currentTranscript.current += event.results[i][0].transcript;
      }
    };
    
    recognition.current.start();
    isRecording.current = true;
  };

  const stopRecord =  async () => {
    isRecording.current = false;
    recognition.current.stop();
    await delay(100);
    console.log("Stop recording", currentTranscript.current);
    fullConversation.current.push({ role: 'user', content: currentTranscript.current });
      
    setLoading(true);
    await fetchLLMResponse(fullConversation.current)
    currentTranscript.current = '';
    setLoading(false);
    
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
      console.log('fullConversation', fullConversation.current);
      
      setUserInput('');
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Failed to fetch the response");
    } finally {
      setLoading(false);
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
      <div className='h-[40rem] w-[50%] block items-start border border-gray-400 gap-y-4 p-4 overflow-y-auto'>
        {fullConversation.current.map((item, index) => (
            item.role !== 'system' && index > 1 && (
              <div className={`flex w-full ${item.role === 'user' ? 'justify-end' : 'justify-start'} `}>
                <span className={`max-w-[60%] flex  p-4 rounded-lg mt-4 ${item.role === 'user' ? 'bg-green-900' : 'bg-gray-500'} `} key={index}>
                  {item.content ?? 'nan'}
                </span>
              </div>
            )
          // <span className='flex bg-gray-600 p-4 rounded-lg' key={index}>{item.content ?? 'nan'}</span>
        ))}
      </div>
      <div className='flex justify-center gap-x-8'>
        <button onClick={() => startRecognition()}>Start</button>
        <button className='btn-danger' onClick={() => stopRecord()}>Stop</button>
      </div>

      <div className='flex justify-center gap-x-8'>
        <button onClick={playGeneratedAudio}>Play Audio from ElevenLabs</button>
        <div>
          {audioSrc && <audio src={audioSrc} controls autoPlay />}
        </div>
      </div>
    </div>
    </>
  )
}

export default App
