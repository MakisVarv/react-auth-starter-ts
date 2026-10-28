const listeners: Set<() => void> = new Set();

export function subscribeToSessionExpired(handler: () => void): () => void {
  listeners.add(handler);

  return () => {
    listeners.delete(handler);
  };
}

export function notifySessionExpired() {
  for (const listener of listeners) {
    listener();
  }
}
