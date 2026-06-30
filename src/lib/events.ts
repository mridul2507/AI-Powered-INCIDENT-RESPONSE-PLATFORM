type Listener = (data: unknown) => void;

const listeners = new Set<Listener>();

export function subscribe(listener: Listener) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function publish(data: unknown) {
  for (const listener of [...listeners]) {
    try {
      listener(data);
    } catch {
      listeners.delete(listener);
    }
  }
}