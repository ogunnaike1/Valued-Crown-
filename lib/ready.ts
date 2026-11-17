// Gate for entrance animations: fires once the preloader has exited.
let isReady = false;
const listeners = new Set<() => void>();

export function markReady() {
  if (isReady) return;
  isReady = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function onReady(fn: () => void) {
  if (isReady) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Called when a page transition starts, so the next page's entrance animations wait for the curtain. */
export function resetReady() {
  isReady = false;
}
