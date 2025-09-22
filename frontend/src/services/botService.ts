import { apiService } from './api';

export interface ChatResponse {
  response: string;
  timestamp: number;
}

export const botService = {
  // Send message to Pong AI
  chatWithBot: async (message: string, userId?: string): Promise<string> => {
    try {
      console.log(' Sending to API:', { message, userId });
      
      const requestBody = {
        message: message,
        ...(userId && { userId })
      };
      
      // Use the singleton apiService instance
      const response = await apiService.post<ChatResponse>(`/bots/chat`, requestBody);
      
      console.log(' API Response:', response);
      
      // Handle case where response might be null or undefined
      if (!response || !response.response) {
        console.warn(' Empty response from API');
        return 'Sorry, I received an empty response. Please try again.';
      }
      
      return response.response;
    } catch (error) {
      console.error(' API Error:', error);
      // Return a more specific error message
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          return 'Cannot connect to the bot server. Please check if the backend is running.';
        }
        return `Connection error: ${error.message}`;
      }
      return 'Sorry, I encountered an unexpected error. Please try again.';
    }
  },

  getBotStatus: async (): Promise<string> => {
    try {
      return await apiService.get<string>('/bots/status');
    } catch (error) {
      console.error(' Status Error:', error);
      return 'Offline';
    }
  },

  testBot: async (): Promise<string> => {
    try {
      return await apiService.get<string>('/bots/test');
    } catch (error) {
      console.error(' Test Error:', error);
      return 'Test failed';
    }
  }
};