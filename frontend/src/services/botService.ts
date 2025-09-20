import { ApiService } from './api';

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  timestamp: number;
}

export const botService = {
  // Send message to PingBot AI
  chatWithBot: async (message: string, userId?: string): Promise<string> => {
    try {
      console.log(' Sending to API:', { message, userId });
      
      const requestBody = {
        message: message,
        ...(userId && { userId })
      };
      
      const response = await ApiService.post<ChatResponse>(`/bots/chat`, requestBody);
      
      console.log(' API Response:', response);
      
      // Handle case where response might be null or undefined
      if (!response || !response.response) {
        console.warn(' Empty response from API');
        return 'Sorry, I received an empty response. Please try again.';
      }
      
      return response.response;
    } catch (error) {
      console.error(' API Error:', error);
      
      // More specific error handling
      if (error instanceof Error) {
        throw new Error(`Bot service error: ${error.message}`);
      }
      
      throw new Error('Failed to communicate with PingBot AI');
    }
  },

  // Check bot status
  getBotStatus: async (): Promise<string> => {
    try {
      const status = await ApiService.get<string>('/bots/status');
      console.log(' Bot Status:', status);
      return status;
    } catch (error) {
      console.error(' Status Error:', error);
      throw new Error('Failed to get bot status');
    }
  },

  // Test bot connection
  testBot: async (): Promise<string> => {
    try {
      const result = await ApiService.get<string>('/bots/test');
      console.log(' Bot Test:', result);
      return result;
    } catch (error) {
      console.error(' Test Error:', error);
      throw new Error('Failed to test bot connection');
    }
  }
};