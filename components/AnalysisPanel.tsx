'use client';

import React from 'react';
import { Brain, Tag, MessageSquare, Hash, BarChart3, Zap } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: any;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis }) => {
  if (!analysis) return null;

  const getSentimentStyles = (label: string) => {
    switch (label?.toLowerCase()) {
      case 'positive':
        return {
          bg: 'bg-success/10',
          border: 'border-success/30',
          text: 'text-success',
          icon: '✓',
        };
      case 'negative':
        return {
          bg: 'bg-destructive/10',
          border: 'border-destructive/30',
          text: 'text-destructive',
          icon: '!',
        };
      default:
        return {
          bg: 'bg-muted',
          border: 'border-border',
          text: 'text-muted-foreground',
          icon: '−',
        };
    }
  };

  const sentiment = getSentimentStyles(analysis.sentiment?.label);

  return (
    <div className="mt-3 space-y-2 pl-2 border-l-2 border-primary/20">
      {/* Sentiment */}
      {analysis.sentiment && (
        <div className={`flex items-start gap-2 p-2 rounded-md ${sentiment.bg} border ${sentiment.border}`}>
          <span className={`text-base font-bold ${sentiment.text} flex-shrink-0`}>{sentiment.icon}</span>
          <div className="flex-1 space-y-0.5">
            <div className="text-xs font-semibold text-foreground capitalize">{analysis.sentiment.label} Tone</div>
            <div className="text-xs text-muted-foreground">
              {(analysis.sentiment.confidence * 100).toFixed(0)}% confident
              {analysis.sentiment.intensity && ` • ${analysis.sentiment.intensity}`}
            </div>
          </div>
        </div>
      )}

      {/* Intent */}
      {analysis.intent && (
        <div className="flex items-start gap-2 p-2 rounded-md bg-primary/5 border border-primary/20">
          <Brain className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-0.5">
            <div className="text-xs font-semibold text-foreground">
              {analysis.intent.primary_intent?.replace(/_/g, ' ') || 'Intent'}
            </div>
            {analysis.intent.all_intents?.length > 1 && (
              <div className="text-xs text-muted-foreground">
                {analysis.intent.all_intents.slice(0, 2).join(' • ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Question Type */}
      {analysis.question_type?.is_question && (
        <div className="flex items-start gap-2 p-2 rounded-md bg-secondary/10 border border-secondary/20">
          <MessageSquare className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-0.5">
            <div className="text-xs font-semibold text-foreground">
              {analysis.question_type.primary_category?.replace(/_/g, ' ') || 'Question'}
            </div>
            {analysis.question_type.question_word && (
              <div className="text-xs text-muted-foreground">"{analysis.question_type.question_word}"</div>
            )}
          </div>
        </div>
      )}

      {/* Keywords */}
      {analysis.keywords?.keywords && analysis.keywords.keywords.length > 0 && (
        <div className="p-2 rounded-md bg-accent/5 border border-accent/20 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-accent flex-shrink-0" />
            <span className="text-xs font-semibold text-foreground">Keywords</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {analysis.keywords.keywords.slice(0, 4).map((keyword: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-accent/20 text-accent-foreground rounded text-xs font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      {analysis.statistics && (
        <div className="grid grid-cols-2 gap-1.5">
          <div className="p-2 rounded-md bg-muted border border-border">
            <div className="flex items-center gap-1 mb-1">
              <Hash className="w-3 h-3 text-muted-foreground" />
              <span className="font-semibold text-xs text-muted-foreground">Words</span>
            </div>
            <div className="text-sm font-bold text-foreground">{analysis.statistics.word_count}</div>
          </div>
          <div className="p-2 rounded-md bg-muted border border-border">
            <div className="flex items-center gap-1 mb-1">
              <BarChart3 className="w-3 h-3 text-muted-foreground" />
              <span className="font-semibold text-xs text-muted-foreground">Diversity</span>
            </div>
            <div className="text-sm font-bold text-foreground">
              {analysis.statistics.lexical_diversity ? (analysis.statistics.lexical_diversity * 100).toFixed(0) : '0'}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
