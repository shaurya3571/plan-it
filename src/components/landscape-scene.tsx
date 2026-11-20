import { cn } from "@/lib/utils";
import { seededRandom } from "@/lib/seeded-random";

/**
 * The illustrated backdrop: sky, clouds, ridge, lake, treeline, meadow.
 *
 * Stars, the back treeline and the meadow flowers are too many to hand-place,
 * so they are generated — but from a fixed seed, because an unseeded
 * Math.random() here renders different markup on server and client and trips
 * hydration.
 */

type Palette = {
  sky: [string, string, string];
  lake: [string, string];
  stars: string;
  moon: string;
  cloudBack: string;
  cloudFront: string;
  birds: string;
  ridge: string;
  snow: string;
  hillLeft: string;
  hillRight: string;
  shimmer: string;
  treeline: string;
  foreLeft: string;
  foreRight: string;
  pines: string;
  meadow: string;
  flowers: string;
};

export const palettes = {
  sunrise: {
    sky: ["#fcfcfa", "#f8e9de", "#f4dccb"],
    lake: ["#9fb0e0", "#c7cdeb"],
    stars: "transparent",
    moon: "transparent",
    cloudBack: "#dcc3d8",
    cloudFront: "#f7d2b6",
    birds: "#4c4c3d",
    ridge: "#cdb9cc",
    snow: "#fbefe6",
    hillLeft: "#8c97cb",
    hillRight: "#7482bf",
    shimmer: "#f8dcc4",
    treeline: "#2e4636",
    foreLeft: "#56722a",
    foreRight: "#6a8733",
    pines: "#1e3326",
    meadow: "#87a23f",
    flowers: "#ffffff",
  },
  dusk: {
    sky: ["#2e4699", "#6f82cc", "#f0c2a0"],
    lake: ["#2b418c", "#4b60ae"],
    stars: "transparent",
    moon: "transparent",
    cloudBack: "#a5aedb",
    cloudFront: "#edb99b",
    birds: "#16315c",
    ridge: "#3e52a0",
    snow: "#c9d2f0",
    hillLeft: "#2a3d86",
    hillRight: "#22336f",
    shimmer: "#f2c7a8",
    treeline: "#0f2230",
    foreLeft: "#1c3527",
    foreRight: "#21402d",
    pines: "#0b1a24",
    meadow: "#2a4d33",
    flowers: "#e9dceb",
  },
  night: {
    sky: ["#0e1311", "#122340", "#16315c"],
    lake: ["#13274b", "#1b3360"],
    stars: "#e9e4cf",
    moon: "#f1ead0",
    cloudBack: "#212c4c",
    cloudFront: "#2c3a60",
    birds: "transparent",
    ridge: "#26355f",
    snow: "#7383b5",
    hillLeft: "#1c2a50",
    hillRight: "#162244",
    shimmer: "#d8cfa6",
    treeline: "#07110d",
    foreLeft: "#132016",
    foreRight: "#17271a",
    pines: "#06100b",
    meadow: "#1c2f1f",
    flowers: "#9aa3c6",
  },
} satisfies Record<string, Palette>;

export type PaletteName = keyof typeof palettes;

const round = (n: number) => Math.round(n * 100) / 100;

/** A circle expressed as path data, so hundreds of them cost one DOM node. */
const circlePath = (cx: number, cy: number, r: number) =>
  `M${round(cx - r)} ${round(cy)} a${round(r)} ${round(r)} 0 1 0 ${round(r * 2)} 0 a${round(r)} ${round(r)} 0 1 0 ${round(-r * 2)} 0`;

function starField(seed: number, count: number) {
  const rand = seededRandom(seed);
  let d = "";
  for (let i = 0; i < count; i++) {
    d += `${circlePath(rand() * 1440, rand() * 330, 0.7 + rand() * 1.1)} `;
  }
  return d;
}

function flowerField(seed: number, count: number) {
  const rand = seededRandom(seed);
  let d = "";
  for (let i = 0; i < count; i++) {
    d += `${circlePath(rand() * 1440, 706 + rand() * 52, 1 + rand() * 1.2)} `;
  }
  return d;
}

/** Saw-tooth of small conifers along the far shore. */
function treeLine(seed: number) {
  const rand = seededRandom(seed);
  const base = 551;
  const step = 11;
  let d = "";
  for (let x = 0; x < 1440; x += step) {
    const top = base - (6 + rand() * 8);
    d += `M${x} ${base} L${x + step / 2} ${round(top)} L${x + step} ${base} Z `;
  }
  return d;
}

/** Three stacked tiers plus a trunk — the scale 1 tree is 169 units tall. */
function pine(x: number, topY: number, s: number) {
  let d = "";
  for (let i = 0; i < 3; i++) {
    const apex = topY + i * 41.8 * s;
    const baseY = topY + (85.5 + i * 41.8) * s;
    const half = (23.94 + i * 9.975) * s;
    d += `M${x} ${round(apex)} L${round(x - half)} ${round(baseY)} L${round(x + half)} ${round(baseY)} Z `;
  }
  const trunkTop = topY + (85.5 + 2 * 41.8) * s;
  d += `M${round(x - 3 * s)} ${round(trunkTop)} h${round(6 * s)} v${round(24.7 * s)} h${round(-6 * s)} Z `;
  return d;
}

const PINES = [
  pine(40, 500, 1),
  pine(85, 544, 0.789),
  pine(132, 572, 0.62),
  pine(1400, 512, 0.95),
  pine(1352, 556, 0.75),
  pine(1306, 582, 0.6),
].join("");

/** Overlapping circles read as a soft cloud bank. */
function cloudBank(
  clusters: { x: number; y: number; r: number }[],
  dx: number,
  dy: number,
  dr: number,
) {
  return clusters
    .map((c) => circlePath(c.x + dx, c.y + dy, c.r + dr))
    .join(" ");
}

const CLOUDS_LEFT = [
  { x: 135, y: 164.6, r: 41 },
  { x: 180.5, y: 141.2, r: 54 },
  { x: 236.4, y: 128.2, r: 64.4 },
  { x: 293.6, y: 146.4, r: 51.4 },
  { x: 337.8, y: 167.2, r: 35.8 },
];

const CLOUDS_RIGHT = [
  { x: 1005, y: 205, r: 34 },
  { x: 1048, y: 186, r: 45 },
  { x: 1100, y: 176, r: 53 },
  { x: 1152, y: 191, r: 42 },
  { x: 1192, y: 208, r: 30 },
];

const RIDGE =
  "M0 548 L0 420 L110 440 L230 372 L330 430 L450 360 L560 420 L660 395 L760 445 L880 388 L1000 330 L1110 410 L1230 352 L1330 400 L1440 372 L1440 548 Z";
const SNOW =
  "M230 372 L219 387 L226 383 L230 389 L235 383 L242 387 Z M450 360 L439 375 L446 371 L450 377 L455 371 L462 375 Z M1000 330 L989 345 L996 341 L1000 347 L1005 341 L1012 345 Z M1230 352 L1219 367 L1226 363 L1230 369 L1235 363 L1242 367 Z";
const HILL_LEFT =
  "M0 548 L0 500 L90 478 L200 516 L300 466 L420 528 L520 500 L610 548 Z";
const HILL_RIGHT =
  "M840 548 L980 470 L1100 512 L1230 450 L1350 500 L1440 474 L1440 548 Z";
const SHIMMER =
  "M640 556 h160 v2.5 h-160 Z M660 566 h120 v2.5 h-120 Z M625 578 h190 v2.5 h-190 Z M675 590 h90 v2.5 h-90 Z M645 602 h150 v2.5 h-150 Z M685 616 h70 v2.5 h-70 Z";
const FORE_LEFT =
  "M0 760 L0 610 C130 590 270 618 390 650 C480 674 540 720 600 760 Z";
const FORE_RIGHT =
  "M1440 760 L1440 616 C1320 604 1180 632 1070 672 C990 702 950 740 930 760 Z";
const MEADOW =
  "M0 760 L0 700 C300 676 700 706 1000 694 C1200 688 1350 704 1440 696 L1440 760 Z";
const BIRDS =
  "M390 70 q5 -6 10 0 q5 -6 10 0 M418 84 q5 -6 10 0 q5 -6 10 0 M445 64 q5 -6 10 0 q5 -6 10 0 M1010 300 q5 -6 10 0 q5 -6 10 0 M1035 314 q5 -6 10 0 q5 -6 10 0";

const STARS = starField(20260211, 170);
const FLOWERS = flowerField(77001, 130);
const TREELINE = treeLine(4242);

export function LandscapeScene({
  palette,
  className,
}: {
  palette: PaletteName;
  className?: string;
}) {
  const p = palettes[palette];
  const skyId = `ls-sky-${palette}`;
  const lakeId = `ls-lake-${palette}`;

  return (
    <svg
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={cn("absolute inset-0 size-full", className)}
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="0.45" stopColor={p.sky[1]} />
          <stop offset="0.72" stopColor={p.sky[2]} />
        </linearGradient>
        <linearGradient id={lakeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.lake[0]} />
          <stop offset="1" stopColor={p.lake[1]} />
        </linearGradient>
      </defs>

      <rect width="1440" height="760" fill={`url(#${skyId})`} />
      <path d={STARS} fill={p.stars} />
      <circle cx="1120" cy="140" r="30" fill={p.moon} />

      <path
        d={`${cloudBank(CLOUDS_LEFT, 0, 0, 0)} ${cloudBank(CLOUDS_RIGHT, 0, 0, 0)}`}
        fill={p.cloudBack}
      />
      <path
        d={`${cloudBank(CLOUDS_LEFT, -6, -9, -2)} ${cloudBank(CLOUDS_RIGHT, -6, -9, -2)}`}
        fill={p.cloudFront}
      />

      <path
        d={BIRDS}
        fill="none"
        stroke={p.birds}
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path d={RIDGE} fill={p.ridge} />
      <path d={SNOW} fill={p.snow} />
      <path d={HILL_LEFT} fill={p.hillLeft} />
      <path d={HILL_RIGHT} fill={p.hillRight} />

      <rect y="548" width="1440" height="90" fill={`url(#${lakeId})`} />
      <path d={SHIMMER} fill={p.shimmer} opacity="0.85" />

      <path d={TREELINE} fill={p.treeline} />
      <path d={FORE_LEFT} fill={p.foreLeft} />
      <path d={FORE_RIGHT} fill={p.foreRight} />
      <path d={PINES} fill={p.pines} />
      <path d={MEADOW} fill={p.meadow} />
      <path d={FLOWERS} fill={p.flowers} />
    </svg>
  );
}

/**
 * Light theme shows `day`, dark theme always shows night. Rendering both and
 * toggling with CSS keeps the server markup theme-independent.
 */
export function ThemedLandscape({ day }: { day: Exclude<PaletteName, "night"> }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <LandscapeScene palette={day} className="dark:hidden" />
      <LandscapeScene palette="night" className="hidden dark:block" />
    </div>
  );
}
