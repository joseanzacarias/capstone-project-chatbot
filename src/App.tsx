import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'regenerator-runtime/runtime';
import { useRef, useState } from 'react';
import './App.css';
import { TEST_SCENARIO, SECOND_SCENARIO, GOLD_STANDARD, HEALTH_GOLD_STANDARD } from './scenarios/prompts';
import { feedbackPrompt } from './scenarios/feedback-prompt';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import React, { useEffect } from 'react';

function App() {
  interface Message {
    role: 'user' | 'system' | 'assistant';
    content: string;
  }

  const scenariosData = [
    {
      id: "1",
      name: "Basic scenario",
      description: "Lazy student scenario",
      voiceId: 'iP95p4xoKVk53GoZ742B',
      systemPrompt: SECOND_SCENARIO
    },
    {
      id:"2",
      name: "Confidentiality",
      description: "Gold Standard",
      voiceId: 'IKne3meq5aSn9XLyUdCD',
      systemPrompt: GOLD_STANDARD
    },
    {
      id: "3",
      name: "Health Assesment",
      description: "Gold Standard",
      voiceId: 'cgSgspJ2msm6clMCkdW9',
      systemPrompt: HEALTH_GOLD_STANDARD
    }
    
  ]


  const [response, setResponse] = useState<string>('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [generatingFeedback, setGeneratingFeedback] = useState<boolean>(false);
  const [isFeedbackGenerated, setIsFeedbackGenerated] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const selectedScenario = useRef(scenariosData[0]);

  const fullConversation = useRef<Message[]>([]);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (fullConversation.current.length > 0) return;

    fullConversation.current.push({ role: 'system', content: selectedScenario.current.systemPrompt });
    fetchLLMResponse(fullConversation.current);
  }, []);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom on initial load
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false); // Ensure the button switches immediately
      SpeechRecognition.stopListening();
      fullConversation.current.push({ role: 'user', content: transcript });
      await fetchLLMResponse(fullConversation.current);
      resetTranscript();
    } else {
      // Start recording
      resetTranscript();
      setIsRecording(true);
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const fetchLLMResponse = async (messages: Message[]) => {
    setIsLoading(true);
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
          temperature: 0.91,
          "max_tokens": 200
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);

      const result = await res.json();
      setResponse(result.choices[0].message.content);
      fullConversation.current.push({
        role: 'assistant',
        content: result.choices[0].message.content,
      });
      if(fullConversation.current.length > 2) {
        playGeneratedAudio(result.choices[0].message.content);
      }
    } catch (error) {
      setResponse('Failed to fetch response');
    }
    setIsLoading(false);
  };

  const fetchFeedback = async (feedbackMessage: string) => {
    setGeneratingFeedback(true); // Start feedback generation
    try {
      const res = await fetch('http://192.168.2.15:1234/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer lm-studio`, },
        body: JSON.stringify({
          model: 'local-model',
          messages: [{
            role: 'system',
            content: feedbackMessage
          }],
          temperature: 0.7,
        })
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const result = await res.json();
      setFeedback(result.choices[0].message.content);
      setIsFeedbackGenerated(true);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
    setGeneratingFeedback(false); // Stop feedback generation
  }

  const playGeneratedAudio = async (textToSpeech: string) => {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedScenario.current.voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': 'sk_9cac98ed5ce0a3fb10bff8f2d09d13fa5c161a2b2056763a', // Replace with your ElevenLabs API key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSpeech,
          voice_settings: {
            stability: 0.15,
            similarity_boost: 0.85,
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);
    } catch (error) {
      console.error('Error fetching audio from ElevenLabs:', error);
    }
  };
  

  const stopSession = async () => {
    scrollToBottom();
    const conversation = fullConversation.current.map((item, index) => {
      if(index > 1){
        return `${item.role === 'assistant' ? 'Assistant' : 'User'}: ${item.content}`;
      }
    }).join('\n');
    const fullPrompt = `${feedbackPrompt} \n ${conversation}`;
    await fetchFeedback(fullPrompt);
  };

  const onScenariosChange = (id: string | number) => {
    // clear feedback
    setFeedback('');
    setIsFeedbackGenerated(false);
    const idx = scenariosData.findIndex((s) => s.id === id)

    if (idx === -1) {
      console.error('Invalid scenario ID');
      return;
    }
    
    
    selectedScenario.current = scenariosData[idx]
    fullConversation.current = [];
    fullConversation.current.push({ role: 'system', content: selectedScenario.current.systemPrompt });
    fetchLLMResponse(fullConversation.current);

  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 shadow-md flex justify-start items-start">
        <select
          value={selectedScenario.current.id}
          onChange={(e) => onScenariosChange(e.target.value)}
          className="bg-gray-700 text-white text-base p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {scenariosData.map((scenario) => (
            <option key={scenario.name} value={scenario.id} className="text-black cursor-pointer">
              {scenario.name} - {scenario.description}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
        {fullConversation.current.map(
          (item, index) =>{
            if(index > 1){
            return item.role !== 'system' && (
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
            )}}
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
        {/* Waiting for Assistant */}
        {isLoading && (
          <div className="flex justify-start items-center px-4 py-2">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full"></div>
              <span>Waiting for assistant...</span>
            </div>
          </div>
        )}
          {/* Feedback Generated */}
        {(isFeedbackGenerated && !generatingFeedback) && (
          <div className="flex justify-start items-center px-4 py-2">
            <div className="flex items-center gap-2 text-gray-600">
              <span>Feedback generated successfully!</span>
            </div>
          </div>
        )}
        {/* Feedback */}
        {(feedback && !generatingFeedback) && (
          <div className="flex w-full justify-start mb-4">
            <div className="max-w-[60%] px-4 py-2 rounded-lg bg-green-300 text-black">
              <ReactMarkdown className={'markdown'} remarkPlugins={[remarkGfm]} children={feedback}></ReactMarkdown>
            </div>
          </div>
        )}
        {/* Response */}
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
            disabled={isRecording || isLoading}
            className={`flex items-center justify-center px-4 py-2 rounded-full border transition-colors font-medium ${
              (isRecording || isLoading)
                ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            Stop session
          </button>
          
          {/* Toggle Recording Button */}
          <button
            onClick={toggleRecording}
            disabled={isLoading}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : isLoading
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
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