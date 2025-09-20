// package com.hire_me.Ping.notifications.service.rules;
// import java.util.HashSet;
// import java.util.Set;
// import java.util.UUID;

// Note: This class intentionally has no Spring stereotype annotation.
// It is pure policy and can be wired by a configuration when ready.

/**
 * Concrete implementation of NotificationRules.
 *
 * IMPORTANT: This class is PURE POLICY:
 * - It does not save to DB.
 * - It does not publish WebSockets.
 * - It only chooses WHO should be notified.
 *
 * It calls other domain services (conversation/channel/board/card/preferences)
 * to ask about memberships, visibility, and user preferences.
 *
 * For now, those dependencies are shown as interfaces you would implement
 * elsewhere in your app. You can swap them for your real services.
 */
// public class NotificationRulesImpl implements NotificationRules {

//     // ---- Dependencies on other domains (define/implement these in your app) ----
//     private final ConversationService conversationService;   // who is in a DM
//     private final ChannelService channelService;             // can user see channel?
//     private final BoardService boardService;                 // board watchers/owners
//     private final CardService cardService;                   // card assignees/watchers
//     private final InviteService inviteService;               // invitee lookup
//     private final CalendarService calendarService;           // event attendees ready for reminder
//     private final PreferenceService preferenceService;       // mutes, DND (quiet hours)

//     public NotificationRulesImpl(ConversationService conversationService,
//                                  ChannelService channelService,
//                                  BoardService boardService,
//                                  CardService cardService,
//                                  InviteService inviteService,
//                                  CalendarService calendarService,
//                                  PreferenceService preferenceService) {
//         this.conversationService = conversationService;
//         this.channelService = channelService;
//         this.boardService = boardService;
//         this.cardService = cardService;
//         this.inviteService = inviteService;
//         this.calendarService = calendarService;
//         this.preferenceService = preferenceService;
//     }

//     // =========================================================
//     // CHAT (MVP)
//     // =========================================================

//     @Override
//     public Set<UUID> recipientsForDirectMessage(UUID directConversationId, UUID actorUserId) {
//         // Defensive coding: return empty set if inputs are missing
//         if (directConversationId == null) return Set.of();

//         // 1) Start with all participants
//         Set<UUID> recipients = new HashSet<>(conversationService.participantsOf(directConversationId));

//         // 2) Exclude the actor (sender shouldn't be notified about their own action)
//         if (actorUserId != null) recipients.remove(actorUserId);

//         // 3) Apply user preferences (mute/DND). Keep policy simple and consistent.
//         recipients.removeIf(userId ->
//                 preferenceService.isMutedForDM(userId, directConversationId)
//              || preferenceService.isDoNotDisturbActive(userId));

//         return recipients;
//     }

//     @Override
//     public Set<UUID> recipientsForChannelMention(UUID channelId, UUID actorUserId, Set<UUID> mentionedUserIds) {
//         if (channelId == null || mentionedUserIds == null || mentionedUserIds.isEmpty()) return Set.of();

//         // 1) Start with only the explicitly mentioned users
//         Set<UUID> recipients = new HashSet<>(mentionedUserIds);

//         // 2) Remove the actor if they mentioned themselves
//         if (actorUserId != null) recipients.remove(actorUserId);

//         // 3) Visibility check: only keep users who can view the channel
//         recipients.removeIf(userId -> !channelService.canUserViewChannel(userId, channelId));

//         // 4) Apply mutes / DND
//         recipients.removeIf(userId ->
//                 preferenceService.isMutedForChannel(userId, channelId)
//              || preferenceService.isDoNotDisturbActive(userId));

//         return recipients;
//     }

//     // =========================================================
//     // KANBAN (future)
//     // =========================================================

//     @Override
//     public Set<UUID> recipientsForCardUpdate(UUID cardId, UUID actorUserId) {
//         if (cardId == null) return Set.of();

//         // 1) Assignees + watchers
//         Set<UUID> recipients = new HashSet<>(cardService.assigneesAndWatchers(cardId));

//         // 2) Exclude actor
//         if (actorUserId != null) recipients.remove(actorUserId);

//         // 3) Apply per-card mutes / DND
//         recipients.removeIf(userId ->
//                 preferenceService.isMutedForCard(userId, cardId)
//              || preferenceService.isDoNotDisturbActive(userId));

//         return recipients;
//     }

//     @Override
//     public Set<UUID> recipientsForBoardUpdate(UUID boardId, UUID actorUserId) {
//         if (boardId == null) return Set.of();

//         // 1) Board watchers/owners
//         Set<UUID> recipients = new HashSet<>(boardService.watchersAndOwners(boardId));

//         // 2) Exclude actor
//         if (actorUserId != null) recipients.remove(actorUserId);

//         // 3) Apply board-level mutes / DND
//         recipients.removeIf(userId ->
//                 preferenceService.isMutedForBoard(userId, boardId)
//              || preferenceService.isDoNotDisturbActive(userId));

//         return recipients;
//     }

//     // =========================================================
//     // INVITES (future)
//     // =========================================================

//     @Override
//     public Set<UUID> recipientsForInvite(UUID inviteId, UUID actorUserId) {
//         if (inviteId == null) return Set.of();

//         // 1) Invitees only
//         Set<UUID> recipients = new HashSet<>(inviteService.invitees(inviteId));

//         // 2) Don't notify the inviter about their own invite
//         if (actorUserId != null) recipients.remove(actorUserId);

//         // 3) Mutes/DND may or may not apply to invites; keep consistent:
//         recipients.removeIf(preferenceService::isDoNotDisturbActive);

//         return recipients;
//     }

//     // =========================================================
//     // CALENDAR (optional)
//     // =========================================================

//     @Override
//     public Set<UUID> recipientsForCalendarReminder(UUID calendarEventId) {
//         if (calendarEventId == null) return Set.of();

//         // Attendees whose reminder window is due now
//         Set<UUID> due = new HashSet<>(calendarService.attendeesDueForReminder(calendarEventId));
//         // Respect DND
//         due.removeIf(preferenceService::isDoNotDisturbActive);
//         return due;
//     }

//     // =========================================================
//     // BOT (optional)
//     // =========================================================

//     @Override
//     public Set<UUID> recipientsForBotReply(UUID botMessageId, UUID maybeTargetUserId) {
//         // Very simple rule: if a target user exists, notify them. Otherwise, none.
//         if (maybeTargetUserId == null) return Set.of();
//         if (preferenceService.isDoNotDisturbActive(maybeTargetUserId)) return Set.of();
//         return Set.of(maybeTargetUserId);
//     }

//     // =========================================================
//     // ----------- Domain service interfaces (stubs) -----------
//     // Define these in your app (or replace with your real services).
//     // Keeping them here as minimal contracts makes this file drop-in ready.
//     // =========================================================

//     public interface ConversationService {
//         Set<UUID> participantsOf(UUID directConversationId);
//     }

//     public interface ChannelService {
//         boolean canUserViewChannel(UUID userId, UUID channelId);
//     }

//     public interface BoardService {
//         Set<UUID> watchersAndOwners(UUID boardId);
//     }

//     public interface CardService {
//         Set<UUID> assigneesAndWatchers(UUID cardId);
//     }

//     public interface InviteService {
//         Set<UUID> invitees(UUID inviteId);
//     }

//     public interface CalendarService {
//         Set<UUID> attendeesDueForReminder(UUID calendarEventId);
//     }

//     public interface PreferenceService {
//         boolean isDoNotDisturbActive(UUID userId);

//         // Mutes per-scope; implement as needed in your app:
//         default boolean isMutedForDM(UUID userId, UUID directConversationId) { return false; }
//         default boolean isMutedForChannel(UUID userId, UUID channelId) { return false; }
//         default boolean isMutedForBoard(UUID userId, UUID boardId) { return false; }
//         default boolean isMutedForCard(UUID userId, UUID cardId) { return false; }
//     }
// }
