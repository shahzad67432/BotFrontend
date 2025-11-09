"use client";
import axios from "axios";
import Image from "next/image";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const searchParams: any = useSearchParams();
  const connected = searchParams.get("connected");

  useEffect(() => {
    if (connected === "gmail") {
      alert("Gmail connected successfully!");
    }
    }, [connected]);

  const handleConnectGmail = async () => {
    if(connected === "gmail") {
      // Start listening for emails
      // use whisper or other service to listen and transcribe input voice
      // call python backend to send an user requested email
    }else{
      const token = localStorage.getItem('auth_token');
      if (!token) return alert("No auth token found");
  
      // Redirect user (instead of axios) cannot use axios here for redirection
      window.location.href = `http://127.0.0.1:5000/oAuth-consent?token=${token}`;
    }

  };


  return (
    <>
      <div className="min-h-screen flex flex-col">
        <h1>Welcome to the Bot Application</h1>
        <p>This is the home page.</p>
        <div>
          User Details: <br />
          Email: {localStorage.getItem('auth_token')} <br />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div onClick={handleConnectGmail} className="w-[100px] h-[100px] text-center bg-red-50 border-2 rounded-full p-2 flex items-center justify-center cursor-pointer hover:shadow-red-200 hover:transform-3d hover:animate-bounce ">{connected === "gmail" ? "Listen" : "Connect Gmail"}</div>
        </div>
      </div>
    </>
  );
}
