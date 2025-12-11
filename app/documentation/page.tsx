"use client"
import React, { useState } from 'react';
import { Mail, Mic, Shield, Code, BookOpen, Users, Zap, Database, Lock, Server, Globe, MessageSquare, ChevronDown, ChevronRight, ExternalLink, Copy, Check, ArrowRight, Sparkles, Brain, FileText, Clock, UserCheck, GraduationCap, Briefcase, Calendar, HelpCircle, GitBranch, BarChart3, Dock, Video, Lightbulb, Play } from 'lucide-react';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedEnv, setCopiedEnv] = useState('');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedEnv(id);
    setTimeout(() => setCopiedEnv(''), 2000);
  };

  const backendEnv = `GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
ENCRYPTION_KEY=""
BASE_URL=""
DATABASE_URL=""
FLASK_ENCRYPTION_KEY=""`;

  const frontendEnv = `JWT_SECRET=""
DATABASE_URL=""
EMAIL_ADDRESS=""
EMAIL_PASSWORD=""`;

  const sections = [
    { id: 'overview', icon: BookOpen, label: 'Overview' },
    { id: 'demo', icon: Video, label: 'Demo' },
    { id: 'example', icon: Lightbulb, label: 'Example' },
    { id: 'features', icon: Sparkles, label: 'Features' },
    { id: 'usecases', icon: GraduationCap, label: 'Use Cases' },
    { id: 'architecture', icon: Code, label: 'Architecture' },
    { id: 'installation', icon: Server, label: 'Installation' },
    { id: 'usage', icon: Zap, label: 'Usage Guide' },
    { id: 'api', icon: Database, label: 'API Reference' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'contributing', icon: Users, label: 'Contributing' },
  ];

  const NavSection = ({ section }) => {
    const Icon = section.icon;
    return (
      <button
        onClick={() => setActiveSection(section.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          activeSection === section.id
            ? 'text-purple-700 font-semibold bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 shadow-[0_3px_0_0_rgba(226,134,248,0.3)] hover:shadow-[0_2px_0_0_rgba(226,134,248,0.3)] hover:translate-y-[1px] active:shadow-none active:translate-y-[3px] transition-all duration-100'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Icon size={20} />
        <span>{section.label}</span>
      </button>
    );
  };

  const CodeBlock = ({ code, envId }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 my-4">
      {envId && (
        <button
          onClick={() => copyToClipboard(code, envId)}
          className="absolute top-3 right-3 p-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          {copiedEnv === envId ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} className="text-gray-400" />
          )}
        </button>
      )}
      <pre className="text-sm text-gray-100 overflow-x-auto pr-12">
        <code>{code}</code>
      </pre>
    </div>
  );

  const FeatureCard = ({ icon: Icon, title, description, color }) => {
    const colorClasses = {
      purple: 'bg-purple-50 border-purple-200',
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      red: 'bg-red-50 border-red-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      indigo: 'bg-indigo-50 border-indigo-200',
      pink: 'bg-pink-50 border-pink-200'
    };

    const iconColors = {
      purple: 'text-purple-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      indigo: 'text-indigo-600',
      pink: 'text-pink-600'
    };

    return (
      <div className={`${colorClasses[color]} border rounded-lg p-6`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Icon className={iconColors[color]} size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>
      </div>
    );
  };

  const UseCaseCard = ({ icon: Icon, title, examples, color }) => {
    const [expanded, setExpanded] = useState(false);

    const colorClasses = {
      red: 'bg-red-50 border-red-200',
      orange: 'bg-orange-50 border-orange-200',
      blue: 'bg-blue-50 border-blue-200',
      purple: 'bg-purple-50 border-purple-200',
      green: 'bg-green-50 border-green-200',
      indigo: 'bg-indigo-50 border-indigo-200',
      gray: 'bg-gray-50 border-gray-200'
    };

    const iconColors = {
      red: 'text-red-600',
      orange: 'text-orange-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      indigo: 'text-indigo-600',
      gray: 'text-gray-600'
    };

    return (
      <div className={`${colorClasses[color]} border rounded-lg p-5`}>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Icon className={iconColors[color]} size={24} />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        
        {expanded && (
          <div className="mt-4 space-y-2">
            {examples.map((example, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-700 italic">{example}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ApiEndpoint = ({ method, endpoint, description, params, response }) => {
    const methodColors = {
      GET: 'bg-blue-100 text-blue-700',
      POST: 'bg-green-100 text-green-700',
      PUT: 'bg-yellow-100 text-yellow-700',
      DELETE: 'bg-red-100 text-red-700'
    };

    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <span className={`${methodColors[method]} px-3 py-1 rounded-md font-semibold text-sm`}>
            {method}
          </span>
          <code className="text-lg font-mono text-gray-800">{endpoint}</code>
        </div>
        
        <p className="text-gray-600 mb-4">{description}</p>
        
        {params && params.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 text-sm mb-2">Parameters:</h4>
            <div className="space-y-2">
              {params.map((param, idx) => (
                <div key={idx} className="bg-gray-50 rounded p-3 text-sm">
                  <code className="text-purple-600 font-semibold">{param.name}</code>
                  <span className="text-gray-500 mx-2">({param.type})</span>
                  <p className="text-gray-600 mt-1">{param.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {response && (
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-2">Response:</h4>
            <pre className="bg-gray-900 text-gray-100 rounded p-4 text-xs overflow-x-auto">
              <code>{response}</code>
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">


      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <aside className="w-64 flex-shrink-0 sticky top-24 h-fit">
          <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="space-y-1">
              {sections.map(section => (
                <NavSection key={section.id} section={section} />
              ))}
              <div className="flex gap-3 flex-col">
                <a href="https://github.com/shahzad67432/BotFrontend" target="_blank" rel="noopener noreferrer" 
                   className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <GitBranch size={16} />
                  Frontend
                </a>
                <a href="https://github.com/shahzad67432/bot-backend" target="_blank" rel="noopener noreferrer"
                   className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <GitBranch size={16} />
                  Backend
                </a>
              </div>
            </div>
          </nav>
        </aside>

        <main className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Neural Mail Assistant is an intelligent voice-to-email system that leverages AI and natural language processing 
                  to transform spoken requests into professional, formatted emails. Designed specifically for students and professionals, 
                  it streamlines email communication through voice commands and smart template matching.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <Brain className="text-purple-600 mb-3" size={32} />
                  <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
                  <p className="text-sm text-gray-600">AIML chatbot understands context and intent</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <Mic className="text-blue-600 mb-3" size={32} />
                  <h3 className="font-semibold text-gray-900 mb-2">Voice First</h3>
                  <p className="text-sm text-gray-600">Speak naturally, no typing required</p>
                </div>
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <Lock className="text-green-600 mb-3" size={32} />
                  <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
                  <p className="text-sm text-gray-600">End-to-end encryption with OAuth2</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Zap className="text-purple-600" size={20} />
                  Quick Start
                </h3>
                <p className="text-gray-700 mb-4">Get started in 3 simple steps:</p>
                <ol className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                    Connect your Gmail account
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                    Speak your email request
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                    Review and send
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeSection === 'demo' && (
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
          )}

          {activeSection === 'example' && (
            <div className=" py-20 border-y-2 border-gray-200">
              <div className="max-w-5xl mx-auto px-6">
      
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
          )}

          {activeSection === 'features' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Features</h2>
              
              <div className="space-y-4">
                <FeatureCard icon={Mic} title="Voice Recognition" description="Advanced Web Speech API integration with automatic silence detection and real-time transcription." color="purple" />
                <FeatureCard icon={Brain} title="Smart Template Matching" description="AI-powered analysis identifies email type (leave, extension, inquiry) and applies appropriate templates automatically." color="blue" />
                <FeatureCard icon={Database} title="Contact Management" description="Intelligent recipient lookup from database based on names, titles, or departments mentioned in voice input." color="green" />
                <FeatureCard icon={Mail} title="Gmail Integration" description="Seamless OAuth2 authentication and email sending through official Gmail API with full formatting support." color="red" />
                <FeatureCard icon={MessageSquare} title="AIML Chatbot" description="Interactive support bot for queries, guidance, and conversation with persistent chat history." color="yellow" />
                <FeatureCard icon={Lock} title="Enterprise Security" description="JWT authentication, Fernet encryption for tokens, secure credential storage, and CORS protection." color="indigo" />
                <FeatureCard icon={Globe} title="Neural Network UI" description="Beautiful animated network visualization with real-time state indicators and smooth transitions." color="pink" />
              </div>
            </div>
          )}

          {activeSection === 'usecases' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Student Use Cases</h2>
              
              <p className="text-gray-600 mb-6">
                Neural Mail Assistant is designed to handle various academic communication scenarios. Here are common situations where students can benefit:
              </p>

              <div className="space-y-4">
                <UseCaseCard icon={FileText} title="Leave Applications" examples={["Send leave email to Professor Ahmed for sick leave tomorrow", "Email Dr. Sarah about family emergency leave for 3 days", "Request personal day off from Sir Mahmood Hussain"]} color="red" />
                <UseCaseCard icon={Clock} title="Assignment Extensions" examples={["Ask Professor Khan for assignment deadline extension due to illness", "Request Dr. Maria for project extension, need 2 more days", "Email Sir Hassan about late submission due to technical issues"]} color="orange" />
                <UseCaseCard icon={Calendar} title="Appointment Scheduling" examples={["Schedule meeting with Dr. Ali for thesis discussion next week", "Request office hours appointment with Professor Zainab", "Book consultation with academic advisor about course selection"]} color="blue" />
                <UseCaseCard icon={HelpCircle} title="Clarification Requests" examples={["Ask Professor Raza about lecture 5 topic clarification", "Email Dr. Fatima regarding exam syllabus confusion", "Request Sir Usman to explain assignment requirements"]} color="purple" />
                <UseCaseCard icon={Users} title="Project Collaboration" examples={["Coordinate with Dr. Ayesha about group project timeline", "Update Professor Bilal on team progress and next steps", "Request guidance from Sir Imran on research methodology"]} color="green" />
                <UseCaseCard icon={Briefcase} title="Internship Inquiries" examples={["Professional email to HR Manager about internship opportunity", "Follow-up with company representative about application status", "Express interest in summer internship program at tech firm"]} color="indigo" />
                <UseCaseCard icon={UserCheck} title="Administrative Requests" examples={["Request transcript from academic office", "Email registrar about enrollment verification letter", "Ask administration for character certificate"]} color="gray" />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Sparkles size={20} />
                  Example Voice Input
                </h3>
                <div className="bg-white rounded-lg p-4 mb-4 border border-blue-100">
                  <p className="text-gray-700 italic">
                    "Send an email to Sir Mahmood Hussain for leave as I am ill with fever and cannot attend tomorrow's class"
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>What happens:</strong> The system identifies this as a sick leave request, finds Sir Mahmood Hussain's email, 
                  applies the formal leave template, includes the reason (fever), and generates a professional email ready to send.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'architecture' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Architecture & Tech Stack</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Globe className="text-purple-600" />
                    Frontend Architecture
                  </h3>
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">Next.js 14</strong>
                          <p className="text-sm text-gray-600">React framework with App Router, Server Components, and API routes</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">TypeScript</strong>
                          <p className="text-sm text-gray-600">Type-safe development with full IDE support</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">Tailwind CSS</strong>
                          <p className="text-sm text-gray-600">Utility-first styling with custom animations and gradients</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-purple-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">Web Speech API</strong>
                          <p className="text-sm text-gray-600">Browser-native voice recognition with silence detection</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Server className="text-blue-600" />
                    Backend Architecture
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">Flask (Python)</strong>
                          <p className="text-sm text-gray-600">Lightweight web framework with RESTful API design</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">AIML Kernel</strong>
                          <p className="text-sm text-gray-600">AI chatbot engine with custom knowledge base</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">Google OAuth2</strong>
                          <p className="text-sm text-gray-600">Secure authentication flow with Gmail API access</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">Gmail API</strong>
                          <p className="text-sm text-gray-600">Official Google API for email sending with MIME support</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Database className="text-green-600" />
                    Database & Storage
                  </h3>
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-green-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">PostgreSQL</strong>
                          <p className="text-sm text-gray-600">Relational database for user data, messages, and OAuth tokens</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-green-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">Prisma ORM</strong>
                          <p className="text-sm text-gray-600">Type-safe database client with migrations</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Lock className="text-red-600" />
                    Security Layer
                  </h3>
                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-red-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">JWT (JSON Web Tokens)</strong>
                          <p className="text-sm text-gray-600">Stateless authentication with HS256 algorithm</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-red-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">Fernet Encryption</strong>
                          <p className="text-sm text-gray-600">Symmetric encryption for OAuth tokens at rest</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <ChevronRight className="text-red-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <strong className="text-gray-900">OAuth2 Flow</strong>
                          <p className="text-sm text-gray-600">Industry-standard authorization with refresh tokens</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'installation' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Installation & Setup</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Prerequisites</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Node.js 18+ and npm/yarn
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Python 3.8+
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      PostgreSQL 14+
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Google Cloud Console account (for OAuth2)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Clone Repositories</h3>
                  <CodeBlock envId="clone" code={`# Clone frontend
git clone https://github.com/shahzad67432/BotFrontend.git
cd BotFrontend

# Clone backend (in separate terminal)
git clone https://github.com/shahzad67432/bot-backend.git
cd bot-backend`} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Frontend Setup</h3>
                  <CodeBlock envId="frontend-install" code={`# Install dependencies
npm install

# Create .env file
touch .env`} />
                  
                  <p className="text-gray-700 mb-2 mt-4 font-medium">Frontend .env configuration:</p>
                  <CodeBlock envId="frontend-env" code={frontendEnv} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Backend Setup</h3>
                  <CodeBlock envId="backend-install" code={`# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows: venv\\Scripts\\activate
# On Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
touch .env`} />
                  
                  <p className="text-gray-700 mb-2 mt-4 font-medium">Backend .env configuration:</p>
                  <CodeBlock envId="backend-env" code={backendEnv} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">4. Database Setup</h3>
                  <CodeBlock envId="database" code={`# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate`} />
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">5. Google OAuth Setup</h3>
<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
<p className="text-gray-700 mb-3">Go to Google Cloud Console and:</p>
<ol className="space-y-2 text-gray-700 ml-4">
<li className="flex items-start gap-2">
<span className="font-semibold">1.</span>
Create a new project or select existing one
</li>
<li className="flex items-start gap-2">
<span className="font-semibold">2.</span>
Enable Gmail API
</li>
<li className="flex items-start gap-2">
<span className="font-semibold">3.</span>
Create OAuth 2.0 credentials
</li>
<li className="flex items-start gap-2">
<span className="font-semibold">4.</span>
Add authorized redirect URIs (e.g., http://localhost:5000/oauth-callback)
</li>
<li className="flex items-start gap-2">
<span className="font-semibold">5.</span>
Copy Client ID and Client Secret to backend .env
</li>
</ol>
</div>
</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">6. Start the Application</h3>
              <CodeBlock envId="start" code={`# Terminal 1 - Start Backend
cd bot-backend
python app.py
Terminal 2 - Start Frontend
cd BotFrontend
npm run dev`} />
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-4">
                <p className="text-gray-700">
                  <strong>Access the application:</strong><br />
                  Frontend: <code className="bg-white px-2 py-1 rounded">http://localhost:3000</code><br />
                  Backend API: <code className="bg-white px-2 py-1 rounded">http://localhost:5000</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'usage' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Usage Guide</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Getting Started</h3>
              
              <div className="space-y-4">
                <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <h4 className="font-semibold text-gray-900">Create Account & Login</h4>
                  </div>
                  <p className="text-gray-600 ml-11">
                    Register with your email and password. After verification, log in to access the dashboard.
                  </p>
                </div>

                <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <h4 className="font-semibold text-gray-900">Connect Gmail Account</h4>
                  </div>
                  <p className="text-gray-600 ml-11 mb-3">
                    Click the central neural network button to connect Gmail via OAuth2.
                  </p>
                </div>

                <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <h4 className="font-semibold text-gray-900">Start Voice Recording</h4>
                  </div>
                  <p className="text-gray-600 ml-11 mb-3">
                    Click again to activate voice recording. Speak your email request clearly.
                  </p>
                  <div className="ml-11 bg-blue-50 rounded p-3 text-sm text-gray-700">
                    <strong>Example:</strong> "Send email to Professor Ahmed for sick leave tomorrow"
                  </div>
                </div>

                <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                    <h4 className="font-semibold text-gray-900">Review & Send</h4>
                  </div>
                  <p className="text-gray-600 ml-11">
                    The system generates the email automatically. Review it and click send when ready.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Voice Commands Tips</h3>
              <div className="space-y-3">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Clear Structure</h4>
                  <p className="text-gray-600 text-sm">Include: recipient, purpose, and key details</p>
                  <p className="text-purple-700 text-sm mt-2 italic">"Send email to Dr. Khan requesting assignment extension due to illness, need 3 more days"</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Natural Speech</h4>
                  <p className="text-gray-600 text-sm">Speak conversationally, the AI understands context</p>
                  <p className="text-purple-700 text-sm mt-2 italic">"I need to inform Sir Mahmood that I won't be able to attend class tomorrow because I'm sick"</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">✓ Specify Recipients</h4>
                  <p className="text-gray-600 text-sm">Use full names or titles for accurate lookup</p>
                  <p className="text-purple-700 text-sm mt-2 italic">"Email to Professor Sarah Johnson about thesis meeting"</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-purple-600" />
                Using the AIML Chatbot
              </h3>
              <p className="text-gray-700 mb-4">
                Access the chatbot anytime for help, guidance, or general conversation. It can answer questions about:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="text-purple-600" size={18} />
                  How to use the voice features
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-purple-600" size={18} />
                  Email template information
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-purple-600" size={18} />
                  Troubleshooting common issues
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-purple-600" size={18} />
                  General questions about the system
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'api' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">API Reference</h2>
          
          <div className="space-y-6">
            <ApiEndpoint
              method="POST"
              endpoint="/oAuth-consent"
              description="Initiates Gmail OAuth2 flow"
              params={[
                { name: 'token', type: 'string', description: 'JWT authentication token' }
              ]}
              response="Redirects to Google OAuth consent screen"
            />

            <ApiEndpoint
              method="POST"
              endpoint="/send-email"
              description="Sends email via Gmail API"
              params={[
                { name: 'token', type: 'string', description: 'JWT authentication token' },
                { name: 'speechText', type: 'string', description: 'Voice transcription text' }
              ]}
              response={`{
"status": "success",
"message_id": "18d4f2c8a1b3e9f0"
}`}
/>
            <ApiEndpoint
              method="GET"
              endpoint="/bot-chat"
              description="AIML chatbot interaction"
              params={[
                { name: 'human_input', type: 'string', description: 'User message' },
                { name: 'auth_token', type: 'string', description: 'JWT authentication token' }
              ]}
              response="Bot response text based on AIML rules"
            />
          </div>
        </div>
      )}

      {activeSection === 'security' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Security & Privacy</h2>
          
          <div className="space-y-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Shield size={20} />
                Security Measures
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <Lock className="text-green-600 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <strong>JWT Authentication:</strong> Stateless, tamper-proof tokens with HS256 signing
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="text-green-600 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <strong>Fernet Encryption:</strong> OAuth tokens encrypted at rest using symmetric cryptography
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="text-green-600 mt-1 flex-shrink-0" size={18} />
                  <div>
                    <strong>OAuth2 Flow:</strong> Industry-standard authorization, never stores passwords
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Data Privacy</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="text-blue-600" size={18} />
                  Voice recordings are processed in real-time, not stored
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-blue-600" size={18} />
                  Email content is never logged or retained
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-blue-600" size={18} />
                  OAuth tokens encrypted with unique per-deployment keys
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'contributing' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Contributing</h2>
          
          <p className="text-gray-700 text-lg">
            We welcome contributions from the community! Whether it's bug fixes, new features, or documentation improvements, 
            your help makes this project better.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <a href="https://github.com/shahzad67432/BotFrontend" target="_blank" rel="noopener noreferrer" 
               className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-2">
                <GitBranch size={24} />
                <h3 className="font-semibold text-lg">Frontend Repository</h3>
              </div>
              <p className="text-purple-100 text-sm">Next.js, React, TypeScript</p>
            </a>

            <a href="https://github.com/shahzad67432/bot-backend" target="_blank" rel="noopener noreferrer"
               className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-2">
                <GitBranch size={24} />
                <h3 className="font-semibold text-lg">Backend Repository</h3>
              </div>
              <p className="text-blue-100 text-sm">Flask, Python, AIML</p>
            </a>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">AIML Data Attribution</h3>
            <p className="text-gray-700 mb-3">
              Most AIML knowledge base files are sourced from:
            </p>
            <a href="https://github.com/pemagrg1/Easy-Chatbot/tree/master/data" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 text-blue-600 hover:underline">
              <GitBranch size={16} />
              Easy-Chatbot by pemagrg1
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      )}

    </main>
  </div>

  <footer className="bg-white border-t border-gray-200 mt-16">
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="text-center">
        <p className="text-sm text-gray-500">
          © 2025 Neural Mail Assistant. Built with ❤️ for students and professionals.
        </p>
      </div>
    </div>
  </footer>
</div>
);
};
export default Documentation;