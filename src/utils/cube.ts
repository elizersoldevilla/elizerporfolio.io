/**
 * Pocket Cube (2x2) state and move logic.
 *
 * Pure functions over a plain data model so it can be unit tested without a
 * DOM. Rendering (CSS 3D transforms) lives in the Astro component and derives
 * every transform from the state produced here.
 *
 * Coordinate system: right-handed, x right, y up, z toward the viewer.
 * Corner positions use -1 / +1 only (that is what makes it a 2x2).
 */

export type Vec3 = readonly [number, number, number];

export interface Sticker {
  /** Which corner this sticker sits on. */
  readonly pos: Vec3;
  /** Outward face direction of the sticker. */
  readonly nrm: Vec3;
  /** Index into FACE_NORMALS / PALETTE; changes as layers turn. */
  color: number;
}

export interface CubeState {
  stickers: Sticker[];
  moves: number;
}

/** Face order is fixed and used for both normals and palette lookups. */
export const FACE = {
  U: 0,
  D: 1,
  F: 2,
  B: 3,
  R: 4,
  L: 5,
} as const;

export const FACE_NAMES = ['U', 'D', 'F', 'B', 'R', 'L'] as const;
export type FaceName = (typeof FACE_NAMES)[number];

export const FACE_NORMALS: readonly Vec3[] = [
  [0, 1, 0], // U
  [0, -1, 0], // D
  [0, 0, 1], // F
  [0, 0, -1], // B
  [1, 0, 0], // R
  [-1, 0, 0], // L
];

export const PALETTE = ['#f1f5f9', '#facc15', '#22c55e', '#3b82f6', '#ef4444', '#f97316'] as const;

export const MOVE_AXIS: Readonly<Record<FaceName, 0 | 1 | 2>> = {
  U: 1,
  D: 1,
  F: 2,
  B: 2,
  R: 0,
  L: 0,
};

export const MOVE_LAYER: Readonly<Record<FaceName, -1 | 1>> = {
  U: 1,
  D: -1,
  F: 1,
  B: -1,
  R: 1,
  L: -1,
};

const CORNERS: readonly Vec3[] = [
  [-1, -1, -1],
  [-1, -1, 1],
  [-1, 1, -1],
  [-1, 1, 1],
  [1, -1, -1],
  [1, -1, 1],
  [1, 1, -1],
  [1, 1, 1],
];

/** Builds a solved cube: every sticker carries the colour of its own face. */
export function createCube(): CubeState {
  const stickers: Sticker[] = [];

  for (let face = 0; face < FACE_NORMALS.length; face++) {
    const nrm = FACE_NORMALS[face]!;
    for (const pos of CORNERS) {
      // A sticker exists only where the corner sits on this face's plane.
      if (dot(pos, nrm) !== 1) continue;
      stickers.push({ pos, nrm, color: face });
    }
  }

  return { stickers, moves: 0 };
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/** Rotates a vector 90 degrees around the given axis. dir=1 is clockwise
 *  when looking straight down the axis toward the origin. */
function rotate(v: Vec3, axis: 0 | 1 | 2, dir: 1 | -1): Vec3 {
  const [x, y, z] = v;
  if (axis === 0) return dir === 1 ? [x, -z, y] : [x, z, -y];
  if (axis === 1) return dir === 1 ? [z, y, -x] : [-z, y, x];
  return dir === 1 ? [-y, x, z] : [y, -x, z];
}

/**
 * Turns one outer layer, returning a new state. Pure: the input is untouched so
 * the component can keep an undo history or animate from the previous state.
 */
export function turn(state: CubeState, face: FaceName, dir: 1 | -1 = 1): CubeState {
  const axis = MOVE_AXIS[face];
  const layer = MOVE_LAYER[face];

  const stickers = state.stickers.map((s) =>
    s.pos[axis] === layer
      ? {
          pos: rotate(s.pos, axis, dir),
          nrm: rotate(s.nrm, axis, dir),
          color: s.color,
        }
      : { ...s }
  );

  return { stickers, moves: state.moves + 1 };
}

/**
 * Index of the face a sticker currently faces, derived from its live normal.
 *
 * The sticker normal rotates along with the position, so `dot(pos, nrm)` is
 * always 1 and cannot be used to identify the face. The normal alone is what
 * says which side of the cube a colour is showing on.
 */
function faceOf(nrm: Vec3): number {
  return FACE_NORMALS.findIndex((n) => n[0] === nrm[0] && n[1] === nrm[1] && n[2] === nrm[2]);
}

/** True when every face shows a single colour. */
export function isSolved(state: CubeState): boolean {
  // A solved cube has exactly one distinct colour per face.
  for (let face = 0; face < FACE_NORMALS.length; face++) {
    const onFace = state.stickers.filter((s) => faceOf(s.nrm) === face);
    const first = onFace[0]?.color;
    if (onFace.some((s) => s.color !== first)) return false;
  }
  return true;
}

/** How many stickers already show the colour their face calls for, 0-24.
 *  Used as a "warmth" hint and to sanity check that turns changed something. */
export function solvedCount(state: CubeState): number {
  return state.stickers.reduce((acc, s) => acc + (s.color === faceOf(s.nrm) ? 1 : 0), 0);
}

/** Applies a list of moves from a solved cube. */
export function applyMoves(moves: Array<[FaceName, 1 | -1]>): CubeState {
  return moves.reduce((acc, [face, dir]) => turn(acc, face, dir), createCube());
}

/** Deterministic PRNG so a given seed always yields the same scramble. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Produces a scramble. Never repeats the same face twice in a row, which keeps
 * the sequence from containing redundant moves.
 */
export function scramble(length: number, seed = Date.now()): Array<[FaceName, 1 | -1]> {
  const rand = mulberry32(seed);
  const out: Array<[FaceName, 1 | -1]> = [];
  let last: FaceName | null = null;

  while (out.length < length) {
    const face = FACE_NAMES[Math.floor(rand() * FACE_NAMES.length)]!;
    if (face === last) continue;
    const dir: 1 | -1 = rand() < 0.5 ? 1 : -1;
    out.push([face, dir]);
    last = face;
  }

  return out;
}