import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ArrowRight, CheckCircle, Target, Lightbulb } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';
import { ChatMessage } from '../../types';

const ChatWindow: React.FC = () => {
  const { state, dispatch } = useZcv();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'background' | 'experiences' | 'projects' | 'skills' | 'complete'>('intro');
  const [discoveredItems, setDiscoveredItems] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages]);

  // Initialize with welcome message
  useEffect(() => {
    if (state.chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'agent',
        content: `Hi there! I'm your AI career assistant, and I'm here to help you discover and articulate your unique professional story. 🚀

Instead of filling out boring forms, we'll have a conversation where I'll help you uncover:
• Your key achievements and impact
• Hidden skills you might not realize you have
• Compelling stories that showcase your value
• Quantifiable results from your work

**Let's start simple:** Could you tell me a bit about yourself? You can either:
1. Upload an existing resume, or
2. Just tell me in a few sentences what you do or have done professionally

Don't worry about being perfect - we'll dig deeper together!`,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: welcomeMessage });
    }
  }, [state.chatMessages.length, dispatch]);

  const getPhaseProgress = () => {
    const phases = ['intro', 'background', 'experiences', 'projects', 'skills', 'complete'];
    const currentIndex = phases.indexOf(currentPhase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  const getPhaseMessage = (phase: string) => {
    const messages = {
      background: "Great start! Now let's dive deeper into your background...",
      experiences: "Excellent! Let's explore your work experiences in detail...",
      projects: "Fantastic! Now tell me about some projects you've worked on...",
      skills: "Perfect! Let's identify and organize your skills...",
      complete: "Amazing work! Your profile is taking shape beautifully! 🎉"
    };
    return messages[phase as keyof typeof messages] || "";
  };

  const generateContextualResponse = (userInput: string, phase: string) => {
    // This would be replaced with actual AI API call
    const responses = {
      intro: [
        `That's a great foundation! I can already see some interesting elements in what you've shared. Let me ask you this: What would you say has been your biggest professional achievement so far? Think about a moment when you felt really proud of what you accomplished.`,
        `Interesting background! I'd love to understand more about your impact. Can you tell me about a specific project or task where you made a real difference? What was the situation, and what did you do?`
      ],
      background: [
        `That's impressive! Let's quantify that impact. Do you remember any specific numbers, percentages, or metrics that show the results of your work? For example, did you save time, increase efficiency, reduce costs, or improve user satisfaction?`,
        `Excellent! Now I'm curious about the challenges you faced. What obstacles did you overcome, and how did you approach solving them? This will help us showcase your problem-solving abilities.`
      ],
      experiences: [
        `That's a compelling story! Let's explore another angle. Tell me about a time when you had to learn something completely new for work. How did you approach it, and what was the outcome?`,
        `Great details! Now, thinking about your day-to-day work, what tools, technologies, or methodologies do you use regularly? Also, have you ever mentored others or led a team?`
      ],
      projects: [
        `Fascinating project! What made you choose that particular approach? And looking back, what would you do differently if you had to start over? This shows your growth mindset.`,
        `That sounds impactful! Have you received any recognition for your work? This could be formal awards, positive feedback, promotions, or even just colleagues asking for your help on similar challenges.`
      ],
      skills: [
        `You're clearly skilled in many areas! Let's think about your unique combination of abilities. What would colleagues say is your superpower? What do people come to you for help with?`,
        `Perfect! I think we've uncovered some amazing insights about your professional journey. You should feel proud of what you've accomplished! 🌟`
      ]
    };

    const phaseResponses = responses[phase as keyof typeof responses] || responses.intro;
    return phaseResponses[Math.floor(Math.random() * phaseResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    setInputValue('');
    setIsTyping(true);

    // Add discovered item for progress tracking
    setDiscoveredItems(prev => [...prev, `Insight ${prev.length + 1}`]);

    // Simulate AI processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate contextual response
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: generateContextualResponse(inputValue, currentPhase),
        timestamp: new Date()
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: agentResponse });
      
      // Progress through phases
      const phases = ['intro', 'background', 'experiences', 'projects', 'skills', 'complete'];
      const currentIndex = phases.indexOf(currentPhase);
      if (currentIndex < phases.length - 1) {
        setTimeout(() => {
          setCurrentPhase(phases[currentIndex + 1] as any);
        }, 1000);
      }
      
      // Update portfolio completeness
      const newCompleteness = Math.min(90, state.portfolio.completeness + 15);
      dispatch({ 
        type: 'UPDATE_PORTFOLIO', 
        payload: { 
          completeness: newCompleteness,
          updatedAt: new Date().toISOString()
        } 
      });
      
    } catch (error) {
      console.error('Chat error:', error);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContinueToEditor = () => {
    dispatch({ type: 'SET_VIEW', payload: 'portfolio-builder' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">AI Discovery Session</h2>
          <span className="text-sm text-gray-600">{Math.round(getPhaseProgress())}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 transition-all duration-500"
            style={{ width: `${getPhaseProgress()}%` }}
          ></div>
        </div>
        {currentPhase !== 'intro' && (
          <p className="text-sm text-gray-600 mt-2">{getPhaseMessage(currentPhase)}</p>
        )}
      </div>

      {/* Discovery Progress */}
      {discoveredItems.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center mb-2">
            <Lightbulb className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-sm font-semibold text-green-800">Insights Discovered</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {discoveredItems.map((item, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                <CheckCircle className="h-3 w-3 mr-1" />
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="h-8 w-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Career Assistant</h3>
              <p className="text-sm text-gray-600">Discovering your professional story together</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {state.chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-2xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  ${message.type === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }
                `}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-white" />
                  )}
                </div>
                
                <div className={`
                  px-4 py-3 rounded-2xl shadow-sm
                  ${message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                  }
                `}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-2xl">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts, experiences, or ask questions..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                disabled={isTyping}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="self-end px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>
          
          {state.chatMessages.length > 4 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleContinueToEditor}
                className="inline-flex items-center px-6 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Continue to Profile Editor
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;