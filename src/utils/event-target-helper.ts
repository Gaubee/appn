export const event_target_on = <T extends Event = Event>(target: EventTarget, eventName: string, callback: (event: T) => void) => {
  target.addEventListener(eventName, callback as EventListener);
  return () => target.removeEventListener(eventName, callback as EventListener);
};
