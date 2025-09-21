import { apiService } from './api';
import {
  MessageResponse,
  MessageCreateRequest,
  MessageUpdateRequest
} from '../types/api';

export class MessageService {
  // ===============================
  // CHANNEL MESSAGE OPERATIONS
  // ===============================

  /**
   * Get messages for a specific channel
   */
  static async getChannelMessages(
    channelId: number,
    params: { limit?: number; offset?: number } = {}
  ): Promise<MessageResponse[]> {
    const { limit = 50, ...otherParams } = params;
    // ✅ Fix: Use instance method for buildQueryString
    const queryString = apiService.buildQueryString({ limit, ...otherParams });
    
    // ✅ Fix: Use instance method for get
    return apiService.get<MessageResponse[]>(`/channels/${channelId}/messages${queryString}`);
  }

  /**
   * Send a message to a channel
   */
  static async sendChannelMessage(
    channelId: number,
    request: MessageCreateRequest
  ): Promise<MessageResponse> {
    // ✅ Fix: Use instance method
    return apiService.post<MessageResponse>(`/channels/${channelId}/messages`, request);
  }

  /**
   * Get a specific message from a channel
   */
  static async getChannelMessage(
    channelId: number,
    messageId: string
  ): Promise<MessageResponse> {
    // ✅ Fix: Use instance method
    return apiService.get<MessageResponse>(`/channels/${channelId}/messages/${messageId}`);
  }

  // ===============================
  // DIRECT MESSAGE OPERATIONS
  // ===============================

  /**
   * Get messages for a specific DM conversation
   */
  static async getDmMessages(
    dmId: string,
    params: { limit?: number; offset?: number } = {}
  ): Promise<MessageResponse[]> {
    try {
      console.log(`Fetching messages for DM: ${dmId}`);
      // ✅ Fix: Use instance method for buildQueryString
      const queryString = apiService.buildQueryString(params);
      // ✅ Fix: Use instance method for get
      const result = await apiService.get<MessageResponse[]>(`/dms/${dmId}/messages${queryString}`);
      console.log('DM messages fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to fetch DM messages:', dmId, error);
      throw error;
    }
  }

  /**
   * Send a message to a DM conversation
   */
  static async sendDmMessage(
    dmId: string,
    request: MessageCreateRequest
  ): Promise<MessageResponse> {
    try {
      console.log(`Sending message to DM ${dmId}:`, request);
      // ✅ Fix: Use instance method
      const result = await apiService.post<MessageResponse>(`/dms/${dmId}/messages`, request);
      console.log('Message sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send DM message:', dmId, request, error);
      throw error;
    }
  }

  /**
   * Update a message
   */
  static async updateMessage(
    messageId: string,
    request: MessageUpdateRequest
  ): Promise<MessageResponse> {
    try {
      console.log(`Updating message ${messageId}:`, request);
      // ✅ Fix: Use instance method
      const result = await apiService.put<MessageResponse>(`/messages/${messageId}`, request);
      console.log('Message updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to update message:', messageId, request, error);
      throw error;
    }
  }

  /**
   * Delete a message
   */
  static async deleteMessage(messageId: string): Promise<void> {
    try {
      console.log(`Deleting message: ${messageId}`);
      // ✅ Fix: Use instance method
      await apiService.delete<void>(`/messages/${messageId}`);
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Failed to delete message:', messageId, error);
      throw error;
    }
  }
}

export default MessageService;