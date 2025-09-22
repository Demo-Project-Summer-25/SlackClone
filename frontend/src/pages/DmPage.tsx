import React, { useState } from 'react';
import { DmList } from '../components/DmList';
import { DirectMessageChat } from '../components/DirectMessageChat';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

interface DmPageProps {
  currentUserId: string;
  notifications?: any[];
  onNotificationsChange?: () => void;
}

export function DmPage({ 
  currentUserId, 
  notifications = [], 
  onNotificationsChange 
}: DmPageProps) {
  const [selectedDmId, setSelectedDmId] = useState<string | null>(null);

  const handleSelectDm = (dmId: string) => {
    setSelectedDmId(dmId);
  };

  const handleBackToDmList = () => {
    setSelectedDmId(null);
  };

  const getUnreadNotificationCount = (dmId: string): number => {
    return notifications.filter(notification => 
      notification.directConversationId === dmId && 
      notification.status === 'UNREAD'
    ).length;
  };

  return (
    <div className="h-full">
      {/* Show DM List when no conversation is selected */}
      {!selectedDmId ? (
        <div className="h-full">
          <DmList 
            currentUserId={currentUserId}
            onSelectDm={handleSelectDm}
            selectedDmId={undefined}
            notifications={notifications}
            onNotificationsChange={onNotificationsChange}
          />
        </div>
      ) : (
        /* Show full-screen conversation when one is selected */
        <div className="h-full">
          <DirectMessageChat 
            dmId={selectedDmId}
            currentUserId={currentUserId}
            onBack={handleBackToDmList}
          />
        </div>
      )}
    </div>
  );
}