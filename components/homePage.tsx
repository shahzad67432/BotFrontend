"use client";
import { getUserMessages, gmailConnectionExpiryRequest } from "@/actions";
import axios, { create, get } from "axios";
import { ArrowBigRight, ArrowRight, BarChart3, ChevronRight, Clock, Loader, Mail, MessageCircle, Send, Sparkles, X, Zap } from 'lucide-react';
import Image from "next/image";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useMemo, useRef, useState } from "react";

import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import NeuralNetworkButton from "@/app/button";
import { HeaderPage } from "@/app/Header";
import { toast } from "sonner";
import { profile } from "console";

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




  return (
    <>
      <div className="min-h-screen flex flex-col relative">

        {/* header */}
        <HeaderPage />

        

          <div className="flex-1 flex flex-col justify-center">
            <NeuralNetworkButton
              onGmailConnect={handleConnectGmail}
              onSendEmail={handleSendingGmail}
              onStartListening={handleStartListening}
              isGmailConnected={isGmailConnected}
              isListening={speech.length > 0}
              transcript={speech}
            />
          </div>


        {/* new messages input */}
        <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="rounded-full flex items-center justify-center transition-all hover:scale-110 mr-6 mb-6"
          >
            <Image src="/support.png" alt="Chat Icon" width={72} height={72} className="shadow-sm rounded-full "/>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl w-[390px] h-[480px] flex flex-col border-2 border-gray-200">
            {/* Chat Header */}
            <div className="bg-[#cc39f5] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Customer Support</h3>
                  <p className="text-xs text-blue-100">We're here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-white hover:text-black hover:bg-opacity-20 rounded-lg p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
              ref={chatRef}
              onScroll={handleScroll}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-[#cc39f5] text-white rounded-br-sm"
                        : "bg-white text-gray-800 border-2 border-gray-200 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {sendingMessage? <div><Loader className="animate-spin ml-2 w-5 h-5 text-gray-500" /></div> : null}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t-2 border-gray-200 bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={humanInput}
                  onChange={(e) => setHumanInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleHumanMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-800"
                />
                <button
                  onClick={handleHumanMessage}
                  className="bg-[#cc39f5] hover:bg-blue-700 text-white p-3 rounded-xl transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      </div>
    </>
  );
}
