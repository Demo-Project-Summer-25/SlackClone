import React, { useEffect, useState } from "react";
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { DmService } from "../services/dmService";
import { MessageService } from "../services/messageService";
import { DmResponse, MessageResponse, MessageCreateRequest } from "../types/api";

interface DirectMessageChatProps {
  dmId: string;
  currentUserId: string;
  onBack: () => void;
}

export function DirectMessageChat({ dmId, currentUserId, onBack }: DirectMessageChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [dmData, setDmData] = useState<DmResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDmChat = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load DM conversation details
        const dm = await DmService.getDm(dmId);
        setDmData(dm);

        // Load messages for this DM
        const dmMessages = await MessageService.getDmMessages(dmId, { limit: 50 });
        setMessages(dmMessages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chat');
        console.error('Error loading DM chat:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDmChat();
  }, [dmId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const request: MessageCreateRequest = {
        senderUserId: currentUserId,
        content: message.trim(),
        contentType: 'TEXT'
      };

      const newMessage = await MessageService.sendDmMessage(dmId, request);
      setMessages(prev => [...prev, newMessage]);
      setMessage("");
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherUser = () => {
    if (!dmData) return null;
    return dmData.participants.find(p => p.userId !== currentUserId);
  };

  const getDisplayName = () => {
    if (!dmData) return "Loading...";
    
    if (dmData.group) {
      return dmData.title || `Group Chat (${dmData.participants.length} members)`;
    }
    
    const otherUser = getOtherUser();
    return otherUser?.user?.displayName || 
           otherUser?.user?.username || 
           `User ${otherUser?.userId}`;
  };

  const getStatus = () => {
    return "online"; // You can implement real user status later
  };

  const formatMessageTime = (createdAt: string): string => {
    return new Date(createdAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Loading conversation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!dmData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="relative">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm">
              {getDisplayName().split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
            getStatus() === "online" ? "bg-green-500" :
            getStatus() === "away" ? "bg-yellow-500" : "bg-gray-400"
          }`} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{getDisplayName()}</h3>
          <p className="text-sm text-muted-foreground capitalize">{getStatus()}</p>
        </div>
        
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderUserId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${getDisplayName()}...`}
              className="pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}