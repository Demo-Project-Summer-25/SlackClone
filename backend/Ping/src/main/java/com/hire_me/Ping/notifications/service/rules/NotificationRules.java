package com.hire_me.Ping.notifications.service.rules;

import java.util.Set;
import java.util.UUID;

/**
 * NotificationRules = "WHO should get notified?" policy.
 * It does NOT save anything and does NOT push WebSockets.
 * It only returns the SET of recipient user IDs.
 *
 * Why a Set<UUID>? It automatically removes duplicates.
 */
public interface NotificationRules {

    // ======== CHAT (MVP + near-future) ========

    /**
     * Direct Message: notify all participants except the sender (actor).
     * Example: DM(Alice,Bob), actor=Alice -> recipients = [Bob]
     */
    Set<UUID> recipientsForDirectMessage(UUID directConversationId, UUID actorUserId);

    /**
     * Channel @mention: notify ONLY the mentioned users who can see the channel.
     * Example: #general, @bob mentioned -> recipients = [Bob]
     */
    Set<UUID> recipientsForChannelMention(UUID channelId, UUID actorUserId, Set<UUID> mentionedUserIds);

    // ======== KANBAN (future) ========

    /**
     * Card update: notify assignees/watchers (exclude the actor).
     * Example: Card #123 moved, actor=Alice -> recipients = { card assignees & watchers } \ Alice
     */
    Set<UUID> recipientsForCardUpdate(UUID cardId, UUID actorUserId);

    /**
     * Board update: notify board watchers/owners (exclude the actor).
     */
    Set<UUID> recipientsForBoardUpdate(UUID boardId, UUID actorUserId);

    // ======== INVITES (future) ========

    /**
     * Invite created: notify the invitee(s) ONLY.
     */
    Set<UUID> recipientsForInvite(UUID inviteId, UUID actorUserId);

    // ======== CALENDAR (optional) ========

    /**
     * Calendar reminder: notify attendees whose reminder time has arrived.
     */
    Set<UUID> recipientsForCalendarReminder(UUID calendarEventId);

    // ======== BOT (optional) ========

    /**
     * Bot reply: notify the targeted user(s), skip the actor if none or same.
     */
    Set<UUID> recipientsForBotReply(UUID botMessageId, UUID maybeTargetUserId);
}


