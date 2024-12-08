import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import Controls from './components/Controls';
import { HEALTH_DELTA_2, HEALTH_GOLD_STANDARD, CONFIDENTIALITY_GOLD_STANDAR } from './scenarios/prompts';
import { feedbackPrompt } from './scenarios/feedback-prompt';

function App() {
  interface Message {
    role: 'user' | 'system' | 'assistant';
    content: string;
  }

  const scenariosData = [
    {
      id: "1",
      name: "Health Assesment",
      description: "Delta 2",
      voiceId: 'cgSgspJ2msm6clMCkdW9',
      systemPrompt: HEALTH_DELTA_2
    },
    {
      id:"2",
      name: "Confidentiality",
      description: "Gold Standard",
      voiceId: 'IKne3meq5aSn9XLyUdCD',
      systemPrompt: CONFIDENTIALITY_GOLD_STANDAR
    },
    {
      id: "3",
      name: "Health Assesment",
      description: "Gold Standard",
      voiceId: 'iP95p4xoKVk53GoZ742B',
      systemPrompt: HEALTH_GOLD_STANDARD
    }
    
  ]

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
      const res = await fetch('http://localhost:1234/v1/chat/completions', {
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
      fullConversation.current.push({
        role: 'assistant',
        content: result.choices[0].message.content,
      });
      if(fullConversation.current.length > 2) {
        playGeneratedAudio(result.choices[0].message.content);
      }
    } catch (error) {
      console.error('Error fetching LLM response:', error);
    }
    setIsLoading(false);
  };

  const fetchFeedback = async (feedbackMessage: string) => {
    setGeneratingFeedback(true); // Start feedback generation
    try {
      const res = await fetch('http://localhost:1234/v1/chat/completions', {
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
    const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!API_KEY) {
      console.error('API key is not defined');
      return;
    }
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedScenario.current.voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY, // Replace with your ElevenLabs API key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSpeech,
          voice_settings: {
            stability: 0.15,
            similarity_boost: 0.85,
            // stability: 0.75,
            // similarity_boost: 0.3,
            // speed: 0.9
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
      <Header
        scenariosData={scenariosData}
        selectedScenarioId={selectedScenario.current.id}
        onScenarioChange={onScenariosChange}
      />
      <ChatArea
        conversation={fullConversation.current}
        isLoading={isLoading}
        generatingFeedback={generatingFeedback}
        feedback={feedback}
        isFeedbackGenerated={isFeedbackGenerated}
        chatEndRef={chatEndRef}
      />
      <Controls
        audioSrc={audioSrc}
        toggleRecording={toggleRecording}
        stopSession={stopSession}
        isRecording={isRecording}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;