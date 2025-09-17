package com.hire_me.Ping.notifications.entity;

public enum NotificationType {
MESSAGE, // MVP: someone sent a direct message
MENTION, // later: you were @mentioned in a channel
CARD_UPDATE, // later: a Kanban card changed
BOARD_UPDATE, // later: a Kanban board changed
INVITE, // later: channel/board/calendar invite
BOT, // later: bot posted something for you
CALENDAR_EVENT // optional: calendar reminder
}
    
