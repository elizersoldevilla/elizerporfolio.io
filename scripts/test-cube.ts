/**
 * Sanity checks for the pocket-cube model.
 * Run with: npx tsx scripts/test-cube.ts   (or via node --experimental-strip-types)
 */
import {
  createCube,
  turn,
  applyMoves,
  isSolved,
  solvedCount,
  scramble,
  FACE_NORMALS,
  type FaceName,
} from '../src/utils/cube.ts';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures++;
    console.log(`  FAIL ${name} ${detail}`);
  }
}

const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

console.log('\nstructure');
{
  const cube = createCube();
  check('24 stickers on a 2x2', cube.stickers.length === 24, `got ${cube.stickers.length}`);
  // A sticker belongs to whichever face its normal currently points at.
  const faceOfNrm = (n: number[]) => FACE_NORMALS.findIndex((f) => f[0] === n[0] && f[1] === n[1] && f[2] === n[2]);
  check(
    '4 stickers per face',
    FACE_NORMALS.every((_, f) => cube.stickers.filter((s) => faceOfNrm(s.nrm) === f).length === 4)
  );
  check('starts solved', isSolved(cube));
  check('solvedCount 24', solvedCount(cube) === 24, `got ${solvedCount(cube)}`);
  check('every sticker colour matches its own face', cube.stickers.every((s) => s.color === faceOfNrm(s.nrm)));
}

console.log('\nturn mechanics');
{
  const cube = createCube();
  const turned = turn(cube, 'R', 1);
  check('turn mutates nothing on the input', isSolved(cube));
  check('one turn breaks solved', !isSolved(turned));

  // An R turn only touches stickers on the x === 1 layer. Everything else
  // must come through byte-identical, including position and normal.
  const key = (s: { pos: number[]; nrm: number[]; color: number }) =>
    `${s.pos}|${s.nrm}|${s.color}`;
  const beforeByKey = new Map(cube.stickers.map((s) => [key(s), s]));
  check(
    'stickers outside the turned layer are untouched',
    turned.stickers
      .filter((s) => s.pos[0] !== 1)
      .every((s) => beforeByKey.has(key(s)))
  );
  check('turned layer still holds 12 stickers', turned.stickers.filter((s) => s.pos[0] === 1).length === 12);
  check(
    'colours are conserved',
    cube.stickers.map((s) => s.color).sort().join() ===
      turned.stickers.map((s) => s.color).sort().join()
  );
  check('move counter increments', turned.moves === 1);

  const back = turn(turned, 'R', -1);
  check('inverse restores solved', isSolved(back), `solvedCount=${solvedCount(back)}`);
}

console.log('\ncommutation and order');
{
  // Opposite faces are independent, so they must commute.
  const a = turn(turn(createCube(), 'R', 1), 'L', 1);
  const b = turn(turn(createCube(), 'L', 1), 'R', 1);
  check('R then L === L then R', solvedCount(a) === solvedCount(b) && isSolved(a) === isSolved(b));

  // Four turns of a face return to the start.
  const four = applyMoves([['U', 1], ['U', 1], ['U', 1], ['U', 1]]);
  check('4x same face is identity', isSolved(four), `solvedCount=${solvedCount(four)}`);

  // Adjacent faces do not commute.
  const c = turn(turn(createCube(), 'U', 1), 'R', 1);
  const d = turn(turn(createCube(), 'R', 1), 'U', 1);
  check('U and R do NOT commute', solvedCount(c) !== solvedCount(d) || !isSolved(c));
}

console.log('\nsolving a scramble');
{
  const moves = scramble(12, 42) as Array<[FaceName, 1 | -1]>;
  const scrambled = applyMoves(moves);
  check('scramble(12) has 12 moves', moves.length === 12, `got ${moves.length}`);
  check('scramble is not solved', !isSolved(scrambled));
  check('solvedCount between 1 and 23', solvedCount(scrambled) > 0 && solvedCount(scrambled) < 24, `got ${solvedCount(scrambled)}`);

  // Reverting each move must restore the solved cube.
  const undone = moves.reduceRight<typeof scrambled>((acc, [f, dir]) => turn(acc, f, dir === 1 ? -1 : 1), scrambled);
  check('reversing a scramble solves it', isSolved(undone), `solvedCount=${solvedCount(undone)}`);

  check('same seed gives same scramble', JSON.stringify(scramble(8, 7)) === JSON.stringify(scramble(8, 7)));
  check('scramble avoids immediate repeats', scramble(30, 3).every(([f], i, arr) => i === 0 || f !== arr[i - 1]![0]));
}

console.log(failures === 0 ? '\nAll cube tests passed.\n' : `\n${failures} test(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);