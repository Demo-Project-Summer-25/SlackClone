// src/services/channelService.ts
import { apiService } from './api';

export interface Channel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  memberCount: number;
}

export class ChannelService {
  static async getUserChannels(userId: string) {
    try {
      // ✅ Use the correct endpoint
      return await apiService.get(`/api/channels/user/${userId}`);
    } catch (error) {
      console.error('Failed to fetch user channels:', error);
      throw error;
    }
  }

  static async getChannelMessages(channelId: string) {
    try {
      return await apiService.get(`/api/channels/${channelId}/messages`);
    } catch (error) {
      console.error('Failed to fetch channel messages:', error);
      throw error;
    }
  }

  static async createChannel(channelData: any) {
    try {
      return await apiService.post('/api/channels', channelData);
    } catch (error) {
      console.error('Failed to create channel:', error);
      throw error;
    }
  }

  static async updateChannel(channelId: string, channelData: any) {
    try {
      return await apiService.put(`/api/channels/${channelId}`, channelData);
    } catch (error) {
      console.error('Failed to update channel:', error);
      throw error;
    }
  }

  static async deleteChannel(channelId: string) {
    try {
      return await apiService.delete(`/api/channels/${channelId}`);
    } catch (error) {
      console.error('Failed to delete channel:', error);
      throw error;
    }
  }
}

export const channelService = new ChannelService();
