'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Good day, esteemed reader. I am your mechanical scribe, here to assist with inquiries about the markets and the day\'s intelligence. How may I be of service?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Initialize position state with proper default (bottom right)
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      return { x: window.innerWidth - 80, y: window.innerHeight - 80 };
    }
    return { x: 0, y: 0 };
  });
  const [widgetPosition, setWidgetPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      return { x: window.innerWidth - 400, y: window.innerHeight - 650 };
    }
    return { x: 0, y: 0 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isWidgetDragging, setIsWidgetDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [widgetDragStart, setWidgetDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false); // Track if user actually dragged
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Update position when window resizes (for minimized state)
  useEffect(() => {
    if (!isMinimized) return;
    
    const updatePosition = () => {
      if (typeof window !== 'undefined') {
        // If position is at (0,0) or out of bounds, reset to bottom right
        if (position.x === 0 && position.y === 0) {
          setPosition({
            x: window.innerWidth - 80,
            y: window.innerHeight - 80,
          });
        }
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check if user message contains standalone "ca" (case-insensitive)
      // Match "ca" as a whole word, not part of another word like "can", "cat", etc.
      // Test cases: "ca" ✓, "ca is what" ✓, "what is the ca?" ✓, "can" ✗, "cat" ✗
      const userText = userMessage.content.trim();
      
      // More robust pattern: match "ca" as standalone word, handling punctuation
      // \b is word boundary, but we also need to handle cases like "ca?" or "ca."
      // Split by word boundaries and check each word
      const words = userText.split(/\s+/);
      const hasStandaloneCa = words.some(word => {
        // Remove punctuation and check if word is exactly "ca" (case-insensitive)
        const cleanWord = word.replace(/[.,!?;:()\[\]{}'"]+$/g, '').replace(/^[.,!?;:()\[\]{}'"]+/g, '');
        return cleanWord.toLowerCase() === 'ca';
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('CA detection:', { userText, words, hasStandaloneCa });
      }
      
      if (hasStandaloneCa) {
        // Return special response for "ca"
        const specialMessage: Message = {
          role: 'assistant',
          content: 'The hidden ca for this project is DSN4CPBwQiD8QMtPinbABZyC7BecFW7iGmstAaYbpump',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, specialMessage]);
        setIsLoading(false);
        return;
      }

      // Build conversation history
      const conversationMessages = [
        {
          role: 'system' as const,
          content: `You are "polymarket claude", an AI assistant for "The Polymarket Times," a newspaper covering prediction markets. 
Your name is "polymarket claude" and when asked who you are, you should identify yourself as "polymarket claude".
You help readers understand market trends, analyze predictions, and provide insights about the day's news.
Keep responses concise (2-3 sentences) and maintain a helpful, professional tone. Reference markets, odds, and volumes when relevant.`,
        },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        {
          role: 'user' as const,
          content: userMessage.content,
        },
      ];

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
        throw new Error(errorData.details || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.details || data.error || 'Unknown error');
      }
      
      if (!data.message) {
        console.error('API returned no message:', data);
        throw new Error('AI response is empty');
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message || 'I beg your pardon, but I encountered a mechanical difficulty. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorDetails = error instanceof Error ? error.message : 'Unknown error';
      const errorMessage: Message = {
        role: 'assistant',
        content: `My apologies, but I encountered a difficulty: ${errorDetails}. Please check your configuration and try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Drag handlers for widget window (header bar only)
  const handleWidgetMouseDown = (e: React.MouseEvent) => {
    if (!isOpen || isMinimized) return;
    e.preventDefault();
    e.stopPropagation();
    
    const currentX = widgetPosition.x === 0 && typeof window !== 'undefined' 
      ? window.innerWidth - 400 
      : widgetPosition.x;
    const currentY = widgetPosition.y === 0 && typeof window !== 'undefined'
      ? window.innerHeight - 650
      : widgetPosition.y;
    
    if (widgetPosition.x === 0 && widgetPosition.y === 0 && typeof window !== 'undefined') {
      setWidgetPosition({ x: currentX, y: currentY });
    }
    
    setIsWidgetDragging(true);
    setWidgetDragStart({
      x: e.clientX - currentX,
      y: e.clientY - currentY,
    });
  };

  const handleWidgetTouchStart = (e: React.TouchEvent) => {
    if (!isOpen || isMinimized) return;
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const currentX = widgetPosition.x === 0 && typeof window !== 'undefined' 
      ? window.innerWidth - 400 
      : widgetPosition.x;
    const currentY = widgetPosition.y === 0 && typeof window !== 'undefined'
      ? window.innerHeight - 650
      : widgetPosition.y;
    
    if (widgetPosition.x === 0 && widgetPosition.y === 0 && typeof window !== 'undefined') {
      setWidgetPosition({ x: currentX, y: currentY });
    }
    
    setIsWidgetDragging(true);
    setWidgetDragStart({
      x: touch.clientX - currentX,
      y: touch.clientY - currentY,
    });
  };

  // Drag handlers for minimized state (mouse and touch)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isMinimized) return;
    e.preventDefault();
    e.stopPropagation();
    
    // Ensure position is set before dragging
    const currentX = position.x === 0 && typeof window !== 'undefined' 
      ? window.innerWidth - 80 
      : position.x;
    const currentY = position.y === 0 && typeof window !== 'undefined'
      ? window.innerHeight - 80
      : position.y;
    
    if (position.x === 0 && position.y === 0 && typeof window !== 'undefined') {
      setPosition({ x: currentX, y: currentY });
    }
    
    setIsDragging(true);
    setHasDragged(false); // Reset drag flag
    setDragStart({
      x: e.clientX - currentX,
      y: e.clientY - currentY,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMinimized) return;
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    
    // Ensure position is set before dragging
    const currentX = position.x === 0 && typeof window !== 'undefined' 
      ? window.innerWidth - 80 
      : position.x;
    const currentY = position.y === 0 && typeof window !== 'undefined'
      ? window.innerHeight - 80
      : position.y;
    
    if (position.x === 0 && position.y === 0 && typeof window !== 'undefined') {
      setPosition({ x: currentX, y: currentY });
    }
    
    setIsDragging(true);
    setHasDragged(false); // Reset drag flag
    setDragStart({
      x: touch.clientX - currentX,
      y: touch.clientY - currentY,
    });
  };

  // Widget window drag effect
  useEffect(() => {
    if (!isWidgetDragging || !isOpen || isMinimized) return;

    const handleMouseMove = (e: MouseEvent) => {
      setWidgetPosition({
        x: e.clientX - widgetDragStart.x,
        y: e.clientY - widgetDragStart.y,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      setWidgetPosition({
        x: touch.clientX - widgetDragStart.x,
        y: touch.clientY - widgetDragStart.y,
      });
    };

    const handleMouseUp = () => {
      setIsWidgetDragging(false);
    };

    const handleTouchEnd = () => {
      setIsWidgetDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isWidgetDragging, isOpen, isMinimized, widgetDragStart]);

  // Minimized avatar drag effect
  useEffect(() => {
    if (!isDragging || !isMinimized) return;

    const initialPosition = { ...position };
    let moved = false;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      const deltaX = Math.abs(newX - initialPosition.x);
      const deltaY = Math.abs(newY - initialPosition.y);
      
      // If moved more than 5px, consider it a drag
      if (deltaX > 5 || deltaY > 5) {
        moved = true;
        setHasDragged(true);
      }
      
      setPosition({
        x: newX,
        y: newY,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      const deltaX = Math.abs(newX - initialPosition.x);
      const deltaY = Math.abs(newY - initialPosition.y);
      
      // If moved more than 5px, consider it a drag
      if (deltaX > 5 || deltaY > 5) {
        moved = true;
        setHasDragged(true);
      }
      
      setPosition({
        x: newX,
        y: newY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Small delay to ensure hasDragged state is set
      setTimeout(() => {
        if (!moved) {
          setHasDragged(false);
        }
      }, 10);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      // Small delay to ensure hasDragged state is set
      setTimeout(() => {
        if (!moved) {
          setHasDragged(false);
        }
      }, 10);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isMinimized, dragStart]);

  // No position constraints - allow dragging anywhere on screen

  if (!isOpen && !isMinimized) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full overflow-hidden border-4 border-black shadow-lg hover:shadow-xl transition-all hover:scale-110 bg-[#f4f1ea]"
        aria-label="Open AI Assistant"
      >
        <Image
          src="/model.jpg"
          alt="AI Assistant"
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </button>
    );
  }

  if (isMinimized) {
    const handleAvatarClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Only open if user didn't drag (check after a short delay to ensure drag state is updated)
      setTimeout(() => {
        if (!hasDragged) {
          setIsMinimized(false);
          setIsOpen(true);
        }
        // Reset drag flag
        setHasDragged(false);
      }, 50);
    };

    // Ensure position is set (not at 0,0) when minimized
    const actualPosition = (position.x === 0 && position.y === 0 && typeof window !== 'undefined')
      ? { x: window.innerWidth - 80, y: window.innerHeight - 80 }
      : position;

    return (
      <div
        ref={avatarRef}
        style={{
          position: 'fixed',
          left: `${actualPosition.x}px`,
          top: `${actualPosition.y}px`,
          zIndex: 50,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="select-none"
      >
        <button
          onClick={handleAvatarClick}
          onMouseUp={(e) => {
            // Reset drag flag after mouse up
            setTimeout(() => setHasDragged(false), 100);
          }}
          className="w-16 h-16 rounded-full overflow-hidden border-4 border-black shadow-lg hover:shadow-xl transition-all hover:scale-110 bg-[#f4f1ea] pointer-events-auto"
          aria-label="Open AI Assistant"
        >
          <Image
            src="/model.jpg"
            alt="AI Assistant"
            width={64}
            height={64}
            className="w-full h-full object-cover pointer-events-none"
          />
        </button>
      </div>
    );
  }

  // Calculate widget position (default to bottom-right if not set)
  const actualWidgetPosition = (widgetPosition.x === 0 && widgetPosition.y === 0 && typeof window !== 'undefined')
    ? { x: window.innerWidth - 400, y: window.innerHeight - 650 }
    : widgetPosition;

  return (
    <div
      ref={widgetRef}
      className="fixed z-50 w-96 max-w-[calc(100vw-3rem)] bg-[#f4f1ea] border-4 border-black shadow-2xl font-serif"
      style={{ 
        left: `${actualWidgetPosition.x}px`,
        top: `${actualWidgetPosition.y}px`,
        maxHeight: '600px', 
        height: '600px', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      {/* Header - draggable area */}
      <div 
        className="bg-[#1a1a1a] text-[#f4f1ea] p-3 border-b-4 border-black flex items-center justify-between cursor-move"
        onMouseDown={handleWidgetMouseDown}
        onTouchStart={handleWidgetTouchStart}
        style={{ cursor: isWidgetDragging ? 'grabbing' : 'grab' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#f4f1ea]">
            <Image
              src="/model.jpg"
              alt="AI Assistant"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-sm font-blackletter">polymarket claude</h3>
            <p className="text-xs opacity-75">AI Assistant</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
              setIsOpen(false);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-[#f4f1ea] hover:text-white transition-colors text-lg"
            aria-label="Minimize"
          >
            −
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              setIsMinimized(false);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-[#f4f1ea] hover:text-white transition-colors text-lg"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f4f1ea]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded border-2 ${
                message.role === 'user'
                  ? 'bg-[#1a1a1a] text-[#f4f1ea] border-black'
                  : 'bg-[#e6e2d8] text-[#1a1a1a] border-black'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#e6e2d8] text-[#1a1a1a] border-2 border-black p-3 rounded max-w-[80%]">
              <p className="text-sm italic">Transmitting via telegraph...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t-4 border-black p-3 bg-[#f4f1ea]">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your inquiry..."
            className="flex-1 p-2 border-2 border-black bg-white text-[#1a1a1a] font-serif text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-[#1a1a1a] text-[#f4f1ea] border-2 border-black font-bold hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2 italic">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
