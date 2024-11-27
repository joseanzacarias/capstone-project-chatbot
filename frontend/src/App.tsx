import 'regenerator-runtime/runtime';
import { useRef, useState } from 'react';
import './App.css';
import { TEST_SCENARIO } from './scenarios/prompts';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import React, { useEffect } from 'react';

function App() {
  interface Message {
    role: 'user' | 'system' | 'assistant';
    content: string;
  }

  const [response, setResponse] = useState<string>('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const conversation = useRef<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [generatingFeedback, setGeneratingFeedback] = useState<boolean>(false);
  const [isFeedbackGenerated, setIsFeedbackGenerated] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [selectedVoice, setSelectedVoice] = useState<string>('iP95p4xoKVk53GoZ742B');

  const fullConversation = useRef<Message[]>([]);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const textTest = 'Sure! We offer a wide range of services, including web development, mobile app development, and more. How can I assist you further?'

  const conversationTest = [
    { role: 'system', content: TEST_SCENARIO },
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there! How can I help you today?' },
    { role: 'user', content: 'Can you tell me more about your services?' },
    {
      role: 'assistant',
      content:
        'Sure! We offer a wide range of services, including web development, mobile app development, and more. How can I assist you further?',
    },
    { role: 'user', content: 'Can you help me with a project?' },
    { role: 'assistant', content: 'Of course! Please provide me with more details about your project and I will do my best to assist you.' },
    { role: 'user', content: 'I need help with a mobile app development project.' },
    { role: 'assistant', content: 'Great! What specific help do you need with your mobile app development project?' },
    { role: 'user', content: 'I need help with designing the user interface.' },
    { role: 'user', content: 'Can you help me with a project?' },
    { role: 'assistant', content: 'Of course! Please provide me with more details about your project and I will do my best to assist you.' },
    { role: 'user', content: 'I need help with a mobile app development project.' },
    { role: 'assistant', content: 'Great! What specific help do you need with your mobile app development project?' },
    { role: 'user', content: 'I need help with designing the user interface.' },
    { role: 'user', content: 'Can you help me with a project?' },
    { role: 'assistant', content: 'Of course! Please provide me with more details about your project and I will do my best to assist you.' },
    { role: 'user', content: 'I need help with a mobile app development project.' },
    { role: 'assistant', content: 'Great! What specific help do you need with your mobile app development project?' },
    { role: 'user', content: 'I need help with designing the user interface.' },
    ]

  useEffect(() => {
    if (fullConversation.current.length > 0) return;

    fullConversation.current.push({ role: 'system', content: TEST_SCENARIO });
    fetchLLMResponse(fullConversation.current);
  }, []);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom on initial load
  }, []);

  const voiceDetails: Record<string, { name: string; description: string; avatar: string }> = {
    iP95p4xoKVk53GoZ742B: {
      name: 'Chris',
      description: 'An experienced conversationalist with a calm and soothing voice, perfect for relaxed discussions.',
      avatar: 'https://via.placeholder.com/40',
    },
    IKne3meq5aSn9XLyUdCD: {
      name: 'Charlie',
      description: 'A friendly and enthusiastic assistant, always eager to help you out.',
      avatar: 'https://via.placeholder.com/40',
    },
    cgSgspJ2msm6clMCkdW9: {
      name: 'Jessica',
      description: 'A sharp and witty voice, providing insightful suggestions and advice.',
      avatar: 'https://via.placeholder.com/40',
    },
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop Recording
      SpeechRecognition.stopListening();
      fullConversation.current.push({ role: 'user', content: transcript });
      resetTranscript();
    } else {
      // Start Recording
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsRecording(!isRecording);
  };

  const fetchLLMResponse = async (messages: Message[]) => {
    try {
      const res = await fetch('http://192.168.2.15:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer lm-studio`,
        },
        body: JSON.stringify({
          model: 'local-model',
          messages,
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);

      const result = await res.json();
      setResponse(result.choices[0].message.content);
      fullConversation.current.push({
        role: 'assistant',
        content: result.choices[0].message.content,
      });
    } catch (error) {
      setResponse('Failed to fetch response');
    }
  };

  // const playGeneratedAudio = async (textToSpeech: string) => {
  //   try {
  //     const res = await fetch('http://localhost:5000/synthesize', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ text: textToSpeech, voice: selectedVoice }),
  //     });

  //     if (!res.ok) {
  //       throw new Error(`Error: ${res.statusText}`);
  //     }

  //     const audioBlob = await res.blob();
  //     const audioUrl = URL.createObjectURL(audioBlob);
  //     setAudioSrc(audioUrl);
  //   } catch (error) {
  //     console.error('Error fetching audio from ElevenLabs:', error);
  //   }
  // };

  const stopSession = async () => {
    setGeneratingFeedback(true); // Start feedback generation
    scrollToBottom();

    // Simulate feedback generation (replace this with actual API call if needed)
    setTimeout(() => {
      setGeneratingFeedback(false); // Stop feedback generation
      setIsFeedbackGenerated(true); // Feedback generated
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 shadow-md flex justify-start items-start">
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="bg-gray-700 text-white text-base p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(voiceDetails).map(([voiceId, details]) => (
            <option key={voiceId} value={voiceId} className="text-black">
              {details.name} - {details.description}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
        {conversationTest.map(
          (item, index) =>
            item.role !== 'system' && (
              <div
                key={index}
                className={`flex w-full ${
                  item.role === 'user' ? 'justify-end' : 'justify-start'
                } mb-4`}
              >
                <div
                  className={`max-w-[60%] px-4 py-2 rounded-lg ${
                    item.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300 text-black' // Assistant text color is black
                  }`}
                >
                  {item.content}
                </div>
              </div>
            )
        )}  
           {/* Generating Feedback */}
        {generatingFeedback && (
          <div className="flex justify-start items-center px-4 py-2">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full"></div>
              <span>Generating feedback...</span>
            </div>
          </div>
        )}
          {/* Feedback Generated */}
        {isFeedbackGenerated && (
          <div className="flex justify-start items-center px-4 py-2">
            <div className="flex items-center gap-2 text-gray-600">
              <span>Feedback generated successfully!</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
        
      </div>

      {/* Controls */}
      <div className="bg-white p-4 flex justify-between items-center border-t">
          {/* Audio Bar */}
        <audio
          controls
          autoPlay
          src={audioSrc || ''}
          className="flex-grow max-w-sm rounded-lg"
        >
          Your browser does not support the audio element.
        </audio>
        {/* Button Group */}
        <div className="flex gap-2">
          {/* Stop Session Button */}
          <button
            onClick={stopSession}
            disabled={isRecording}
            className={`flex items-center justify-center px-4 py-2 rounded-full border transition-colors font-medium ${
              isRecording
                ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            Stop session
          </button>
          
          {/* Toggle Recording Button */}
          <button
            onClick={toggleRecording}
            className={`flex items-center justify-center w-12 h-12 rounded-full text-white transition-colors ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <i className={`fas ${isRecording ? 'fa-square' : 'fa-microphone'}`}></i>
          </button>
        </div>
      </div>

    </div>
  );
}

export default App;