import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Clock, Mail, MessageCircle, Send, X, Zap, Loader, Mic, MicOff, Layout, Sparkles, TrendingUp, BarChart3, Sidebar, User, Dock, Menu } from 'lucide-react';
import { Brain, Tag, MessageSquare, Hash } from 'lucide-react';
import Image from 'next/image';

// ChatDesign Component
export const ChatDesign = ({
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
  setMessages,
  humanInput,
  setHumanInput,
  handleHumanMessage,
  sendingMessage,
  chatEndRef,
  isLoading
}: any) => {
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

  // Analysis Panel Component
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
        {analysis.sentiment && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getSentimentColor(analysis.sentiment.label)}`}>
            <span className="text-base">{getSentimentEmoji(analysis.sentiment.label)}</span>
            <div className="flex-1">
              <div className="font-semibold capitalize">{analysis.sentiment.label}</div>
              <div className="opacity-75">
                Confidence: {(analysis.sentiment.confidence * 100).toFixed(0)}%
                {analysis.sentiment.intensity && ` • ${analysis.sentiment.intensity}`}
              </div>
            </div>
          </div>
        )}

        {/* Intent */}
        {analysis.intent && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <Brain className="w-4 h-4" />
            <div className="flex-1">
              <div className="font-semibold">Intent: {analysis.intent.primary_intent?.replace(/_/g, ' ')}</div>
              {analysis.intent.all_intents && analysis.intent.all_intents.length > 1 && (
                <div className="opacity-75">
                  Also: {analysis.intent.all_intents.slice(1, 3).join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Question Type */}
        {analysis.question_type?.is_question && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700">
            <MessageSquare className="w-4 h-4" />
            <div className="flex-1">
              <div className="font-semibold">Question Type: {analysis.question_type.primary_category?.replace(/_/g, ' ')}</div>
              {analysis.question_type.question_word && (
                <div className="opacity-75">
                  Word: "{analysis.question_type.question_word}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Keywords */}
        {analysis.keywords?.keywords && analysis.keywords.keywords.length > 0 && (
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
        {analysis.statistics && (
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
              <div className="text-lg font-bold">
                {analysis.statistics.lexical_diversity
                  ? (analysis.statistics.lexical_diversity * 100).toFixed(0)
                  : 0}%
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh)] max-w-7xl mx-auto px-6 py-8">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden rounded-l-xl`}>

        <div className="p-6 pt-3 space-y-6">
          <div>
            <Header/>
          </div>
          {/* Gmail Connection */}
          <div className="space-y-3">
            {isGmailConnected ? (
              <div className="p-4 rounded-xl bg-gradient-to-b from-green-50 to-green-100 border-2 border-green-300 shadow-[0_3px_0_0_rgba(34,197,94,0.3)]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-semibold text-gray-900">Gmail Connected</span>
                </div>
              </div>
            ) : (
              <button
                onClick={onConnectGmail}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-2 border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 font-semibold text-white text-sm flex items-center justify-center gap-2"
              >
                <Mail size={16} />
                Connect Gmail
              </button>
            )}
          </div>

          {/* Analysis Toggle */}
          <div>
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="px-3 py-1.5 text-xs rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
            </button>
          </div>

          {/* Credits */}
          {!isLoading && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Credits</h3>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-purple-600">{profile?.credits || 0}</span>
                  <Sparkles className="text-purple-600" size={24} />
                </div>
                <p className="text-xs text-gray-600">Available credits</p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(((profile?.credits || 0) / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email History */}
          {!isLoading && profile?.emailHistory && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Email History</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {profile.emailHistory.slice(0, 5).map((email: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_2px_0_0_rgba(226,134,248,0.2)] hover:shadow-[0_1px_0_0_rgba(226,134,248,0.2)] hover:translate-y-[1px] transition-all duration-100"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="text-purple-600" size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{email.receiverName}</p>
                        <p className="text-xs text-gray-600 truncate">{email.receiverEmail}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-md border border-green-200 font-medium">
                            Sent
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {new Date(email.sentAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Bar */}
        <div className={`bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-tr-xl ${!showSidebar && "rounded-tl-xl"}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Sidebar size={20} className="text-gray-600" />
            </button>
            <div>
              <h2 className="font-semibold text-gray-900">Neural Email Assistant</h2>
              <p className="text-xs text-gray-500">Voice-powered email composition</p>
            </div>
          </div>
          {isRecording ? 
          <div className="flex items-center gap-2">
            {isRecording && (
              <span className="flex items-center gap-2 text-sm text-red-600 font-medium">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                Recording...
              </span>
            )}
          </div>
          : (
            <div>
               <Image 
                  className="cursor-pointer hover:scale-110 transition-transform" 
                  onClick={() => {window.location.href = '/';}} 
                  src="/logo.png" 
                  alt="Logo" 
                  width={40} 
                  height={40} 
                />
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Welcome Message */}
            {messages.length === 0 && !speech && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="text-purple-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Neural Assistant</h3>
                <p className="text-gray-600 mb-6">Use voice or text to compose and send emails</p>
                {!isGmailConnected && (
                  <button
                    onClick={onConnectGmail}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                  >
                    Connect Gmail to Start
                  </button>
                )}
              </div>
            )}

            {/* Message Rendering */}
            {messages.map((msg: any, idx: number) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%]`}>
                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl ${msg.role === "user"
                        ? "bg-[#cc39f5] text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                      }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>

                  {/* Analysis Panel - Only show for bot messages if toggle is on and analysis exists */}
                  {msg.role === "bot" && showAnalysis && msg.analysis && (
                    <AnalysisPanel analysis={msg.analysis} />
                  )}
                </div>
              </div>
            ))}

            {/* Voice Transcript Preview */}
            {speech && (
              <div className="flex justify-end">
                <div className="max-w-[75%] bg-purple-100 border-2 border-purple-300 rounded-2xl px-5 py-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Mic className="text-purple-600 flex-shrink-0 mt-1" size={18} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">{speech}</p>
                      <button
                        onClick={handleSendEmail}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Send size={16} />
                        Send as Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sendingMessage && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
                  <Loader className="animate-spin text-purple-600" size={20} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className={`bg-white border-t border-gray-200 px-6 py-4 rounded-br-xl ${!showSidebar && "rounded-bl-xl"}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              {/* Voice Button */}
              <button
                onClick={handleRecord}
                disabled={!isGmailConnected}
                className={`p-4 rounded-xl transition-all ${isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
                  }`}
              >
                {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              {/* Text Input */}
              <div className="flex-1">
                <input
                  type="text"
                  value={humanInput}
                  onChange={(e) => setHumanInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleHumanMessage()}
                  placeholder={isGmailConnected ? "Type a message or use voice..." : "Connect Gmail first..."}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleHumanMessage}
                className="p-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={24} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              {isGmailConnected
                ? 'Use voice recording or type your message to get started'
                : 'Please connect your Gmail account to use the assistant'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


const Header = () => {
    const [jwt, setJwt] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setJwt(localStorage.getItem("auth_token"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        window.location.href = '/login';
    };

    const navItems = [
        { label: 'Profile', href: '/profile', logo: User },
        { label: 'Documentation', href: '/documentation', logo: Dock },
    ];

    return (
        <>
            <div className="flex justify-center items-center w-full px-4 pb-4">
                {/* Desktop Navigation */}
                <div className="hidden md:flex w-full max-w-4xl items-center "> 
                    <div className="flex text-center items-center gap-2">
                        {navItems.map((item) => {
                          const Icon =  item.logo;
                        return (
                            <button
                                key={item.label}
                                className="px-4 py-2 rounded-xl bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 font-medium text-gray-700 hover:text-[#cc39f5] "
                                onClick={() => {window.location.href = item.href}}
                            >
                                <Icon/>
                            </button>
                        )})}
                        
                        {jwt ? (
                            <button 
                                className="w-full px-3 py-2 rounded-xl bg-[#cc39f5] border-2 border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 font-semibold text-white text-sm flex items-center gap-2"
                                onClick={handleLogout}
                            >
                                Logout
                                <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button 
                                className="px-5 py-2 rounded-xl bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-2 border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 font-semibold text-white flex items-center gap-2"
                                onClick={() => {window.location.href = '/login'}}
                            >
                                Login
                                <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex justify-between px-4 w-full py-3 items-center border-2 rounded-full border-[#e086f8] bg-white/80 backdrop-blur-md shadow-lg shadow-purple-200/50">
                    <Image 
                        className="cursor-pointer hover:scale-110 transition-transform" 
                        onClick={() => {window.location.href = '/';}} 
                        src="/logo.png" 
                        alt="Logo" 
                        width={32} 
                        height={32} 
                    />
                    
                    <button
                        className="p-2 rounded-xl bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 text-[#cc39f5]"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed top-20 left-0 right-0 mx-4 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#e086f8] shadow-2xl shadow-purple-300/50 z-50 overflow-hidden animate-in slide-in-from-top duration-200">
                    <div className="flex flex-col p-4 gap-3">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100 font-medium text-gray-700 hover:text-[#cc39f5] hover:border-[#e086f8] text-left"
                                onClick={() => {
                                    window.location.href = item.href;
                                    setMobileMenuOpen(false);
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                        
                        <div className="border-t-2 border-gray-200 my-2"></div>
                        
                        {jwt ? (
                            <button 
                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-2 border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 font-semibold text-white text-sm flex items-center justify-center gap-2"
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                            >
                                Logout
                                <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button 
                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-2 border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 font-semibold text-white flex items-center justify-center gap-2"
                                onClick={() => {
                                    window.location.href = '/login';
                                    setMobileMenuOpen(false);
                                }}
                            >
                                Login
                                <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Mobile Menu Backdrop */}
            {mobileMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}
        </>
    );
}