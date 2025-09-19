import { useState, useEffect } from 'react';
import { Bot, BotCreateRequest, BotUpdateRequest } from '../types/bot';
import { botService } from '../services/botService';

export const useBots = (userId: string | null) => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBots = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedBots = await botService.getUserBots(id);
      setBots(fetchedBots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bots');
    } finally {
      setLoading(false);
    }
  };

  const createBot = async (request: BotCreateRequest) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const newBot = await botService.createBot(userId, request);
      setBots(prev => [...prev, newBot]);
      return newBot;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bot');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBot = async (botId: string, request: BotUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBot = await botService.updateBot(botId, request);
      setBots(prev => prev.map(bot => bot.id === botId ? updatedBot : bot));
      return updatedBot;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bot');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBot = async (botId: string) => {
    setLoading(true);
    setError(null);
    try {
      await botService.deleteBot(botId);
      setBots(prev => prev.filter(bot => bot.id !== botId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bot');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserBots(userId);
    }
  }, [userId]);

  return {
    bots,
    loading,
    error,
    createBot,
    updateBot,
    deleteBot,
    refetch: () => userId && fetchUserBots(userId),
  };
};

export const useBot = (botId: string | null) => {
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBot = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedBot = await botService.getBotById(id);
      setBot(fetchedBot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bot');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (botId) {
      fetchBot(botId);
    }
  }, [botId]);

  return {
    bot,
    loading,
    error,
    refetch: () => botId && fetchBot(botId),
  };
};

export const useActiveBots = (userId: string | null) => {
  const [activeBots, setActiveBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveBots = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedBots = await botService.getUserActiveBots(id);
      setActiveBots(fetchedBots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active bots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchActiveBots(userId);
    }
  }, [userId]);

  return {
    activeBots,
    loading,
    error,
    refetch: () => userId && fetchActiveBots(userId),
  };
};