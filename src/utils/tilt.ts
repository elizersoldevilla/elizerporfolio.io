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

/**
 * Reveals every still-hidden fade card that is on screen.
 *
 * Content must never be permanently invisible: a card whose container is
 * collapsed (the portfolio filter) will never satisfy its observer, so the
 * load pass is the backstop that guarantees readability.
 */
function revealOnLoad(): void {
  for (const el of document.querySelectorAll<HTMLElement>('.card-fade:not(.is-visible)')) {
    if (isOnScreen(el)) el.classList.add('is-visible');
  }
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
      const show = () => el.classList.add('is-visible');

      const reveal = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            show();
            reveal.unobserve(entry.target);
          }
        },
        { threshold: 0.12 }
      );
      reveal.observe(el);

      /*
       * A card inside a collapsed container (the portfolio filter hides
       * non-matching panels) can never intersect the viewport, so it would stay
       * at opacity 0. Components that show such a card dispatch
       * `portfolio:reveal` on it. The load-time pass below then catches anything
       * still hidden once layout has settled, so content is never unreachable.
       */
      el.addEventListener('portfolio:reveal', show);

      /*
       * Reveal anything already on screen at load.
       *
       * A bare requestAnimationFrame is unreliable here: rAF callbacks are
       * throttled or skipped while the tab is backgrounded or the page is
       * still settling, which left cards stuck at opacity 0. The observer above
       * normally covers on-screen cards, but an explicit check on load plus a
       * load-event pass guarantees it.
       */
      if (isOnScreen(el)) show();

      if (document.readyState === 'complete') revealOnLoad();
      else window.addEventListener('load', revealOnLoad, { once: true });
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
}