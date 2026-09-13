/**
 * Build-time geometry for the site's figures.
 *
 * Every illustration on this site is *computed*, not drawn: the contours are
 * real level sets of a scalar field, the trajectories are real descent paths on
 * that field, and the scatter is a deterministic pseudo-random draw. Nothing
 * here runs in the browser — the components call these functions in their
 * frontmatter and emit static path data.
 *
 * The fields are abstract. They are not fitted to data and carry no units, so
 * figures built from them are never labelled with numeric axes.
 */

export type Point = readonly [number, number];

export interface Bounds {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export type ScalarField = (x: number, y: number) => number;

/** Deterministic PRNG (mulberry32) so every build produces identical figures. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box–Muller draw from a seeded uniform stream. */
export function gaussian(rand: () => number): number {
  const u = Math.max(rand(), Number.EPSILON);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

/**
 * Marching squares. Returns level-set polylines in field coordinates.
 * Segments are emitted per cell, then stitched into the longest possible runs.
 */
export function contour(f: ScalarField, level: number, bounds: Bounds, resolution = 96): Point[][] {
  const { x0, x1, y0, y1 } = bounds;
  const nx = resolution;
  const ny = Math.max(8, Math.round((resolution * (y1 - y0)) / (x1 - x0)));
  const dx = (x1 - x0) / nx;
  const dy = (y1 - y0) / ny;

  const values: number[][] = [];
  for (let j = 0; j <= ny; j++) {
    const row: number[] = [];
    for (let i = 0; i <= nx; i++) row.push(f(x0 + i * dx, y0 + j * dy) - level);
    values.push(row);
  }

  const interp = (pa: Point, va: number, pb: Point, vb: number): Point => {
    const t = va === vb ? 0.5 : va / (va - vb);
    return [pa[0] + t * (pb[0] - pa[0]), pa[1] + t * (pb[1] - pa[1])];
  };

  const segments: [Point, Point][] = [];

  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const xa = x0 + i * dx;
      const xb = xa + dx;
      const ya = y0 + j * dy;
      const yb = ya + dy;

      // Corners, counter-clockwise from bottom-left.
      const v0 = values[j]![i]!;
      const v1 = values[j]![i + 1]!;
      const v2 = values[j + 1]![i + 1]!;
      const v3 = values[j + 1]![i]!;
      const p0: Point = [xa, ya];
      const p1: Point = [xb, ya];
      const p2: Point = [xb, yb];
      const p3: Point = [xa, yb];

      let idx = 0;
      if (v0 > 0) idx |= 1;
      if (v1 > 0) idx |= 2;
      if (v2 > 0) idx |= 4;
      if (v3 > 0) idx |= 8;
      if (idx === 0 || idx === 15) continue;

      const bottom = () => interp(p0, v0, p1, v1);
      const right = () => interp(p1, v1, p2, v2);
      const top = () => interp(p3, v3, p2, v2);
      const left = () => interp(p0, v0, p3, v3);

      switch (idx) {
        case 1:
        case 14:
          segments.push([left(), bottom()]);
          break;
        case 2:
        case 13:
          segments.push([bottom(), right()]);
          break;
        case 3:
        case 12:
          segments.push([left(), right()]);
          break;
        case 4:
        case 11:
          segments.push([right(), top()]);
          break;
        case 6:
        case 9:
          segments.push([bottom(), top()]);
          break;
        case 7:
        case 8:
          segments.push([left(), top()]);
          break;
        // Saddles: resolve with the cell-average so the lines never cross.
        case 5: {
          const avg = (v0 + v1 + v2 + v3) / 4;
          if (avg > 0) {
            segments.push([left(), top()]);
            segments.push([bottom(), right()]);
          } else {
            segments.push([left(), bottom()]);
            segments.push([right(), top()]);
          }
          break;
        }
        case 10: {
          const avg = (v0 + v1 + v2 + v3) / 4;
          if (avg > 0) {
            segments.push([left(), bottom()]);
            segments.push([right(), top()]);
          } else {
            segments.push([left(), top()]);
            segments.push([bottom(), right()]);
          }
          break;
        }
      }
    }
  }

  return stitch(segments, Math.min(dx, dy) * 0.5);
}

/** Join loose segments end-to-end into polylines (closed where possible). */
function stitch(segments: [Point, Point][], tol: number): Point[][] {
  const key = (p: Point) => `${Math.round(p[0] / tol)}:${Math.round(p[1] / tol)}`;
  const open = new Map<string, [Point, Point][]>();
  for (const seg of segments) {
    for (const end of [seg[0], seg[1]]) {
      const k = key(end);
      const bucket = open.get(k);
      if (bucket) bucket.push(seg);
      else open.set(k, [seg]);
    }
  }

  const used = new Set<[Point, Point]>();
  const lines: Point[][] = [];

  const take = (from: Point, exclude: [Point, Point]): [Point, Point] | undefined =>
    open.get(key(from))?.find((s) => s !== exclude && !used.has(s));

  for (const seg of segments) {
    if (used.has(seg)) continue;
    used.add(seg);
    const line: Point[] = [seg[0], seg[1]];

    // Extend forward.
    let head = seg[1];
    let prev = seg;
    for (;;) {
      const next = take(head, prev);
      if (!next) break;
      used.add(next);
      head = key(next[0]) === key(head) ? next[1] : next[0];
      line.push(head);
      prev = next;
    }

    // Extend backward.
    let tail = seg[0];
    prev = seg;
    for (;;) {
      const next = take(tail, prev);
      if (!next) break;
      used.add(next);
      tail = key(next[0]) === key(tail) ? next[1] : next[0];
      line.unshift(tail);
      prev = next;
    }

    if (line.length > 2) lines.push(line);
  }

  return lines;
}

/**
 * Ramer–Douglas–Peucker simplification.
 *
 * Marching squares emits a vertex per grid crossing, which is far more detail
 * than a hairline stroke can show. Dropping points that sit within `tolerance`
 * of the chord keeps the curve identical on screen and cuts the emitted path
 * data by roughly an order of magnitude.
 */
export function simplify(points: Point[], tolerance: number): Point[] {
  if (points.length < 3) return points;

  const distanceToSegment = (p: Point, a: Point, b: Point) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
    let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
  };

  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;

  const stack: [number, number][] = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop()!;
    let furthest = -1;
    let maxDistance = tolerance;
    for (let i = first + 1; i < last; i++) {
      const distance = distanceToSegment(points[i]!, points[first]!, points[last]!);
      if (distance > maxDistance) {
        maxDistance = distance;
        furthest = i;
      }
    }
    if (furthest > 0) {
      keep[furthest] = 1;
      stack.push([first, furthest], [furthest, last]);
    }
  }

  return points.filter((_, i) => keep[i]);
}

/** Central-difference gradient of a scalar field. */
export function gradient(f: ScalarField, h = 1e-4): (x: number, y: number) => Point {
  return (x, y) => [(f(x + h, y) - f(x - h, y)) / (2 * h), (f(x, y + h) - f(x, y - h)) / (2 * h)];
}

/**
 * Heavy-ball gradient descent. Used purely as a drawing primitive: the path is
 * the real iterate sequence on the abstract field above.
 */
export function descentPath(
  f: ScalarField,
  start: Point,
  {
    steps = 26,
    rate = 0.08,
    momentum = 0.72,
    /** Truncate once the iterate reaches this distance from `target`. */
    stopWithin,
    target,
  }: {
    steps?: number;
    rate?: number;
    momentum?: number;
    stopWithin?: number;
    target?: Point;
  } = {},
): Point[] {
  const grad = gradient(f);
  const path: Point[] = [start];
  let [x, y] = start;
  let vx = 0;
  let vy = 0;
  for (let i = 0; i < steps; i++) {
    const [gx, gy] = grad(x, y);
    vx = momentum * vx - rate * gx;
    vy = momentum * vy - rate * gy;
    x += vx;
    y += vy;
    if (
      stopWithin !== undefined &&
      target &&
      Math.hypot(x - target[0], y - target[1]) < stopWithin
    ) {
      path.push(target);
      break;
    }
    path.push([x, y]);
  }
  return path;
}

/** Maps field coordinates to an SVG viewBox. */
export function projector(bounds: Bounds, width: number, height: number, pad = 0) {
  const sx = (width - 2 * pad) / (bounds.x1 - bounds.x0);
  const sy = (height - 2 * pad) / (bounds.y1 - bounds.y0);
  return (p: Point): Point => [
    pad + (p[0] - bounds.x0) * sx,
    // SVG y grows downward; flip so figures read like plots.
    height - pad - (p[1] - bounds.y0) * sy,
  ];
}

const round = (n: number) => Math.round(n * 10) / 10;

/** Polyline as a plain SVG path. */
export function toPath(points: Point[], close = false): string {
  if (points.length === 0) return '';
  const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`).join(' ');
  return close ? `${d}Z` : d;
}

/** Catmull–Rom to cubic Bézier — used where a curve should read as smooth. */
export function toSmoothPath(points: Point[], close = false, tension = 1): string {
  if (points.length < 3) return toPath(points, close);
  const pts = close ? [...points, points[0]!, points[1]!] : points;
  const at = (i: number): Point => pts[Math.max(0, Math.min(pts.length - 1, i))]!;

  let d = `M${round(at(close ? 0 : 0)[0])} ${round(at(0)[1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Point = [
      p1[0] + ((p2[0] - p0[0]) / 6) * tension,
      p1[1] + ((p2[1] - p0[1]) / 6) * tension,
    ];
    const c2: Point = [
      p2[0] - ((p3[0] - p1[0]) / 6) * tension,
      p2[1] - ((p3[1] - p1[1]) / 6) * tension,
    ];
    d += ` C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
  }
  return close ? `${d}Z` : d;
}

/** The site's shared "decision landscape": one bowl, one ridge, one optimum. */
export const decisionLandscape: ScalarField = (x, y) =>
  0.52 * x * x +
  0.86 * y * y +
  0.33 * x * y +
  0.34 * Math.sin(1.5 * x + 0.35) * Math.cos(1.25 * y - 0.2) +
  0.1 * x;
