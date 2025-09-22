import { useState, useEffect, useCallback } from 'react';
import { MessageService } from '../services/messageService';
import { DmService } from '../services/dmService';
import { MessageResponse, MessageCreateRequest, DmResponse } from '../types/api'; // Fixed imports

export interface FormattedMessage extends MessageResponse {
  isOwn: boolean;
  senderName: string;
  senderInitials: string;
  formattedTime: string;
  formattedDate?: string; // Made optional since it can be undefined
  showDateSeparator: boolean;
}

// Updated DmData interface to match what we actually need
interface DmData {
  dmId: string;
  otherUserName: string;
  otherUserStatus: string;
  isGroup: boolean;
}

export function useDmMessages(dmId: string, currentUserId: string) {
  const [messages, setMessages] = useState<FormattedMessage[]>([]);
  const [dmData, setDmData] = useState<DmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Format a single message
  const formatMessage = useCallback((
    message: MessageResponse, 
    previousMessage?: MessageResponse,
    otherUserName?: string
  ): FormattedMessage => {
    const isOwn = message.senderUserId === currentUserId;
    const messageTime = new Date(message.createdAt);
    const previousTime = previousMessage ? new Date(previousMessage.createdAt) : null;
    
    // Check if we need a date separator (different day from previous message)
    const showDateSeparator = !previousTime || 
      messageTime.toDateString() !== previousTime.toDateString();

    // Generate sender name and initials
    let senderName: string;
    let senderInitials: string;
    
    if (isOwn) {
      senderName = 'You';
      senderInitials = 'Y';
    } else {
      senderName = otherUserName || `User ${message.senderUserId}`;
      senderInitials = senderName.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return {
      ...message,
      isOwn,
      senderName,
      senderInitials,
      formattedTime: messageTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      formattedDate: showDateSeparator ? messageTime.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : undefined,
      showDateSeparator
    };
  }, [currentUserId]);

  // Load DM data and messages
  useEffect(() => {
    if (!dmId) {
      setMessages([]);
      setDmData(null);
      return;
    }

    const loadDmChat = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load DM conversation details
        const dm = await DmService.getDm(dmId);
        
        // Find the other user (for 1-on-1 DMs)
        const otherParticipant = dm.participants.find(p => p.userId !== currentUserId);
        const otherUserName = dm.group
          ? (dm.title || `Group Chat (${dm.participants.length} members)`)
          : (otherParticipant?.user?.displayName || 
             otherParticipant?.user?.username || 
             `User ${otherParticipant?.userId}`);

        setDmData({
          dmId,
          otherUserName,
          otherUserStatus: 'online', // You can implement real status later
          isGroup: dm.group
        });

        // Load messages
        const rawMessages = await MessageService.getDmMessages(dmId, { limit: 100 });
        
        // Format messages with context
        const formattedMessages = rawMessages.map((message, index) => 
          formatMessage(message, rawMessages[index - 1], otherUserName)
        );

        setMessages(formattedMessages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load chat');
        console.error('Error loading DM chat:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDmChat();
  }, [dmId, currentUserId, formatMessage]);

  // Send a new message
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!dmId || !content.trim()) return;

    setSending(true);
    try {
      const request: MessageCreateRequest = {
        senderUserId: currentUserId,
        content: content.trim(),
        contentType: 'TEXT'
      };

      const newMessage = await MessageService.sendDmMessage(dmId, request);
      
      // Format and add the new message
      const formattedMessage = formatMessage(
        newMessage, 
        messages[messages.length - 1],
        dmData?.otherUserName
      );

      setMessages(prev => [...prev, formattedMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Error sending message:', err);
      throw err; // Re-throw so component can handle it
    } finally {
      setSending(false);
    }
  }, [dmId, currentUserId, messages, dmData?.otherUserName, formatMessage]);

  // Load more messages (for pagination)
  const loadMoreMessages = useCallback(async (): Promise<void> => {
    if (!dmId || messages.length === 0 || loading) return;

    const oldestMessage = messages[0];
    try {
      const olderMessages = await MessageService.getDmMessages(dmId, {
        limit: 50
        // Note: Removed 'before' parameter as it might not be supported by your backend
      });

      if (olderMessages.length > 0) {
        const formattedOlderMessages = olderMessages.map((message, index) => 
          formatMessage(message, olderMessages[index - 1], dmData?.otherUserName)
        );

        setMessages(prev => [...formattedOlderMessages, ...prev]);
      }
    } catch (err) {
      console.error('Error loading more messages:', err);
    }
  }, [dmId, messages, loading, dmData?.otherUserName, formatMessage]);

  // Add real-time message (for WebSocket integration later)
  const addRealtimeMessage = useCallback((newMessage: MessageResponse) => {
    const formattedMessage = formatMessage(
      newMessage,
      messages[messages.length - 1],
      dmData?.otherUserName
    );
    
    setMessages(prev => [...prev, formattedMessage]);
  }, [messages, dmData?.otherUserName, formatMessage]);

  return {
    messages,
    dmData,
    loading,
    error,
    sending,
    sendMessage,
    loadMoreMessages,
    addRealtimeMessage,
    // Utility functions
    hasMessages: messages.length > 0,
    unreadCount: 0, // Implement this based on your needs
  };
}
