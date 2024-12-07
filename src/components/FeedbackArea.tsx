import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FeedbackAreaProps {
  feedback: string;
  generatingFeedback: boolean;
  isFeedbackGenerated: boolean;
}

const FeedbackArea: React.FC<FeedbackAreaProps> = ({
  feedback,
  generatingFeedback,
  isFeedbackGenerated,
}) => {
  return (
    <div>
      {generatingFeedback && (
        <div className="flex justify-start items-center px-4 py-2">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full"></div>
            <span>Generating feedback...</span>
          </div>
        </div>
      )}

      {isFeedbackGenerated && !generatingFeedback && (
        <div className="flex justify-start items-center px-4 py-2">
          <div className="flex items-center gap-2 text-gray-600">
            <span>Feedback generated successfully!</span>
          </div>
        </div>
      )}

      {feedback && !generatingFeedback && (
        <div className="flex w-full justify-start mb-4">
          <div className="max-w-[60%] px-4 py-2 rounded-lg bg-green-300 text-black">
            <ReactMarkdown className={'markdown'} remarkPlugins={[remarkGfm]}>
              {feedback}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackArea;
