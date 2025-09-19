import React, { useState } from 'react';
import { DmList } from '../components/DmList';
import { DirectMessageChat } from '../components/DirectMessageChat';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

interface DmPageProps {
  currentUserId: string;
}

export function DmPage({ currentUserId }: DmPageProps) {
  const [selectedDmId, setSelectedDmId] = useState<string | null>(null);

  const handleSelectDm = (dmId: string) => {
    setSelectedDmId(dmId);
  };

  const handleBackToDmList = () => {
    setSelectedDmId(null);
  };

  return (
    <div className="h-full flex">
      {/* Sidebar with DM List - always visible */}
      <div className={`${selectedDmId ? 'w-80' : 'w-full'} border-r border-border flex-shrink-0 transition-all duration-300`}>
        <DmList 
          currentUserId={currentUserId}
          onSelectDm={handleSelectDm}
          selectedDmId={selectedDmId || undefined}
        />
      </div>
      
      {/* Main Chat Area - only visible when a DM is selected */}
      {selectedDmId ? (
        <div className="flex-1">
          <DirectMessageChat 
            dmId={selectedDmId}
            currentUserId={currentUserId}
            onBack={handleBackToDmList}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-500">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}