'use client';

import React, { useState } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

interface ChatDesignRefactoredProps {
  profile: any;
  analysis: any;
  isGmailConnected: boolean;
  onConnectGmail: () => void;
  onSendEmail: (email: string) => void;
  onStartListening: () => void;
  onStopListening: () => void;
  speech: string;
  setSpeech: (value: string) => void;
  messages: any[];
  humanInput: string;
  setHumanInput: (input: string) => void;
  handleHumanMessage: () => void;
  sendingMessage: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  error?: string;
}

export const ChatDesignRefactored: React.FC<ChatDesignRefactoredProps> = ({
  profile,
  analysis,
  isGmailConnected,
  onConnectGmail,
  onSendEmail,
  onStartListening,
  onStopListening,
  speech,
  setSpeech,
  messages,
  humanInput,
  setHumanInput,
  handleHumanMessage,
  sendingMessage,
  chatEndRef,
  isLoading,
  error,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(true);

  const handleRecord = () => {
    if (isRecording) {
      onStopListening();
      setIsRecording(false);
    } else {
      onStartListening();
      setIsRecording(true);
    }
  };

  const handleSendEmail = () => {
    if (speech.trim()) {
      onSendEmail(speech);
      setSpeech('');
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={showSidebar}
        onToggle={() => setShowSidebar(!showSidebar)}
        isGmailConnected={isGmailConnected}
        onConnectGmail={onConnectGmail}
        profile={profile}
        showAnalysis={showAnalysis}
        onToggleAnalysis={() => setShowAnalysis(!showAnalysis)}
        isLoading={isLoading}
      />

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ChatHeader
          isSidebarOpen={showSidebar}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          isRecording={isRecording}
        />

        {/* Messages Area */}
        <ChatMessages
          messages={messages}
          speech={speech}
          sendingMessage={sendingMessage}
          showAnalysis={showAnalysis}
          analysis={analysis}
          isGmailConnected={isGmailConnected}
          onSendEmail={handleSendEmail}
          chatEndRef={chatEndRef}
          error={error}
        />

        {/* Input Area */}
        <ChatInput
          isRecording={isRecording}
          isGmailConnected={isGmailConnected}
          humanInput={humanInput}
          onHumanInputChange={setHumanInput}
          onSendMessage={handleHumanMessage}
          onRecord={handleRecord}
          isSidebarOpen={showSidebar}
          isLoading={sendingMessage}
          error={error}
        />
      </div>
    </div>
  );
};
