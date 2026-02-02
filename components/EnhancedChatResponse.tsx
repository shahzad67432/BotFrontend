import { Brain, TrendingUp, Tag, MessageSquare, BarChart3, Hash, Loader } from 'lucide-react';
import { useState } from 'react';

// Add this component for displaying analysis data
const AnalysisPanel = ({ analysis }: { analysis: any }) => {
  if (!analysis) return null;

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSentimentEmoji = (label: string) => {
    switch (label) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  return (
    <div className="mt-2 space-y-2 text-xs">
      {/* Sentiment */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getSentimentColor(analysis.sentiment.label)}`}>
        <span className="text-base">{getSentimentEmoji(analysis.sentiment.label)}</span>
        <div className="flex-1">
          <div className="font-semibold capitalize">{analysis.sentiment.label}</div>
          <div className="opacity-75">
            Confidence: {(analysis.sentiment.confidence * 100).toFixed(0)}%
            {' • '}
            {analysis.sentiment.intensity}
          </div>
        </div>
      </div>

      {/* Intent */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
        <Brain className="w-4 h-4" />
        <div className="flex-1">
          <div className="font-semibold">Intent: {analysis.intent.primary_intent.replace(/_/g, ' ')}</div>
          {analysis.intent.all_intents.length > 1 && (
            <div className="opacity-75">
              Also: {analysis.intent.all_intents.slice(1, 3).join(', ')}
            </div>
          )}
        </div>
      </div>

      {/* Question Type */}
      {analysis.question_type.is_question && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700">
          <MessageSquare className="w-4 h-4" />
          <div className="flex-1">
            <div className="font-semibold">Question Type: {analysis.question_type.primary_category.replace(/_/g, ' ')}</div>
            {analysis.question_type.question_word && (
              <div className="opacity-75">
                Word: "{analysis.question_type.question_word}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keywords */}
      {analysis.keywords.keywords.length > 0 && (
        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <Tag className="w-4 h-4" />
            <span className="font-semibold">Keywords</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {analysis.keywords.keywords.map((keyword: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700">
          <div className="flex items-center gap-1 mb-1">
            <Hash className="w-3 h-3" />
            <span className="font-semibold text-xs">Words</span>
          </div>
          <div className="text-lg font-bold">{analysis.statistics.word_count}</div>
        </div>
        <div className="px-3 py-2 rounded-lg bg-pink-50 border border-pink-200 text-pink-700">
          <div className="flex items-center gap-1 mb-1">
            <BarChart3 className="w-3 h-3" />
            <span className="font-semibold text-xs">Diversity</span>
          </div>
          <div className="text-lg font-bold">{(analysis.statistics.lexical_diversity * 100).toFixed(0)}%</div>
        </div>
      </div>
    </div>
  );
};

// Updated Chat Component with Analysis Toggle
export default function EnhancedChatInterface(messages: any[], chatEndRef: any, sendingMessage: boolean) {
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <>
      {/* Analysis Toggle Button - Add this near your chat header */}
      <button
        onClick={() => setShowAnalysis(!showAnalysis)}
        className="px-3 py-1.5 text-xs rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center gap-2"
      >
        <Brain className="w-4 h-4" />
        {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
      </button>

      {/* Updated Message Rendering */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[70%]`}>
              {/* Message Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-[#cc39f5] text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>

              {/* Analysis Panel - Only show for bot messages if toggle is on */}
              {msg.role === "bot" && showAnalysis && msg.analysis && (
                <AnalysisPanel analysis={msg.analysis} />
              )}
            </div>
          </div>
        ))}
        {sendingMessage && (
          <div className="flex justify-start">
            <Loader className="animate-spin w-5 h-5 text-gray-500" />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </>
  );
}