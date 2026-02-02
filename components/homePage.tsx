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
import chatAnimation from "..//public/chatbot.json"


type ChatMessage = {
  id: number;
  role: string;
  content: string;
  createdAt: Date;
  userId: number;
  analysis?: any;
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
  const [res, setRes] = useState<any>(null);

  const router = useRouter();

  const checkedRef = useRef(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  let jwt = null;

  if (typeof window !== "undefined") {
    jwt = window.localStorage.getItem("auth_token");
  }

  useEffect(() => {
    if (!jwt) {
      window.location.href = `http://localhost:3000/login`;
    }

  }, [jwt]);

  const { data: profile, isError } = useQuery<any>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!jwt) throw new Error('No token');
      return await getUserProfileData(jwt);
    },
    enabled: !!jwt, // Only run when jwt exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  console.log("User Profile:", profile);

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
      analysis: null, // Initially null, will be updated if response comes back with analysis for user message (optional)
    };

    // Display user's message immediately
    setMessages(prev => [...prev, newUserMessage]);

    // Optimistically update cache to prevent message disappearing
    queryClient.setQueryData(['messages', 1], (oldData: ChatMessage[] | undefined) => {
      if (!oldData) return [newUserMessage];
      return [...oldData, newUserMessage];
    });

    try {
      const token = localStorage.getItem("auth_token");
      setSendingMessage(true);

      const inputMessage = humanInput;
      setHumanInput("");

      const res = await axios.get("http://127.0.0.1:5000/bot-chat", {
        params: { human_input: inputMessage, auth_token: token, email: profile.email, name: profile.name },
      });
      console.log("Bot response:", res.data);
      if (res) setRes(res.data)
      // Initial user message update if needed
      // The backend returns userMessage object but we already added one optimistically.
      // If we want analysis on user message too, we'd need to update it.
      // However, the request is specifically about bot message analysis. I will prioritize bot message.

      const botMsg: ChatMessage = {
        id: res.data.botMessage?.id || Date.now(),
        role: "bot",
        createdAt: res.data.botMessage?.createdAt
          ? new Date(res.data.botMessage.createdAt)
          : new Date(),
        userId: res.data.botMessage?.userId || 0,
        content: res.data.content, // Bot response text
        analysis: res.data.analysis, // Add analysis here
      };

      setSendingMessage(false);

      // Update the last user message with analysis if available from response
      // optional: if the backend returns userMessage with analysis
      // But primarily let's add the bot message
      setMessages(prev => {
        // Find the last user message and attach analysis if available? 
        // The user didn't explicitly ask for user message analysis updates, 
        // but 'botreponse contain the analysis' suggests bot message.
        // Let's stick to adding bot message with analysis.

        // Double check to ensure we don't add duplicates
        if (prev.some(m => m.id === botMsg.id)) return prev;
        return [...prev, botMsg];
      });

      // Use setQueryData to update the cache manually with the complete message (including analysis)
      // capable of persisting the analysis in the session without refetching from DB immediately.
      queryClient.setQueryData(['messages', 1], (oldData: ChatMessage[] | undefined) => {
        if (!oldData) return [botMsg];
        // Check for duplicates in cache too
        if (oldData.some(m => m.id === botMsg.id)) return oldData;
        return [...oldData, botMsg];
      });

      // We do NOT invalidate queries here because the DB might not have the analysis data yet (or at all),
      // and refetching would overwrite our localized full data with incomplete data.
      // queryClient.invalidateQueries({ queryKey: ['messages'] });
    } catch (error) {
      console.error(error);
      setSendingMessage(false);

      const errorMsg = {
        id: Date.now(),
        role: "bot",
        createdAt: new Date(),
        userId: 0,
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("auth_token")
      : null;

  const { data: initialData, isLoading, error, isFetching } = useQuery({
    queryKey: ['messages', 1], // Always fetch page 1
    queryFn: () => getUserMessages(token as string, 1),
    enabled: !!token,
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

  console.log(messages, "messages here");

  return (
    <div className="bg-gray-50">
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
          analysis={res}
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
      <div className="fixed bottom-0 right-0 z-50">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="hover:scale-110 transition-transform flex items-center justify-center"
          >
            <Lottie
            animationData={chatAnimation}
            loop={true}
            autoplay={true}
            className="w-36 h-36"
          />
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
                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${msg.role === "user"
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


