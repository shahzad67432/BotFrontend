"use client";
import axios from "axios";
import Image from "next/image";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const searchParams: any = useSearchParams();
  const connected = searchParams.get("connected");
  const [speech, setSpeech] = useState("");
  const recognitionRef = useRef<any>(null);
  const [humanInput, setHumanInput] = useState("");
  const [botResponse, setBotResponse] = useState([""]);
  
  const jwt = localStorage.getItem("auth_token");
  useEffect(() => {
    if (!jwt) {
      window.location.href = `http://localhost:3000/login`;
    }
  }, [jwt]);

  useEffect(() => {
    if (connected === "gmail") {
      alert("Gmail connected successfully!");
    }
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = `http://localhost:3000/login`;
    }
  }, [connected]);

  const isGmailConnected = true;

  const handleConnectGmail = async () => {
    if (connected === "gmail" || isGmailConnected) {
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

    } else {
      const token = localStorage.getItem("auth_token");
      if (!token) return alert("No auth token found");

      // Redirect user
      window.location.href = `http://127.0.0.1:5000/oAuth-consent?token=${token}`;
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop(); // stop listening
    recognitionRef.current = null;
  };

  const handleSendingGmail = async (speechText: string) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return alert("No auth token found");

    try {
      await axios.post("http://127.0.0.1:5000/send-email", {
        token,
        speechText
      });
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleHumanMessage = async () => {
    try {
      const response:any = await axios.get("http://127.0.0.1:5000/bot-chat", {
        params: { human_input: humanInput }
      });
      setBotResponse(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Error sending human message:", error);
      alert("Failed to get response from bot.");
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {jwt ? (
          <button onClick={() => {localStorage.removeItem("auth_token"); window.location.href = '/login';}}>Logout</button>
        ) : (
          <button onClick={() => {window.location.href = '/login'}}>Login</button>
        )}
        <h1>Welcome to the Bot Application</h1>
        <p>This is the home page.</p>
        <div>
          User Details: <br />
        </div>
        <div>
          User Message: <textarea name="human_input" onChange={(e:any) => setHumanInput(e.target.value)} className="border p-2 rounded-lg w-full" />
          <button onClick={handleHumanMessage} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 ml-4">
            Submit
          </button>
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            {botResponse.map((response, index) => (
              <p key={index}>BotResponse: {response}</p>
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center gap-8 p-8">
          <div className="flex flex-1 items-center justify-center">
            <div onClick={handleConnectGmail} className="w-[100px] h-[100px] text-center bg-red-50 border-2 rounded-full p-2 flex items-center justify-center cursor-pointer hover:shadow-red-200 hover:transform-3d hover:animate-bounce ">{(connected === "gmail" || isGmailConnected) ? "Listen" : "Connect Gmail"}</div>
          </div>
          <div className="flex flex-1 bg-amber-50 p-4 rounded-2xl">
            <h2>Transcribed Speech:</h2>
            <p>{speech}</p>
          </div>
          <div>
            <button onClick={() => handleSendingGmail(speech)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Send Email</button>
          </div>
        </div>
      </div>
    </>
  );
}
