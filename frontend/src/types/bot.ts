export interface Bot {
  id: string;
  userId: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  botType: 'CHAT_GPT' | 'CLAUDE' | 'GEMINI' | 'CUSTOM' | 'WEBHOOK';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  apiKey?: string;
  webhookUrl?: string;
  configurationJson?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
}

export interface BotCreateRequest {
  name: string;
  description?: string;
  avatarUrl?: string;
  botType: 'CHAT_GPT' | 'CLAUDE' | 'GEMINI' | 'CUSTOM' | 'WEBHOOK';
  apiKey?: string;
  webhookUrl?: string;
  configurationJson?: string;
}

export interface BotUpdateRequest {
  name?: string;
  description?: string;
  avatarUrl?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  apiKey?: string;
  webhookUrl?: string;
  configurationJson?: string;
  isActive?: boolean;
}