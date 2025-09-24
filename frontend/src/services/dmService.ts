import { apiService } from './api';
import { 
  DmResponse, 
  DmCreateRequest, 
  DmParticipantCreateRequest, 
  DmParticipantResponse, 
  DmUpdateRequest, 
  DmParticipantUpdateRequest, 
  DmQueryParams 
} from '../types/api';

export class dmService {
  // ===============================
  // CORE DM OPERATIONS
  // ===============================
  
  /**
   * Get all DM conversations for a user
   * Matches: GET /api/dms/user/{userId}
   */
  static async getDmsForUser(userId: string): Promise<DmResponse[]> {
    try {
      console.log(`Fetching DMs for user: ${userId}`);
      const result = await apiService.get<DmResponse[]>(`/api/dms/user/${userId}`);
      console.log('DMs fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to fetch DMs for user:', userId, error);
      throw error;
    }
  }

  /**
   * Get a specific DM conversation by ID
   * Matches: GET /api/dms/{id}
   */
  static async getDm(dmId: string): Promise<DmResponse> {
    try {
      console.log(`Fetching DM: ${dmId}`);
      const result = await apiService.get<DmResponse>(`/api/dms/${dmId}`);
      console.log('DM fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to fetch DM:', dmId, error);
      throw error;
    }
  }

  /**
   * Create a new DM conversation
   * Matches: POST /api/dms
   */
  static async createDm(request: DmCreateRequest): Promise<DmResponse> {
    try {
      console.log('Creating DM:', request);
      const result = await apiService.post<DmResponse>('/api/dms', request);
      console.log('DM created successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to create DM:', request, error);
      throw error;
    }
  }

  /**
   * Add a participant to a DM conversation
   * Matches: POST /api/dms/{id}/participants
   */
  static async addParticipant(
    dmId: string,
    request: DmParticipantCreateRequest
  ): Promise<DmParticipantResponse> {
    try {
      console.log(`Adding participant to DM ${dmId}:`, request);
      const result = await apiService.post<DmParticipantResponse>(`/api/dms/${dmId}/participants`, request);
      console.log('Participant added successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to add participant:', dmId, request, error);
      throw error;
    }
  }

  /**
   * Remove a participant from a DM conversation
   * Matches: DELETE /api/dms/{id}/participants/{userId}
   */
  static async removeParticipant(dmId: string, userId: string): Promise<void> {
    try {
      console.log(`Removing participant ${userId} from DM ${dmId}`);
      await apiService.delete<void>(`/api/dms/${dmId}/participants/${userId}`);
      console.log('Participant removed successfully');
    } catch (error) {
      console.error('Failed to remove participant:', dmId, userId, error);
      throw error;
    }
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
}
