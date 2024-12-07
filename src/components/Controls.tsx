import React from 'react';

interface ControlsProps {
  audioSrc: string | null;
  toggleRecording: () => void;
  stopSession: () => void;
  isRecording: boolean;
  isLoading: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  audioSrc,
  toggleRecording,
  stopSession,
  isRecording,
  isLoading,
}) => {
  return (
    <div className="bg-white p-4 flex justify-between items-center border-t">
      <audio controls autoPlay src={audioSrc || ''} className="flex-grow max-w-sm rounded-lg">
        Your browser does not support the audio element.
      </audio>
      <div className="flex gap-2">
        <button
          onClick={stopSession}
          disabled={isRecording || isLoading}
          className={`flex items-center justify-center px-4 py-2 rounded-full border transition-colors font-medium ${
            isRecording || isLoading
              ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          Stop session
        </button>
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
  );
};

export default Controls;
