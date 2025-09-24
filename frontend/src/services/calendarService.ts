import { apiService } from './api';

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
    return apiService.post<CalendarBootstrap>(withUserId('/api/calendars/me', userId));
  },

  async getMyCalendar(userId: string): Promise<CalendarInfo> {
    return apiService.get<CalendarInfo>(withUserId('/api/calendars/me', userId));
  },

  async listEvents(userId: string, from: string, to: string): Promise<EventResponse[]> {
    const query = apiService.buildQueryString({ from, to, userId });
    return apiService.get<EventResponse[]>(`/api/calendar/events${query}`);
  },

  async createEvent(userId: string, payload: EventCreateRequest): Promise<EventResponse> {
    return apiService.post<EventResponse>(withUserId('/api/calendar/events', userId), payload);
  },

  async deleteEvent(userId: string, eventId: string): Promise<void> {
    return apiService.delete<void>(withUserId(`/api/calendar/events/${eventId}`, userId));
  },

  async updateEvent(userId: string, eventId: string, payload: EventUpdateRequest): Promise<EventResponse> {
    return apiService.patch<EventResponse>(withUserId(`/api/calendar/events/${eventId}`, userId), payload);
  },
};
