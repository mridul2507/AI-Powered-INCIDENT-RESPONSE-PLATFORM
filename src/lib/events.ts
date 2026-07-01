import { logger } from "./logger";
type Listener = (data: unknown) => void;

const listeners = new Set<Listener>();

export function subscribe(listener: Listener) {
  listeners.add(listener);

  logger.info({
    event: "EVENT_SUBSCRIBED",
    totalListeners: listeners.size,
  });

  return () => listeners.delete(listener);
}

export function publish(data: unknown) {

  logger.info({
    event: "EVENT_PUBLISHED",
    listeners: listeners.size,
  });
  for (const listener of [...listeners]) {
    try {
      listener(data);
    } 
    
    catch (error) {
      logger.error({
        event: "EVENT_HANDLER_FAILED",
        error,
      });

      listeners.delete(listener);
    }
  }
}