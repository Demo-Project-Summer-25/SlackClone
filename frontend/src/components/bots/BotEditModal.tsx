import React, { useState } from 'react';
import { Bot, BotUpdateRequest } from '../../types/bot';

interface BotEditModalProps {
  bot: Bot;
  onUpdate: (request: BotUpdateRequest) => Promise<void>;
  onClose: () => void;
}

const BotEditModal: React.FC<BotEditModalProps> = ({ bot, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<BotUpdateRequest>({
    name: bot.name,
    description: bot.description || '',
    botType: bot.botType,
    apiKey: '', // Don't pre-fill for security
    configuration: '',
    status: bot.status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update bot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Bot: {bot.name}</h2>
          <button onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="bot-form">
          <div className="form-group">
            <label>Bot Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          {(bot.botType === 'CLAUDE_SONNET' || bot.botType === 'CLAUDE_HAIKU' || bot.botType === 'CLAUDE_OPUS') && (
            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="Update API key"
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Bot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BotEditModal;