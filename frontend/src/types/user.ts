export interface User {
  id: string;                    // ✅ UUID as string
  username: string;              // ✅ Backend has this
  displayName?: string;          // ✅ Backend has this  
  profileUrl?: string;           // ✅ Backend calls it profileUrl
  createdTimestamp: string;      // ✅ Match backend field name
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'; // ✅ Match backend enum
}

export interface UserUpdateRequest {
  displayName?: string;          // ✅ Backend has this
  profileUrl?: string;           // ✅ Backend has this  
  email?: string;                // ✅ Backend has this in update request
}

// ✅ BACKEND - BotIntegrationPublicDto (what you actually return)
return new BotIntegrationPublicDto(
    bot.getId(),                // UUID ✅
    bot.getName(),              // String ✅
    bot.getDescription(),       // String ✅
    bot.getBotType(),           // BotType enum ✅
    bot.getStatus(),            // BotStatus enum ✅
    bot.getUser().getId(),      // UUID (userId) ✅
    bot.getCreatedTimestamp(),  // LocalDateTime ✅
    bot.getUpdatedTimestamp()   // LocalDateTime ✅
);