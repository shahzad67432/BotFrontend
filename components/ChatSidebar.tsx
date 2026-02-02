'use client';

import React from 'react';
import { Mail, Brain, Sparkles, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isGmailConnected: boolean;
  onConnectGmail: () => void;
  profile: any;
  showAnalysis: boolean;
  onToggleAnalysis: () => void;
  isLoading: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  isGmailConnected,
  onConnectGmail,
  profile,
  showAnalysis,
  onToggleAnalysis,
  isLoading,
}) => {
  return (
    <aside
      className={`${
        isOpen ? 'w-72' : 'w-0'
      } transition-all duration-300 bg-sidebar border-r border-sidebar-border overflow-hidden flex flex-col`}
    >
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Gmail Connection Status */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
            Gmail Account
          </label>
          {isGmailConnected ? (
            <div className="p-4 rounded-lg bg-success/10 border border-success/20 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm font-medium text-foreground">Connected</span>
              </div>
              <p className="text-xs text-muted-foreground">{profile?.email || 'Your email account'}</p>
            </div>
          ) : (
            <Button
              onClick={onConnectGmail}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              <Mail className="h-4 w-4 mr-2" />
              Connect Gmail
            </Button>
          )}
        </div>

        {/* Analysis Toggle */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
            Features
          </label>
          <Button
            onClick={onToggleAnalysis}
            variant={showAnalysis ? 'default' : 'outline'}
            size="sm"
            className="w-full justify-start"
          >
            <Brain className="h-4 w-4 mr-2" />
            {showAnalysis ? 'Analysis On' : 'Analysis Off'}
          </Button>
        </div>

        {/* Credits Card */}
        {!isLoading && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Credits
            </label>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-accent">{profile?.credits || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Available</p>
                </div>
                <Sparkles className="h-6 w-6 text-accent/60" />
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{
                      width: `${Math.min(((profile?.credits || 0) / (profile?.creditLimit || 100)) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile?.creditLimit ? `of ${profile.creditLimit}` : 'unlimited'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Email History */}
        {!isLoading && profile?.emailHistory && profile.emailHistory.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
              Recent Emails
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {profile.emailHistory.slice(0, 5).map((email: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-card border border-border hover:border-sidebar-accent transition-colors space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{email.receiverName}</p>
                      <p className="text-xs text-muted-foreground truncate">{email.receiverEmail}</p>
                    </div>
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(email.sentAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty History State */}
        {!isLoading && (!profile?.emailHistory || profile.emailHistory.length === 0) && (
          <div className="text-center py-6 space-y-2">
            <Mail className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="text-xs text-muted-foreground">No emails sent yet</p>
          </div>
        )}
      </div>
    </aside>
  );
};
