import { api, ApiService as ApiServiceClass } from './api';

export interface CalendarInfo {
  id: string;
  ownerId: string;
  defaultTimezone?: string;
  defaultReminderMinutes?: number | null;
}

export interface CalendarBootstrap {
  calendarId: string;
}

export interface EventResponse {
  id: string;
  calendarId: string;
  organizerId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  description?: string | null;
  location?: string | null;
  visibility: 'PRIVATE' | 'PUBLIC' | 'CHANNEL';
}

export interface EventCreateRequest {
  title: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  description?: string;
  location?: string;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'CHANNEL';
}

export interface EventUpdateRequest {
  title?: string;
  startsAt?: string;
  endsAt?: string;
  timezone?: string;
  description?: string | null;
  location?: string | null;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'CHANNEL';
}

const withUserId = (path: string, userId: string) => {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}userId=${encodeURIComponent(userId)}`;
};

export const calendarService = {
  async createOrGetMyCalendar(userId: string): Promise<CalendarBootstrap> {
    return api.post<CalendarBootstrap>(withUserId('/calendars/me', userId));
  },

  async getMyCalendar(userId: string): Promise<CalendarInfo> {
    return api.get<CalendarInfo>(withUserId('/calendars/me', userId));
  },

  async listEvents(userId: string, from: string, to: string): Promise<EventResponse[]> {
    const query = ApiServiceClass.buildQueryString({ from, to, userId });
    return api.get<EventResponse[]>(`/calendar/events${query}`);
  },

  async createEvent(userId: string, payload: EventCreateRequest): Promise<EventResponse> {
    return api.post<EventResponse>(withUserId('/calendar/events', userId), payload);
  },

  async deleteEvent(userId: string, eventId: string): Promise<void> {
    return api.delete<void>(withUserId(`/calendar/events/${eventId}`, userId));
  },

  async updateEvent(userId: string, eventId: string, payload: EventUpdateRequest): Promise<EventResponse> {
    return api.patch<EventResponse>(withUserId(`/calendar/events/${eventId}`, userId), payload);
  },
};
