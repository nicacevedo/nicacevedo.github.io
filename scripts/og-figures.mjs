/**
 * Card-scale renditions of the site's figure primitives.
 *
 * A social card is seen at thumbnail size, so these use the same geometry and
 * the same random seeds as the on-page components but draw it with heavier
 * strokes and fewer incidental marks. Colours are literal because the card has
 * no stylesheet.
 */
import {
  contour,
  descentPath,
  gaussian,
  projector,
  seeded,
  simplify,
  toPath,
  toSmoothPath,
} from '../src/utils/field.ts';

export const INK = '#111419';
export const SIGNAL = '#2856d8';
export const ALT = '#0f766e';
export const LINE = '#9aa1a5';
export const FIELD = '#c2c8c5';
export const PAPER = '#f7f6f2';

const wrap = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const dot = (p, r, fill) =>
  `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" fill="${fill}"/>`;
const ring = (p, r, stroke, width = 1.6) =>
  `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" fill="${PAPER}" stroke="${stroke}" stroke-width="${width}"/>`;
const stroke = (d, color, width, dash) =>
  `<path d="${d}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;

/* --------------------------------------------------------------------------
   The signature landscape: level sets of a valley, with a descent along it.
   -------------------------------------------------------------------------- */

const FIELD_FN = (x, y) => 0.55 * (1 - x) ** 2 + 2.6 * (y - 0.58 * x * x) ** 2;
const OPTIMUM = [1, 0.58];
const LEVELS = [0.05, 0.15, 0.34, 0.64, 1.08, 1.7, 2.55, 3.7, 5.2, 7.1, 9.5];

export function landscape(w, h) {
  const bounds = { x0: -2.1, x1: 2.55, y0: -0.5, y1: 3.68 };
  const proj = projector(bounds, w, h, 0);
  const pixel = (bounds.x1 - bounds.x0) / w;
  let body = '';

  LEVELS.forEach((level, i) => {
    const color = i < LEVELS.length - 2 ? LINE : FIELD;
    for (const line of contour(FIELD_FN, level, bounds, 150)) {
      const a = line[0];
      const z = line[line.length - 1];
      const closed = Math.hypot(a[0] - z[0], a[1] - z[1]) < 0.05;
      body += stroke(
        toSmoothPath(simplify(line, pixel * 0.45).map(proj), closed),
        color,
        i < 3 ? 1.8 : 1.35,
      );
    }
  });

  const iterates = descentPath(FIELD_FN, [-1.72, 2.55], {
    steps: 120,
    rate: 0.028,
    momentum: 0.86,
    stopWithin: 0.07,
    target: OPTIMUM,
  }).map(proj);

  body += stroke(toSmoothPath(iterates), SIGNAL, 3);
  const every = Math.max(4, Math.round(iterates.length / 8));
  iterates.forEach((p, i) => {
    if (i > 0 && i < iterates.length - 2 && i % every === 0) body += dot(p, 3.4, SIGNAL);
  });
  const opt = proj(OPTIMUM);
  body += `<circle cx="${opt[0].toFixed(1)}" cy="${opt[1].toFixed(1)}" r="9" stroke="${SIGNAL}" stroke-width="1.6" opacity="0.45"/>`;
  body += dot(opt, 5, SIGNAL);
  return wrap(w, h, body);
}

/* --------------------------------------------------------------------------
   Two objectives in tension.
   -------------------------------------------------------------------------- */

export function frontier(w, h) {
  const pad = { l: 46, r: 30, t: 34, b: 52 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const curveAt = (t) => [0.06 + 0.88 * t, 0.09 + 0.82 * (1 - t) ** 2.1];
  const toPx = ([x, y]) => [pad.l + x * iw, pad.t + (1 - y) * ih];

  const rand = seeded(20240903);
  const dominated = [];
  while (dominated.length < 22) {
    const t = rand();
    const [fx, fy] = curveAt(t);
    const lift = 0.05 + Math.abs(gaussian(rand)) * 0.19;
    const jitter = gaussian(rand) * 0.05;
    const x = fx + jitter;
    const y = fy + lift;
    if (x > 0.04 && x < 0.97 && y < 0.98) dominated.push(toPx([x, y]));
  }

  let body = stroke(
    `M${pad.l} ${pad.t} L${pad.l} ${pad.t + ih} L${pad.l + iw} ${pad.t + ih}`,
    LINE,
    1.6,
  );
  for (const p of dominated) body += ring(p, 4.5, LINE, 1.5);
  body += stroke(
    toSmoothPath(Array.from({ length: 40 }, (_, i) => curveAt(i / 39)).map(toPx)),
    INK,
    2.6,
  );
  const selected = toPx(curveAt(0.46));
  body += `<circle cx="${selected[0].toFixed(1)}" cy="${selected[1].toFixed(1)}" r="11" stroke="${SIGNAL}" stroke-width="1.8" opacity="0.5"/>`;
  body += dot(selected, 6, SIGNAL);
  return wrap(w, h, body);
}

/* --------------------------------------------------------------------------
   A facility and the boundary that public records reach.
   -------------------------------------------------------------------------- */

export function network(w, h) {
  const sx = w / 440;
  const sy = h / 340;
  const at = (x, y) => [x * sx, y * sy];
  const grid = at(64, 96);
  const site = at(214, 168);
  const compute = at(326, 100);
  const cooling = at(326, 178);
  const water = at(64, 246);
  const ground = at(214, 288);
  const air = at(326, 256);
  const edge = (a, b, bow) =>
    `M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2 - bow * sy).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;

  let body = `<rect x="${(128 * sx).toFixed(1)}" y="${(40 * sy).toFixed(1)}" width="${(176 * sx).toFixed(1)}" height="${(262 * sy).toFixed(1)}" rx="12" stroke="${LINE}" stroke-width="1.6" stroke-dasharray="3 7"/>`;
  body += stroke(edge(grid, site, 18), SIGNAL, 3.4);
  body += stroke(edge(water, site, -16), ALT, 3);
  body += stroke(edge(site, compute, 20), SIGNAL, 2.6);
  body += stroke(edge(site, cooling, 6), ALT, 2.4);
  body += stroke(edge(site, ground, -14), LINE, 2, '4 6');
  body += stroke(edge(site, air, -20), LINE, 2, '4 6');
  body += `<rect x="${(site[0] - 34 * sx).toFixed(1)}" y="${(site[1] - 25 * sy).toFixed(1)}" width="${(68 * sx).toFixed(1)}" height="${(50 * sy).toFixed(1)}" rx="5" fill="${PAPER}" stroke="${INK}" stroke-width="2.4"/>`;
  for (const n of [grid, compute, cooling, air, ground]) body += ring(n, 8, LINE, 2);
  body += ring(water, 8, ALT, 2);
  return wrap(w, h, body);
}

/* --------------------------------------------------------------------------
   Residuals falling onto a floor set by arithmetic.
   -------------------------------------------------------------------------- */

export function convergence(w, h) {
  const pad = { l: 46, r: 30, t: 36, b: 52 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const toPx = ([x, y]) => [pad.l + x * iw, pad.t + (1 - y) * ih];
  const rand = seeded(1120231);
  const floorLevel = 0.16;

  const series = Array.from({ length: 54 }, (_, i) => {
    const t = i / 53;
    const clean = Math.exp(-4.3 * t);
    const noise = Math.abs(gaussian(rand)) * 0.055;
    return [
      0.02 + t * 0.96,
      Math.min(0.99, floorLevel + clean * 0.8 + (clean < 0.06 ? noise : noise * 0.25)),
    ];
  });

  const bandTop = toPx([0, floorLevel + 0.07])[1];
  let body = `<rect x="${pad.l}" y="${bandTop.toFixed(1)}" width="${iw}" height="${(pad.t + ih - bandTop).toFixed(1)}" fill="${SIGNAL}" opacity="0.07"/>`;
  body += stroke(toPath([toPx([0, floorLevel]), toPx([1, floorLevel])]), LINE, 1.8, '6 6');
  body += stroke(
    `M${pad.l} ${pad.t} L${pad.l} ${pad.t + ih} L${pad.l + iw} ${pad.t + ih}`,
    LINE,
    1.6,
  );
  body += stroke(toSmoothPath(series.map(toPx), false, 0.55), SIGNAL, 3);
  series.filter((_, i) => i % 9 === 0).forEach((p) => (body += dot(toPx(p), 3.6, SIGNAL)));
  return wrap(w, h, body);
}

/* --------------------------------------------------------------------------
   A sparse coefficient vector, three of whose columns were generated.
   -------------------------------------------------------------------------- */

export function sparse(w, h) {
  const pad = { l: 34, r: 26, t: 44, b: 48 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const baseline = pad.t + ih / 2;
  const columns = 38;
  const step = iw / (columns - 1);
  const x = (i) => pad.l + i * step;

  const rand = seeded(2023121);
  const active = [4, 8, 14, 19, 26, 31, 35];
  const signs = [1, -1, 1, -1, -1, 1, -1];
  const generated = new Set([14, 26, 35]);

  let body = stroke(
    toPath([
      [pad.l, baseline],
      [pad.l + iw, baseline],
    ]),
    LINE,
    1.8,
  );
  for (let i = 0; i < columns; i++) {
    if (active.includes(i)) continue;
    body += stroke(
      toPath([
        [x(i), baseline - 4],
        [x(i), baseline + 4],
      ]),
      FIELD,
      1.8,
    );
  }
  active.forEach((i, k) => {
    const gen = generated.has(i);
    const dir = -signs[k];
    const y = baseline - signs[k] * (0.42 + rand() * 0.55) * (ih / 2 - 14);
    body += stroke(
      toPath([
        [x(i), baseline],
        [x(i), y],
      ]),
      gen ? SIGNAL : INK,
      gen ? 3 : 2.4,
    );
    body += dot([x(i), y], gen ? 6 : 5, gen ? SIGNAL : INK);
    if (gen) {
      body += `<path d="M${(x(i) - 6).toFixed(1)} ${(baseline + dir * 13).toFixed(1)} L${(x(i) + 6).toFixed(1)} ${(baseline + dir * 13).toFixed(1)} L${x(i).toFixed(1)} ${(baseline + dir * 3).toFixed(1)}Z" fill="${SIGNAL}"/>`;
    }
  });
  return wrap(w, h, body);
}

/* --------------------------------------------------------------------------
   Observations, a fitted trend, and the few the rule flags.
   -------------------------------------------------------------------------- */

export function observation(w, h) {
  const pad = { l: 44, r: 30, t: 36, b: 50 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const toPx = ([x, y]) => [pad.l + x * iw, pad.t + (1 - y) * ih];
  const rand = seeded(3062022);
  const slope = 0.62;
  const intercept = 0.2;

  const points = [];
  for (let i = 0; i < 62; i++) {
    const px = 0.04 + rand() * 0.92;
    const flagged = i % 19 === 6;
    const resid = flagged
      ? (rand() < 0.5 ? -1 : 1) * (0.24 + rand() * 0.12)
      : gaussian(rand) * 0.065;
    points.push({
      p: [px, Math.max(0.03, Math.min(0.97, intercept + slope * px + resid))],
      flagged,
    });
  }

  let body = stroke(
    `M${pad.l} ${pad.t} L${pad.l} ${pad.t + ih} L${pad.l + iw} ${pad.t + ih}`,
    LINE,
    1.6,
  );
  body += stroke(
    toPath([toPx([0.02, intercept + slope * 0.02]), toPx([0.98, intercept + slope * 0.98])]),
    LINE,
    2.2,
  );
  for (const { p, flagged } of points) {
    const at = toPx(p);
    if (!flagged) {
      body += dot(at, 3.6, LINE);
      continue;
    }
    body += stroke(toPath([at, toPx([p[0], intercept + slope * p[0]])]), SIGNAL, 1.8);
    body += `<circle cx="${at[0].toFixed(1)}" cy="${at[1].toFixed(1)}" r="10" stroke="${SIGNAL}" stroke-width="1.8" opacity="0.6"/>`;
    body += dot(at, 4.5, SIGNAL);
  }
  return wrap(w, h, body);
}

/* --------------------------------------------------------------------------
   A few candidates chosen from a pool, in an order that is itself a decision.
   -------------------------------------------------------------------------- */

export function sequence(w, h) {
  const pad = { l: 52, r: 52, t: 52, b: 72 };
  const cols = 7;
  const rows = 5;
  const stepX = (w - pad.l - pad.r) / (cols - 1);
  const stepY = (h - pad.t - pad.b) / (rows - 1);
  const at = (c, r) => [pad.l + c * stepX, pad.t + r * stepY];
  const route = [
    [1, 3],
    [3, 1],
    [4, 4],
    [6, 2],
  ];
  const keys = new Set(route.map(([c, r]) => `${c}:${r}`));
  const chosen = route.map(([c, r]) => at(c, r));
  const axisY = h - pad.b + 34;

  let body = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (keys.has(`${c}:${r}`)) continue;
      body += dot(at(c, r), 3.6, FIELD);
    }
  }
  body += stroke(toSmoothPath(chosen, false, 0.55), SIGNAL, 2.6, '2 6');
  body += stroke(
    toPath([
      [pad.l, axisY],
      [w - pad.r, axisY],
    ]),
    LINE,
    1.6,
  );
  chosen.forEach((p, i) => {
    body += stroke(
      toPath([
        [p[0], p[1] + 12],
        [p[0], axisY - 10],
      ]),
      LINE,
      1.4,
      '3 6',
    );
    body += stroke(
      toPath([
        [p[0], axisY - 7],
        [p[0], axisY + 7],
      ]),
      SIGNAL,
      2.4,
    );
    body += i === 0 ? ring(p, 7, LINE, 2.2) : dot(p, 6.5, SIGNAL);
  });
  return wrap(w, h, body);
}

export const artworkFor = { frontier, network, convergence, sparse, observation, sequence };
