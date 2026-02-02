'use client';

import React from 'react';
import { Sparkles, Loader, Mic, Send, MessageCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisPanel } from './AnalysisPanel';

interface Message {
  id: number;
  role: string;
  content: string;
  createdAt: Date;
  error?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  speech: string;
  sendingMessage: boolean;
  showAnalysis: boolean;
  analysis: any;
  isGmailConnected: boolean;
  onSendEmail: () => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
  error?: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  speech,
  sendingMessage,
  showAnalysis,
  analysis,
  isGmailConnected,
  onSendEmail,
  chatEndRef,
  error,
}) => {
  return (
    <main className="flex-1 overflow-y-auto px-6 py-8 bg-background">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Empty State */}
        {messages.length === 0 && !speech && !sendingMessage && (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">Ready to compose an email?</h2>
                <p className="text-muted-foreground max-w-xs">Start speaking or type your message below to get AI-powered suggestions and analysis.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Something went wrong</p>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className="max-w-xl">
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : msg.error
                      ? 'bg-destructive/10 text-destructive border border-destructive/20 rounded-bl-none'
                      : 'bg-card text-foreground border border-border rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>

              {/* Analysis Panel for Bot Messages */}
              {msg.role === 'bot' && showAnalysis && analysis?.analysis && (
                <div className="mt-3">
                  <AnalysisPanel analysis={analysis.analysis} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Voice Transcript Preview */}
        {speech && (
          <div className="flex justify-end">
            <div className="max-w-xl bg-secondary/10 border border-secondary rounded-2xl px-4 py-3 space-y-3">
              <div className="flex items-start gap-2">
                <Mic className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed flex-1">{speech}</p>
              </div>
              <Button
                onClick={onSendEmail}
                disabled={sendingMessage}
                size="sm"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Send className="h-4 w-4 mr-2" />
                Send as Email
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {sendingMessage && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Analyzing and composing...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </main>
  );
};
