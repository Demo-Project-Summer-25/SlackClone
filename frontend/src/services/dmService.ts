import { ApiService } from './api';

// DM interfaces matching your backend entities
export interface DmResponse {
  id: string;  // UUID
  title?: string;
  group: boolean;  // Backend uses 'group', not 'isGroup'
  createdByUserId: string;  // UUID
  createdAt: string;
  participants: DmParticipantResponse[];
}

export interface DmParticipantResponse {
  userId: string;  // UUID
  admin: boolean;  // Backend uses 'admin', not 'isAdmin'
  joinedAt: string;
  leftAt?: string;
  notifyLevel: 'ALL' | 'MENTIONS_ONLY' | 'NONE';
  // User details (if populated by backend)
  user?: {
    id: string;  // UUID
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
  };
}

export interface DmCreateRequest {
  title?: string;
  group: boolean;  // Backend expects 'group'
  createdByUserId: string;  // UUID
  participants: DmParticipantCreateRequest[];
}

export interface DmParticipantCreateRequest {
  userId: string;  // UUID
  admin?: boolean;
  notifyLevel?: 'ALL' | 'MENTIONS_ONLY' | 'NONE';
}

export interface DmUpdateRequest {
  title?: string;
}

export interface DmParticipantUpdateRequest {
  admin?: boolean;
  notifyLevel?: 'ALL' | 'MENTIONS_ONLY' | 'NONE';
}

export interface DmQueryParams {
  includeLeft?: boolean;
  limit?: number;
  offset?: number;
}

export class DmService {
  
  // ===============================
  // DM CONVERSATION OPERATIONS
  // ===============================
  
  /**
   * Create a new DM conversation
   */
  static async createDm(request: DmCreateRequest): Promise<DmResponse> {
    return ApiService.post<DmResponse>('/dms', request);
  }

  /**
   * Get a specific DM conversation by ID
   */
  static async getDm(id: string): Promise<DmResponse> {
    return ApiService.get<DmResponse>(`/dms/${id}`);
  }

  /** 
   * Get all DM conversations for a user
   */
  static async getUserDms(
    userId: string,
    params: DmQueryParams = {}
  ): Promise<DmResponse[]> {
    const queryString = ApiService.buildQueryString(params);
    return ApiService.get<DmResponse[]>(`/dms/user/${userId}${queryString}`);
  }

  /**
   * Update DM conversation details
   */
  static async updateDm(
    dmId: string,
    request: DmUpdateRequest
  ): Promise<DmResponse> {
    return ApiService.put<DmResponse>(`/dms/${dmId}`, request);
  }

  /**
   * Delete/Leave a DM conversation
   */
  static async deleteDm(dmId: string): Promise<void> {
    return ApiService.delete<void>(`/dms/${dmId}`);
  }

  // ===============================
  // PARTICIPANT OPERATIONS
  // ===============================
  
  /**
   * Add a participant to a DM conversation
   */
  static async addParticipant(
    dmId: string,
    request: DmParticipantCreateRequest
  ): Promise<DmResponse> {
    return ApiService.post<DmResponse>(`/dms/${dmId}/participants`, request);
  }

  /**
   * Remove a participant from a DM conversation
   */
  static async removeParticipant(
    dmId: string,
    userId: string
  ): Promise<void> {
    return ApiService.delete<void>(`/dms/${dmId}/participants/${userId}`);
  }

  /**
   * Update participant settings
   */
  static async updateParticipant(
    dmId: string,
    userId: string,
    request: DmParticipantUpdateRequest
  ): Promise<DmParticipantResponse> {
    return ApiService.put<DmParticipantResponse>(`/dms/${dmId}/participants/${userId}`, request);
  }

  /**
   * Get all participants of a DM conversation
   */
  static async getDmParticipants(dmId: string): Promise<DmParticipantResponse[]> {
    return ApiService.get<DmParticipantResponse[]>(`/dms/${dmId}/participants`);
  }

  /**
   * Leave a DM conversation (user leaves themselves)
   */
  static async leaveDm(dmId: string, userId: string): Promise<void> {
    return ApiService.post<void>(`/dms/${dmId}/leave`, { userId });
  }

  /**
   * Rejoin a DM conversation (if user previously left)
   */
  static async rejoinDm(dmId: string, userId: string): Promise<DmResponse> {
    return ApiService.post<DmResponse>(`/dms/${dmId}/rejoin`, { userId });
  }

  // ===============================
  // CONVENIENCE METHODS
  // ===============================
  
  /**
   * Create a direct message between two users (1-on-1)
   */
  static async createDirectMessage(
    createdByUserId: string,
    targetUserId: string
  ): Promise<DmResponse> {
    return this.createDm({
      group: false,  // Changed back to 'group'
      createdByUserId,
      participants: [
        { userId: createdByUserId, admin: true },
        { userId: targetUserId, admin: false }
      ]
    });
  }

  /**
   * Create a group DM
   */
  static async createGroupDm(
    createdByUserId: string,
    participantUserIds: string[],
    title?: string
  ): Promise<DmResponse> {
    const participants: DmParticipantCreateRequest[] = [
      { userId: createdByUserId, admin: true }
    ];
    
    // Add other participants
    participantUserIds.forEach(userId => {
      if (userId !== createdByUserId) {
        participants.push({ userId, admin: false });
      }
    });

    return this.createDm({
      title,
      group: true,  // Changed back to 'group'
      createdByUserId,
      participants
    });
  }

  /**
   * Find existing DM between two users
   */
  static async findDirectMessageBetweenUsers(
    userId1: string,
    userId2: string
  ): Promise<DmResponse | null> {
    const userDms = await this.getUserDms(userId1);
    
    // Find 1-on-1 DM with the target user
    const existingDm = userDms.find(dm => 
      !dm.group &&  // Changed back to 'group'
      dm.participants.length === 2 &&
      dm.participants.some(p => p.userId === userId2)
    );
    
    return existingDm || null;
  }

  /**
   * Get or create DM between two users
   */
  static async getOrCreateDirectMessage(
    currentUserId: string,
    targetUserId: string
  ): Promise<DmResponse> {
    // First try to find existing DM
    const existing = await this.findDirectMessageBetweenUsers(currentUserId, targetUserId);
    
    if (existing) {
      return existing;
    }
    
    // Create new DM if none exists
    return this.createDirectMessage(currentUserId, targetUserId);
  }

  /**
   * Get active DMs for a user (exclude left conversations)
   */
  static async getActiveDms(userId: string): Promise<DmResponse[]> {
    return this.getUserDms(userId, { includeLeft: false });
  }

  /**
   * Check if user is admin of a DM
   */
  static isUserAdmin(dm: DmResponse, userId: string): boolean {
    const participant = dm.participants.find(p => p.userId === userId);
    return participant?.admin || false;  // Changed back to 'admin'
  }

  /**
   * Check if user is still active in a DM
   */
  static isUserActive(dm: DmResponse, userId: string): boolean {
    const participant = dm.participants.find(p => p.userId === userId);
    return participant ? !participant.leftAt : false;
  }

  /**
   * Get DM display name for a user
   */
  static getDmDisplayName(dm: DmResponse, currentUserId: string): string {
    if (dm.title) {
      return dm.title;
    }
    
    if (dm.group) {  // Changed back to 'group'
      // For group DMs without title, show participant names
      const otherParticipants = dm.participants
        .filter(p => p.userId !== currentUserId && !p.leftAt)
        .map(p => p.user?.firstName || p.user?.username || `User ${p.userId}`)
        .slice(0, 3);
      
      return otherParticipants.length > 0 
        ? otherParticipants.join(', ') 
        : 'Group Chat';
    } else {
      // For 1-on-1 DMs, show the other person's name
      const otherParticipant = dm.participants.find(p => p.userId !== currentUserId);
      return otherParticipant?.user?.firstName || 
             otherParticipant?.user?.username || 
             `User ${otherParticipant?.userId}`;
    }
  }

  // ===============================
  // SEARCH AND FILTERING
  // ===============================
  
  /**
   * Search user's DMs by title or participant names
   */
  static async searchUserDms(
    userId: string,
    query: string
  ): Promise<DmResponse[]> {
    const allDms = await this.getUserDms(userId);
    
    return allDms.filter(dm => {
      const displayName = this.getDmDisplayName(dm, userId).toLowerCase();
      return displayName.includes(query.toLowerCase());
    });
  }

  /**
   * Get recent DMs for a user (most recently active)
   */
  static async getRecentDms(
    userId: string,
    limit: number = 10
  ): Promise<DmResponse[]> {
    const dms = await this.getUserDms(userId, { limit });
    
    // Sort by creation date (most recent first)
    return dms.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export default DmService;