import fs from "fs";
import path from "path";

export type CaseStudySlug =
  | "mabaat"
  | "otida"
  | "mnt-halan"
  | "club-tie"
  | "club-experience"
  | "club-app"
  | "club-dashboard"
  | "halan-design-system"
  | "gatherup-design-system"
  | "etar"
  | "club-levels"
  | "club-platform";

const HTML_FILES: Record<CaseStudySlug, string> = {
  mabaat: "mabaat-case-study.html",
  otida: "otida-case-study.html",
  "mnt-halan": "project-case-study.html",
  "club-tie": "club-design-system-case-study.html",
  "club-experience": "club-experience-case-study.html",
  "club-app": "club-app-case-study.html",
  "club-dashboard": "club-dashboard-case-study.html",
  "halan-design-system": "halan-design-system-case-study.html",
  "gatherup-design-system": "gatherup-design-system-case-study.html",
  etar: "etar-case-study.html",
  "club-levels": "club-levels-case-study.html",
  "club-platform": "club-platform-case-study.html",
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
  if (filename.startsWith("club-dashboard-"))
    return `/images/projects/club-dashboard/${filename}`;
  if (
    filename.startsWith("club-level-") ||
    filename.startsWith("club-levels-")
  )
    return `/images/projects/club-levels/${filename}`;
  if (filename === "level-structure.png")
    return "/images/projects/club-tie/level-structure.png";
  if (filename === "levels-types.png")
    return "/images/projects/club-tie/levels-types.png";
  if (filename.startsWith("halan-ds-"))
    return `/images/projects/halan-design-system/${filename}`;
  if (
    filename.startsWith("gatherup-ds-") ||
    filename.startsWith("gatherup-flow-") ||
    filename.startsWith("gatherup-design-system")
  )
    return `/images/projects/gatherup-design-system/${filename}`;
  if (filename.startsWith("halan-"))
    return `/images/projects/mnt-halan/${filename}`;
  if (
    filename === "Cash reward.png" ||
    filename === "Gift Card reward.png" ||
    filename === "Product reward.png" ||
    filename === "Reward icon group.png" ||
    filename === "Value.png" ||
    filename === "Button.png" ||
    filename === "Image.png" ||
    filename === "Brand avatar.png" ||
    filename === "App template 10.png" ||
    filename === "Mission Card App📱.png" ||
    filename === "Missions.png" ||
    filename === "Notifications-01.png"
  )
    return `/images/projects/club-tie/${filename.replace(/ /g, "%20")}`;
  if (
    filename.startsWith("Missions-screen-") ||
    filename.startsWith("brand-hub-screen-") ||
    filename.startsWith("brand-screen-") ||
    filename.startsWith("notifications-screen-") ||
    filename.startsWith("onboarding-screen-") ||
    filename.startsWith("dashboard-screen-")
  )
    return `/images/projects/club-tie/${filename}`;
  if (
    filename.startsWith("club-") ||
    filename.startsWith("tie-") ||
    filename.startsWith("mission-") ||
    filename.startsWith("missions-") ||
    filename.startsWith("wallet-") ||
    filename.startsWith("rewards-") ||
    filename.startsWith("brand-") ||
    filename.startsWith("progress-") ||
    filename.startsWith("settings-")
  )
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

/**
 * Experience timeline logos under `public/images/timeline-logos/`.
 * Previously we read from `.cursor/...`; Turbopack’s SSR sandbox often blocked
 * that, so some `<img data-logo>` tags shipped without `src` and React reported
 * hydration mismatches.
 */
const TIMELINE_LOGO_PUBLIC_FILES: Record<string, string> = {
  club: "club.png",
  halan: "halan.png",
  mabaat: "mabaat.png",
  orcas: "orcas.png",
  "wallet-erp": "wallet-erp.png",
  awammer: "awammer.png",
  otida: "otida.png",
  etar: "etar.svg",
};

function injectHomeTimelineLogoSrc(html: string): string {
  return html.replace(
    /<img([^>]*?)data-logo="([^"]+)"([^>]*?)>/g,
    (full, pre: string, key: string, post: string) => {
      const file = TIMELINE_LOGO_PUBLIC_FILES[key];
      if (!file) return full;
      const cleanedPost = post.replace(/\s*\/\s*$/, "");
      return `<img${pre}data-logo="${key}"${cleanedPost} src="/images/timeline-logos/${file}">`;
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

/**
 * Forces every <video> to preload="none" so browsers only fetch them when
 * actually played. Authored HTML sometimes sets preload="auto" (e.g. homepage
 * case cards) which would otherwise eagerly download 50MB+ on landing.
 * Companion runtime code starts playback once the video scrolls into view.
 */
function enhanceVideoLoading(html: string): string {
  return html.replace(/<video(\s[^>]*)>/gi, (_full, attrs: string) => {
    const isHoverPlay = /\sdata-hover-play(?=\s|$|=)/i.test(attrs);
    const stripped = attrs
      .replace(/\spreload\s*=\s*"[^"]*"/gi, "")
      .replace(/\sautoplay(?=\s|$)/gi, " data-autoplay")
      .replace(/\sautoplay=""/gi, ' data-autoplay=""');
    // Hover-play cards need a first frame; metadata is enough without full download.
    const preload = isHoverPlay ? "metadata" : "none";
    return `<video${stripped} preload="${preload}">`;
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
  inner = enhanceVideoLoading(inner);
  if (slug === "club-tie") {
    inner = inner.replace(
      /onclick="switchTab\(this,'([^']+)'\)"/g,
      'type="button" data-case-tab="$1"',
    );
  }
  return inner;
}

function extractHtmlBetweenComments(
  raw: string,
  startComment: string,
  endComment: string,
): string {
  const start = raw.indexOf(startComment);
  const end = raw.indexOf(endComment, start);
  if (start === -1 || end === -1) return "";
  return raw.slice(start + startComment.length, end).trim();
}

function rewriteCaseStudyHrefs(html: string): string {
  return html
    .replace(
      /href="halan-design-system-case-study\.html"/g,
      'href="/work/halan-design-system"',
    )
    .replace(
      /href="gatherup-design-system-case-study\.html"/g,
      'href="/work/gatherup-design-system"',
    )
    .replace(/href="mabaat-case-study\.html"/g, 'href="/work/mabaat"')
    .replace(/href="otida-case-study\.html"/g, 'href="/work/otida"')
    .replace(/href="project-case-study\.html"/g, 'href="/work/mnt-halan"')
    .replace(
      /href="club-design-system-case-study\.html"/g,
      'href="/work/club-tie"',
    )
    .replace(
      /href="club-experience-case-study\.html"/g,
      'href="/work/club-experience"',
    )
    .replace(/href="etar-case-study\.html"/g, 'href="/work/etar"')
    .replace(/href="club-levels-case-study\.html"/g, 'href="/work/club-levels"');
}

export function getWorkPageHtml(): string {
  const full = path.join(process.cwd(), "reference/html/index.html");
  const raw = fs.readFileSync(full, "utf8");

  let nav = extractHtmlBetweenComments(
    raw,
    "<!-- ═══ NAV ═══ -->",
    "<!-- ═══ HERO ═══ -->",
  );
  nav = nav
    .replace(/href="#about"/g, 'href="/#about"')
    .replace(/href="#experience"/g, 'href="/#experience"')
    .replace(/href="#contact"/g, 'href="/#contact"')
    .replace(
      'href="/work" class="pressable" data-section="work"',
      'href="/work" class="pressable is-active" data-section="work"',
    );

  let section = extractHtmlBetweenComments(
    raw,
    "<!-- ═══ CASE STUDIES ═══ -->",
    "<!-- ═══ ARTICLES",
  );
  section = rewriteCaseStudyHrefs(section);
  section = rewriteImgSrc(section);
  section = rewriteVideoPoster(section);
  section = enhanceImageLoading(section);
  section = enhanceVideoLoading(section);

  const footer = extractHtmlBetweenComments(
    raw,
    "<!-- ═══ FOOTER ═══ -->",
    "<!-- ═══ SCRIPTS ═══ -->",
  );

  return `<div class="cursor-glow" id="cursorGlow"></div>\n${nav}\n${section}\n${footer}`;
}

export function getArticlesPageHtml(): string {
  const full = path.join(process.cwd(), "reference/html/index.html");
  const raw = fs.readFileSync(full, "utf8");

  let nav = extractHtmlBetweenComments(
    raw,
    "<!-- ═══ NAV ═══ -->",
    "<!-- ═══ HERO ═══ -->",
  );
  nav = nav
    .replace(/href="#about"/g, 'href="/#about"')
    .replace(/href="#experience"/g, 'href="/#experience"')
    .replace(/href="#contact"/g, 'href="/#contact"')
    .replace(
      'href="/articles" class="pressable" data-section="articles"',
      'href="/articles" class="pressable is-active" data-section="articles"',
    );

  let section = extractHtmlBetweenComments(
    raw,
    "<!-- ═══ ARTICLES & COMMUNITY — horizontal rail ═══ -->",
    "<!-- ═══ ABOUT",
  );
  section = section
    .replace(
      'class="articles-rail-outer rv" data-reveal-delay="100"',
      'class="articles-grid-outer rv" data-reveal-delay="100"',
    )
    .replace(
      /class="articles-rail"[^>]*>/,
      'class="articles-grid" role="list" aria-label="Featured writing and appearances">',
    )
    .replace(/href="#contact"/g, 'href="/#contact"');
  section = rewriteImgSrc(section);
  section = enhanceImageLoading(section);

  const footer = extractHtmlBetweenComments(
    raw,
    "<!-- ═══ FOOTER ═══ -->",
    "<!-- ═══ SCRIPTS ═══ -->",
  );

  return `<div class="cursor-glow" id="cursorGlow"></div>\n${nav}\n${section}\n${footer}`;
}

export function getHomeBodyHtml(): string {
  const full = path.join(process.cwd(), "reference/html/index.html");
  const raw = fs.readFileSync(full, "utf8");
  let inner = extractBodyInner(raw);
  inner = rewriteCaseStudyHrefs(inner);
  inner = rewriteImgSrc(inner);
  inner = rewriteVideoPoster(inner);
  inner = injectHomeTimelineLogoSrc(inner);
  inner = enhanceImageLoading(inner);
  inner = enhanceVideoLoading(inner);
  return inner;
}
