'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Mic, Mail, Check, Loader, MailIcon } from 'lucide-react'
import Image from 'next/image'
import Lottie from 'lottie-react';
import mailAnimation from '../public/Email.json';

interface Node {
  id: number
  x: number
  y: number
  size: number
  blinkDelay: number
}

const generateRandomNodes = (width: number, height: number): Node[] => {
  const nodes: Node[] = []
  const nodeCount = 25
  const centerX = width / 2
  const centerY = height / 2
  const centerRadius = 50
  const maxRadius = Math.min(width, height) / 2.2

  for (let i = 0; i < nodeCount; i++) {
    let x, y, distance
    
    do {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * maxRadius
      x = centerX + Math.cos(angle) * radius
      y = centerY + Math.sin(angle) * radius
      distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
    } while (distance < centerRadius)

    nodes.push({
      id: i,
      x,
      y,
      size: Math.random() * 1.5 + 1.5,
      blinkDelay: Math.random() * 2,
    })
  }

  return nodes
}

const findConnectedNodes = (nodes: Node[], node: Node, maxDistance: number): Node[] => {
  return nodes.filter(other => {
    if (other.id === node.id) return false
    const dx = other.x - node.x
    const dy = other.y - node.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < maxDistance
  })
}

interface NeuralNetworkButtonProps {
  onGmailConnect?: () => Promise<void>
  onSendEmail?: (transcript: string) => Promise<void>
  onStartListening?: () => void
  isGmailConnected?: boolean
  isListening?: boolean
  transcript?: string
}

export const NeuralNetworkButton: React.FC<NeuralNetworkButtonProps> = ({
  onGmailConnect,
  onSendEmail,
  onStartListening,
  isGmailConnected = false,
  isListening = false,
  transcript = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [state, setState] = useState<'idle' | 'connecting' | 'sending'>('idle')
  const [nodes, setNodes] = useState<Node[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      setNodes(generateRandomNodes(canvas.width, canvas.height))
    }
  }, [])

  useEffect(() => {
    if (isListening) {
      setState('idle')
    }
  }, [isListening])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const connectionDistance = 90

      const isActive = isListening || state === 'sending'
      const displayState = !isGmailConnected ? 'idle' : 
                           isListening ? 'listening' : 
                           state === 'sending' ? 'sending' : 
                           'idle'

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)'
      ctx.lineWidth = 0.8

      nodes.forEach((node) => {
        const connected = findConnectedNodes(nodes, node, connectionDistance)
        connected.forEach((other) => {
          if (node.id < other.id) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        })
      })

      if (isActive) {
        const pulse = Math.abs(Math.sin(Date.now() / 600)) * 0.5 + 0.3
        ctx.strokeStyle = `rgba(16, 185, 129, ${pulse * 0.6})`
        ctx.lineWidth = 1.5

        nodes.forEach((node) => {
          const connected = findConnectedNodes(nodes, node, connectionDistance)
          connected.forEach((other) => {
            if (node.id < other.id) {
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(other.x, other.y)
              ctx.stroke()
            }
          })
        })
      }

      nodes.forEach((node) => {
        const blink = Math.abs(Math.sin((Date.now() / 500 + node.blinkDelay) * Math.PI))
        const opacity = isActive ? 0.5 + blink * 0.5 : 0.4 + blink * 0.4
        
        let color = '#9ca3af'
        if (displayState === 'idle') {
          color = isGmailConnected ? '#10b981' : '#3b82f6'
        } else if (displayState === 'listening') {
          color = '#10b981'
        } else if (displayState === 'sending') {
          color = '#8b5cf6'
        }

        ctx.fillStyle = color
        ctx.globalAlpha = opacity
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = 1
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size + 0.8, 0, Math.PI * 2)
        ctx.stroke()
      })

      const iconBgRadius = 28
      ctx.fillStyle = !isGmailConnected ? 'rgba(59, 130, 246, 0.1)' : 
                      displayState === 'listening' ? 'rgba(34, 197, 94, 0.1)' :
                      displayState === 'sending' ? 'rgba(139, 92, 246, 0.1)' :
                      'rgba(16, 185, 129, 0.1)'
      
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(centerX, centerY, iconBgRadius, 0, Math.PI * 2)
      ctx.fill()

      requestAnimationFrame(animate)
    }

    animate()
  }, [state, nodes, isGmailConnected, isListening, transcript])

  const handleButtonClick = async () => {
    if (!isGmailConnected) {
      setState('connecting')
      try {
        if (onGmailConnect) {
          await onGmailConnect()
        }
        setState('idle')
      } catch (error) {
        console.error('Gmail connection failed:', error)
        setState('idle')
      }
    } else if (isGmailConnected && !isListening) {
      if (onStartListening) {
        onStartListening()
      }
    }
  }

  const handleSendEmail = async () => {
    setState('sending')
    try {
      if (onSendEmail) {
        await onSendEmail(transcript)
      }
      setState('idle')
    } catch (error) {
      console.error('Failed to send email:', error)
      setState('idle')
    }
  }

  const shouldShowSendButton = transcript && isGmailConnected

  return (
    <div className="min-h-screen  flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12 mt-8 flex flex-col items-center justify-center">
          <h1 className=" relative text-5xl font-bold text-[#cc39f5] mb-4 flex flex-row items-center justify-center text-center gap-6" style={{ fontFamily: 'Mauline, sans-serif' }}>
            NEURAL 
            <span className=" w-[100px] items-center justify-center">
                <Lottie 
                  animationData={mailAnimation}
                  loop={true}
                  width={48}
                  height={48}
                />
            </span>
          </h1>
          <p className='relative text-5xl text-[#cc39f5] mb-4 flex flex-row items-center justify-center text-center gap-6 font-pixel font-medium ' style={{ fontFamily: 'Mauline, sans-serif' }}> ASSISTANT</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Info Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#cc39f5] flex items-center justify-center">
                <Mail className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-[#cc39f5]">Connect</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Link your Gmail account to start sending emails with your voice
            </p>
          </div>

          {/* Central Neural Network */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full aspect-square max-w-md">
              <canvas
                ref={canvasRef}
                width={384}
                height={384}
                className="relative w-full h-full rounded-3xl bg-white/50 backdrop-blur-sm border-gray-200/50"
              />
              
              {/* Central Hub Button */}
              <button
                onClick={handleButtonClick}
                disabled={state === 'sending' || state === 'connecting' || isListening}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  w-24 h-24 rounded-full font-semibold transition-all duration-300 
                  flex items-center justify-center shadow-2xl
                  ${!isGmailConnected ? 'text-blue-500 hover:scale-110' : ''}
                  ${isGmailConnected && !isListening ? 'text-green-500 hover:scale-110' : ''}
                  ${state === 'connecting' ? 'text-amber-500 animate-pulse' : ''}
                  ${isListening ? 'text-emerald-500 animate-pulse scale-110' : ''}
                  ${state === 'sending' ? 'text-purple-500 scale-110' : ''}
                  disabled:opacity-70 disabled:cursor-not-allowed z-10
                  bg-white/90 backdrop-blur-md border-4 
                  ${!isGmailConnected ? 'border-blue-200' : ''}
                  ${isGmailConnected && !isListening ? 'border-green-200' : ''}
                  ${isListening ? 'border-emerald-300' : ''}
                  ${state === 'sending' ? 'border-purple-300' : ''}`}
              >
                {!isGmailConnected && <Mail size={36} />}
                {isGmailConnected && !isListening && state !== 'connecting' && <Mic size={36} />}
                {state === 'connecting' && <Loader size={36} className="animate-spin" />}
                {isListening && <Mic size={36} />}
                {state === 'sending' && <Check size={36} />}
              </button>
            </div>

            {/* Connection Status Badge */}
            <div className={`px-6 py-3 rounded-full font-medium text-sm shadow-lg transition-all duration-300
              ${!isGmailConnected ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' : 'bg-green-100 text-green-700 border-2 border-green-200'}`}>
              {!isGmailConnected ? '📧 Click to Connect Gmail' : '✓ Gmail Connected'}
            </div>
          </div>

          {/* Right Info Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#cc39f5] flex items-center justify-center">
                <Mic className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-semibold text-[#cc39f5]">Speak</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Dictate your message naturally and let AI handle the rest
            </p>
          </div>
        </div>

        {/* Transcription Display */}
        {(isListening || transcript) && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              {/* Connector Line */}
              <div className="absolute left-1/2 -top-8 w-0.5 h-8 bg-gradient-to-b from-transparent to-cyan-400 transform -translate-x-1/2" />
              
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border-2 border-cyan-200 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className={`w-6 h-6 rounded-full ${isListening ? 'bg-cyan-500 animate-pulse' : 'bg-cyan-400'} shadow-lg`} />
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <Mic className="text-white" size={20} />
                  </div>
                  
                  <div className="flex-1 min-h-24 max-h-40 overflow-y-auto">
                    <p className="text-gray-800 leading-relaxed text-lg">
                      {transcript || (
                        <span className="text-cyan-600 italic flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                          Listening for your message...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Send Email Button */}
        {shouldShowSendButton && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSendEmail}
              disabled={state === 'sending'}
              className="group relative px-12 py-5 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 
                hover:from-purple-600 hover:via-purple-700 hover:to-indigo-700 
                disabled:opacity-60 disabled:cursor-not-allowed
                text-white rounded-2xl font-semibold text-lg transition-all duration-300 
                shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              <span className="relative z-10 flex items-center gap-3">
                {state === 'sending' ? (
                  <>
                    <Loader size={24} className="animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Mail size={24} />
                    Send Email
                  </>
                )}
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>
        )}

        {/* Status Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-medium inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
            {!isGmailConnected && '📧 Connect your Gmail to get started'}
            {isGmailConnected && !isListening && !transcript && '🎤 Click the center button to start recording'}
            {state === 'connecting' && '⏳ Connecting to Gmail...'}
            {isListening && '🎙️ Listening... Speak your message now'}
            {transcript && !isListening && !state && '✍️ Review and send your email'}
            {state === 'sending' && '📨 Sending your email...'}
          </p>
        </div>

      </div>
    </div>
  )
}

export default NeuralNetworkButton