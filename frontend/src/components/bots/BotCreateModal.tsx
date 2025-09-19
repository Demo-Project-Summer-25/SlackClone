import React, { useState } from 'react';
import { BotCreateRequest } from '../../types/bot';

interface BotCreateModalProps {
  onCreate: (request: BotCreateRequest) => Promise<void>;
  onClose: () => void;
}

const BotCreateModal: React.FC<BotCreateModalProps> = ({ onCreate, onClose }) => {
  const [formData, setFormData] = useState<BotCreateRequest>({
    name: '',
    botType: 'CHAT_GPT',
    description: '',
    avatarUrl: '',
    apiKey: '',
    webhookUrl: '',
    configurationJson: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onCreate(formData);
      onClose();
    } catch (error) {
      console.error('Failed to create bot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Bot</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="bot-form">
          <div className="form-group">
            <label>Bot Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="My AI Assistant"
            />
          </div>

          <div className="form-group">
            <label>Bot Type *</label>
            <select
              value={formData.botType}
              onChange={(e) => setFormData({ ...formData, botType: e.target.value as any })}
              required
            >
              <option value="CHAT_GPT">ChatGPT</option>
              <option value="CLAUDE">Claude</option>
              <option value="GEMINI">Gemini</option>
              <option value="CUSTOM">Custom</option>
              <option value="WEBHOOK">Webhook</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What does this bot do?"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Avatar URL</label>
            <input
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://example.com/avatar.png"
            />
          </div>

          {(formData.botType === 'CHAT_GPT' || formData.botType === 'CLAUDE' || formData.botType === 'GEMINI') && (
            <div className="form-group">
              <label>API Key *</label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="Your API key"
                required
              />
            </div>
          )}

          {formData.botType === 'WEBHOOK' && (
            <div className="form-group">
              <label>Webhook URL *</label>
              <input
                type="url"
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                placeholder="https://your-webhook.com/endpoint"
                required
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Bot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BotCreateModal;