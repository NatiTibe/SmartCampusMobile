import api from './apiService';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4';

export type MobileEvent = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  status: string;
  registrationCount: number;
  isRegistered: boolean;
  image: string;
  raw: any;
};

export const formatStatus = (status?: string) => {
  const normalized = String(status || 'pending').toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const normalizeEvent = (event: any, extras: Partial<MobileEvent> = {}): MobileEvent => {
  const startDate = event?.startDate ? new Date(event.startDate) : null;
  const category = event?.category?.name || event?.category || 'General';
  const organizer = event?.organizedBy?.organizationName || event?.organizedBy?.fullName || event?.organizer;

  return {
    id: event?._id || event?.id || '',
    title: event?.title || 'Untitled Event',
    description: event?.description || '',
    category,
    location: event?.location || 'Campus',
    date: startDate ? startDate.toDateString() : event?.date || '',
    time: startDate
      ? startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : event?.startTime || event?.time || '',
    status: formatStatus(event?.status),
    registrationCount: event?.registrationCount || event?.registeredCount || 0,
    isRegistered: Boolean(event?.isRegistered),
    image: event?.imageUrl || event?.image || FALLBACK_IMAGE,
    raw: { ...event, organizer },
    ...extras,
  };
};

export const getApprovedEvents = async () => {
  const response = await api.get('/event/all-events');
  const events = response.data?.result || response.data?.events || [];
  return events.map((event: any) => normalizeEvent(event));
};

export const getEventDetails = async (eventId: string) => {
  const response = await api.get(`/event/single-event/${eventId}`);
  return {
    ...response.data,
    event: normalizeEvent(response.data?.event, {
      isRegistered: Boolean(response.data?.isRegistered),
      registrationCount: response.data?.registeredStudents?.length || response.data?.event?.registrationCount || 0,
    }),
  };
};

export const getStudentEvents = async () => {
  const response = await api.get('/student/my-events');
  return {
    popularEvents: (response.data?.popularEvents || []).map((event: any) => normalizeEvent(event)),
    registeredEvents: (response.data?.registeredEvents || []).map((item: any) => {
      const event = item?.event || item?.eventId || item;
      return normalizeEvent(event, { isRegistered: true });
    }),
    interestedEvents: (response.data?.interestedEvents || []).map((item: any) => {
      const event = item?.event || item?.eventId || item;
      return normalizeEvent(event);
    }),
    previouslyAttendedEvents: (response.data?.previouslyAttendedEvents || []).map((item: any) => {
      const event = item?.event || item?.eventId || item;
      return normalizeEvent(event);
    }),
  };
};

export const getCalendarEvents = async (month: number, year: number) => {
  const response = await api.get('/student/calendar', { params: { month, year } });
  return (response.data?.calendarEvents || []).map((item: any) => {
    const event = item?.event || item?.eventId || item;
    return normalizeEvent(event, { isRegistered: true });
  });
};

export const getAiRecommendations = async () => {
  const response = await api.get('/student/recommendations');
  return (response.data?.recommendations || []).map((item: any) => {
    const event = item?.event || item?.eventId || item;
    return {
      ...normalizeEvent(event),
      reason: item?.reason || item?.explanation || 'Recommended based on your activity.',
      match: item?.score ? `${Math.round(item.score)}%` : item?.match || 'AI',
    };
  });
};

export const registerForEvent = async (eventId: string) => {
  const response = await api.post(`/registration/register/${eventId}`);
  return response.data;
};

export const unregisterFromEvent = async (eventId: string) => {
  const response = await api.delete(`/registration/unregister/${eventId}`);
  return response.data;
};
