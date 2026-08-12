#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";

const ROOT = new URL("../", import.meta.url);
const SITE_JSON = new URL("data/site.json", ROOT);
const CHECK_ONLY = process.argv.includes("--check");

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const escapeText = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

function normalizedBaseUrl(value) {
  const url = new URL(value);
  url.pathname = url.pathname.replace(/\/+$/, "") + "/";
  url.search = "";
  url.hash = "";
  return url;
}

function absoluteUrl(baseUrl, path) {
  return new URL(String(path).replace(/^\//, ""), baseUrl).href;
}

function compactJsonLd(value) {
  return JSON.stringify(value, null, 2).replaceAll("<", "\\u003c");
}

function pageJsonLd({ pageKey, page, site, baseUrl }) {
  const pageUrl = absoluteUrl(baseUrl, page.path);
  const homeUrl = absoluteUrl(baseUrl, "/");

  if (pageKey === "home") {
    const sameAs = (site.links || [])
      .map((link) => link.href)
      .filter((href) => /^https?:\/\//i.test(href));

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          name: site.meta.siteName,
          url: homeUrl,
        },
        {
          "@type": "Person",
          name: site.profile.name,
          url: homeUrl,
          image: absoluteUrl(baseUrl, site.profile.avatar),
          jobTitle: site.meta.person?.jobTitle || site.profile.kicker,
          description: site.profile.role,
          sameAs,
        },
      ],
    };
  }

  if (pageKey === "portfolio") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: page.title,
          url: pageUrl,
          isPartOf: {
            "@type": "WebSite",
            name: site.meta.siteName,
            url: homeUrl,
          },
          about: {
            "@type": "Person",
            name: site.profile.name,
            url: homeUrl,
          },
        },
      ],
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    url: pageUrl,
  };
}

function seoBlock({ pageKey, page, site, baseUrl }) {
  const meta = site.meta;
  const pageUrl = absoluteUrl(baseUrl, page.path);
  const imageUrl = absoluteUrl(baseUrl, page.socialImage || meta.socialImage);
  const title = page.title;
  const description = page.description;
  const ogTitle = page.ogTitle || title;
  const ogDescription = page.ogDescription || description;
  const jsonLd = pageJsonLd({ pageKey, page, site, baseUrl });

  return `<!-- SEO:START -->
  <!-- Generated from data/site.json by scripts/generate-seo.mjs. Do not edit this block manually. -->
  <title>${escapeText(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${escapeHtml(page.robots || meta.robots)}">
  <link rel="canonical" href="${escapeHtml(pageUrl)}">
  <meta property="og:type" content="${escapeHtml(page.ogType || "website")}">
  <meta property="og:site_name" content="${escapeHtml(meta.siteName)}">
  <meta property="og:locale" content="${escapeHtml(page.locale || meta.locale)}">
  <meta property="og:title" content="${escapeHtml(ogTitle)}">
  <meta property="og:description" content="${escapeHtml(ogDescription)}">
  <meta property="og:url" content="${escapeHtml(pageUrl)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:width" content="${escapeHtml(meta.socialImageWidth)}">
  <meta property="og:image:height" content="${escapeHtml(meta.socialImageHeight)}">
  <meta property="og:image:type" content="${escapeHtml(meta.socialImageType)}">
  <meta property="og:image:alt" content="${escapeHtml(page.socialImageAlt || meta.socialImageAlt)}">
  <meta name="twitter:card" content="${escapeHtml(page.twitterCard || meta.twitterCard)}">
  <meta name="twitter:title" content="${escapeHtml(page.twitterTitle || ogTitle)}">
  <meta name="twitter:description" content="${escapeHtml(page.twitterDescription || ogDescription)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
  <meta name="twitter:image:alt" content="${escapeHtml(page.socialImageAlt || meta.socialImageAlt)}">
  <script type="application/ld+json">
${compactJsonLd(jsonLd).split("\n").map((line) => `    ${line}`).join("\n")}
  </script>
  <!-- SEO:END -->`;
}

function homeNoscript(site) {
  const links = (site.links || []).map((link) =>
    `          <li><a href="${escapeHtml(link.href)}">${escapeText(link.label)}</a></li>`
  ).join("\n");

  return `<!-- NOSCRIPT:START -->
  <!-- Generated from data/site.json by scripts/generate-seo.mjs. Do not edit this block manually. -->
  <noscript>
    <main>
      <h1>${escapeText(site.profile.name)}</h1>
      <p>${escapeText(site.profile.role)}</p>
      <p>${escapeText(site.profile.summary)}</p>
      <p><a href="portfolio.html">${escapeText(site.labels.portfolio)}</a></p>
      <nav aria-label="Profile and contact links">
        <ul>
${links}
        </ul>
      </nav>
    </main>
  </noscript>
  <!-- NOSCRIPT:END -->`;
}

function portfolioNoscript(site) {
  const projects = (site.portfolio?.projects || []).map((project) => {
    const tags = project.tags?.length
      ? `\n        <p>Technologies: ${escapeText(project.tags.join(", "))}.</p>`
      : "";
    const links = (project.links || []).map((link) =>
      `\n        <p><a href="${escapeHtml(link.href)}">${escapeText(link.label)}</a></p>`
    ).join("");
    return `      <article>\n        <h2>${escapeText(project.name)}</h2>\n        <p>${escapeText(project.description)}</p>${tags}${links}\n      </article>`;
  }).join("\n");

  return `<!-- NOSCRIPT:START -->
  <!-- Generated from data/site.json by scripts/generate-seo.mjs. Do not edit this block manually. -->
  <noscript>
    <main>
      <h1>${escapeText(site.portfolio.title)}</h1>
${projects}
    </main>
  </noscript>
  <!-- NOSCRIPT:END -->`;
}

function replaceMarkedBlock(source, marker, replacement) {
  const start = `<!-- ${marker}:START -->`;
  const end = `<!-- ${marker}:END -->`;
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(`Missing ${marker} markers`);
  }

  return source.slice(0, startIndex) + replacement + source.slice(endIndex + end.length);
}

async function updateFile(url, transform) {
  const current = await readFile(url, "utf8");
  const next = transform(current);

  if (CHECK_ONLY) {
    if (current !== next) {
      throw new Error(`${url.pathname.split("/").pop()} is out of date. Run: node scripts/generate-seo.mjs`);
    }
    return;
  }

  if (current !== next) await writeFile(url, next);
}

const site = JSON.parse(await readFile(SITE_JSON, "utf8"));
if (!site.meta?.defaultDeployment || !site.meta?.deployments) {
  throw new Error("data/site.json must contain meta.defaultDeployment and meta.deployments");
}

const deploymentName = process.env.SITE_DEPLOYMENT || site.meta.defaultDeployment;
const deployment = site.meta.deployments[deploymentName];
if (!deployment?.siteUrl) {
  throw new Error(`Unknown SITE_DEPLOYMENT: ${deploymentName}`);
}
const baseUrl = normalizedBaseUrl(deployment.siteUrl);
const pageFiles = {
  home: "index.html",
  portfolio: "portfolio.html",
};

for (const [pageKey, fileName] of Object.entries(pageFiles)) {
  const page = site.meta[pageKey];
  if (!page) throw new Error(`Missing meta.${pageKey}`);
  const fileUrl = new URL(fileName, ROOT);
  await updateFile(fileUrl, (html) => {
    let next = html.replace(/<html lang="[^"]*">/, `<html lang="${escapeHtml(page.lang || site.meta.lang)}">`);
    next = replaceMarkedBlock(next, "SEO", seoBlock({ pageKey, page, site, baseUrl }));
    next = replaceMarkedBlock(next, "NOSCRIPT", pageKey === "home" ? homeNoscript(site) : portfolioNoscript(site));
    return next;
  });
}

const indexedPages = Object.entries(pageFiles)
  .map(([pageKey]) => site.meta[pageKey])
  .filter((page) => page && page.index !== false);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexedPages.map((page) => `  <url>\n    <loc>${escapeText(absoluteUrl(baseUrl, page.path))}</loc>\n  </url>`).join("\n")}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl(baseUrl, "/sitemap.xml")}\n`;

await updateFile(new URL("sitemap.xml", ROOT), () => sitemap);
await updateFile(new URL("robots.txt", ROOT), () => robots);

if (!CHECK_ONLY) {
  console.log(`SEO generated from data/site.json using deployment "${deploymentName}" (${baseUrl.origin})`);
}
