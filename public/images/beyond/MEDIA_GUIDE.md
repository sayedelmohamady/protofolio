# Beyond the Interface — media files

**Hero copy** is in **`src/components/beyond/HeroSection.tsx`**.  
**Section titles** (eyebrow + heading) and the **media grid** are in **`src/lib/beyondMedia.ts`**.

## Hero

| File | Path |
|------|------|
| Full-bleed cover | `public/images/beyond/hero/hero.jpg` |

## Plants (first section after hero)

Put **23 JPEGs** in `public/images/beyond/plants/`:

`plant01.jpg`, `plant02.jpg`, … `plant23.jpg` (two-digit numbers).

They render as **horizontal stacks** (overlapping cards, rightmost on top): **up to 6 images per stack**, then the next stack starts; stacks are laid out in a **responsive grid of rows** (e.g. 6+6+6+5 → four stacks). Tweak `stackMax` or `layout` in `src/lib/beyondMedia.ts` if needed.

## Other sections

Place files to match **`beyondMedia.ts`**:

| Section | Folder | Images | Videos |
|---------|--------|--------|--------|
| Gaming | `images/beyond/gaming/` | `01.jpg` … `06.jpg` | `videos/beyond/gaming-reel.mp4` |
| Music | `images/beyond/music/` | `01.jpg` … `06.jpg` | — |
| Movement | `images/beyond/movement/` | `01.jpg` … `06.jpg` | `cycling-clip.mp4`, `swimming-clip.mp4` |
| History | `images/beyond/history/` | `01.jpg` … `06.jpg` | — |

Use **`.jpg`**, **`.png`**, or **`.webp`** — update extensions in `beyondMedia.ts` if needed.  
Videos: **`.mp4`** (muted loops work best).

Missing files are skipped automatically (no broken layout).
