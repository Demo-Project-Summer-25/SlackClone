import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { MessageInput } from './ui/MessageInput';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { botService } from '../services/botService';
import { toast } from 'sonner';
import '../styles/bot.css';
import '../styles/markdown.css';
import { useTheme } from './ThemeProvider';

// Add highlight.js CSS
import 'highlight.js/styles/github.css'; // Light theme
import 'highlight.js/styles/github-dark.css'; // Dark theme

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
}

// Helper function to process markdown text
const processMarkdownText = (text: string): string => {
  // Teacher's suggestion: Clean up markdown formatting
  
  // Fix numbered lists: "1. " -> proper formatting
  text = text.replace(/^(\d+)\.\s+/gm, '$1. ');
  
  // Fix bullet lists: "- " -> proper formatting  
  text = text.replace(/^[\s]*-[\s]+/gm, '- ');
  
  // Fix newline + dash formatting: "\n - " -> proper list
  text = text.replace(/\n[\s]*-[\s]+/g, '\n- ');
  
  // Clean up excessive whitespace
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return text;
};

// Custom markdown components for better styling
const MarkdownComponents = {
  // Custom code block styling
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    
    if (!inline && match) {
      return (
        <div className="my-4">
          <div className="bg-muted/50 text-xs px-3 py-1 border-b border-border rounded-t-md text-muted-foreground">
            {match[1]}
          </div>
          <pre className="bg-muted p-4 rounded-b-md overflow-x-auto">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    }
    
    // Inline code
    return (
      <code className="bg-muted/70 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
  
  // Custom list styling
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside space-y-1 my-3 ml-4">
      {children}
    </ul>
  ),
  
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside space-y-1 my-3 ml-4">
      {children}
    </ol>
  ),
  
  li: ({ children }: any) => (
    <li className="text-sm leading-relaxed">
      {children}
    </li>
  ),
  
  // Custom heading styling
  h1: ({ children }: any) => (
    <h1 className="text-lg font-bold mt-4 mb-2 text-foreground">
      {children}
    </h1>
  ),
  
  h2: ({ children }: any) => (
    <h2 className="text-base font-semibold mt-3 mb-2 text-foreground">
      {children}
    </h2>
  ),
  
  h3: ({ children }: any) => (
    <h3 className="text-sm font-medium mt-2 mb-1 text-foreground">
      {children}
    </h3>
  ),
  
  // Custom paragraph styling
  p: ({ children }: any) => (
    <p className="text-sm leading-relaxed mb-2">
      {children}
    </p>
  ),
  
  // Custom blockquote styling
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-primary/30 pl-4 my-3 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  
  // Custom table styling
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-border rounded-md">
        {children}
      </table>
    </div>
  ),
  
  th: ({ children }: any) => (
    <th className="border border-border bg-muted/50 px-3 py-2 text-left text-xs font-medium">
      {children}
    </th>
  ),
  
  td: ({ children }: any) => (
    <td className="border border-border px-3 py-2 text-sm">
      {children}
    </td>
  ),
};

export const PongAI: React.FC = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey! I'm **Pong**, your AI coding companion. I can help with:\n\n- Code explanations and debugging\n- Architecture decisions\n- Best practices\n- Framework questions\n\nWhat are you working on today? 🚀",
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
      const response = await botService.chatWithBot(inputMessage, 'current-user');
      
      // Process the response text to clean up markdown
      const processedResponse = processMarkdownText(response);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: processedResponse,
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error chatting with bot:', error);
      toast.error('Failed to send message to Pong');

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again! 🔧",
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
      {/* Header */}
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2">Pong AI</h2>
          <div className="text-sm sm:text-base text-muted-foreground">
           <p>Hello! I'm Pong, your AI coding companion. How can I help you today?</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
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
                    
                    {/* MARKDOWN RENDERING HERE */}
                    {message.isUser ? (
                      // User messages: plain text
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content || "Empty message"}
                      </p>
                    ) : (
                      // Bot messages: rendered markdown
                      <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={MarkdownComponents}
                        >
                          {message.content || "Empty message"}
                        </ReactMarkdown>
                      </div>
                    )}
                    
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

      {/* Input Area */}
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