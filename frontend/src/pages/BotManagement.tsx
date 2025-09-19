import React, { useState } from 'react';
import { useBots, useActiveBots } from '../hooks/useBots';
import BotManager from '../components/bots/BotManager';

interface BotManagementProps {
  userId: string; // You'll pass this from your auth context or props
}

const BotManagement: React.FC<BotManagementProps> = ({ userId }) => {
  const { bots, loading, error } = useBots(userId);
  const { activeBots } = useActiveBots(userId);
  const [view, setView] = useState<'all' | 'active'>('all');

  if (loading) return <div className="loading">Loading bots...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const displayedBots = view === 'active' ? activeBots : bots;

  return (
    <div className="bot-management-page">
      <div className="page-header">
        <h1>Bot Management</h1>
        <p>Manage your AI assistants and automation bots</p>
      </div>

      <div className="bot-stats">
        <div className="stat-card">
          <h3>{bots.length}</h3>
          <p>Total Bots</p>
        </div>
        <div className="stat-card">
          <h3>{activeBots.length}</h3>
          <p>Active Bots</p>
        </div>
        <div className="stat-card">
          <h3>{bots.filter(bot => bot.status === 'SUSPENDED').length}</h3>
          <p>Suspended</p>
        </div>
        <div className="stat-card">
          <h3>{bots.filter(bot => bot.status === 'INACTIVE').length}</h3>
          <p>Inactive</p>
        </div>
      </div>

      <div className="view-controls">
        <button 
          className={`view-btn ${view === 'all' ? 'active' : ''}`}
          onClick={() => setView('all')}
        >
          All Bots ({bots.length})
        </button>
        <button 
          className={`view-btn ${view === 'active' ? 'active' : ''}`}
          onClick={() => setView('active')}
        >
          Active Only ({activeBots.length})
        </button>
      </div>

      <div className="bot-types-overview">
        <h3>Bot Types Overview</h3>
        <div className="bot-type-stats">
          {['CHAT_GPT', 'CLAUDE', 'GEMINI', 'CUSTOM', 'WEBHOOK'].map(type => {
            const count = bots.filter(bot => bot.botType === type).length;
            return (
              <div key={type} className="bot-type-stat">
                <span className={`bot-type-badge ${type.toLowerCase()}`}>
                  {type.replace('_', ' ')}
                </span>
                <span className="count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <BotManager userId={userId} />

      {bots.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <h3>No Bots Yet</h3>
          <p>Create your first AI bot to get started with automation and assistance.</p>
        </div>
      )}
    </div>
  );
};

export default BotManagement;