import fs from "fs";
import path from "path";

export type CaseStudySlug =
  | "mabaat"
  | "otida"
  | "mnt-halan"
  | "club-tie"
  | "halan-design-system"
  | "etar";

const HTML_FILES: Record<CaseStudySlug, string> = {
  mabaat: "mabaat-case-study.html",
  otida: "otida-case-study.html",
  "mnt-halan": "project-case-study.html",
  "club-tie": "club-design-system-case-study.html",
  "halan-design-system": "halan-design-system-case-study.html",
  etar: "etar-case-study.html",
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
  if (filename.startsWith("etar-"))
    return `/images/projects/etar/${filename}`;
  if (filename.startsWith("halan-ds-"))
    return `/images/projects/halan-design-system/${filename}`;
  if (filename.startsWith("halan-"))
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

const TIMELINE_LOGO_ASSET_PATHS: Record<string, string> = {
  club: "/Users/sayedelmohamadysayedelmohamady/.cursor/projects/Users-sayedelmohamadysayedelmohamady-Downloads-Sayed-elmohamady/assets/image-3f176e52-1971-4956-9962-1e8b6e4a0212.png",
  halan: "/Users/sayedelmohamadysayedelmohamady/.cursor/projects/Users-sayedelmohamadysayedelmohamady-Downloads-Sayed-elmohamady/assets/image-9ca6ac65-4b4d-407b-90a6-1c4e5da21daa.png",
  mabaat: "/Users/sayedelmohamadysayedelmohamadysayedelmohamady/.cursor/projects/Users-sayedelmohamadysayedelmohamady-Downloads-Sayed-elmohamady/assets/image-8a93d831-4c2f-415c-8d10-9a46e7a6d296.png",
  orcas: "/Users/sayedelmohamadysayedelmohamady/.cursor/projects/Users-sayedelmohamadysayedelmohamady-Downloads-Sayed-elmohamady/assets/image-43a85179-3f7f-422a-9b3b-29c7ca7c965a.png",
  "wallet-erp":
    "/Users/sayedelmohamadysayedelmohamady/.cursor/projects/Users-sayedelmohamadysayedelmohamady-Downloads-Sayed-elmohamady/assets/image-1d061ca2-b1dc-4b51-9f77-c64f62c848e9.png",
  awammer:
    "/Users/sayedelmohamadysayedelmohamady/.cursor/projects/Users-sayedelmohamadysayedelmohamady-Downloads-Sayed-elmohamady/assets/image-74f459c5-137b-4c9a-8cd2-18243e350e48.png",
};

// Turbopack's server sandbox can’t reliably read `.cursor/.../assets` during SSR.
// Hard-code the Mabaat logo (the failing one) as a data URI.
const TIMELINE_LOGO_DATA_URI_OVERRIDES: Partial<Record<string, string>> = {
  mabaat:
    "data:image/png;base64,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",
};

const TIMELINE_LOGO_DATA_URI_CACHE: Record<string, string> = {};

function getTimelineLogoDataUri(key: string): string | null {
  const p = TIMELINE_LOGO_ASSET_PATHS[key];
  if (!p) return null;
  const override = TIMELINE_LOGO_DATA_URI_OVERRIDES[key];
  if (override) return override;
  if (TIMELINE_LOGO_DATA_URI_CACHE[key]) {
    return TIMELINE_LOGO_DATA_URI_CACHE[key];
  }
  if (!fs.existsSync(p)) {
    // Avoid crashing the whole page if the local dev asset is missing.
    // (Also helps debugging path issues.)
    // eslint-disable-next-line no-console
    console.warn("[timeline] missing logo asset", { key, p });
    return null;
  }
  const buf = fs.readFileSync(p);
  const dataUri = `data:image/png;base64,${buf.toString("base64")}`;
  TIMELINE_LOGO_DATA_URI_CACHE[key] = dataUri;
  return dataUri;
}

function injectHomeTimelineLogoSrc(html: string): string {
  return html.replace(
    /<img([^>]*?)data-logo="([^"]+)"([^>]*?)>/g,
    (full, pre: string, key: string, post: string) => {
      const src = getTimelineLogoDataUri(key);
      if (!src) return full;
      // Keep original attributes; just add `src` to the logo tag.
      // If the source tag was self-closing, `post` might end with `/`; strip it.
      const cleanedPost = post.replace(/\s*\/\s*$/, "");
      return `<img${pre}data-logo="${key}"${cleanedPost} src="${src}">`;
    },
  );
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
    /href="halan-design-system-case-study\.html"/g,
    'href="/work/halan-design-system"',
  );
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
  inner = inner.replace(
    /href="etar-case-study\.html"/g,
    'href="/work/etar"',
  );
  inner = rewriteImgSrc(inner);
  inner = rewriteVideoPoster(inner);
  inner = injectHomeTimelineLogoSrc(inner);
  inner = enhanceImageLoading(inner);
  return inner;
}
