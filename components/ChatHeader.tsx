'use client';

import React from 'react';
import { Menu, Volume2 } from 'lucide-react';
import { Button } from '../components/ui/button';

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isRecording: boolean;
  title?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  isRecording,
  title = 'Neural Email Assistant',
}) => {
  return (
    <header className="flex items-center justify-between h-16 px-6 py-4 border-b border-border bg-card shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hover:bg-muted"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex flex-col gap-0.5">
          <h1 className="text-base font-semibold text-foreground leading-tight">{title}</h1>
          <p className="text-xs text-muted-foreground">Voice-powered composition</p>
        </div>
      </div>

      {isRecording && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-1.5">
            <Volume2 className="h-4 w-4 text-accent animate-pulse" />
            <span className="text-xs font-medium text-accent">Listening</span>
          </div>
        </div>
      )}
    </header>
  );
};
