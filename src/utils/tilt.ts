/**
 * Pointer-driven 3D tilt.
 *
 * Rotates an element toward the cursor on its X/Y axes and lifts it slightly in
 * Z, which reads as physical depth without moving the page layout (the
 * perspective lives on a wrapper, so nothing reflows).
 *
 * Deliberately restrained: small max rotation, and the effect is skipped
 * entirely for coarse pointers and for anyone who asked for reduced motion.
 * Content must stay fully readable, so tilt is decorative only and is never
 * the sole way to see something.
 */

import { createFrameScheduler } from '@/utils/frame';

const MAX_TILT = 7; // degrees; enough to read as 3D, not enough to distort text
const LIFT = 14; // px of Z translation
const SCALE = 1.012;

interface TiltOptions {
  /** Re-applies the effect when the element enters the viewport. */
  enter?: 'none' | 'lift';
  /** Max rotation in degrees. */
  max?: number;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function finePointer(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** True when the element currently overlaps the viewport. */
function isOnScreen(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return false;
  return r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth;
}

/*
 * Reveal sweep.
 *
 * IntersectionObserver drives the scroll-linked timing, but it is not on its own
 * trustworthy: delivery depends on the rendering lifecycle, so a card can be
 * scrolled past without ever being reported as intersecting and would sit at
 * opacity 0. The sweep is the deterministic backstop. It only ever looks at the
 * shrinking set of cards that are still hidden, so the steady-state cost is a
 * single empty set, and it stops for good once everything is revealed.
 */
const pending = new Set<HTMLElement>();
let sweepQueued = false;

function sweep(): void {
  sweepQueued = false;
  for (const el of [...pending]) {
    if (isOnScreen(el)) {
      el.classList.add('is-visible');
      pending.delete(el);
    }
  }
}

function queueSweep(): void {
  if (sweepQueued) return;
  sweepQueued = true;
  // setTimeout rather than rAF: rAF is suspended in a background tab, and this
  // is exactly the case where a card must not be left hidden.
  setTimeout(sweep, 60);
}

function watchForReveal(el: HTMLElement, show: () => void): void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show();
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12 }
  );
  observer.observe(el);

  pending.add(el);
  if (isOnScreen(el)) show();

  const showAndStop = () => {
    show();
    pending.delete(el);
  };
  el.addEventListener('portfolio:reveal', showAndStop);
}

export function initTilt(root: ParentNode = document): void {
  const targets = root.querySelectorAll<HTMLElement>('[data-tilt]:not([data-tilt-ready])');
  if (!targets.length) return;

  for (const el of targets) {
    const opts: TiltOptions = {
      enter: (el.dataset.tilt as TiltOptions['enter']) ?? 'none',
      max: Number(el.dataset.tiltMax ?? MAX_TILT),
    };
    const wrapper = el.closest<HTMLElement>('[data-tilt-perspective]') ?? el;

    /*
     * Entrance reveal.
     *
     * Cards carry `.card-fade` (opacity only) rather than an `animate-*` class:
     * a running CSS animation outranks inline styles in the cascade, so it would
     * permanently own `transform` and the tilt below could never show. Fading
     * opacity instead lets the two effects compose.
     *
     * This runs for everyone, including reduced-motion users. Bailing out early
     * would leave their cards stuck at opacity 0, i.e. invisible content.
     */
    if (el.classList.contains('card-fade')) {
      watchForReveal(el, () => el.classList.add('is-visible'));
    }

    const reset = () => {
      el.style.transform = '';
      el.style.setProperty('--tilt-shadow', '');
    };

    /*
     * Pointer tilt is opt-in per environment. Coarse pointers (touch) have no
     * hover, and reduced-motion users asked for none of this, so in both cases
     * the element stays flat and static.
     */
    if (!finePointer() || prefersReducedMotion()) {
      el.dataset.tiltReady = 'static';
      return;
    }

    el.dataset.tiltReady = 'true';

    /*
     * Coalesce pointermove into one write per frame via the shared scheduler.
     * The scheduler heals itself if a frame is dropped, which a plain
     * `if (frame) return` latch cannot do: rAF is deferred while the tab is
     * hidden, so hovering a card and then switching tabs left the latch stuck
     * and tilt was dead for the rest of the session.
     */
    const schedule = createFrameScheduler<{ x: number; y: number }>(({ x, y }) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;

      // Normalised cursor position within the element, -0.5..0.5.
      // x/y are viewport coordinates, and the rect is viewport-relative.
      const px = (x - r.left) / r.width - 0.5;
      const py = (y - r.top) / r.height - 0.5;

      // RotateY follows horizontal cursor, rotateX inverts vertical so the
      // surface appears to tip away from the pointer.
      const rotateY = px * opts.max! * 2;
      const rotateX = -py * opts.max! * 2;

      el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) translateZ(${LIFT}px) scale(${SCALE})`;

      // Shadow shifts opposite the tilt so the light source stays put.
      el.style.setProperty('--tilt-shadow', `${(-rotateY / 2).toFixed(1)}px ${(
        rotateX / 2 + 6
      ).toFixed(1)}px 30px rgba(2, 8, 23, 0.16)`);
    });

    el.addEventListener('pointermove', (e) => {
      // Page coordinates, converted to the viewport frame the handler reads.
      schedule({ x: e.clientX, y: e.clientY });
    });

    el.addEventListener('pointerleave', () => {
      schedule.flush();
      reset();
    });
    el.addEventListener('blur', reset);

    if (opts.enter === 'lift') {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              el.classList.add('is-tilting');
              io.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.25 }
      );
      io.observe(el);
    }
  }

  if (!pending.size) return;

  /*
   * Sweep on scroll and resize. Both are passive, and the handler is a single
   * boolean check once everything has been revealed.
   */
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });

  /*
   * Final backstop: after the page has settled, reveal anything left.
   *
   * By this point a reader has had time to scroll; leaving a card hidden because
   * an observer did not fire is far worse than showing it without the
   * scroll-linked timing. Cards still far below the fold appear when reached,
   * via the sweep above.
   */
  const revealAll = () => {
    for (const el of [...pending]) {
      el.classList.add('is-visible');
      pending.delete(el);
    }
  };

  const startTimers = () => {
    queueSweep();
    window.setTimeout(revealAll, 1500);
    window.setTimeout(revealAll, 4000);
  };

  if (document.readyState === 'complete') startTimers();
  else window.addEventListener('load', startTimers, { once: true });
}