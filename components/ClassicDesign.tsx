import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Clock, Mail, MessageCircle, Send, X, Zap, Loader, Mic, MicOff, Layout, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';

// ClassicDesign Component
export const ClassicDesign = ({ 
  profile, 
  isGmailConnected, 
  onConnectGmail, 
  onSendEmail, 
  onStartListening,
  speech,
  recentEmails,
  NeuralNetworkButton,
  PhantomStatsBar,
  router,
  isLoading
}:any) => {
  return (
    <>
      {/* Stats Section */}
      {isLoading ? (
        <div className="w-full max-w-7xl mx-auto h-48 flex items-center justify-center">
          <Loader className="animate-spin text-purple-500" />
        </div>
      ) : (
        <PhantomStatsBar 
          credits={profile?.credits} 
          history={profile?.emailHistory} 
        />
      )}

      {/* Neural Network Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12 pt-4 md:pt-0">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <NeuralNetworkButton
            onGmailConnect={onConnectGmail}
            onSendEmail={onSendEmail}
            onStartListening={onStartListening}
            isGmailConnected={isGmailConnected}
            isListening={speech.length > 0}
            transcript={speech}
          />

          {/* Status Bar */}
          <div className="mt-8 flex items-center justify-center">
            <div className="bg-gray-50 rounded-xl px-6 py-3 border border-gray-200">
              <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
                {!isGmailConnected && (
                  <>
                    <Mail size={16} className="text-gray-500" />
                    Connect Gmail account to begin
                  </>
                )}
                {isGmailConnected && !speech && (
                  <>
                    <CheckCircle size={16} className="text-green-600" />
                    Ready to record - Click center button
                  </>
                )}
                {speech && (
                  <>
                    <Zap size={16} className="text-purple-600" />
                    Review your message and send
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentEmails.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="text-gray-600" size={20} />
                Recent Activity
              </h3>
              <button
                onClick={() => router.push('/profile')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                View all
                <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {recentEmails.map((email, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Mail className="text-purple-600" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{email.receiverName}</p>
                      <p className="text-sm text-gray-600">{email.receiverEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-md border border-green-200 font-medium">
                      Delivered
                    </span>
                    <p className="text-sm text-gray-500">
                      {new Date(email.sentAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};