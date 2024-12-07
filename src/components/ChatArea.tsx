import React from 'react';
import FeedbackArea from './FeedbackArea';

interface ChatAreaProps {
  conversation: { role: string; content: string }[];
  isLoading: boolean;
  generatingFeedback: boolean;
  feedback: string;
  isFeedbackGenerated: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  isLoading,
  generatingFeedback,
  feedback,
  isFeedbackGenerated,
  chatEndRef,
}) => {
  return (
    <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
      {conversation.map((item, index) =>
        index > 1 ? (
          <div
            key={index}
            className={`flex w-full ${item.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-[60%] px-4 py-2 rounded-lg ${
                item.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
              }`}
            >
              {item.content}
            </div>
          </div>
        ) : null
      )}

      {isLoading && (
        <div className="flex justify-start items-center px-4 py-2">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full"></div>
            <span>Waiting for assistant...</span>
          </div>
        </div>
      )}

      {/* Feedback Area */}
      <FeedbackArea
        feedback={feedback}
        generatingFeedback={generatingFeedback}
        isFeedbackGenerated={isFeedbackGenerated}
      />

      <div ref={chatEndRef}></div>
    </div>
  );
};

export default ChatArea;
