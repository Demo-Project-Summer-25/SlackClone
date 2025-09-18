import React, { useEffect, useState } from "react";
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

interface DirectMessageChatProps {
  contact: {
    name: string;
    status: "online" | "away" | "offline";
    lastMessage: string;
  };
  onBack: () => void;
}

export function DirectMessageChat({ contact, onBack }: DirectMessageChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/dms/${contact.name}/messages`)
      .then(res => res.json())
      .then(setMessages)
      .catch(() => {});
  }, [contact.name]);

  const handleSendMessage = () => {
    if (message.trim()) {
      fetch(`/api/dms/${contact.name}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
      })
        .then(() => {
          setMessage("");
          // Optionally re-fetch messages or optimistically update
        });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="relative">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm">
              {contact.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
            contact.status === "online" ? "bg-green-500" :
            contact.status === "away" ? "bg-yellow-500" : "bg-gray-400"
          }`} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{contact.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{contact.status}</p>
        </div>
        
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[70%] ${msg.isOwn ? "order-2" : "order-1"}`}>
              <div
                className={`p-3 rounded-lg ${
                  msg.isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1 px-1">
                {msg.time}
              </p>
            </div>
          </div>
        ))}
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
              placeholder={`Message ${contact.name}...`}
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