'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  isRecording: boolean;
  isGmailConnected: boolean;
  humanInput: string;
  onHumanInputChange: (value: string) => void;
  onSendMessage: () => void;
  onRecord: () => void;
  isSidebarOpen: boolean;
  isLoading?: boolean;
  error?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  isRecording,
  isGmailConnected,
  humanInput,
  onHumanInputChange,
  onSendMessage,
  onRecord,
  isSidebarOpen,
  isLoading = false,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const canSend = humanInput.trim().length > 0 && !isLoading && isGmailConnected;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && canSend) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <footer className="border-t border-border bg-card p-6 space-y-3">
      {error && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        </div>
      )}

      <div className="flex items-end gap-3">
        <Button
          onClick={onRecord}
          disabled={!isGmailConnected || isLoading}
          size="lg"
          className={`flex-shrink-0 transition-all ${
            isRecording
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <div className={`flex-1 relative transition-all ${isFocused ? 'ring-2 ring-primary ring-offset-1 rounded-lg' : ''}`}>
          <input
            type="text"
            value={humanInput}
            onChange={(e) => onHumanInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              !isGmailConnected
                ? 'Connect Gmail to get started'
                : isLoading
                  ? 'Processing...'
                  : 'Type your message or use voice...'
            }
            disabled={!isGmailConnected || isLoading}
            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            aria-label="Message input"
          />
        </div>

        <Button
          onClick={onSendMessage}
          disabled={!canSend}
          size="lg"
          className="flex-shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {!isGmailConnected && (
        <p className="text-xs text-muted-foreground text-center">
          Connect your Gmail account in the sidebar to enable the assistant
        </p>
      )}
    </footer>
  );
};
