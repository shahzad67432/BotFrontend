"use client";
import { getUserMessages, gmailConnectionExpiryRequest } from "@/actions";
import axios, { create, get } from "axios";
import { ArrowBigRight, ArrowRight, BarChart3, CheckCircle, ChevronRight, Clock, Loader, Mail, MessageCircle, Send, Sparkles, TrendingUp, X, Zap } from 'lucide-react';
import Image from "next/image";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useMemo, useRef, useState } from "react";

import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import NeuralNetworkButton from "@/app/button";
import { HeaderPage } from "@/app/Header";
import { toast } from "sonner";
import { profile } from "console";
import { getUserProfileData } from "@/app/actions/profile";

type ChatMessage = {
  id: number;
  role: string;
  content: string;
  createdAt: Date;
  userId: number;
}

export default function Home() {
  const searchParams: any = useSearchParams();
  const connected = searchParams.get("connected");
  const [speech, setSpeech] = useState("");
  const recognitionRef = useRef<any>(null);
  const [humanInput, setHumanInput] = useState("");
  const [botResponse, setBotResponse] = useState([""]);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<null | 'compose' | 'insights' | 'history'>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const queryClient = useQueryClient();

  const router = useRouter();

  const checkedRef = useRef(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const jwt = localStorage.getItem("auth_token");
  
  useEffect(() => {
    if (!jwt) {
      window.location.href = `http://localhost:3000/login`;
    }

  }, [jwt]);

  const { data: profile, isError} = useQuery<any>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!jwt) throw new Error('No token');
      return await getUserProfileData(jwt);
    },
    enabled: !!jwt, // Only run when jwt exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  useEffect(() => {
    
    if (checkedRef.current) return; // reduce duplicate calls
    checkedRef.current = true;

    const checkGmailConnection = async () => {
      const expiryStr = localStorage.getItem("gmail_token_expiry");
      const now = Date.now();

      if (expiryStr && now < parseInt(expiryStr)) {
        // token still valid, no backend call needed
        setIsGmailConnected(true);
        return;
      }
      // otherwise, call backend once
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const expiry = await gmailConnectionExpiryRequest(token);
        localStorage.setItem("gmail_token_expiry", new Date(expiry).getTime().toString());
        setIsGmailConnected(true);
      } catch (err) {
        console.error("Failed to check Gmail connection:", err);
      }
    };
    checkGmailConnection();
  }, []);

  useEffect(() => {
    if (connected === "gmail") {
      alert("Gmail connected successfully!");
    }
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = `http://localhost:3000/login`;
    }
  }, [connected]);



  const handleConnectGmail = async () => {
    if (connected === "gmail" || isGmailConnected) {
      // Connection logic stays here but button calls this function
      // Check for browser support
      const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Browser does not support SpeechRecognition API");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";
    let timeoutId: NodeJS.Timeout | null = null;

    recognition.onresult = (e: any) => {
      let interimTranscript = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const combined = finalTranscript + interimTranscript;
      setSpeech(combined.trim());

      // Reset 5s inactivity timer each time speech is detected
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        recognition.stop();
        console.log("Auto-stopped after 5s of silence");
      }, 5000);
    };

    recognition.onerror = (err: any) => console.error(err);

    recognition.onend = () => {
      console.log("Recognition ended.");
    };

    recognition.start();
    recognitionRef.current = recognition;

    } else {
      const token = localStorage.getItem("auth_token");
      if (!token) return alert("No auth token found");

      // Redirect user
      window.location.href = `http://127.0.0.1:5000/oAuth-consent?token=${token}`;
    }
  };

  const handleStartListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Browser does not support SpeechRecognition API");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";
    let timeoutId: NodeJS.Timeout | null = null;

    recognition.onresult = (e: any) => {
      let interimTranscript = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const combined = finalTranscript + interimTranscript;
      setSpeech(combined.trim());

      // Reset 5s inactivity timer each time speech is detected
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        recognition.stop();
        console.log("Auto-stopped after 5s of silence");
      }, 5000);
    };

    recognition.onerror = (err: any) => console.error(err);

    recognition.onend = () => {
      console.log("Recognition ended.");
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop(); // stop listening
    recognitionRef.current = null;
  };

  const handleSendingGmail = async (speechText: string) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return alert("No auth token found");
    const profile: any = queryClient.getQueryData(['userProfile']);

     try {
    // Pre-flight credit check
    if (!profile) {
      toast.error("Unable to load profile data");
      return;
    }

    if (profile.credits <= 0) {
      toast.error("No credits remaining!", {
        description: "Purchase more credits to continue sending emails",
        action: {
          label: "Buy Credits",
          onClick: () => router.push('/profile')
        }
      });
      return;
    }

    // Low credit warning
    if (profile.credits <= 5) {
      toast.warning(`Only ${profile.credits} credits left!`, {
        description: "Consider purchasing more credits soon"
      });
    }

    // Send email with loading state
    const loadingToast = toast.loading("Sending email...");
    
    const response = await axios.post("http://127.0.0.1:5000/send-email", {
      token,
      speechText
    });

    toast.dismiss(loadingToast);
    toast.success("Email sent successfully!", {
      description: `${profile.credits - 1} credits remaining`
    });
    
    // Optimistic update for instant UI feedback
    queryClient.setQueryData(["userProfile"], (old: any) => ({
      ...old,
      credits: old.credits - 1
    }));
    
    // Then invalidate to ensure consistency
    await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    
    router.push('/profile');
    
  } catch (error: any) {
    console.error("Error sending email:", error);
    
    if (error.response?.status === 403) {
      toast.error("Insufficient credits!", {
        description: "Your credits have been used up",
        action: {
          label: "Buy More",
          onClick: () => router.push('/profile')
        }
      });
      // Force refetch in case of mismatch
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    } else {
      toast.error("Failed to send email", {
        description: error.response?.data?.message || "Please try again"
      });
    }
  }
  };

  const handleHumanMessage = async () => {
  const newUserMessage = {
    id: Date.now(),
    createdAt: new Date(),
    userId: 0,
    role: "user",
    content: humanInput,
  };

  // Display user's message immediately
  setMessages(prev => [...prev, newUserMessage]);

  try {
    const token = localStorage.getItem("auth_token");
    setSendingMessage(true);

    const inputMessage = humanInput;
    setHumanInput("");

    const res = await axios.get("http://127.0.0.1:5000/bot-chat", {
      params: { human_input: inputMessage, auth_token: token },
    });

    const botMsg = {
      id: Date.now(),
      role: "bot",
      createdAt: new Date(),
      userId: 0,
      content: res.data,
    };

    setSendingMessage(false);
    setMessages(prev => [...prev, botMsg]);
  } catch (error) {
    console.error(error);
  }
};


const { data: initialData, isLoading, error, isFetching } = useQuery({
    queryKey: ['messages', 1], // Always fetch page 1
    
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("No token");
      return await getUserMessages(token, 1);
    },
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes
    gcTime: 30 * 60 * 1000, // Keep in memory for 30 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Will use cache if available on mount
  });

   console.log({
    isLoading,   // false if cache exists
    isFetching,  // false if within staleTime
    hasData: !!initialData,
  })

  // ✅ Set initial messages from cache/fresh data
  useEffect(() => {
    if (initialData) {
      setMessages(initialData);
    }
  }, [initialData]);

  const chatRef = useRef(null);

  const handleScroll = async () => {
    const box = chatRef.current;
    if (!box || isLoading) return;
  
    if (box.scrollTop === 0) {
      const previousHeight = box.scrollHeight;
      const nextPage = page + 1;
      const token = localStorage.getItem("auth_token");
      if (!token) return alert("No auth token found");

      try {
        // Check cache first
        const cachedOlderMessages = queryClient.getQueryData<ChatMessage[]>(['messages', nextPage]);
        
        let older: ChatMessage[];
        
        if (cachedOlderMessages) {
          // ✅ Use cached data
          console.log('✅ Using cached page:', nextPage);
          older = cachedOlderMessages;
        } else {
          // ✅ Fetch and cache new page
          console.log('🌐 Fetching page:', nextPage);
          older = await queryClient.fetchQuery({
            queryKey: ['messages', nextPage],
            queryFn: () => getUserMessages(token, nextPage),
            staleTime: 15 * 60 * 1000,
          });
        }
    
        if (older.length === 0) return; // No more messages
    
        setMessages(prev => [...older, ...prev]);
        setPage(nextPage);
    
        setTimeout(() => {
          box.scrollTop = box.scrollHeight - previousHeight;
        }, 0);
      } catch (error) {
        console.error('Error loading older messages:', error);
      }
    }
  };


  const recentEmails = profile?.emailHistory?.slice(0, 3) || [];
  const todayEmails = profile?.emailHistory?.filter(email => {
    const emailDate = new Date(email.sentAt);
    const today = new Date();
    return emailDate.toDateString() === today.toDateString();
  }).length || 0;

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Placeholder for your HeaderPage component */}
      <HeaderPage/>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 md:pt-10 hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Credits Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Credits</p>
                <p className="text-3xl font-bold text-gray-900">{profile?.credits || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Sparkles className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-purple-700 transition-all duration-500"
                style={{ width: `${((profile?.credits || 0) / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Today's Emails */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sent Today</p>
                <p className="text-3xl font-bold text-gray-900">{todayEmails}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Mail className="text-blue-600" size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Keep up the momentum!</p>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">100%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">All emails delivered</p>
          </div>
        </div>
      </div>

      {/* Neural Network Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12 pt-4 md:pt-0">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <NeuralNetworkButton
            onGmailConnect={handleConnectGmail}
            onSendEmail={handleSendingGmail}
            onStartListening={handleStartListening}
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
              {recentEmails.map((email: any, idx: number) => (
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

      {/* Chat Support */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 bg-purple-600 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
          >
            <MessageCircle className="text-white" size={28} />
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl w-[390px] h-[480px] flex flex-col border-2 border-gray-200">
            <div className="bg-[#cc39f5] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Support Chat</h3>
                  <p className="text-xs text-purple-100">We're here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-[#cc39f5] text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
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

            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={humanInput}
                  onChange={(e) => setHumanInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleHumanMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                />
                <button
                  onClick={handleHumanMessage}
                  className="px-5 py-2 rounded-xl bg-gradient-to-b from-[#cc39f5] to-[#b020e0] border-2 border-[#9010c0] shadow-[0_4px_0_0_rgba(144,16,192,0.8)] hover:shadow-[0_2px_0_0_rgba(144,16,192,0.8)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all duration-100 text-white"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}