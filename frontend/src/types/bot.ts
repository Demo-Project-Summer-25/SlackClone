export interface Bot {
  id: string;                            // ✅ UUID as string
  userId: string;                        // ✅ UUID as string  
  name: string;                          // ✅ Matches backend
  description?: string;                  // ✅ Matches backend
  botType: 'CLAUDE_SONNET' | 'CLAUDE_HAIKU' | 'CLAUDE_OPUS' | 'CUSTOM'; // ✅ Matches backend
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'SUSPENDED'; // ✅ Matches backend
  createdTimestamp: string;              // ✅ Match backend field name
  updatedTimestamp: string;              // ✅ Match backend field name
}

export interface BotCreateRequest {
  name: string;                          // ✅ Backend requires
  description?: string;                  // ✅ Backend optional
  botType: 'CLAUDE_SONNET' | 'CLAUDE_HAIKU' | 'CLAUDE_OPUS' | 'CUSTOM'; // ✅ Backend enum
  apiKey: string;                        // ✅ Backend requires
  configuration?: string;                // ✅ Backend optional
}

export interface BotUpdateRequest {
  name?: string;                         // ✅ Backend has this
  description?: string;                  // ✅ Backend has this
  botType?: 'CLAUDE_SONNET' | 'CLAUDE_HAIKU' | 'CLAUDE_OPUS' | 'CUSTOM'; // ✅ Backend has this
  apiKey?: string;                       // ✅ Backend has this
  configuration?: string;                // ✅ Backend has this
  status?: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'SUSPENDED'; // ✅ Backend has this
}