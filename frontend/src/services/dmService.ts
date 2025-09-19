import ApiService from './api';
import { 
  DmResponse, 
  DmCreateRequest, 
  DmParticipantCreateRequest, 
  DmParticipantResponse, 
  DmUpdateRequest, 
  DmParticipantUpdateRequest, 
  DmQueryParams 
} from '../types/api';

export class DmService {
  // ===============================
  // CORE DM OPERATIONS
  // ===============================
  
  /**
   * Get all DM conversations for a user
   */
  static async getDmsForUser(userId: string): Promise<DmResponse[]> {
    return ApiService.get<DmResponse[]>(`/dms/user/${userId}`);
  }

  /**
   * Get a specific DM conversation by ID
   */
  static async getDm(dmId: string): Promise<DmResponse> {
    return ApiService.get<DmResponse>(`/dms/${dmId}`);
  }

  /**
   * Create a new DM conversation
   */
  static async createDm(request: DmCreateRequest): Promise<DmResponse> {
    return ApiService.post<DmResponse>('/dms', request);
  }

  /** 
   * Get all DM conversations for a user with query params
   */
  static async getUserDms(
    userId: string,
    params: DmQueryParams = {}
  ): Promise<DmResponse[]> {
    const queryString = ApiService.buildQueryString(params);
    return ApiService.get<DmResponse[]>(`/dms/user/${userId}${queryString}`);
  }

  /**
   * Get display name for a DM conversation
   */
  static getDmDisplayName(dm: DmResponse, currentUserId: string): string {
    if (dm.group && dm.title) {
      return dm.title;
    }
    
    if (dm.group) {
      return `Group Chat (${dm.participants.length} members)`;
    }
    
    // Find the other participant (not the current user)
    const otherParticipant = dm.participants.find(p => p.userId !== currentUserId);
    if (otherParticipant?.user) {
      return otherParticipant.user.displayName || 
             otherParticipant.user.username || 
             `User ${otherParticipant.userId}`;
    }
    
    return 'Direct Message';
  }

  /**
   * Update a DM conversation
   */
  static async updateDm(
    dmId: string,
    request: DmUpdateRequest
  ): Promise<DmResponse> {
    return ApiService.put<DmResponse>(`/dms/${dmId}`, request);
  }

  /**
   * Delete a DM conversation
   */
  static async deleteDm(dmId: string): Promise<void> {
    return ApiService.delete<void>(`/dms/${dmId}`);
  }

  /**
   * Add a participant to a DM conversation
   */
  static async addParticipant(
    dmId: string,
    request: DmParticipantCreateRequest
  ): Promise<DmParticipantResponse> {
    return ApiService.post<DmParticipantResponse>(`/dms/${dmId}/participants`, request);
  }

  /**
   * Update a participant in a DM conversation
   */
  static async updateParticipant(
    dmId: string,
    participantId: string,
    request: DmParticipantUpdateRequest
  ): Promise<DmParticipantResponse> {
    return ApiService.put<DmParticipantResponse>(`/dms/${dmId}/participants/${participantId}`, request);
  }

  /**
   * Remove a participant from a DM conversation
   */
  static async removeParticipant(dmId: string, participantId: string): Promise<void> {
    return ApiService.delete<void>(`/dms/${dmId}/participants/${participantId}`);
  }

  /**
   * Get participants of a DM conversation
   */
  static async getParticipants(dmId: string): Promise<DmParticipantResponse[]> {
    return ApiService.get<DmParticipantResponse[]>(`/dms/${dmId}/participants`);
  }
}
