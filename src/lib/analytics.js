export const ANALYTICS_STORAGE_KEY = 'jungle-adventure-analytics-v1';
export const MAX_STORED_EVENTS = 200;

export const loadAnalyticsEvents = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawEvents = window.localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!rawEvents) {
      return [];
    }
    const parsed = JSON.parse(rawEvents);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Unable to read Jungle Adventure analytics events.', error);
    return [];
  }
};

export const trackAnalyticsEvent = (event, payload = {}) => {
  if (typeof window === 'undefined') {
    return [];
  }

  const nextEvent = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  };

  const nextEvents = [...loadAnalyticsEvents(), nextEvent].slice(-MAX_STORED_EVENTS);
  window.localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(nextEvents));
  return nextEvents;
};

export const clearAnalyticsEvents = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(ANALYTICS_STORAGE_KEY);
};
