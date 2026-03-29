/**
 * Beyond the Interface — media grids.
 * Plants: `public/images/beyond/plants/plant01.jpg` … `plant23.jpg`
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

/** 23 plant photos: plant01.jpg … plant23.jpg */
function plantSectionItems(): BeyondGridItem[] {
  const items: BeyondGridItem[] = [];
  for (let i = 1; i <= 23; i++) {
    const n = String(i).padStart(2, "0");
    items.push({ src: `/images/beyond/plants/plant${n}.jpg` });
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
    items: [
      { src: "/videos/beyond/gaming-reel.mp4", type: "video", span: "full" },
      { src: "/images/beyond/gaming/01.jpg", span: "wide" },
      { src: "/images/beyond/gaming/02.jpg" },
      { src: "/images/beyond/gaming/03.jpg" },
      { src: "/images/beyond/gaming/04.jpg", span: "tall" },
      { src: "/images/beyond/gaming/05.jpg" },
      { src: "/images/beyond/gaming/06.jpg" },
    ],
  },
  {
    id: "beyond-music",
    variant: "music",
    eyebrow: "03 — Music",
    title: "Keys & rhythm",
    items: [
      { src: "/images/beyond/music/01.jpg", span: "full" },
      { src: "/images/beyond/music/02.jpg", span: "wide" },
      { src: "/images/beyond/music/03.jpg" },
      { src: "/images/beyond/music/04.jpg" },
      { src: "/images/beyond/music/05.jpg", span: "tall" },
      { src: "/images/beyond/music/06.jpg" },
    ],
  },
  {
    id: "beyond-movement",
    variant: "movement",
    eyebrow: "04 — Movement",
    title: "Road & water",
    items: [
      { src: "/videos/beyond/cycling-clip.mp4", type: "video", span: "wide" },
      { src: "/videos/beyond/swimming-clip.mp4", type: "video", span: "wide" },
      { src: "/images/beyond/movement/01.jpg", span: "tall" },
      { src: "/images/beyond/movement/02.jpg" },
      { src: "/images/beyond/movement/03.jpg" },
      { src: "/images/beyond/movement/04.jpg", span: "wide" },
      { src: "/images/beyond/movement/05.jpg" },
      { src: "/images/beyond/movement/06.jpg" },
    ],
  },
  {
    id: "beyond-history",
    variant: "history",
    eyebrow: "05 — History",
    title: "Time & place",
    items: [
      { src: "/images/beyond/history/01.jpg", span: "full" },
      { src: "/images/beyond/history/02.jpg" },
      { src: "/images/beyond/history/03.jpg", span: "tall" },
      { src: "/images/beyond/history/04.jpg" },
      { src: "/images/beyond/history/05.jpg", span: "wide" },
      { src: "/images/beyond/history/06.jpg" },
    ],
  },
];
