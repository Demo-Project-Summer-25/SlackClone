import React, { useState } from 'react';
import { useBots } from '../../hooks/useBots';
import BotCard from './BotCard';
import BotCreateModal from './BotCreateModal';

interface BotManagerProps {
  userId: string;
}

const BotManager: React.FC<BotManagerProps> = ({ userId }) => {
  const { bots, loading, error, createBot, updateBot, deleteBot } = useBots(userId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading) return <div>Loading bots...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bot-manager">
      <div className="bot-manager-header">
        <h3>AI Bots</h3>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="create-bot-btn"
        >
          + Add Bot
        </button>
      </div>

      <div className="bots-grid">
        {bots.map(bot => (
          <BotCard
            key={bot.id}
            bot={bot}
            onUpdate={updateBot}
            onDelete={deleteBot}
          />
        ))}
      </div>

      {bots.length === 0 && (
        <div className="empty-state">
          <p>No bots configured yet</p>
          <button onClick={() => setIsCreateModalOpen(true)}>
            Create your first bot
          </button>
        </div>
      )}

      {isCreateModalOpen && (
        <BotCreateModal
          onCreate={createBot}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BotManager;