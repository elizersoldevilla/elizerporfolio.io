/**
 * Coalescing frame scheduler for pointer-driven effects.
 *
 * Pointer events fire far more often than the display refreshes, so handlers
 * want to write at most once per frame. The usual `if (pending) return` latch has
 * a trap: requestAnimationFrame is deferred while the tab is hidden, so a
 * pointermove that schedules a frame and is then interrupted by a tab switch
 * leaves the latch stuck `true` and the effect is dead for the rest of the
 * session. Returning to the tab and hovering again does nothing.
 *
 * This scheduler treats a schedule older than STALE_MS as abandoned, so a
 * dropped frame heals itself, and clears pending work when the tab becomes
 * visible again.
 */

/** A schedule older than this is assumed to have been dropped. */
const STALE_MS = 100;

export interface FrameScheduler<T> {
  /** Queues `value`, collapsing repeat calls into a single frame. */
  (value: T): void;
  /** Runs any queued work immediately and clears the pending frame. */
  flush(): void;
}

export function createFrameScheduler<T>(write: (value: T) => void): FrameScheduler<T> {
  let handle = 0;
  let queuedAt = 0;
  let latest: T | undefined;

  const flush = () => {
    handle = 0;
    if (latest === undefined) return;
    const value = latest;
    latest = undefined;
    write(value);
  };

  const schedule = ((value: T) => {
    latest = value;

    const now = performance.now();
    if (handle && now - queuedAt < STALE_MS) return;

    // Either nothing was pending, or the previous schedule was dropped while the
    // tab was hidden. Cancel first so only one frame is ever outstanding.
    if (handle) cancelAnimationFrame(handle);
    queuedAt = now;
    handle = requestAnimationFrame(flush);
  }) as FrameScheduler<T>;

  schedule.flush = () => {
    if (handle) cancelAnimationFrame(handle);
    handle = 0;
    flush();
  };

  // A tab that regains visibility has no frame in flight, so drop the stale
  // latch and let the next event schedule normally.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    if (handle) cancelAnimationFrame(handle);
    handle = 0;
    latest = undefined;
  });

  return schedule;
}