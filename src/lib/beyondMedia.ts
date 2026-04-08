/**
 * Beyond the Interface — media grids.
 * Plants: `public/images/beyond/plants/plant01.jpg` … `plant23.jpg`
 * Other sections: mostly 23 cells. Gaming is **4×4** (16 tiles): `Game01.png`…`Game11.png` cycled to fill 16.
 * Film & TV (03): `public/images/beyond/movies/Movie Poster01.png` … `Movie Poster23.png`
 */

export type BeyondGridSpan = "default" | "wide" | "tall" | "full";

export type BeyondGridItem = {
  src: string;
  type?: "image" | "video";
  span?: BeyondGridSpan;
};

export type BeyondSectionDefinition = {
  id: string;
  variant: "gaming" | "music" | "movement" | "plants" | "history";
  eyebrow: string;
  title: string;
  items: BeyondGridItem[];
};

/** Same count and layout as Plants: 23 portrait tiles, default spans only, images only. */
const UNIFORM_GRID_COUNT = 23;

const GAMING_GRID_COUNT = 16;
const GAMING_IMAGE_COUNT = 11;

/** 4×4 grid; cycles `Game01.png` … `Game11.png` across 16 cells. */
function gamingSectionItems(): BeyondGridItem[] {
  const items: BeyondGridItem[] = [];
  for (let i = 1; i <= GAMING_GRID_COUNT; i++) {
    const n = ((i - 1) % GAMING_IMAGE_COUNT) + 1;
    const fn = String(n).padStart(2, "0");
    items.push({ src: `/images/beyond/gaming/Game${fn}.png` });
  }
  return items;
}

/** 23 plant photos: plant01.jpg … plant23.jpg */
function plantSectionItems(): BeyondGridItem[] {
  const items: BeyondGridItem[] = [];
  for (let i = 1; i <= UNIFORM_GRID_COUNT; i++) {
    const n = String(i).padStart(2, "0");
    items.push({ src: `/images/beyond/plants/plant${n}.jpg` });
  }
  return items;
}

/** 23 posters; filenames include a space — encode for valid URLs. */
function moviesSectionItems(): BeyondGridItem[] {
  const items: BeyondGridItem[] = [];
  for (let i = 1; i <= UNIFORM_GRID_COUNT; i++) {
    const n = String(i).padStart(2, "0");
    const file = `Movie Poster${n}.png`;
    items.push({
      src: `/images/beyond/movies/${encodeURIComponent(file)}`,
    });
  }
  return items;
}

/**
 * Fills a grid by cycling `01.jpg` … `0N.jpg` in `images/beyond/{folder}/`.
 * @param total - cell count (default 23 like Plants; gaming uses 16 for 4×4).
 */
function uniformNumberedImages(
  folder: string,
  fileCount: number,
  total: number = UNIFORM_GRID_COUNT,
): BeyondGridItem[] {
  const items: BeyondGridItem[] = [];
  for (let i = 1; i <= total; i++) {
    const n = ((i - 1) % fileCount) + 1;
    const fn = String(n).padStart(2, "0");
    items.push({ src: `/images/beyond/${folder}/${fn}.jpg` });
  }
  return items;
}

export const beyondMediaSections: BeyondSectionDefinition[] = [
  {
    id: "beyond-plants",
    variant: "plants",
    eyebrow: "01 — Plants",
    title: "Garden & 200+ plants",
    items: plantSectionItems(),
  },
  {
    id: "beyond-gaming",
    variant: "gaming",
    eyebrow: "02 — Gaming & stories",
    title: "Futuristic worlds & AI narratives",
    items: gamingSectionItems(),
  },
  {
    id: "beyond-movement",
    variant: "movement",
    eyebrow: "03 — Film & TV",
    title: "Films & series worth the marathon",
    items: moviesSectionItems(),
  },
  {
    id: "beyond-history",
    variant: "history",
    eyebrow: "04 — History",
    title: "Time & place",
    items: uniformNumberedImages("history", 6),
  },
  {
    id: "beyond-music",
    variant: "music",
    eyebrow: "05 — Music",
    title: "Keys & rhythm",
    items: uniformNumberedImages("music", 6),
  },
];
