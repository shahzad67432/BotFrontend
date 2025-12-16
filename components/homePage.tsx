"use client";
import { getUserMessages, gmailConnectionExpiryRequest } from "@/actions";
import axios, { create, get } from "axios";
import { ArrowBigRight, ArrowRight, BarChart3, CheckCircle, ChevronRight, Clock, Layout, Loader, Mail, MessageCircle, Send, Sparkles, TrendingUp, X, Zap } from 'lucide-react';
import Image from "next/image";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useMemo, useRef, useState } from "react";

import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import NeuralNetworkButton from "@/app/button";
import { HeaderPage } from "@/app/Header";
import { toast } from "sonner";
import { profile } from "console";
import { getUserProfileData } from "@/app/actions/profile";
import Lottie from "lottie-react";
import mailAnimation from '../public/Email.json';
import PhantomStatsBar from "@/app/StatusBar";
import { ChatDesign } from "./ChatbotInterface";
import { ClassicDesign } from "./ClassicDesign";

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
  const [isNewDesign, setIsNewDesign] = useState(false);
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


    useEffect(() => {
    const saved = localStorage.getItem('design_preference');
    if (saved) setIsNewDesign(saved === 'chat');
    }, []);

    const toggleDesign = () => {
      const newValue = !isNewDesign;
      setIsNewDesign(newValue);
      localStorage.setItem('design_preference', newValue ? 'chat' : 'classic');
    };

    return (
    <div className="bg-gray-50">
      {/* Header - Placeholder for your HeaderPage component */}
      <HeaderPage/>
    <button
      onClick={toggleDesign}
      className="text-white fixed bottom-6 left-6 z-50 p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-sm shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
    >
      {isNewDesign ? "Old Design" : "New Design"}
    </button>

    {/* Design Switch */}
    {isNewDesign ? (
      <ChatDesign
            profile={profile}
            isGmailConnected={isGmailConnected}
            onConnectGmail={handleConnectGmail}
            onSendEmail={handleSendingGmail}
            onStartListening={handleStartListening}
            onStopListening={stopListening}
            speech={speech}
            setSpeech={setSpeech}
            recentEmails={recentEmails}
            messages={messages}
            setMessages={setMessages}
            humanInput={humanInput}
            setHumanInput={setHumanInput}
            handleHumanMessage={handleHumanMessage}
            sendingMessage={sendingMessage}
            chatEndRef={chatEndRef}
            isLoading={false}
          />
        ) : (
          <ClassicDesign
            profile={profile}
            isGmailConnected={isGmailConnected}
            onConnectGmail={handleConnectGmail}
            onSendEmail={handleSendingGmail}
            onStartListening={handleStartListening}
            speech={speech}
            recentEmails={recentEmails}
            NeuralNetworkButton={NeuralNetworkButton}
            PhantomStatsBar={PhantomStatsBar}
            router={router}
            isLoading={false}
          />
    )}

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

//   const processEmailStats = (history: any[]) => {
//     const now = new Date();
//     const todayStr = now.toDateString();

//     console.log("Email history:", history);
    
//     // 1. Calculate Today's Count
//     const sentToday = history.filter(email => new Date(email.sentAt).toDateString() === todayStr).length;

//     // 2. Calculate Success Rate
//     // Assuming status is 'sent' or 'delivered' for success. Adjust 'failed' check as needed.
//     const total = history.length;
//     const successful = history.filter(email => email.status !== 'failed').length;
//     const successRate = total === 0 ? 100 : Math.round((successful / total) * 100);

//     // 3. Generate Last 5 Days Activity for Bar Chart
//     const days = [];
//     const activityData = [];
//     const dayLabels = [];

//     for (let i = 4; i >= 0; i--) {
//       const d = new Date();
//       d.setDate(now.getDate() - i);
//       const dStr = d.toDateString();

//       // Get Day Name (e.g., "M", "T")
//       dayLabels.push(d.toLocaleDateString('en-US', { weekday: 'narrow' }));

//       // Count emails for this specific date
//       const count = history.filter(email => new Date(email.sentAt).toDateString() === dStr).length;
//       days.push(count);
//     }

//     // Normalize data for bar height (0 to 100%)
//     // We find the max value in the week to set the scale. If max is 0, avoid division by zero.
//     const maxVal = Math.max(...days, 5); // Minimum scale of 5 to avoid flat bars
//     days.forEach(count => activityData.push((count / maxVal) * 100));

//     return { sentToday, successRate, activityData, dayLabels };
//   };


// const PhantomStatsBar = ({ credits = 0, history = [] }) => {
//   const { sentToday, successRate, activityData, dayLabels } = processEmailStats(history);

//   return (
//     <div className="w-full max-w-7xl mx-auto px-6 py-6 hidden md:block">
//       <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 flex items-center justify-between relative overflow-hidden">
        
//         {/* Background Gradients */}
//         <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

//         {/* 1. Activity Chart */}
//         <div className="flex flex-col gap-4 w-1/3 border-r border-gray-100 pr-8">
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-gray-500 text-sm font-medium">Activity (5 Days)</h3>
//             <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">Live</span>
//           </div>
//           <div className="h-24 flex items-end justify-between gap-3">
//             {activityData.map((height, i) => (
//               <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
//                 <div className="relative w-full rounded-t-lg bg-gray-100 h-full overflow-hidden flex items-end">
//                    <div 
//                     className="w-full rounded-t-lg transition-all duration-1000 ease-out group-hover:opacity-80"
//                     style={{ 
//                       height: `${height}%`,
//                       background: 'linear-gradient(180deg, #cc39f5 0%, #6366f1 100%)' 
//                     }} 
//                    />
//                 </div>
//                 <span className="text-[10px] text-gray-400 font-medium">
//                   {dayLabels[i]}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Header */}
//         <div className="text-center mb-12 mt-8 flex flex-col items-center justify-center">
//           <h1 className=" relative text-5xl font-bold text-[#cc39f5] mb-4 flex flex-row items-center justify-center text-center gap-6" style={{ fontFamily: 'Mauline, sans-serif' }}>
//             NEURAL 
//             <span className=" w-[100px] items-center justify-center">
//                 <Lottie 
//                   animationData={mailAnimation}
//                   loop={true}
//                   width={48}
//                   height={48}
//                 />
//             </span>
//           </h1>
//           <p className='relative text-5xl text-[#cc39f5] mb-4 flex flex-row items-center justify-center text-center gap-6 font-pixel font-medium ' style={{ fontFamily: 'Mauline, sans-serif' }}> ASSISTANT</p>
//         </div>

//         {/* 2. Credits Gauge */}
//         <div className="flex flex-col items-center justify-center w-1/3 px-8 relative">
//           {/* Top Left - Max Credits */}
//           {/* <div className="absolute top-0 left-12 text-center">
//             <p className="text-2xl font-bold text-gray-800">100</p>
//             <p className="text-[10px] text-gray-400 font-medium">Max Credits</p>
//           </div> */}
          
//           {/* Top Right - Used Credits */}
//           <div className="absolute top-0 right-12 text-center">
//             <p className="text-2xl font-bold text-gray-800">{10 - credits}</p>
//             <p className="text-[10px] text-gray-400 font-medium">Used Credits</p>
//           </div>
          
//           {/* Bottom - Success Rate */}
//           {/* <div className="absolute bottom-0 text-center">
//             <p className="text-2xl font-bold text-green-500">{successRate}%</p>
//             <p className="text-[10px] text-gray-400 font-medium">Success Rate</p>
//           </div> */}

//           {/* Main Gauge */}
//           <div className="relative w-56 h-32 flex items-center justify-center">
//             <svg viewBox="0 0 200 110" className="w-full h-full">
//               {/* Generate line-based semicircle */}
//               {Array.from({ length: 50 }).map((_, i) => {
//                 const angle = (i / 49) * 180; // 0 to 180 degrees (left to right)
//                 const radians = (angle * Math.PI) / 180;
//                 const radius = 85;
//                 const centerX = 100;
//                 const centerY = 100;
//                 const x1 = centerX + Math.cos(radians) * (radius - 12);
//                 const y1 = centerY - Math.sin(radians) * (radius - 12);
//                 const x2 = centerX + Math.cos(radians) * radius;
//                 const y2 = centerY - Math.sin(radians) * radius;
                
//                 const progress = (credits / 10) * 50;
//                 const isActive = i < progress;
                
//                 return (
//                   <line
//                     key={i}
//                     x1={x1}
//                     y1={y1}
//                     x2={x2}
//                     y2={y2}
//                     stroke={isActive ? (i < progress * 0.6 ? '#cc39f5' : '#6366f1') : '#e5e7eb'}
//                     strokeWidth="2.5"
//                     strokeLinecap="round"
//                     className="transition-all duration-1000 ease-out"
//                     style={{ transitionDelay: `${i * 10}ms` }}
//                   />
//                 );
//               })}
//             </svg>
            
//             {/* Center text */}
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
//               <p className="text-5xl font-bold text-gray-800">{credits}</p>
//               <p className="text-xs text-gray-400 font-medium mt-1">Available Credits</p>
//             </div>
//           </div>
//         </div>

//         {/* 3. Metrics */}
//         {/* <div className="flex flex-col gap-6 w-1/3 border-l border-gray-100 pl-8 justify-center">
//           <div className="flex items-center justify-between group cursor-pointer">
//             <div>
//               <p className="text-3xl font-bold text-gray-800 group-hover:text-[#cc39f5] transition-colors">{sentToday}</p>
//               <p className="text-sm text-gray-500">Emails Sent Today</p>
//             </div>
//             <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
//               <ArrowRight size={20} className="text-gray-400 group-hover:text-[#cc39f5]" />
//             </div>
//           </div>
//           <div className="flex items-center justify-between group cursor-pointer">
//             <div>
//               <p className="text-3xl font-bold text-gray-800 group-hover:text-green-500 transition-colors">{successRate}%</p>
//               <p className="text-sm text-gray-500">Success Rate</p>
//             </div>
//             <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
//               <TrendingUp size={20} className="text-gray-400 group-hover:text-green-500" />
//             </div>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   )
// }