import fs from "fs";
import path from "path";

export type CaseStudySlug = "mabaat" | "otida" | "mnt-halan" | "club-tie";

const HTML_FILES: Record<CaseStudySlug, string> = {
  mabaat: "mabaat-case-study.html",
  otida: "otida-case-study.html",
  "mnt-halan": "project-case-study.html",
  "club-tie": "club-design-system-case-study.html",
};

function mapImageSrc(filename: string): string {
  if (filename.startsWith("http://") || filename.startsWith("https://"))
    return filename;
  if (filename === "sayed-photo.png") return "/images/personal/sayed-photo.png";
  if (filename === "Group 162327.png" || filename === "club-card-bg.png")
    return "/images/ui/group-162327.png";
  if (filename.startsWith("mabaat-"))
    return `/images/projects/mabaat/${filename}`;
  if (filename.startsWith("otida-"))
    return `/images/projects/otida/${filename}`;
  if (filename.startsWith("mnt-halan"))
    return `/images/projects/mnt-halan/${filename}`;
  if (filename.startsWith("club-"))
    return `/images/projects/club-tie/${filename}`;
  if (filename === "mabaat-card-bg.png")
    return "/images/projects/mabaat/mabaat-card-bg.png";
  if (filename === "otida-card-bg.png")
    return "/images/projects/otida/otida-card-bg.png";
  return filename;
}

function rewriteImgSrc(html: string): string {
  return html.replace(/src="([^"]+)"/g, (_, src: string) => {
    const next = mapImageSrc(src);
    return `src="${next}"`;
  });
}

function rewriteVideoPoster(html: string): string {
  return html.replace(/poster="([^"]+)"/g, (_, src: string) => {
    const next = mapImageSrc(src);
    return `poster="${next}"`;
  });
}

/** Adds lazy-loading for below-the-fold images; prioritizes hero portrait for LCP. */
function enhanceImageLoading(html: string): string {
  return html.replace(/<img(\s[^>]+)>/gi, (full, attrs: string) => {
    if (/\sloading\s*=/i.test(attrs)) return full;
    const isHeroPhoto = /\bhero-photo\b/i.test(attrs);
    if (isHeroPhoto) {
      if (/\sfetchpriority\s*=/i.test(attrs)) return full;
      return `<img${attrs} fetchpriority="high" decoding="async">`;
    }
    if (/\sdecoding\s*=/i.test(attrs)) {
      return `<img${attrs} loading="lazy">`;
    }
    return `<img${attrs} loading="lazy" decoding="async">`;
  });
}

function extractBodyInner(html: string): string {
  const bodyOpen = html.match(/<body[^>]*>/i);
  if (!bodyOpen || bodyOpen.index === undefined) {
    throw new Error("Missing <body> in case study HTML");
  }
  const start = bodyOpen.index + bodyOpen[0].length;
  const scriptIdx = html.indexOf("<script", start);
  const end = scriptIdx === -1 ? html.search(/<\/body>/i) : scriptIdx;
  if (end === -1) return html.slice(start);
  return html.slice(start, end);
}

export function getCaseStudyBodyHtml(slug: CaseStudySlug): string {
  const file = HTML_FILES[slug];
  const full = path.join(process.cwd(), "reference/html", file);
  const raw = fs.readFileSync(full, "utf8");
  let inner = extractBodyInner(raw);
  inner = inner.replace(/<nav class="top-nav">[\s\S]*?<\/nav>\s*/i, "");
  inner = inner.replace(/href="index\.html"/g, 'href="/"');
  inner = rewriteImgSrc(inner);
  inner = enhanceImageLoading(inner);
  if (slug === "club-tie") {
    inner = inner.replace(
      /onclick="switchTab\(this,'([^']+)'\)"/g,
      'type="button" data-case-tab="$1"',
    );
  }
  return inner;
}

export function getHomeBodyHtml(): string {
  const full = path.join(process.cwd(), "reference/html/index.html");
  const raw = fs.readFileSync(full, "utf8");
  let inner = extractBodyInner(raw);
  inner = inner.replace(
    /href="mabaat-case-study\.html"/g,
    'href="/work/mabaat"',
  );
  inner = inner.replace(
    /href="otida-case-study\.html"/g,
    'href="/work/otida"',
  );
  inner = inner.replace(
    /href="project-case-study\.html"/g,
    'href="/work/mnt-halan"',
  );
  inner = inner.replace(
    /href="club-design-system-case-study\.html"/g,
    'href="/work/club-tie"',
  );
  inner = rewriteImgSrc(inner);
  inner = rewriteVideoPoster(inner);
  inner = enhanceImageLoading(inner);
  return inner;
}
