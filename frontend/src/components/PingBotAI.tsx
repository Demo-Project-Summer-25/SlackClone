import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { MessageInput } from './ui/MessageInput';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { botService } from '../services/botService';
import { toast } from 'sonner';
import '../styles/bot.css';
import { useTheme } from './ThemeProvider';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
}

export const PongAI: React.FC = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Code Blocks, Development Strategies, I can help with it all! What are you working on?",
      isUser: false,
      timestamp: Date.now(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Sending message:', inputMessage);
      const response = await botService.chatWithBot(inputMessage, 'current-user');
      console.log('Received response:', response);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response || "No response received",
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error chatting with bot:', error);
      toast.error('Failed to send message to Pong');

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again!",
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header - Remove max-w and mx-auto centering */}
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2">Pong AI</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
           <p>Hello! I'm Pong, your AI coding companion. How can I help you today?</p>
          </p>
        </div>
      </div>

      {/* Chat Messages Area - Add padding here instead */}
      <div className="flex-1 space-y-3 sm:space-y-4 overflow-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isUser && (
                  <div className="flex-shrink-0">
                    <img
                      src={theme === 'dark' ? '/botwhite.png' : '/bot.png'}
                      alt="Pong"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                  </div>
                )}

                <div className={`max-w-[80%] ${message.isUser ? 'order-first' : ''}`}>
                  <div className={`p-3 sm:p-4 rounded-lg ${message.isUser
                      ? 'bg-primary text-primary-foreground ml-auto max-w-xs'
                      : 'bg-muted text-foreground'
                    }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content || "Empty message"}
                    </p>
                    <div className={`text-xs mt-2 ${message.isUser
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                      }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {message.isUser && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-accent-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <img
                    src={theme === 'dark' ? '/botwhite.png' : '/bot.png'}
                    alt="Pong"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                </div>
                <div className="bg-muted p-3 sm:p-4 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Match other components' padding */}
      <div className="shrink-0">
        <MessageInput
          message={inputMessage}
          onMessageChange={setInputMessage}
          onSendMessage={sendMessage}
          placeholder="Ask Pong anything about your code..."
          disabled={isLoading}
        />
      </div>
    </div>
  );
};