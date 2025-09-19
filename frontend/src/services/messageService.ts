import { ApiService } from './api';

// Message interfaces matching your backend entities
export interface MessageResponse {
  id: string;  // Changed from number to string (UUID)
  channelId?: number;  // Keep as number for channels
  directConversationId?: string;  // Changed from number to string (UUID)
  senderUserId: string;  // Changed from number to string (UUID)
  content: string;
  contentType: 'TEXT' | 'IMAGE' | 'FILE';
  deleted: boolean;
  createdAt: string;
  editedAt?: string;
}

export interface MessageCreateRequest {
  senderUserId: string;  // Changed from number to string (UUID)
  content: string;
  contentType?: 'TEXT' | 'IMAGE' | 'FILE';
}

export interface MessageUpdateRequest {
  content: string;
}

export interface MessageQueryParams {
  after?: string;      // Changed from number to string (UUID)
  before?: string;     // Changed from number to string (UUID)
  limit?: number;      // Keep as number
  since?: string;      // Keep as string (ISO timestamp)
}

export class MessageService {
  
  // ===============================
  // CHANNEL MESSAGE OPERATIONS
  // ===============================
  
  /**
   * Get messages for a specific channel
   */
  static async getChannelMessages(
    channelId: number,  // Keep as number for channels
    params: MessageQueryParams = {}
  ): Promise<MessageResponse[]> {
    const { limit = 50, ...otherParams } = params;
    const queryString = ApiService.buildQueryString({ limit, ...otherParams });
    
    return ApiService.get<MessageResponse[]>(`/channels/${channelId}/messages${queryString}`);
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
   */
  static async getDmMessages(
    dmId: string,  // Changed from number to string (UUID)
    params: MessageQueryParams = {}
  ): Promise<MessageResponse[]> {
    const { limit = 50, ...otherParams } = params;
    const queryString = ApiService.buildQueryString({ limit, ...otherParams });
    
    return ApiService.get<MessageResponse[]>(`/dms/${dmId}/messages${queryString}`);
  }

  /**
   * Send a message to a DM conversation
   */
  static async sendDmMessage(
    dmId: string,  // Changed from number to string (UUID)
    request: MessageCreateRequest
  ): Promise<MessageResponse> {
    return ApiService.post<MessageResponse>(`/dms/${dmId}/messages`, request);
  }

  /**
   * Get a specific message from a DM conversation
   */
  static async getDmMessage(
    dmId: string,  // Changed from number to string (UUID)
    messageId: string  // Changed from number to string (UUID)
  ): Promise<MessageResponse> {
    return ApiService.get<MessageResponse>(`/dms/${dmId}/messages/${messageId}`);
  }

  // ===============================
  // GENERAL MESSAGE OPERATIONS
  // ===============================
  
  /**
   * Edit a message (works for both channel and DM messages)
   */
  static async editMessage(
    messageId: string,  // Changed from number to string (UUID)
    request: MessageUpdateRequest
  ): Promise<MessageResponse> {
    return ApiService.patch<MessageResponse>(`/messages/${messageId}`, request);
  }

  /**
   * Delete a message (soft delete - marks as deleted)
   */
  static async deleteMessage(messageId: string): Promise<void> {  // Changed parameter type
    return ApiService.delete<void>(`/messages/${messageId}`);
  }

  /**
   * Get a message by ID (works for both channel and DM messages)
   */
  static async getMessageById(messageId: string): Promise<MessageResponse> {  // Changed parameter type
    return ApiService.get<MessageResponse>(`/messages/${messageId}`);
  }

  // ===============================
  // FILE UPLOAD OPERATIONS
  // ===============================
  
  /**
   * Upload a file and send as message to a channel
   */
  static async sendChannelFileMessage(
    channelId: number,  // Keep as number for channels
    file: File,
    senderUserId: string,  // Changed parameter type
    caption?: string
  ): Promise<MessageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderUserId', senderUserId);  // Now string
    formData.append('contentType', 'FILE');
    
    if (caption) {
      formData.append('caption', caption);
    }

    return ApiService.uploadFile<MessageResponse>(`/channels/${channelId}/messages/upload`, formData);
  }

  /**
   * Upload a file and send as message to a DM
   */
  static async sendDmFileMessage(
    dmId: string,  // Changed parameter type
    file: File,
    senderUserId: string,  // Changed parameter type
    caption?: string
  ): Promise<MessageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderUserId', senderUserId);  // Now string
    formData.append('contentType', 'FILE');
    
    if (caption) {
      formData.append('caption', caption);
    }

    return ApiService.uploadFile<MessageResponse>(`/dms/${dmId}/messages/upload`, formData);
  }

  // ===============================
  // SEARCH AND PAGINATION
  // ===============================
  
  /**
   * Search messages in a channel
   */
  static async searchChannelMessages(
    channelId: number,  // Keep as number for channels
    query: string,
    params: { limit?: number; offset?: number } = {}
  ): Promise<MessageResponse[]> {
    const { limit = 50, offset = 0 } = params;
    const queryString = ApiService.buildQueryString({ q: query, limit, offset });
    
    return ApiService.get<MessageResponse[]>(`/channels/${channelId}/messages/search${queryString}`);
  }

  /**
   * Search messages in a DM conversation
   */
  static async searchDmMessages(
    dmId: string,  // Changed parameter type
    query: string,
    params: { limit?: number; offset?: number } = {}
  ): Promise<MessageResponse[]> {
    const { limit = 50, offset = 0 } = params;
    const queryString = ApiService.buildQueryString({ q: query, limit, offset });
    
    return ApiService.get<MessageResponse[]>(`/dms/${dmId}/messages/search${queryString}`);
  }

  // ===============================
  // UTILITY METHODS
  // ===============================
  
  /**
   * Get latest messages for a channel (convenience method)
   */
  static async getLatestChannelMessages(
    channelId: number,  // Keep as number for channels
    limit: number = 50
  ): Promise<MessageResponse[]> {
    return this.getChannelMessages(channelId, { limit });
  }

  /**
   * Get latest messages for a DM (convenience method)
   */
  static async getLatestDmMessages(
    dmId: string,  // Changed parameter type
    limit: number = 50
  ): Promise<MessageResponse[]> {
    return this.getDmMessages(dmId, { limit });
  }

  /**
   * Get messages before a specific message (for pagination)
   */
  static async getChannelMessagesBefore(
    channelId: number,  // Keep as number for channels
    beforeMessageId: string,  // Changed parameter type
    limit: number = 50
  ): Promise<MessageResponse[]> {
    return this.getChannelMessages(channelId, { before: beforeMessageId, limit });
  }

  /**
   * Get messages after a specific message (for real-time updates)
   */
  static async getChannelMessagesAfter(
    channelId: number,  // Keep as number for channels
    afterMessageId: string,  // Changed parameter type
    limit: number = 50
  ): Promise<MessageResponse[]> {
    return this.getChannelMessages(channelId, { after: afterMessageId, limit });
  }
}

export default MessageService;