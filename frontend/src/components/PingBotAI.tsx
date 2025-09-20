import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { botService } from '../services/botService';
import { toast } from 'sonner';
import '../styles/bot.css'; // Add this import

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
}

export const PingBotAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: " Hey! I'm PingBot, your AI coding companion. I can help with React, Java, debugging, architecture questions, or just chat about development. What are you working on?",
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
      console.log(' Sending message:', inputMessage); // Debug log
      const response = await botService.chatWithBot(inputMessage, 'current-user');
      console.log(' Received response:', response); // Debug log
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response || "No response received", // Fallback text
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(' Error chatting with bot:', error);
      toast.error('Failed to send message to PingBot');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again! ",
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
    <div className="ping-bot-ai h-full flex flex-col bg-background text-foreground">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            PingBot AI
            <span className="text-sm text-green-500 font-normal">● Online</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4">
          {/* Messages Area */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${
                      message.isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isUser 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                    }`}>
                      {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    
                    <div
                      className={`px-3 py-2 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-500'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div 
                        className="text-sm whitespace-pre-wrap"
                        style={{
                          color: message.isUser 
                            ? '#ffffff' 
                            : document.documentElement.classList.contains('dark') 
                              ? '#dsadds' 
                              : '#111827'
                        }}
                      >
                        {message.content || "Empty message"}
                      </div>
                      <div 
                        className="text-xs mt-1"
                        style={{
                          color: message.isUser 
                            ? 'rgba(234, 226, 226, 0.7)' 
                            : document.documentElement.classList.contains('dark')
                              ? 'rgba(7, 16, 26, 0.7)'
                              : 'rgba(17, 24, 39, 0.7)'
                        }}
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-700 dark:text-gray-300" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t bg-background p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about coding, debugging, or development..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground"
                style={{
                  backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                  color: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#111827',
                  borderColor: document.documentElement.classList.contains('dark') ? '#4b5563' : '#d1d5db'
                }}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};