import ApiService, { ApiService as ApiServiceClass } from './api';
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
    channelId: number,  // Keep as number for channels
    params: { limit?: number; offset?: number } = {}
  ): Promise<MessageResponse[]> {
    const { limit = 50, ...otherParams } = params;
    const queryString = ApiServiceClass.buildQueryString({ limit, ...otherParams }); // Use class for static method

    return ApiService.get<MessageResponse[]>(`/channels/${channelId}/messages${queryString}`); // Use instance for instance methods
  }

  /**
   * Send a message to a channel
   */
  static async sendChannelMessage(
    channelId: number,  // Keep as number for channels
    request: MessageCreateRequest
  ): Promise<MessageResponse> {
    return ApiService.post<MessageResponse>(`/channels/${channelId}/messages`, request);
  }

  /**
   * Get a specific message from a channel
   */
  static async getChannelMessage(
    channelId: number,  // Keep as number for channels
    messageId: string  // Changed from number to string (UUID)
  ): Promise<MessageResponse> {
    return ApiService.get<MessageResponse>(`/channels/${channelId}/messages/${messageId}`);
  }

  // ===============================
  // DIRECT MESSAGE OPERATIONS
  // ===============================

  /**
   * Get messages for a specific DM conversation
   * Matches: GET /api/dms/{dmId}/messages
   */
  static async getDmMessages(
    dmId: string,
    params: { limit?: number; offset?: number } = {}
  ): Promise<MessageResponse[]> {
    try {
      console.log(`Fetching messages for DM: ${dmId}`);
      const queryString = ApiServiceClass.buildQueryString(params); // Use class for static method
      const result = await ApiService.get<MessageResponse[]>(`/dms/${dmId}/messages${queryString}`);
      console.log('DM messages fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to fetch DM messages:', dmId, error);
      throw error;
    }
  }

  /**
   * Send a message to a DM conversation
   * Matches: POST /api/dms/{dmId}/messages
   */
  static async sendDmMessage(
    dmId: string,  // Changed from number to string (UUID)
    request: MessageCreateRequest
  ): Promise<MessageResponse> {
    try {
      console.log(`Sending message to DM ${dmId}:`, request);
      const result = await ApiService.post<MessageResponse>(`/dms/${dmId}/messages`, request);
      console.log('Message sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send DM message:', dmId, request, error);
      throw error;
    }
  }

  /**
   * Update a message
   * Matches: PATCH /api/messages/{messageId}
   */
  static async updateMessage(
    messageId: string,  // Changed from number to string (UUID)
    request: MessageUpdateRequest
  ): Promise<MessageResponse> {
    try {
      console.log(`Updating message ${messageId}:`, request);
      const result = await ApiService.put<MessageResponse>(`/messages/${messageId}`, request);
      console.log('Message updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to update message:', messageId, request, error);
      throw error;
    }
  }

  /**
   * Delete a message
   * Matches: DELETE /api/messages/{messageId}
   */
  static async deleteMessage(messageId: string): Promise<void> {
    try {
      console.log(`Deleting message: ${messageId}`);
      await ApiService.delete<void>(`/messages/${messageId}`);
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Failed to delete message:', messageId, error);
      throw error;
    }
  }
}

export default MessageService;