// DM (Direct Message) Types
export interface DmResponse {
  id: string;
  createdByUserId: string;
  group: boolean;
  title?: string;
  createdAt: string;
  updatedAt: string;
  participants: DmParticipantResponse[];
}

export interface DmParticipantResponse {
  id: string;
  userId: string;
  admin: boolean;
  joinedAt: string;
  leftAt?: string;
  notifyLevel: 'ALL' | 'MENTIONS_ONLY' | 'NONE';
  user?: UserInfo;
}

export interface UserInfo {
  id: string;
  username: string;
  displayName?: string;
  profileUrl?: string;
}

export interface DmCreateRequest {
  createdByUserId: string;
  group: boolean;
  title?: string;
  participantUserIds: string[];
}

export interface DmUpdateRequest {
  title?: string;
  group?: boolean;
}

export interface DmQueryParams {
  limit?: number;
  offset?: number;
  includeLeft?: boolean;
}

// DM Participant Types
export interface DmParticipantCreateRequest {
  userId: string;
  admin?: boolean;
  notifyLevel?: 'ALL' | 'MENTIONS_ONLY' | 'NONE';
}

export interface DmParticipantUpdateRequest {
  admin?: boolean;
  notifyLevel?: 'ALL' | 'MENTIONS_ONLY' | 'NONE';
  leftAt?: string;
}

// Message Types
export interface MessageResponse {
  id: string;
  channelId?: number;
  directConversationId?: string;
  senderUserId: string;
  content: string;
  contentType: 'TEXT' | 'IMAGE' | 'FILE';
  deleted: boolean;
  createdAt: string;
  editedAt?: string;
}

export interface MessageCreateRequest {
  senderUserId: string;
  content: string;
  contentType?: 'TEXT' | 'IMAGE' | 'FILE';
}

export interface MessageUpdateRequest {
  content?: string;
  contentType?: 'TEXT' | 'IMAGE' | 'FILE';
}

export interface MessageQueryParams {
  limit?: number;
  offset?: number;
  before?: string;
  after?: string;
  includeDeleted?: boolean;
}

// Channel Types (for future use)
export interface ChannelResponse {
  id: number;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelCreateRequest {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface ChannelUpdateRequest {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

// User Types (basic for API responses)
export interface ApiUserResponse {
  id: string;
  username: string;
  displayName?: string;
  profileUrl?: string;
  createdTimestamp: string;
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

// Error Response Type
export interface ApiErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  status: number;
}

// Pagination Types
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}