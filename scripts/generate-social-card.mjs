#!/usr/bin/env node

import {access, mkdir, readFile} from "node:fs/promises";
import {dirname} from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";
import sharp from "sharp";

const ROOT = new URL("../", import.meta.url);
const SITE_JSON = new URL("data/site.json", ROOT);
const THEME_JSON = new URL("data/theme.json", ROOT);
const CHECK_ONLY = process.argv.includes("--check");

const DEFAULT_THEME = {
    bg: "#070713",
    "bg-deep": "#02030a",
    surface: "rgba(7, 7, 20, 0.56)",
    text: "#f7f5ff",
    "text-muted": "#b2aec2",
    "text-soft": "#817c91",
    border: "rgba(172, 139, 255, 0.58)",
    "border-soft": "rgba(172, 139, 255, 0.24)",
    accent: "#a996ff",
    "accent-strong": "#7d7cff",
    "chip-bg": "rgba(168, 140, 255, 0.075)",
    "chip-border": "rgba(188, 157, 255, 0.58)",
    glow: "rgba(105, 87, 255, 0.38)",
    "ambient-glow": "rgba(100, 74, 255, 0.86)",
};

function escapeXml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function normalizedBaseUrl(value) {
    const url = new URL(value);
    url.pathname = url.pathname.replace(/\/+$/, "") + "/";
    url.search = "";
    url.hash = "";
    return url;
}

function wrapWords(value, maxChars = 38, maxLines = 2) {
    const words = String(value).trim().split(/\s+/).filter(Boolean);
    const lines = [];
    let current = "";

    for (let index = 0; index < words.length; index += 1) {
        const word = words[index];
        const next = current ? `${current} ${word}` : word;

        if (next.length <= maxChars) {
            current = next;
            continue;
        }

        if (lines.length === maxLines - 1) {
            const remainder = [current, ...words.slice(index)].filter(Boolean).join(" ");
            current =
                remainder.length <= maxChars
                    ? remainder
                    : `${remainder.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…`;
            break;
        }

        if (current) lines.push(current);
        current =
            word.length <= maxChars
                ? word
                : `${word.slice(0, Math.max(1, maxChars - 1))}…`;
    }

    if (current && lines.length < maxLines) lines.push(current);
    return lines.slice(0, maxLines);
}

function getSkillLabel(skill) {
    if (typeof skill === "string") return skill.trim();

    if (skill && typeof skill === "object") {
        const value =
            skill.label ??
            skill.title ??
            skill.name ??
            skill.text ??
            skill.value ??
            "";
        return String(value).trim();
    }

    return String(skill ?? "").trim();
}

async function measureTextWidth(text, fontSize) {
    const { info } = await sharp({
        text: {
            text,
            font: `Inter ${fontSize}`,
            dpi: 72,
            rgba: true,
        },
    })
        .png()
        .toBuffer({ resolveWithObject: true });

    return info.width;
}

function nameFontSize(name) {
    if (name.length > 30) return 50;
    if (name.length > 24) return 56;
    if (name.length > 19) return 61;
    return 66;
}

async function loadTheme() {
    try {
        const themeJson = JSON.parse(await readFile(THEME_JSON, "utf8"));
        return {...DEFAULT_THEME, ...(themeJson.themes?.dark || {})};
    } catch {
        return DEFAULT_THEME;
    }
}

function textLinesSvg(lines, {x, y, lineHeight, fontSize, fill, weight = 400}) {
    return `<text x="${x}" y="${y}" fill="${fill}" font-size="${fontSize}" font-weight="${weight}" font-family="Inter, 'Segoe UI', Arial, sans-serif">${lines
        .map(
            (line, index) =>
                `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
        )
        .join("")}</text>`;
}

async function buildSvg({width, height, site, theme, host}) {
    const profile = site.profile || {};
    const kicker =
        profile.kicker || site.meta?.person?.jobTitle || "SOFTWARE ENGINEER";
    const name = profile.name || site.meta?.siteName || "";
    const handle = profile.handle || "";
    const role = profile.role || site.meta?.home?.description || "";
    const roleLines = wrapWords(role, 38, 2);
    const titleSize = nameFontSize(name);

    const sx = width / 1200;
    const sy = height / 630;
    const s = Math.min(sx, sy);
    const X = (v) => Math.round(v * sx * 100) / 100;
    const Y = (v) => Math.round(v * sy * 100) / 100;
    const S = (v) => Math.round(v * s * 100) / 100;

    const skills = (site.skills || [])
        .map(getSkillLabel)
        .filter(Boolean)
        .slice(0, 3);

    const chipStartX = X(108);
    const chipY = Y(424);
    const chipHeight = Y(40);
    const chipGap = X(10);
    const chipPaddingX = X(15);

    const avatarCx = X(934);
    const avatarCy = Y(314);
    const avatarOuterRadius = S(153);

    const chipRightLimit =
        avatarCx -
        avatarOuterRadius -
        X(30);

    let chipX = chipStartX;
    const chipMarkup = [];

    for (const skill of skills) {
        const measuredTextWidth = await measureTextWidth(
            skill,
            S(16.5),
        );

        // Actual rendered text width + 15px padding on both sides.
        const chipWidth = measuredTextWidth + chipPaddingX * 2;

        // Don't render a mangled/truncated chip.
        // If it doesn't fit, just stop.
        if (chipX + chipWidth > chipRightLimit) {
            break;
        }

        chipMarkup.push(`
    <g>
      <rect
        x="${chipX}"
        y="${chipY}"
        width="${chipWidth}"
        height="${chipHeight}"
        rx="${S(20)}"
        fill="${theme["chip-bg"]}"
        stroke="${theme["chip-border"]}"
        stroke-width="${S(1)}"
      />

      <text
        x="${chipX + chipPaddingX}"
        y="${chipY + Y(26)}"
        fill="${theme["text-muted"]}"
        font-size="${S(16.5)}"
        font-weight="400"
        font-family="Inter, 'Segoe UI', Arial, sans-serif"
      >${escapeXml(skill)}</text>
    </g>
  `);

        chipX += chipWidth + chipGap;
    }

    const chips = chipMarkup.join("");

    const kickerX = X(108);
    const kickerY = Y(105);
    const kickerHeight = Y(37);
    const kickerFontSize = S(15.5);
    const kickerPaddingX = X(13);
    const kickerLetterSpacing = S(0.35);

    const kickerTextWidth = await measureTextWidth(
        kicker,
        kickerFontSize,
    );

    const kickerWidth = Math.ceil(
        kickerTextWidth +
        kickerPaddingX * 2 +
        X(4)
    );

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${theme.bg}"/>
      <stop offset="0.78" stop-color="${theme["bg-deep"]}"/>
      <stop offset="1" stop-color="#09071c"/>
    </linearGradient>
    <radialGradient id="glowLeft" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${X(
        60
    )} ${Y(80)}) rotate(32) scale(${X(410)} ${Y(390)})">
      <stop offset="0" stop-color="${theme["ambient-glow"]}" stop-opacity="0.62"/>
      <stop offset="0.42" stop-color="${theme["accent-strong"]}" stop-opacity="0.19"/>
      <stop offset="1" stop-color="${theme["bg-deep"]}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowRight" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${X(
        1115
    )} ${Y(620)}) rotate(-130) scale(${X(360)} ${Y(290)})">
      <stop offset="0" stop-color="${theme["ambient-glow"]}" stop-opacity="0.44"/>
      <stop offset="0.5" stop-color="${theme["accent-strong"]}" stop-opacity="0.15"/>
      <stop offset="1" stop-color="${theme["bg-deep"]}" stop-opacity="0"/>
    </radialGradient>
    <filter id="panelShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${Y(16)}" stdDeviation="${S(24)}" flood-color="#000000" flood-opacity="0.42"/>
    </filter>
    <filter id="avatarShadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="${Y(12)}" stdDeviation="${S(18)}" flood-color="#000000" flood-opacity="0.48"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glowLeft)"/>
  <rect width="${width}" height="${height}" fill="url(#glowRight)"/>

  <g filter="url(#panelShadow)">
    <rect x="${X(52)}" y="${Y(56)}" width="${X(1096)}" height="${Y(
        520
    )}" rx="${S(48)}" fill="${theme.surface}" stroke="${
        theme.border
    }" stroke-width="${S(1.35)}"/>
  </g>

   <rect
    x="${kickerX}"
    y="${kickerY}"
    width="${kickerWidth}"
    height="${kickerHeight}"
    rx="${kickerHeight / 2}"
    fill="${theme["chip-bg"]}"
    stroke="${theme["chip-border"]}"
    stroke-width="${S(1)}"
  />

  <text
    x="${kickerX + kickerWidth / 2}"
    y="${kickerY + kickerHeight / 2}"
    fill="${theme.accent}"
    font-size="${kickerFontSize}"
    font-weight="500"
    letter-spacing="${kickerLetterSpacing}"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="Inter, 'Segoe UI', Arial, sans-serif"
  >${escapeXml(kicker)}</text>

  <text x="${X(108)}" y="${Y(226)}" fill="${theme.text}" font-size="${S(
        titleSize
    )}" font-weight="600" letter-spacing="${S(
        -1.7
    )}" font-family="Inter, 'Segoe UI', Arial, sans-serif">${escapeXml(
        name
    )}</text>
  <text x="${X(108)}" y="${Y(266)}" fill="${
        theme["text-muted"]
    }" font-size="${S(25)}" font-weight="400" font-family="Inter, 'Segoe UI', Arial, sans-serif">${escapeXml(
        handle
    )}</text>

  ${textLinesSvg(roleLines, {
        x: X(108),
        y: Y(334),
        lineHeight: Y(37),
        fontSize: S(30),
        fill: theme.text,
        weight: 400,
    })}

  ${chips}

  <text x="${X(108)}" y="${Y(540)}" fill="${
        theme["text-soft"]
    }" font-size="${S(17)}" font-weight="400" font-family="Inter, 'Segoe UI', Arial, sans-serif">${escapeXml(
        host
    )}</text>

  <g filter="url(#avatarShadow)">
    <circle cx="${avatarCx}" cy="${avatarCy}" r="${S(
        153
    )}" fill="rgba(0,0,0,0.16)" stroke="${theme.accent}" stroke-width="${S(2.5)}"/>
    <circle cx="${avatarCx}" cy="${avatarCy}" r="${S(
        145
    )}" fill="none" stroke="${theme["border-soft"]}" stroke-width="${S(1.25)}"/>
    <circle cx="${avatarCx}" cy="${avatarCy}" r="${S(
        140
    )}" fill="none" stroke="#f3efff" stroke-opacity="0.92" stroke-width="${S(1.5)}"/>
  </g>
</svg>`;
}

async function fileExists(url) {
    try {
        await access(url);
        return true;
    } catch {
        return false;
    }
}

const site = JSON.parse(await readFile(SITE_JSON, "utf8"));
const theme = await loadTheme();

if (!site.meta?.defaultDeployment || !site.meta?.deployments) {
    throw new Error("data/site.json must contain meta.defaultDeployment and meta.deployments");
}

const deploymentName = process.env.SITE_DEPLOYMENT || site.meta.defaultDeployment;
const deployment = site.meta.deployments[deploymentName];
if (!deployment?.siteUrl) {
    throw new Error(`Unknown SITE_DEPLOYMENT: ${deploymentName}`);
}

const width = Number(site.meta.socialImageWidth) || 1200;
const height = Number(site.meta.socialImageHeight) || 630;
const outputUrl = new URL(site.meta.socialImage || "assets/img/social-card.png", ROOT);
const avatarUrl = new URL(site.profile?.avatar || "assets/img/avatar.webp", ROOT);
const baseUrl = normalizedBaseUrl(deployment.siteUrl);
const host = baseUrl.host.replace(/^www\./, "");

const avatarSize = Math.round(276 * Math.min(width / 1200, height / 630));
const avatarLeft = Math.round((796 * width) / 1200);
const avatarTop = Math.round((176 * height) / 630);

const avatarMask = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${avatarSize}" height="${avatarSize}">
    <circle cx="${avatarSize / 2}" cy="${avatarSize / 2}" r="${avatarSize / 2}" fill="#fff"/>
  </svg>
`);

const avatar = await sharp(fileURLToPath(avatarUrl))
    .resize(avatarSize, avatarSize, {fit: "cover", position: "centre"})
    .png()
    .composite([{input: avatarMask, blend: "dest-in"}])
    .toBuffer();

const cardSvg = Buffer.from(await buildSvg({width, height, site, theme, host}));
const rendered = await sharp(cardSvg)
    .composite([{input: avatar, left: avatarLeft, top: avatarTop}])
    .png({compressionLevel: 9, adaptiveFiltering: true})
    .toBuffer();

if (CHECK_ONLY) {
    if (!(await fileExists(outputUrl))) {
        throw new Error(`${site.meta.socialImage} does not exist. Run: node scripts/generate-social-card.mjs`);
    }

    const current = await readFile(outputUrl);
    if (!current.equals(rendered)) {
        throw new Error(`${site.meta.socialImage} is out of date. Run: node scripts/generate-social-card.mjs`);
    }
} else {
    const outputPath = fileURLToPath(outputUrl);
    await mkdir(dirname(outputPath), {recursive: true});
    await sharp(rendered).toFile(outputPath);
    console.log(
        `Social card generated from data/site.json for deployment "${deploymentName}" (${host}) -> ${site.meta.socialImage}`
    );
}