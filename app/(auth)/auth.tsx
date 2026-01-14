
"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Lock, CheckCircle, ArrowRight, User, Key } from "lucide-react";
import Image from "next/image";
import { sign } from "crypto";

const AuthPage = ({ SignType }: { SignType: string }) => {
  const [step, setStep] = useState<number>(1);
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [loginMethod, setLoginMethod] = useState<"otp" | "password">("otp");

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (SignType === "signup" && (!name || !password)) {
      alert("Please provide name and password");
      return;
    }

    const response: any = await axios.post('/api/auth/signup', { 
      email, 
      name, 
      password, 
      SignType 
    });

    if (response.data.message === "User not found" && SignType === "login") {
      return alert("User not found. Please sign up first.");
    }

    if (response.data.message === "User already exists") {
      return alert("User already exists. Please login.");
    }

    if (response.data.otp) {
      setGeneratedOtp(response.data.otp);
      setStep(step + 1);
    }
  };

  const handlePasswordLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const response: any = await axios.post('/api/auth/login-password', { 
        email, 
        password 
      });

      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        setStep(3);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleVerifyOTP = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const response: any = await axios.post('/api/auth/verify-otp', { 
      email, 
      otp, 
      name, 
      password, 
      SignType 
    });

    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      setStep(step + 1);
    }
  };

  useEffect(() => {
    if (step === 3 && SignType === "login") {
      setStep(1);
      router.push('/');
    }
  }, [step, SignType, router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 cursor-pointer" onClick={() => { window.location.href = '/'; }}>
            <Image src="/logo.png" alt="Logo" width={64} height={64} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {SignType === "signup" ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600">
            {SignType === "signup"
              ? "Start your journey with automated email assistance"
              : "Sign in to continue to your dashboard"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 gap-2">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${step >= 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span className="ml-2 text-xs font-medium hidden sm:inline">Details</span>
          </div>
          <div className={`w-12 h-0.5 transition-all ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${step >= 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200'}`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <span className="ml-2 text-xs font-medium hidden sm:inline">Verify</span>
          </div>
          <div className={`w-12 h-0.5 transition-all ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${step >= 3 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200'}`}>
              {step > 3 ? '✓' : '3'}
            </div>
            <span className="ml-2 text-xs font-medium hidden sm:inline">Done</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Step 1: User Details */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Login Method Toggle (Only for Login) */}
              {SignType === "login" && (
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4">
                  <button
                    onClick={() => setLoginMethod("otp")}
                    className={`flex-1 py-2 rounded-md font-medium transition-all ${loginMethod === "otp" ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
                  >
                    OTP Login
                  </button>
                  <button
                    onClick={() => setLoginMethod("password")}
                    className={`flex-1 py-2 rounded-md font-medium transition-all ${loginMethod === "password" ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
                  >
                    Password Login
                  </button>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-800"
                  />
                </div>
              </div>

              {/* Name Input (Signup Only) */}
              {SignType === "signup" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Muhammad Shahzad Ali"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Password Input */}
              {SignType === "signup" || (SignType === "login" && loginMethod === "password") ? 
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-800"
                  />
                </div>
              </div>
              
              : null }

              {/* Submit Button */}
              <button
                onClick={SignType === "login" && loginMethod === "password" ? handlePasswordLogin : handleSignup}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                {SignType === "login" && loginMethod === "password" ? "Login" : "Continue"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-3">
                  <Lock className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Verify Your Email</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the OTP for <span className="font-semibold text-gray-800">{email}</span>
                </p>
                {/* 🔥 Display OTP on screen */}
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 font-semibold">Development Mode - Your OTP:</p>
                  <p className="text-3xl font-bold text-yellow-900 tracking-wider">{generatedOtp}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP(e as any)}
                  maxLength={6}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-center text-2xl font-bold tracking-widest text-gray-800"
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Verify OTP
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium transition-colors"
              >
                ← Back to details
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-6 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {SignType === "signup" ? "Account Created!" : "Login Successful!"}
                </h3>
                <p className="text-gray-600">
                  {SignType === "signup"
                    ? "Your account has been created successfully."
                    : "Redirecting to your dashboard..."}
                </p>
              </div>
              {SignType === "signup" && (
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {SignType === "signup" ? (
              <>
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Login
                </a>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <a href="/signup" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Sign up
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;