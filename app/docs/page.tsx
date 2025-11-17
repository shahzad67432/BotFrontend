"use client";
import React, { useState } from 'react';
import { Mail, Mic, Brain, Zap, Shield, Sparkles, ChevronRight, ArrowRight, Check, Play, MessageSquare, Clock, Users } from 'lucide-react';
import Image from 'next/image';

export default function LearnPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const steps = [
    {
      number: 1,
      title: "Connect Gmail",
      description: "Link your Gmail account securely with one click",
      icon: Mail,
      color: "#3b82f6",
      bgColor: "#eff6ff",
      details: "Your credentials are encrypted and stored securely. We use OAuth 2.0 authentication to ensure your data remains private."
    },
    {
      number: 2,
      title: "Speak Naturally",
      description: "Just talk - our AI understands your intent",
      icon: Mic,
      color: "#10b981",
      bgColor: "#f0fdf4",
      details: "Our advanced speech recognition captures your voice with 95% accuracy. Pause for 5 seconds and we'll automatically process your message."
    },
    {
      number: 3,
      title: "AI Processes",
      description: "Neural network converts speech to perfect email",
      icon: Brain,
      color: "#cc39f5",
      bgColor: "#faf5ff",
      details: "Our AI understands context, extracts recipient information, and formats your message professionally - all in milliseconds."
    },
    {
      number: 4,
      title: "Email Sent",
      description: "Your message is delivered instantly",
      icon: Zap,
      color: "#f59e0b",
      bgColor: "#fffbeb",
      details: "Track delivery status in real-time. Your emails are sent with proper formatting and optimal delivery timing."
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Understanding",
      description: "Advanced natural language processing understands context and intent",
      color: "#cc39f5",
      bgColor: "#faf5ff"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption protects your data at every step",
      color: "#3b82f6",
      bgColor: "#eff6ff"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Send emails in seconds, not minutes",
      color: "#f59e0b",
      bgColor: "#fffbeb"
    },
    {
      icon: Sparkles,
      title: "Smart Formatting",
      description: "AI automatically formats emails professionally",
      color: "#ec4899",
      bgColor: "#fdf2f8"
    }
  ];

  const stats = [
    { icon: Users, value: "10K+", label: "Active Users" },
    { icon: Mail, value: "500K+", label: "Emails Sent" },
    { icon: Clock, value: "3 sec", label: "Avg. Send Time" },
  ];

  const jwt = localStorage.getItem("auth_token");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-between px-6 w-full mx-[20%] py-2 items-center border rounded-full border-[#e086f8] mt-6">
          <Image onClick={() => {window.location.href = '/';}} src="/logo.png" alt="Logo" width={40} height={40} />
          <div className="flex text-center items-center">
            <div>
              {jwt ? (
                <button onClick={() => {localStorage.removeItem("auth_token"); window.location.href = '/login';}} className="">Logout</button>
              ) : (
                <button onClick={() => {window.location.href = '/login'}}>Login</button>
              )}
            </div>
            <button className="py-0.5 px-3 border bg-[#ecbbf9] border-[#e086f8] ml-4 mr-2 rounded-full text-[#cc39f5] text-center flex items-center gap-2" onClick={() => {window.location.href = '/docs'}}>Learn <ArrowRight width={16} height={16} /> </button>
          </div>
        </div>
       </div>

      {/* Hero Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#faf5ff] border-2 border-[#e086f8] px-6 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-[#cc39f5]" />
            <span className="text-sm font-semibold text-[#cc39f5]">Learn How It Works</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 text-[#cc39f5]" style={{ fontFamily: 'Mauline, sans-serif' }}>
            Voice to Email in Seconds
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Transform the way you communicate. Speak naturally, and let our neural network handle the rest.
          </p>
          
          <button className="group bg-[#cc39f5] hover:bg-[#b030d9] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto">
            <Play className="w-6 h-6" />
            Watch Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:px-32">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#faf5ff] border-2 border-[#e086f8] rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-8 h-8 text-[#cc39f5]" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Interactive Demo Section */}
      <div className=" py-20 border-y-2 border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              See It In <span className="text-[#cc39f5]">Action</span>
            </h2>
          </div>

          <div className="bg-[#faf5ff] border-2 border-[#e086f8] rounded-3xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Voice Input Simulation */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">You Speak</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 min-h-32 border-2 border-gray-200">
                  <p className="text-gray-600 italic">
                    "Hey, send an email to Shahzad at f2023376234@umt.edu.pk about tomorrow's meeting. 
                    Let him know we'll discuss the Q4 strategy at 2 PM."
                  </p>
                </div>
              </div>

              {/* Right: AI Output */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#cc39f5] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">AI Sends</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 min-h-32 space-y-2 border-2 border-gray-200">
                  <p className="text-sm text-gray-500">To: f2023376234@umt.edu.pk</p>
                  <p className="text-sm text-gray-500">Subject: Tomorrow's Meeting</p>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-gray-700">
                      Hi Shahzad,<br/><br/>
                      I wanted to touch base regarding tomorrow's meeting. 
                      We'll be discussing the Q4 strategy at 2 PM.<br/><br/>
                      Looking forward to it!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <div className="bg-white border-2 border-[#cc39f5] px-6 py-3 rounded-full shadow-lg">
                <p className="text-sm font-semibold text-[#cc39f5] flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Email sent in 3 seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Powered by <span className="text-[#cc39f5]">Advanced AI</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setSelectedFeature(index)}
                onMouseLeave={() => setSelectedFeature(null)}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${
                  selectedFeature === index ? 'border-[#cc39f5]' : 'border-gray-200'
                } transform hover:-translate-y-2`}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className=" text-[#cc39f5] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold  mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl  mb-8">
            Join thousands of users who are already saving hours every week
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-white text-[#cc39f5] px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Get Started Now
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}