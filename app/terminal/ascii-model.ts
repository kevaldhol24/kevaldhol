/**
 * A tiny software 3D renderer that draws into a grid of characters (think donut.c).
 *
 * Every shape is the same number of surface points with normals, so the page can morph
 * between any two of them by interpolating point-for-point. Each frame the points are
 * rotated, projected, z-buffered and shaded into a luminance ramp of ASCII glyphs.
 */

export type ShapeName = "k" | "person" | "laptop" | "stairs" | "gear" | "cap" | "envelope";
export type Shape = { p: Float32Array; n: Float32Array };

type Vec3 = [number, number, number];
type Sampler = (rnd: () => number) => [Vec3, Vec3];

const POINTS = 9000;
const RAMP = ".,-~:;=!*#$@";
const LIGHT = normalize([-0.45, 0.65, -0.62]);
/** Camera distance and how much of the grid the shape fills. */
const K2 = 4.2;
const FILL = 0.27;

function normalize(v: Vec3): Vec3 {
  const m = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / m, v[1] / m, v[2] / m];
}

/** Deterministic LCG so the point clouds are identical on every load. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

function sampled(sample: Sampler, seed: number): Shape {
  const rnd = seeded(seed);
  const p = new Float32Array(POINTS * 3);
  const n = new Float32Array(POINTS * 3);
  for (let i = 0; i < POINTS; i++) {
    const [point, normal] = sample(rnd);
    p.set(point, i * 3);
    n.set(normal, i * 3);
  }
  return { p, n };
}

/** A piece of a shape: its surface area (so point density stays even) and a sampler. */
type Part = { area: number; sample: Sampler };
type Placement = { c?: Vec3; rx?: number; ry?: number; rz?: number };

/** Rotate around x, then y, then z. */
function rotate([x, y, z]: Vec3, rx = 0, ry = 0, rz = 0): Vec3 {
  [y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)];
  [x, z] = [x * Math.cos(ry) + z * Math.sin(ry), -x * Math.sin(ry) + z * Math.cos(ry)];
  [x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)];
  return [x, y, z];
}

/** Moves a sampler's local points (and normals) into place. */
function place(sample: Sampler, { c = [0, 0, 0], rx, ry, rz }: Placement): Sampler {
  return (rnd) => {
    const [p, n] = sample(rnd);
    const q = rotate(p, rx, ry, rz);
    return [[q[0] + c[0], q[1] + c[1], q[2] + c[2]], rotate(n, rx, ry, rz)];
  };
}

/** Picks a part in proportion to its area, then samples it. */
function union(parts: Part[]): Sampler {
  const total = parts.reduce((sum, part) => sum + part.area, 0);
  return (rnd) => {
    let r = rnd() * total;
    for (const part of parts) {
      r -= part.area;
      if (r <= 0) return part.sample(rnd);
    }
    return parts[parts.length - 1].sample(rnd);
  };
}

/** A box with half-extents `h`. */
function box(h: Vec3, at: Placement = {}): Part {
  const [hx, hy, hz] = h;
  const faces = [hy * hz, hy * hz, hx * hz, hx * hz, hx * hy, hx * hy];
  const total = faces.reduce((a, b) => a + b, 0);
  const local: Sampler = (rnd) => {
    let r = rnd() * total;
    let side = 5;
    for (let f = 0; f < 6; f++) {
      r -= faces[f];
      if (r <= 0) {
        side = f;
        break;
      }
    }
    const u = rnd() * 2 - 1;
    const v = rnd() * 2 - 1;
    const sign = side % 2 === 0 ? 1 : -1;
    if (side < 2)
      return [
        [sign * hx, u * hy, v * hz],
        [sign, 0, 0],
      ];
    if (side < 4)
      return [
        [u * hx, sign * hy, v * hz],
        [0, sign, 0],
      ];
    return [
      [u * hx, v * hy, sign * hz],
      [0, 0, sign],
    ];
  };
  return { area: 4 * total, sample: place(local, at) };
}

/** A cylinder along y with radius `r` and half-height `h`. */
function cylinder(r: number, h: number, at: Placement = {}, caps = true): Part {
  const side = 2 * Math.PI * r * 2 * h;
  const cap = caps ? Math.PI * r * r : 0;
  const local: Sampler = (rnd) => {
    const t = rnd() * Math.PI * 2;
    if (rnd() < side / (side + 2 * cap)) {
      return [
        [r * Math.cos(t), (rnd() * 2 - 1) * h, r * Math.sin(t)],
        [Math.cos(t), 0, Math.sin(t)],
      ];
    }
    const rr = r * Math.sqrt(rnd());
    const up = rnd() < 0.5 ? 1 : -1;
    return [
      [rr * Math.cos(t), up * h, rr * Math.sin(t)],
      [0, up, 0],
    ];
  };
  return { area: side + 2 * cap, sample: place(local, at) };
}

/** An ellipsoid with radii `e`; `dome` keeps only the upper half. */
function ellipsoid(e: Vec3, at: Placement = {}, dome = false): Part {
  const [a, b, c] = e;
  // Knud Thomsen's approximation of an ellipsoid's surface area.
  const pw = 1.6;
  const area = 4 * Math.PI * (((a * b) ** pw + (a * c) ** pw + (b * c) ** pw) / 3) ** (1 / pw);
  const local: Sampler = (rnd) => {
    let y = rnd() * 2 - 1;
    if (dome) y = Math.abs(y);
    const t = rnd() * Math.PI * 2;
    const r = Math.sqrt(1 - y * y);
    const d: Vec3 = [r * Math.cos(t), y, r * Math.sin(t)];
    return [[d[0] * a, d[1] * b, d[2] * c], normalize([d[0] / a, d[1] / b, d[2] / c])];
  };
  return { area: dome ? area / 2 : area, sample: place(local, at) };
}

/** One model per section. The viewer looks along +z, so "front" faces point to -z. */
const SAMPLERS: Record<ShapeName, Sampler> = {
  // whoami: the initial, a stem and two legs.
  k: union([
    box([0.19, 1, 0.24], { c: [-0.55, 0, 0] }),
    box([0.66, 0.17, 0.24], { c: [0.13, 0.5, 0], rz: 0.8 }),
    box([0.64, 0.17, 0.24], { c: [0.17, -0.47, 0], rz: -0.88 }),
  ]),
  // about: head and shoulders, like an avatar icon.
  person: union([
    ellipsoid([0.36, 0.4, 0.36], { c: [0, 0.45, 0] }),
    ellipsoid([0.8, 0.75, 0.45], { c: [0, -0.88, 0] }, true),
  ]),
  // projects: an open laptop, screen tilted back, keyboard plate on the deck.
  laptop: union([
    box([0.95, 0.045, 0.62], { c: [0, -0.35, -0.15] }),
    box([0.8, 0.012, 0.3], { c: [0, -0.3, -0.05] }),
    box([0.95, 0.6, 0.035], { c: [0, 0.275, 0.625], rx: 0.26 }),
  ]),
  // experience: three rising steps, one per role, with a flag at the top.
  stairs: union([
    ...[0, 1, 2].map((i) => {
      const hy = 0.28 * (i + 1);
      return box([0.3, hy, 0.45], { c: [-0.62 + 0.62 * i, -1.05 + hy, 0] });
    }),
    box([0.02, 0.25, 0.02], { c: [0.62, 0.88, 0] }),
    box([0.15, 0.09, 0.015], { c: [0.77, 1.04, 0] }),
  ]),
  // skills: a cog, axis toward the viewer.
  gear: union([
    cylinder(0.6, 0.16, { rx: Math.PI / 2 }),
    cylinder(0.2, 0.28, { rx: Math.PI / 2 }),
    ...Array.from({ length: 10 }, (_, k) => {
      const a = (k * Math.PI) / 5;
      return box([0.14, 0.1, 0.16], { c: [Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0], rz: a });
    }),
  ]),
  // education: a mortarboard with its button, cord and tassel.
  cap: union([
    box([0.85, 0.03, 0.85], { c: [0, 0.3, 0], ry: Math.PI / 4 }),
    cylinder(0.48, 0.25, { c: [0, 0.02, 0] }, false),
    ellipsoid([0.07, 0.05, 0.07], { c: [0, 0.35, 0] }),
    box([0.57, 0.012, 0.012], { c: [0.58, 0.345, 0] }),
    box([0.03, 0.2, 0.03], { c: [1.15, 0.15, 0] }),
  ]),
  // contact: an envelope with its V flap on the front.
  envelope: union([
    box([1, 0.64, 0.07]),
    box([0.61, 0.035, 0.03], { c: [-0.5, 0.3, -0.09], rz: -0.6 }),
    box([0.61, 0.035, 0.03], { c: [0.5, 0.3, -0.09], rz: 0.6 }),
  ]),
};

let shapes: Record<ShapeName, Shape> | null = null;

/** Built lazily on first use (client only). */
export function getShapes() {
  if (!shapes) {
    const entries = Object.entries(SAMPLERS).map(([name, sampler], i) => [
      name,
      sampled(sampler, 7 + i * 101),
    ]);
    shapes = Object.fromEntries(entries) as Record<ShapeName, Shape>;
  }
  return shapes;
}

export const pointCount = POINTS;

export class AsciiRenderer {
  private cols = 0;
  private rows = 0;
  /** Glyph width / line height, so shapes are not stretched vertically. */
  private aspect = 0.5;
  private cells: string[] = [];
  private depth = new Float32Array(0);

  resize(cols: number, rows: number, aspect: number) {
    this.cols = cols;
    this.rows = rows;
    this.aspect = aspect;
    this.cells = new Array(cols * rows);
    this.depth = new Float32Array(cols * rows);
  }

  /**
   * Draw `from` morphing into `to` (t = 0…1) rotated by rx/ry; returns the frame as text.
   * `centerX` (0…1) places the shape horizontally and `span` is the share of the grid's
   * width it may fill, so it can sit in whichever half of the page is free.
   */
  render(from: Shape, to: Shape, t: number, rx: number, ry: number, centerX = 0.5, span = 1) {
    const { cols, rows, aspect, cells, depth } = this;
    if (!cols || !rows) return "";
    cells.fill(" ");
    depth.fill(0);

    const cX = Math.cos(rx);
    const sX = Math.sin(rx);
    const cY = Math.cos(ry);
    const sY = Math.sin(ry);
    const K1 = Math.min(cols * span, rows / aspect) * K2 * FILL;
    const halfW = cols * centerX;
    const halfH = rows / 2;
    const u = 1 - t;
    // Points fly outward slightly mid-morph, which reads as an intentional "burst".
    const burst = 1 + Math.sin(t * Math.PI) * 0.18;
    const A = from.p;
    const B = to.p;
    const An = from.n;
    const Bn = to.n;

    for (let i = 0; i < POINTS; i++) {
      const j = i * 3;
      const x = (A[j] * u + B[j] * t) * burst;
      const y = (A[j + 1] * u + B[j + 1] * t) * burst;
      const z = (A[j + 2] * u + B[j + 2] * t) * burst;
      let nx = An[j] * u + Bn[j] * t;
      let ny = An[j + 1] * u + Bn[j + 1] * t;
      let nz = An[j + 2] * u + Bn[j + 2] * t;
      const nl = Math.hypot(nx, ny, nz) || 1;
      nx /= nl;
      ny /= nl;
      nz /= nl;

      // Rotate around X, then Y.
      const y1 = y * cX - z * sX;
      const z1 = y * sX + z * cX;
      const x2 = x * cY + z1 * sY;
      const z2 = -x * sY + z1 * cY;
      const ny1 = ny * cX - nz * sX;
      const nz1 = ny * sX + nz * cX;
      const nx2 = nx * cY + nz1 * sY;
      const nz2 = -nx * sY + nz1 * cY;

      const ooz = 1 / (z2 + K2);
      const xp = (halfW + K1 * ooz * x2) | 0;
      const yp = (halfH - K1 * ooz * y1 * aspect) | 0;
      if (xp < 0 || xp >= cols || yp < 0 || yp >= rows) continue;

      const idx = yp * cols + xp;
      if (ooz > depth[idx]) {
        depth[idx] = ooz;
        const lum = nx2 * LIGHT[0] + ny1 * LIGHT[1] + nz2 * LIGHT[2];
        const level = Math.floor(((lum + 0.2) / 1.2) * RAMP.length);
        cells[idx] = RAMP[Math.max(0, Math.min(RAMP.length - 1, level))];
      }
    }

    let out = "";
    for (let r = 0; r < rows; r++) {
      out += cells.slice(r * cols, r * cols + cols).join("");
      if (r < rows - 1) out += "\n";
    }
    return out;
  }
}
