import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { calendarService, EventResponse } from '../../services/calendarService';
import { useAuth } from '../../hooks/useAuth';

interface CalendarComponentProps {
  isInSplitMode?: boolean;
}

type CalendarEventDetails = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  timeLabel: string;
  visibility: EventResponse["visibility"];
};

type NormalizedEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  time: string;
  timeLabel: string;
  dateLabel: string;
  description?: string;
  location?: string;
  visibility: EventResponse["visibility"];
};

interface EventType {
  id: string;
  name: string;
  description: string;
  colorClass: string;
  defaultDuration: number; // in minutes
}

const EVENT_TYPES: EventType[] = [
  {
    id: 'meeting',
    name: 'Team Meeting',
    description: 'Regular team sync or planning meeting',
    colorClass: 'bg-blue-500',
    defaultDuration: 60
  },
  {
    id: 'review',
    name: 'Code Review',
    description: 'Peer code review session',
    colorClass: 'bg-green-500',
    defaultDuration: 30
  },
  {
    id: 'planning',
    name: 'Sprint Planning',
    description: 'Sprint planning and estimation',
    colorClass: 'bg-purple-500',
    defaultDuration: 120
  },
  {
    id: 'standup',
    name: 'Daily Standup',
    description: 'Daily team standup meeting',
    colorClass: 'bg-yellow-500',
    defaultDuration: 15
  },
  {
    id: 'demo',
    name: 'Demo/Presentation',
    description: 'Feature demo or presentation',
    colorClass: 'bg-red-500',
    defaultDuration: 45
  },
  {
    id: 'retrospective',
    name: 'Retrospective',
    description: 'Sprint retrospective meeting',
    colorClass: 'bg-indigo-500',
    defaultDuration: 90
  },
  {
    id: 'workshop',
    name: 'Workshop/Training',
    description: 'Learning session or workshop',
    colorClass: 'bg-pink-500',
    defaultDuration: 180
  },
  {
    id: 'interview',
    name: 'Interview',
    description: 'Technical interview or candidate screening',
    colorClass: 'bg-orange-500',
    defaultDuration: 60
  },
  {
    id: 'custom',
    name: 'Custom Event',
    description: 'Create your own event type',
    colorClass: 'bg-gray-500',
    defaultDuration: 60
  }
];

export function CalendarComponent({ isInSplitMode = false }: CalendarComponentProps) {
  const { currentUser, isLoading: authLoading } = useAuth();
  
  // State management
  const today = useMemo(() => new Date(), []);
  const [monthDate, setMonthDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [eventsRaw, setEventsRaw] = useState<EventResponse[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isDayEventsOpen, setIsDayEventsOpen] = useState(false);
  const [dayDialogDay, setDayDialogDay] = useState<number | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [eventError, setEventError] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [newEventForm, setNewEventForm] = useState({
    title: "",
    eventType: "custom",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    location: "",
    visibility: "PRIVATE" as EventResponse["visibility"],
  });

  const [showPresets, setShowPresets] = useState(true);

  // Calendar calculations
  const monthLabel = monthDate.toLocaleString(undefined, { month: "long", year: "numeric" });
  const monthShort = monthDate.toLocaleString(undefined, { month: "short" });
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const daysArray = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);
  const startOffset = useMemo(() => {
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    return (firstDay.getDay() + 6) % 7; // convert Sunday=0 to Monday=0
  }, [monthDate]);
  
  const calendarCells = useMemo(() => {
    const cells: Array<number | null> = [];
    for (let i = 0; i < startOffset; i += 1) {
      cells.push(null);
    }
    daysArray.forEach(day => cells.push(day));
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    return cells;
  }, [daysArray, startOffset]);

  // Formatters
  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }),
    []
  );
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }),
    []
  );
  const timezoneId = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC", []);

  // Event processing
  const normalizedEvents = useMemo<NormalizedEvent[]>(() => {
    return eventsRaw
      .map(event => {
        const start = new Date(event.startsAt);
        const end = new Date(event.endsAt);
        return {
          id: event.id,
          title: event.title,
          start,
          end,
          time: timeFormatter.format(start),
          timeLabel: timeFormatter.format(start),
          dateLabel: dateFormatter.format(start),
          visibility: event.visibility,
          description: event.description || undefined,
          location: event.location || undefined,
        };
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [eventsRaw, timeFormatter, dateFormatter]);

  const eventsByDay = useMemo<Record<number, CalendarEventDetails[]>>(() => {
    const grouped: Record<number, CalendarEventDetails[]> = {};
    normalizedEvents.forEach(event => {
      const day = event.start.getDate();
      const entry: CalendarEventDetails = {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        timeLabel: event.time,
        visibility: event.visibility,
      };
      grouped[day] = grouped[day] ? [...grouped[day], entry] : [entry];
    });
    Object.values(grouped).forEach(list => list.sort((a, b) => a.start.getTime() - b.start.getTime()));
    return grouped;
  }, [normalizedEvents]);

  const upcomingEvents = useMemo(() => normalizedEvents.slice(0, 4), [normalizedEvents]);

  const dayDialogEvents = useMemo(() => {
    if (dayDialogDay === null) return [] as NormalizedEvent[];
    return normalizedEvents.filter(event => event.start.getDate() === dayDialogDay);
  }, [normalizedEvents, dayDialogDay]);

  // Event handlers
  const fetchEvents = useCallback(async () => {
    if (!currentUser?.id) return;
    setEventsLoading(true);
    setEventsError(null);
    try {
      const from = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).toISOString();
      const to = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1).toISOString();
      
      // First, try to get existing calendar, only create if it doesn't exist
      try {
        await calendarService.getMyCalendar(currentUser.id);
      } catch (error) {
        // Calendar doesn't exist, create it
        console.log('Calendar not found, creating new one...');
        await calendarService.createOrGetMyCalendar(currentUser.id);
      }
      
      const events = await calendarService.listEvents(currentUser.id, from, to);
      setEventsRaw(events);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load events.";
      setEventsError(message);
      toast.error(message);
      setEventsRaw([]);
    } finally {
      setEventsLoading(false);
    }
  }, [currentUser?.id, monthDate]);

  const shiftMonth = (delta: number) => {
    setMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const formatDateForInput = useCallback((date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddEventOpen(open);
    if (!open) {
      setEventError(null);
      setEditingEventId(null);
      setShowPresets(true);
    }
  };

  const handleOpenAddEvent = () => {
    const baseDay = selectedDate ?? today.getDate();
    const targetDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), baseDay);
    setNewEventForm({
      title: "",
      eventType: "custom",
      date: formatDateForInput(targetDate),
      startTime: "09:00",
      endTime: "10:00",
      description: "",
      location: "",
      visibility: "PRIVATE",
    });
    setShowPresets(true);
    setEventError(null);
    setIsAddEventOpen(true);
  };

  const handlePresetSelect = (eventType: EventType) => {
    const baseDay = selectedDate ?? today.getDate();
    const targetDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), baseDay);
    
    // Calculate end time based on default duration
    const startTime = "09:00";
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);
    
    const endDate = new Date(startDate.getTime() + eventType.defaultDuration * 60000);
    const endTime = endDate.toTimeString().slice(0, 5);

    setNewEventForm({
      title: eventType.name,
      eventType: eventType.id,
      date: formatDateForInput(targetDate),
      startTime: startTime,
      endTime: endTime,
      description: eventType.description,
      location: "",
      visibility: "PRIVATE",
    });
    setShowPresets(false);
  };

  const handleOpenEditEvent = (event: NormalizedEvent) => {
    const startLocal = event.start;
    const endLocal = event.end;
    const formatTimeForInput = (date: Date) =>
      date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    // Extract event type from description if it exists
    const eventTypeMatch = event.description?.match(/^\[(\w+)\]/);
    const eventTypeId = eventTypeMatch ? eventTypeMatch[1] : 'custom';
    const cleanDescription = event.description?.replace(/^\[\w+\]\s*/, '') || '';

    setNewEventForm({
      title: event.title,
      eventType: eventTypeId,
      date: formatDateForInput(startLocal),
      startTime: formatTimeForInput(startLocal),
      endTime: formatTimeForInput(endLocal),
      description: cleanDescription,
      location: event.location || "",
      visibility: event.visibility,
    });
    setEditingEventId(event.id);
    setShowPresets(false);
    setEventError(null);
    setIsAddEventOpen(true);
  };

  const handleCreateEvent = async () => {
    if (!currentUser?.id) return;
    const { title, date, startTime, endTime, description, location, visibility, eventType } = newEventForm;

    if (!title.trim()) {
      setEventError("Title is required.");
      return;
    }

    if (!date || !startTime || !endTime) {
      setEventError("Date and time are required.");
      return;
    }

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    if (!(end.getTime() > start.getTime())) {
      setEventError("End time must be after start time.");
      return;
    }

    setSubmittingEvent(true);
    try {
      const startIso = start.toISOString();
      const endIso = end.toISOString();

      // Include event type in description for storage
      const eventTypePrefix = eventType !== 'custom' ? `[${eventType}] ` : '';
      const fullDescription = eventTypePrefix + (description ? description.trim() : '');

      if (editingEventId) {
        const updated = await calendarService.updateEvent(currentUser.id, editingEventId, {
          title: title.trim(),
          startsAt: startIso,
          endsAt: endIso,
          timezone: timezoneId,
          description: fullDescription || null,
          location: location ? location.trim() : null,
          visibility,
        });

        const updatedStart = new Date(updated.startsAt);
        const staysInMonth =
          updatedStart.getFullYear() === monthDate.getFullYear() &&
          updatedStart.getMonth() === monthDate.getMonth();

        setEventsRaw(prev => {
          const filtered = prev.filter(event => event.id !== updated.id);
          return staysInMonth ? [...filtered, updated] : filtered;
        });

        if (!staysInMonth) {
          setMonthDate(new Date(updatedStart.getFullYear(), updatedStart.getMonth(), 1));
        }

        toast.success("Event updated.");
      } else {
        const created = await calendarService.createEvent(currentUser.id, {
          title: title.trim(),
          startsAt: startIso,
          endsAt: endIso,
          timezone: timezoneId,
          description: fullDescription || undefined,
          location: location ? location.trim() : undefined,
          visibility,
        });

        toast.success("Event created.");
        const createdStart = new Date(created.startsAt);
        if (
          createdStart.getFullYear() === monthDate.getFullYear() &&
          createdStart.getMonth() === monthDate.getMonth()
        ) {
          setEventsRaw(prev => [...prev, created]);
        } else {
          setMonthDate(new Date(createdStart.getFullYear(), createdStart.getMonth(), 1));
        }
      }

      setIsAddEventOpen(false);
      setEventError(null);
      setEditingEventId(null);
      setShowPresets(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create event.";
      setEventError(message);
      toast.error(message);
    } finally {
      setSubmittingEvent(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!currentUser?.id) return;
    const target = eventsRaw.find(event => event.id === eventId);
    setDeletingEventId(eventId);
    try {
      await calendarService.deleteEvent(currentUser.id, eventId);
      setEventsRaw(prev => prev.filter(event => event.id !== eventId));
      toast.success("Event deleted.");

      if (target) {
        const eventDay = new Date(target.startsAt).getDate();
        const remaining = eventsRaw.filter(event => event.id !== eventId && new Date(event.startsAt).getDate() === eventDay);
        if (remaining.length === 0) {
          setIsDayEventsOpen(false);
          setDayDialogDay(null);
          if (selectedDate === eventDay) {
            setSelectedDate(null);
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete event.";
      toast.error(message);
    } finally {
      setDeletingEventId(null);
    }
  };

  const handleOpenDayEvents = (day: number) => {
    setSelectedDate(day);
    setDayDialogDay(day);
    setIsDayEventsOpen(true);
  };

  // Color function that uses both visibility and event type
  const getEventColor = (visibility: EventResponse["visibility"], eventTypeId?: string) => {
    // If we have an event type, use its color
    if (eventTypeId) {
      const eventType = EVENT_TYPES.find(type => type.id === eventTypeId);
      if (eventType) {
        return eventType.colorClass;
      }
    }
    
    // Fallback to visibility-based colors
    switch (visibility) {
      case "PUBLIC":
        return "bg-green-500";
      case "CHANNEL":
        return "bg-orange-500";
      default:
        return "bg-blue-500";
    }
  };

  // Helper function to extract event type from description
  const extractEventType = (description?: string | null) => {
    if (!description) return undefined;
    const eventTypeMatch = description.match(/^\[(\w+)\]/);
    return eventTypeMatch ? eventTypeMatch[1] : undefined;
  };

  // Stats widget component
  const StatsWidget = () => {
    // Get this week's stats
    const weekStats = useMemo(() => {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (now.getDay() || 7) + 1); // Monday
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekEvents = normalizedEvents.filter(event => 
        event.start >= weekStart && event.start <= weekEnd
      );

      const totalMinutes = weekEvents.reduce((total, event) => {
        const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
        return total + duration;
      }, 0);

      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.round(totalMinutes % 60);

      return {
        totalEvents: weekEvents.length,
        hours,
        minutes,
        formattedTime: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      };
    }, [normalizedEvents]);

    return (
      <Card>
        <CardHeader>
          <CardTitle>This Week</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{weekStats.totalEvents}</p>
                <p className="text-xs text-muted-foreground">Events</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{weekStats.formattedTime}</p>
                <p className="text-xs text-muted-foreground">Time</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Effects
  useEffect(() => {
    if (!authLoading) {
      fetchEvents();
    }
  }, [authLoading, fetchEvents]);

  useEffect(() => {
    if (selectedDate && selectedDate > daysInMonth) {
      setSelectedDate(null);
    }
  }, [selectedDate, daysInMonth]);

  useEffect(() => {
    if (!isDayEventsOpen) {
      setDayDialogDay(null);
    }
  }, [isDayEventsOpen]);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl mb-2">Calendar</h2>
          <p className="text-muted-foreground">Manage your development schedule</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleOpenAddEvent}
            disabled={eventsLoading || submittingEvent || !currentUser}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {eventsError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {eventsError}
        </div>
      )}

      {/* Event Creation/Edit Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEventId ? 'Edit Event' : 'Add Event'}</DialogTitle>
          </DialogHeader>
          
          {/* Preset Event Types Selection - More Compact */}
          {showPresets && !editingEventId && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium mb-2">Choose an event type:</h3>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {EVENT_TYPES.map(eventType => (
                    <button
                      key={eventType.id}
                      onClick={() => handlePresetSelect(eventType)}
                      className="flex flex-col items-center gap-2 p-2 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full ${eventType.colorClass} flex-shrink-0`} />
                      <div className="text-center">
                        <p className="text-xs font-medium">{eventType.name}</p>
                        <p className="text-xs text-muted-foreground">{eventType.defaultDuration}min</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPresets(false)}
                  size="sm"
                >
                  Skip & Create Custom
                </Button>
              </div>
            </div>
          )}

          {/* Event Form - More Compact */}
          {!showPresets && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {/* Event Type Indicator */}
              {newEventForm.eventType !== 'custom' && (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <div className={`w-3 h-3 rounded-full ${EVENT_TYPES.find(t => t.id === newEventForm.eventType)?.colorClass}`} />
                  <span className="text-sm text-muted-foreground">
                    {EVENT_TYPES.find(t => t.id === newEventForm.eventType)?.name}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowPresets(true)}
                    className="ml-auto"
                  >
                    Change Type
                  </Button>
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-xs font-medium">Title</Label>
                <Input
                  value={newEventForm.title}
                  onChange={e => setNewEventForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Event title"
                  className="h-8"
                />
              </div>
              
              <div className="grid gap-2 grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Date</Label>
                  <Input
                    type="date"
                    value={newEventForm.date}
                    onChange={e => setNewEventForm(prev => ({ ...prev, date: e.target.value }))}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Start Time</Label>
                  <Input
                    type="time"
                    value={newEventForm.startTime}
                    onChange={e => setNewEventForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">End Time</Label>
                  <Input
                    type="time"
                    value={newEventForm.endTime}
                    onChange={e => setNewEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Location</Label>
                  <Input
                    value={newEventForm.location}
                    onChange={e => setNewEventForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Optional"
                    className="h-8"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs font-medium">Description</Label>
                <Textarea
                  rows={2}
                  value={newEventForm.description}
                  onChange={e => setNewEventForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional details"
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs font-medium">Visibility</Label>
                <select
                  className="w-full rounded border border-input bg-background px-2 py-1 text-sm h-8"
                  value={newEventForm.visibility}
                  onChange={e =>
                    setNewEventForm(prev => ({
                      ...prev,
                      visibility: e.target.value as EventResponse["visibility"],
                    }))
                  }
                >
                  <option value="PRIVATE">Private</option>
                  <option value="PUBLIC">Public</option>
                  <option value="CHANNEL">Channel</option>
                </select>
              </div>
              
              {eventError && <p className="text-xs text-red-600">{eventError}</p>}
              
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => handleDialogOpenChange(false)} disabled={submittingEvent} size="sm">
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent} disabled={submittingEvent} size="sm">
                  {submittingEvent ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Day Events Dialog */}
      <Dialog open={isDayEventsOpen} onOpenChange={setIsDayEventsOpen}>
        <DialogContent className="max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dayDialogDay !== null
                ? `Events for ${monthShort} ${dayDialogDay}`
                : "Events"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {eventsLoading ? (
              <p className="text-sm text-muted-foreground">Loading events…</p>
            ) : dayDialogEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
            ) : (
              dayDialogEvents.map(event => {
                const eventTypeId = extractEventType(event.description);
                const eventType = EVENT_TYPES.find(t => t.id === eventTypeId);
                
                return (
                  <div key={event.id} className="border rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getEventColor(event.visibility, eventTypeId)}`} />
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.timeLabel} • {event.dateLabel}
                          </p>
                          {eventType && (
                            <p className="text-xs text-muted-foreground">
                              {eventType.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditEvent(event)}
                          disabled={submittingEvent}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={deletingEventId === event.id}
                        >
                          {deletingEventId === event.id ? "Deleting…" : "Delete"}
                        </Button>
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground">
                        {event.description.replace(/^\[\w+\]\s*/, '')}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-xs text-muted-foreground">Location: {event.location}</p>
                    )}
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {event.visibility}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar Layout */}
      <div className={`${isInSplitMode ? 'space-y-6' : 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {/* Calendar Grid */}
        <div className={isInSplitMode ? '' : 'lg:col-span-2'}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{monthLabel}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => shiftMonth(-1)} aria-label="Previous month">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => shiftMonth(1)} aria-label="Next month">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {days.map(day => (
                  <div key={day} className="p-2 text-center text-sm text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((cell, index) => {
                  if (cell === null) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="min-h-[60px] rounded border border-transparent"
                      />
                    );
                  }

                  const day = cell;
                  const dayEvents = eventsByDay[day] || [];
                  const isSelected = selectedDate === day;
                  const isToday =
                    monthDate.getFullYear() === today.getFullYear() &&
                    monthDate.getMonth() === today.getMonth() &&
                    day === today.getDate();

                  const cellClasses = [
                    "min-h-[60px] p-1 border rounded cursor-pointer transition-colors",
                    isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/50",
                    isToday ? "ring-2 ring-primary" : "",
                  ].join(" ");

                  return (
                    <div key={day} className={cellClasses} onClick={() => handleOpenDayEvents(day)}>
                      <div className={`text-sm ${isToday ? 'font-semibold text-primary' : ''}`}>{day}</div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => {
                          const eventTypeId = extractEventType(normalizedEvents.find(e => e.id === event.id)?.description);
                          return (
                            <div
                              key={event.id}
                              className={`w-full h-1.5 rounded ${getEventColor(event.visibility, eventTypeId)}`}
                            />
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{dayEvents.length - 2}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {eventsLoading && (
                <div className="mt-4 text-sm text-muted-foreground">Loading events…</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Event Details - Stacked below calendar in split mode */}
        <div className="space-y-4">
          {selectedDate && eventsByDay[selectedDate] ? (
            // When showing selected date events
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Events for {selectedDate} {monthShort}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {eventsByDay[selectedDate].map(event => {
                    const eventTypeId = extractEventType(normalizedEvents.find(e => e.id === event.id)?.description);
                    const eventType = EVENT_TYPES.find(t => t.id === eventTypeId);
                    
                    return (
                      <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${getEventColor(event.visibility, eventTypeId)}`} />
                        <div className="flex-1">
                          <p className="text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.timeLabel}</p>
                          {eventType && (
                            <p className="text-xs text-muted-foreground">
                              {eventType.name}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              <StatsWidget />
            </>
          ) : (
            // When showing upcoming events
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {eventsLoading ? "Loading events…" : "No events scheduled."}
                    </p>
                  ) : (
                    upcomingEvents.map(event => {
                      const eventTypeId = extractEventType(event.description);
                      
                      return (
                        <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${getEventColor(event.visibility, eventTypeId)}`} />
                          <div className="flex-1">
                            <p className="text-sm">{event.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{event.timeLabel}</span>
                              <span>•</span>
                              <span>{event.dateLabel}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              <StatsWidget />
            </>
          )}
        </div>
      </div>
    </div>
  );
}