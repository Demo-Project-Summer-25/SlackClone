// src/services/channelService.ts
import ApiService from './api';

export interface Channel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  memberCount: number;
}

export const channelService = {
  // Get all channels
  getAllChannels: async (): Promise<Channel[]> => {
    return ApiService.get<Channel[]>('/channels');
  },

  // Get channels for a specific user directly from backend
  getUserChannels: async (userId: string): Promise<Channel[]> => {
    return ApiService.get<Channel[]>(`/channels/user/${userId}`);
  },

  // Optional: still keep this if you want to fetch members separately
  getChannelMembers: async (channelId: string) => {
    return ApiService.get(`/channels/${channelId}/members`);
  },
};
