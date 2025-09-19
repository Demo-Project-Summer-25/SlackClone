import React, { useState } from 'react';
import { Bot, BotUpdateRequest } from '../../types/bot';
import BotEditModal from './BotEditModal';

interface BotCardProps {
  bot: Bot;
  onUpdate: (botId: string, request: BotUpdateRequest) => Promise<void>;
  onDelete: (botId: string) => Promise<void>;
}

const BotCard: React.FC<BotCardProps> = ({ bot, onUpdate, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${bot.name}?`)) {
      setIsDeleting(true);
      try {
        await onDelete(bot.id);
      } catch (error) {
        console.error('Failed to delete bot:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleActive = async () => {
    try {
      await onUpdate(bot.id, { isActive: !bot.isActive });
    } catch (error) {
      console.error('Failed to toggle bot status:', error);
    }
  };

  return (
    <div className={`bot-card ${bot.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
      <div className="bot-header">
        <img 
          src="/default-bot-avatar.png" 
          alt={bot.name}
          className="bot-avatar"
        />
        <div className="bot-info">
          <h4>{bot.name}</h4>
          <span className={`bot-type ${bot.botType.toLowerCase()}`}>
            {bot.botType}
          </span>
        </div>
        <div className="bot-actions">
          <button onClick={() => setIsEditModalOpen(true)}></button>
          <button onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : ''}
          </button>
        </div>
      </div>

      {bot.description && (
        <p className="bot-description">{bot.description}</p>
      )}

      <div className="bot-status">
        <span className={`status-badge ${bot.status.toLowerCase()}`}>
          {bot.status}
        </span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={bot.status === 'ACTIVE'}
            onChange={handleToggleActive}
          />
          <span className="slider"></span>
        </label>
      </div>

      {bot.lastUsedAt && (
        <p className="last-used">
          Last used: {new Date(bot.lastUsedAt).toLocaleDateString()}
        </p>
      )}

      {isEditModalOpen && (
        <BotEditModal
          bot={bot}
          onUpdate={(request) => onUpdate(bot.id, request)}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BotCard;