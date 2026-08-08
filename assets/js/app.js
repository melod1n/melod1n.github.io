const ICONS = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.2c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.74-1.55-2.58-.3-5.29-1.29-5.29-5.73 0-1.27.45-2.3 1.2-3.11-.12-.3-.52-1.47.11-3.07 0 0 .98-.31 3.16 1.19a10.9 10.9 0 0 1 5.76 0c2.19-1.5 3.16-1.19 3.16-1.19.64 1.6.24 2.78.12 3.07.74.81 1.19 1.84 1.19 3.11 0 4.45-2.72 5.43-5.3 5.72.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.7 3.5 18.6 20c-.23 1.16-.84 1.44-1.7.9l-4.73-3.49-2.28 2.2c-.25.25-.46.46-.95.46l.34-4.82 8.78-7.94c.38-.34-.08-.53-.59-.19L6.62 13.95l-4.67-1.46c-1.02-.32-1.04-1.02.21-1.51L20.42 3.9c.85-.31 1.59.19 1.28-.4Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.2 7.7H1.6V22h3.6V7.7ZM3.4 2A2.1 2.1 0 1 0 3.4 6.2 2.1 2.1 0 0 0 3.4 2ZM22.4 13.8c0-4.3-2.3-6.4-5.4-6.4-2.5 0-3.6 1.4-4.2 2.3v-2H9.2V22h3.6v-7.1c0-1.9.36-3.7 2.68-3.7 2.29 0 2.32 2.14 2.32 3.82V22h3.6l1-8.2Z"/></svg>`,
  gitea: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="5" r="2.5"/><circle cx="18" cy="19" r="2.5"/><circle cx="6" cy="19" r="2.5"/><path d="M6 7.5v9M8.5 5H13a5 5 0 0 1 5 5v6.5"/></svg>`,
  vk: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.4 5.5h3.4c.2 0 .35.13.42.32.8 2.22 1.8 4.17 3.04 5.85.2.27.62.13.62-.2V6c0-.27.22-.5.5-.5h2.97c.27 0 .5.23.5.5v4.73c0 .4.49.57.73.25 1.21-1.62 2.2-3.35 2.96-5.18.08-.18.25-.3.45-.3h3.2c.4 0 .64.45.43.78-1.18 1.9-2.45 3.66-3.79 5.28a.5.5 0 0 0 .03.67c1.48 1.45 2.9 3.08 4.2 4.87.24.34 0 .8-.41.8h-3.56a.5.5 0 0 1-.39-.19c-1-1.25-2.05-2.38-3.14-3.4-.26-.24-.69-.06-.69.29v2.8a.5.5 0 0 1-.5.5h-1.34C7.8 17.9 4.5 14.3 2.92 6.14a.53.53 0 0 1 .48-.64Z"/></svg>`,
  "arrow-left": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 5h5v5M19 5l-9 9"/><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg>`
};

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const app = document.getElementById("app");
const page = document.body.dataset.page || "home";

let siteConfig = null;
let themeConfig = null;
let siteSnapshot = "";
let themeSnapshot = "";
let refreshInFlight = false;

function icon(name) {
  return ICONS[name] || ICONS.external;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function append(parent, ...children) {
  parent.append(...children.filter(Boolean));
  return parent;
}

function createIcon(name, className) {
  const node = element("span", className);
  node.innerHTML = icon(name);
  node.setAttribute("aria-hidden", "true");
  return node;
}

function createAmbient() {
  const ambient = element("div", "ambient");
  ambient.setAttribute("aria-hidden", "true");
  ambient.append(element("span", "ambient__glow"));
  return ambient;
}

function createSectionHeading(title, modifier = "") {
  const heading = element("div", `section-heading${modifier ? ` ${modifier}` : ""}`);
  append(
    heading,
    element("h2", "", title),
    element("span", "section-heading__line")
  );
  heading.lastElementChild.setAttribute("aria-hidden", "true");
  return heading;
}

function createKicker(desktopValue, mobileValue) {
  const wrapper = element("p", "eyebrow");
  wrapper.id = "profile-kicker";

  const desktop = element("span", "eyebrow__desktop", desktopValue);
  const mobile = element("span", "eyebrow__mobile");
  mobile.setAttribute("aria-hidden", "true");

  const compact = String(mobileValue || desktopValue || "")
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean);

  mobile.append(...compact.map((part) => element("span", "", part)));
  wrapper.append(desktop, mobile);
  return wrapper;
}

function createProfileLink(item) {
  const href = String(item.href || "#");
  const anchor = element("a", "profile-link");
  anchor.href = href;
  anchor.rel = href.startsWith("http") ? "me noopener" : "noopener";
  if (href.startsWith("http")) anchor.target = "_blank";
  anchor.setAttribute("aria-label", `${item.label || "Link"}: ${item.value || href}`);

  const copy = element("span", "profile-link__copy");
  append(
    copy,
    element("span", "profile-link__label", item.label),
    element("span", "profile-link__value", item.value)
  );

  append(anchor, createIcon(item.icon, "profile-link__icon"), copy);
  return anchor;
}

function getPreferredLinkColumns(count) {
  if (count <= 1) return 1;
  if (count === 2 || count === 4) return 2;
  if (count <= 6 || count % 3 === 0) return 3;
  return 4;
}

function createProjectCard(project) {
  const card = element("article", "project-card");
  const head = element("header", "project-card__head");
  append(
    head,
    element("p", "project-card__eyebrow", project.type || "Project"),
    element("h2", "", project.name)
  );

  const description = element("p", "project-card__description", project.description);
  const tags = element("div", "project-tags");
  tags.append(...(project.tags || []).map((tag) => element("span", "project-tag", tag)));

  append(card, head, description, tags);

  if (project.links?.length) {
    const links = element("div", "project-links");
    links.append(...project.links.map((item) => {
      if (!item.href) return null;
      const anchor = element("a", "project-link");
      anchor.href = item.href;
      anchor.target = "_blank";
      anchor.rel = "noopener";
      append(anchor, createIcon(item.icon || "external", ""), element("span", "", item.label));
      return anchor;
    }).filter(Boolean));
    card.append(links);
  }

  return card;
}

function createHome(data) {
  const profile = data.profile || {};
  const labels = data.labels || {};

  const headerCopy = element("div", "profile-header__copy");
  const name = element("h1", "", profile.name);
  name.id = "profile-name";

  const handle = element("a", "handle", profile.handle);
  handle.href = profile.handleUrl || "#";
  handle.rel = "me noopener";

  append(
    headerCopy,
    createKicker(profile.kicker, profile.kickerMobile),
    name,
    handle
  );

  const avatarFrame = element("div", "avatar-frame");
  const avatar = element("img", "avatar");
  avatar.src = profile.avatar || "";
  avatar.alt = profile.avatarAlt || profile.name || "Profile photo";
  avatar.width = 256;
  avatar.height = 256;
  avatar.decoding = "async";
  avatarFrame.append(avatar);

  const header = element("header", "profile-header");
  append(header, headerCopy, avatarFrame);

  const intro = element("section", "intro");
  const role = element("h2", "", profile.role);
  role.id = "profile-role";
  append(intro, role, element("p", "", profile.summary));
  const portfolioLink = element("a", "portfolio-cta", labels.portfolio || "View portfolio");
  portfolioLink.href = "portfolio.html";
  append(intro, portfolioLink);
  intro.setAttribute("aria-labelledby", "profile-role");

  const skillsSection = element("section", "content-section skills-section");
  const skillsHeading = createSectionHeading(labels.skills || "");
  const skillsTitle = skillsHeading.querySelector("h2");
  skillsTitle.id = "skills-title";
  skillsSection.setAttribute("aria-labelledby", "skills-title");

  const skills = element("div", "chip-list");
  skills.append(...(data.skills || []).map((skill) => element("span", "skill-chip", skill)));
  append(skillsSection, skillsHeading, skills);

  const profileMain = element("section", "profile-main glass-card");
  append(profileMain, header, intro, skillsSection);

  const drawer = element("section", "contact-drawer");
  const linksHeading = createSectionHeading(labels.links || "", "section-heading--drawer");
  const linksTitle = linksHeading.querySelector("h2");
  linksTitle.id = "links-title";
  drawer.setAttribute("aria-labelledby", "links-title");

  const visibleLinks = (data.links || []).filter((item) => item.visible !== false);
  const links = element("div", "link-list");
  const linkCount = visibleLinks.length;
  const preferredColumns = getPreferredLinkColumns(linkCount);

  links.dataset.count = String(linkCount);
  links.style.setProperty("--link-basis-desktop", `calc(${100 / preferredColumns}% - var(--link-gap))`);
  links.append(...visibleLinks.map(createProfileLink));

  const footer = element("footer", "profile-footer profile-footer--home");
  footer.append(element("span", "", data.footer?.copyright || ""));
  append(drawer, linksHeading, links);

  const article = element("article", "profile-shell");
  article.setAttribute("aria-labelledby", "profile-name");
  append(article, profileMain, drawer);

  const main = element("main", "page-shell page-shell--home");
  main.append(article, footer);

  return [createAmbient(), main];
}

function createPortfolio(data) {
  const portfolio = data.portfolio || {};
  const navigation = data.navigation || {};

  const back = element("a", "portfolio-link");
  back.href = "index.html";
  back.setAttribute("aria-label", navigation.backAriaLabel || navigation.back || "Back");
  append(back, createIcon("arrow-left", ""), element("span", "", navigation.back || ""));

  const topbar = element("div", "profile-card__topbar");
  topbar.append(back);

  const header = element("header", "portfolio-header");
  append(
    header,
    element("p", "eyebrow", portfolio.kicker),
    element("h1", "", portfolio.title),
    element("p", "", portfolio.intro)
  );

  const projects = portfolio.projects || [];
  const grid = element("section", "project-grid");
  if (projects.length) {
    grid.append(...projects.map(createProjectCard));
  } else {
    grid.append(element("p", "projects-empty", data.labels?.projectsEmpty || "Projects will appear here soon."));
  }

  const footer = element("footer", "profile-footer profile-footer--portfolio");
  const home = element("a", "", navigation.home || "");
  home.href = "index.html";
  append(footer, element("span", "", data.footer?.copyright || ""), home);

  const card = element("article", "portfolio-card glass-card");
  append(card, topbar, header, grid);

  const main = element("main", "page-shell page-shell--portfolio");
  main.append(card, footer);

  return [createAmbient(), main];
}

function renderPage(data) {
  document.body.className = page === "portfolio" ? "portfolio-page" : "home-page";
  const nodes = page === "portfolio" ? createPortfolio(data) : createHome(data);
  app.replaceChildren(...nodes);
}

function setMeta(name, value, attribute = "name") {
  if (value === undefined || value === null) return;
  let meta = document.head.querySelector(`meta[${attribute}="${CSS.escape(name)}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, name);
    document.head.append(meta);
  }
  meta.setAttribute("content", String(value));
}

function applyMetadata(data) {
  const metadata = data.meta?.[page] || {};
  document.documentElement.lang = metadata.lang || data.meta?.lang || "en";
  document.title = metadata.title || "";
  setMeta("description", metadata.description);
  setMeta("og:type", metadata.ogType || "website", "property");
  setMeta("og:title", metadata.ogTitle || metadata.title, "property");
  setMeta("og:description", metadata.ogDescription || metadata.description, "property");
  setMeta("og:image", metadata.ogImage || data.profile?.avatar, "property");
}

function applyTheme() {
  if (!themeConfig) return;

  const settings = themeConfig.settings || {};
  const defaultTheme = settings.defaultTheme === "light" ? "light" : "dark";
  const useSystemPreference = settings.useSystemPreference !== false;
  const resolved = useSystemPreference
    ? (systemTheme.matches ? "dark" : "light")
    : defaultTheme;

  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;

  const values = themeConfig.themes?.[resolved] || {};
  Object.entries(values).forEach(([name, value]) => {
    document.documentElement.style.setProperty(`--${name}`, value);
  });

  const themeColor = themeConfig.browser?.[resolved] || values.bg;
  if (themeColor) {
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute("content", themeColor);
    });

    const tileColor = document.querySelector('meta[name="msapplication-TileColor"]');
    if (tileColor) tileColor.setAttribute("content", themeColor);
  }
}

function watchSystemTheme() {
  const listener = () => applyTheme();
  if (typeof systemTheme.addEventListener === "function") {
    systemTheme.addEventListener("change", listener);
  } else if (typeof systemTheme.addListener === "function") {
    systemTheme.addListener(listener);
  }
}

async function loadJson(path) {
  const url = new URL(path, document.baseURI);
  url.searchParams.set("_", Date.now().toString());

  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" }
  });

  if (!response.ok) throw new Error(`Unable to load ${path}: ${response.status}`);
  return response.json();
}

function preloadImage(src) {
  if (!src) return Promise.resolve();

  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    image.onload = finish;
    image.onerror = finish;
    image.src = src;
    window.setTimeout(finish, 2500);
  });
}

function nextPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

function revealPage() {
  document.documentElement.classList.remove("is-loading");
  document.documentElement.classList.add("is-ready");
}

function showFatalError(error) {
  console.error(error);
  document.body.className = "error-page";

  const title = element("h1", "", "The site configuration could not be loaded");
  const message = element(
    "p",
    "",
    window.location.protocol === "file:"
      ? "Open the site through start-site.sh, start-site.cmd or python3 serve.py instead of opening index.html directly."
      : "Check data/site.json and data/theme.json for syntax errors, then reload the page."
  );
  const details = element("code", "", error instanceof Error ? error.message : String(error));
  const card = element("main", "config-error glass-card");
  append(card, title, message, details);
  app.replaceChildren(card);
  revealPage();
}

async function loadInitialConfig() {
  if (window.location.protocol === "file:") {
    throw new Error("JSON files cannot be loaded from file:// in this browser.");
  }

  const [site, theme] = await Promise.all([
    loadJson("data/site.json"),
    loadJson("data/theme.json")
  ]);

  siteConfig = site;
  themeConfig = theme;
  siteSnapshot = JSON.stringify(site);
  themeSnapshot = JSON.stringify(theme);

  applyTheme();
  applyMetadata(siteConfig);
  await preloadImage(siteConfig.profile?.avatar);
  renderPage(siteConfig);
  await nextPaint();
  revealPage();
}

async function refreshConfig() {
  if (refreshInFlight) return;
  refreshInFlight = true;

  try {
    const [siteResult, themeResult] = await Promise.allSettled([
      loadJson("data/site.json"),
      loadJson("data/theme.json")
    ]);

    if (themeResult.status === "fulfilled") {
      const nextSnapshot = JSON.stringify(themeResult.value);
      if (nextSnapshot !== themeSnapshot) {
        themeConfig = themeResult.value;
        themeSnapshot = nextSnapshot;
        applyTheme();
      }
    } else {
      console.error("theme.json was not updated. The previous valid theme remains active.", themeResult.reason);
    }

    if (siteResult.status === "fulfilled") {
      const nextSnapshot = JSON.stringify(siteResult.value);
      if (nextSnapshot !== siteSnapshot) {
        siteConfig = siteResult.value;
        siteSnapshot = nextSnapshot;
        applyMetadata(siteConfig);
        await preloadImage(siteConfig.profile?.avatar);
        renderPage(siteConfig);
      }
    } else {
      console.error("site.json was not updated. The previous valid content remains on screen.", siteResult.reason);
    }
  } finally {
    refreshInFlight = false;
  }
}

function startConfigWatcher() {
  const isLocalServer = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

  if (isLocalServer) {
    window.setInterval(() => {
      if (!document.hidden) refreshConfig();
    }, 800);
  }

  window.addEventListener("focus", refreshConfig);
}

async function init() {
  try {
    watchSystemTheme();
    await loadInitialConfig();
    startConfigWatcher();
  } catch (error) {
    showFatalError(error);
  }
}

init();
