import { Bot, BotCreateRequest, BotUpdateRequest } from '../types/bot';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class BotService {
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('authToken');
    
    return fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });
  }

  // POST /api/bots/users/{userId}  (not /api/bots)
  async createBot(userId: string, request: BotCreateRequest): Promise<Bot> {
    const response = await this.fetchWithAuth(`/api/bots/users/${userId}`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create bot: ${response.statusText}`);
    }
    
    return response.json();
  }

  // GET /api/bots/{botId}
  async getBotById(botId: string): Promise<Bot> {
    const response = await this.fetchWithAuth(`/api/bots/${botId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch bot: ${response.statusText}`);
    }
    
    return response.json();
  }

  // GET /api/bots/users/{userId}  (not /api/users/{userId}/bots)
  async getUserBots(userId: string): Promise<Bot[]> {
    const response = await this.fetchWithAuth(`/api/bots/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user bots: ${response.statusText}`);
    }
    
    return response.json();
  }

  // GET /api/bots/users/{userId}/active
  async getUserActiveBots(userId: string): Promise<Bot[]> {
    const response = await this.fetchWithAuth(`/api/bots/users/${userId}/active`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch active bots: ${response.statusText}`);
    }
    
    return response.json();
  }

  // PUT /api/bots/{botId}
  async updateBot(botId: string, request: BotUpdateRequest): Promise<Bot> {
    const response = await this.fetchWithAuth(`/api/bots/${botId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update bot: ${response.statusText}`);
    }
    
    return response.json();
  }

  // DELETE /api/bots/{botId}
  async deleteBot(botId: string): Promise<void> {
    const response = await this.fetchWithAuth(`/api/bots/${botId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete bot: ${response.statusText}`);
    }
  }

  // Helper method for bot count (derived from getUserBots)
  async getUserBotCount(userId: string): Promise<number> {
    const bots = await this.getUserBots(userId);
    return bots.length;
  }
}

export const botService = new BotService();