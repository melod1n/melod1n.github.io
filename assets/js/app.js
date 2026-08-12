const ICONS = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.2c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.74-1.55-2.58-.3-5.29-1.29-5.29-5.73 0-1.27.45-2.3 1.2-3.11-.12-.3-.52-1.47.11-3.07 0 0 .98-.31 3.16 1.19a10.9 10.9 0 0 1 5.76 0c2.19-1.5 3.16-1.19 3.16-1.19.64 1.6.24 2.78.12 3.07.74.81 1.19 1.84 1.19 3.11 0 4.45-2.72 5.43-5.3 5.72.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.7 3.5 18.6 20c-.23 1.16-.84 1.44-1.7.9l-4.73-3.49-2.28 2.2c-.25.25-.46.46-.95.46l.34-4.82 8.78-7.94c.38-.34-.08-.53-.59-.19L6.62 13.95l-4.67-1.46c-1.02-.32-1.04-1.02.21-1.51L20.42 3.9c.85-.31 1.59.19 1.28-.4Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.2 7.7H1.6V22h3.6V7.7ZM3.4 2A2.1 2.1 0 1 0 3.4 6.2 2.1 2.1 0 0 0 3.4 2ZM22.4 13.8c0-4.3-2.3-6.4-5.4-6.4-2.5 0-3.6 1.4-4.2 2.3v-2H9.2V22h3.6v-7.1c0-1.9.36-3.7 2.68-3.7 2.29 0 2.32 2.14 2.32 3.82V22h3.6l1-8.2Z"/></svg>`,
  gitea: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="5" r="2.5"/><circle cx="18" cy="19" r="2.5"/><circle cx="6" cy="19" r="2.5"/><path d="M6 7.5v9M8.5 5H13a5 5 0 0 1 5 5v6.5"/></svg>`,
  vk: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.4 5.5h3.4c.2 0 .35.13.42.32.8 2.22 1.8 4.17 3.04 5.85.2.27.62.13.62-.2V6c0-.27.22-.5.5-.5h2.97c.27 0 .5.23.5.5v4.73c0 .4.49.57.73.25 1.21-1.62 2.2-3.35 2.96-5.18.08-.18.25-.3.45-.3h3.2c.4 0 .64.45.43.78-1.18 1.9-2.45 3.66-3.79 5.28a.5.5 0 0 0 .03.67c1.48 1.45 2.9 3.08 4.2 4.87.24.34 0 .8-.41.8h-3.56a.5.5 0 0 1-.39-.19c-1-1.25-2.05-2.38-3.14-3.4-.26-.24-.69-.06-.69.29v2.8a.5.5 0 0 1-.5.5h-1.34C7.8 17.9 4.5 14.3 2.92 6.14a.53.53 0 0 1 .48-.64Z"/></svg>`,
  "arrow-left": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 5h5v5M19 5l-9 9"/><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 9-4 3 4 3M16 9l4 3-4 14"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>`
};

const app = document.getElementById("app");
const page = document.body.dataset.page || "home";

let themeConfig = null;
let projectDialog = null;

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

function createProfileLink(item, labelsHiddenOnMobile) {
  const href = String(item.href || "#");
  const anchor = element("a", "profile-link");
  if (labelsHiddenOnMobile) anchor.classList.add("profile-link--label-hidden-mobile");
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

function projectSlug(project) {
  const id = String(project.id || "").trim();
  if (id) return id;
  const value = String(project.name || "").trim().toLowerCase();
  return value.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function createProjectCard(project, openDetails) {
  const card = element("article", "project-card");
  const gridSpan = Number(project.gridSpan);
  if (gridSpan === 1 || gridSpan === 2) card.style.gridColumn = `span ${gridSpan}`;
  const details = element("button", "project-card__details");
  details.type = "button";
  details.setAttribute("aria-label", `View details for ${project.name || "project"}`);
  details.setAttribute("aria-haspopup", "dialog");
  details.addEventListener("click", () => openDetails(project, details));

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

  append(card, element("span", "project-card__details-label", "Details →"), details);

  return card;
}

function safeUrl(value, protocols = ["http:", "https:"]) {
  if (!value) return "";
  try {
    const url = new URL(String(value || ""), document.baseURI);
    return protocols.includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function appendDetailSection(parent, title, content) {
  if (!content || (Array.isArray(content) && !content.length)) return;
  const section = element("section", "project-dialog__section");
  section.append(element("h3", "", title));
  if (Array.isArray(content)) {
    const list = element("ul", "");
    list.append(...content.filter(Boolean).map((item) => element("li", "", item)));
    if (!list.children.length) return;
    section.append(list);
  } else {
    section.append(element("p", "", content));
  }
  parent.append(section);
}

function createProjectDialog(projects) {
  const dialog = element("dialog", "project-dialog");
  const title = element("h2", "project-dialog__title");
  title.id = "project-dialog-title";
  dialog.setAttribute("aria-labelledby", title.id);

  const type = element("p", "project-dialog__type");
  const actions = element("div", "project-dialog__actions");
  const close = element("button", "project-dialog__close");
  close.type = "button";
  close.setAttribute("aria-label", "Close");
  close.innerHTML = icon("close");
  actions.append(close);

  const top = element("div", "project-dialog__top");
  append(top, type, actions);
  const chips = element("div", "project-dialog__chips");
  const body = element("div", "project-dialog__body");
  append(dialog, top, title, chips, body);

  let origin = null;
  let closing = false;
  let pushed = false;
  let historyEntry = null;
  let closeTimer = null;
  let focusCloseOnOpen = false;
  let focusFrame = null;
  let lockedScrollY = 0;
  let scrollLockedOnMobile = false;
  const projectBySlug = new Map(projects.map((project) => [projectSlug(project), project]).filter(([slug]) => slug));

  function currentSlug() {
    try {
      return decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return "";
    }
  }

  function render(project) {
    const github = (project.links || []).find((link) => link.icon === "github" && safeUrl(link.href));
    title.textContent = project.name || "Project";
    type.textContent = project.type || "Project";
    chips.replaceChildren(...(project.tags || []).map((tag) => element("span", "project-tag", tag)));
    actions.replaceChildren();
    actions.append(close);
    if (github) {
      const githubUrl = safeUrl(github.href);
      const link = element("a", "project-dialog__github", github.label || "GitHub");
      link.href = githubUrl;
      link.target = "_blank";
      link.rel = "noopener";
      append(link, createIcon("github", ""));
      actions.append(link);
    }

    body.replaceChildren();
    const imageUrl = safeUrl(project.image);
    body.classList.toggle("project-dialog__body--copy-only", !imageUrl);
    if (imageUrl) {
      const image = element("img", "project-dialog__image");
      image.src = imageUrl;
      image.alt = project.imageAlt || project.name || "Project image";
      image.loading = "lazy";
      body.append(image);
    }
    const copy = element("div", "project-dialog__copy");
    if (project.tagline) copy.append(element("p", "project-dialog__tagline", project.tagline));
    if (project.description) copy.append(element("p", "project-dialog__description", project.description));
    appendDetailSection(copy, "Highlights", project.highlights);
    appendDetailSection(copy, "Contribution", project.contribution);
    appendDetailSection(copy, "Architecture", project.architecture);
    appendDetailSection(copy, "Details", project.details);
    if (copy.children.length) body.append(copy);
  }

  function finishClose() {
    if (!dialog.open) return;
    closeTimer = null;
    if (focusFrame) window.cancelAnimationFrame(focusFrame);
    focusFrame = null;
    focusCloseOnOpen = false;
    close.classList.remove("is-initial-focus");
    dialog.close();
    dialog.classList.remove("is-closing");
    document.body.classList.remove("project-dialog-open");
    document.body.classList.remove("project-dialog-open--mobile");
    document.body.style.top = "";
    const scrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, lockedScrollY);
    if (origin?.isConnected) origin.focus({ preventScroll: true });
    window.scrollTo(0, lockedScrollY);
    document.documentElement.style.scrollBehavior = scrollBehavior;
    closing = false;
    pushed = false;
    historyEntry = null;
    scrollLockedOnMobile = false;
    origin = null;
  }

  function updateScrollLock() {
    if (!dialog.open) return;
    const isMobile = window.matchMedia("(max-width: 599px)").matches;
    document.body.classList.add("project-dialog-open");
    document.body.classList.toggle("project-dialog-open--mobile", isMobile);
    document.body.style.top = isMobile ? `-${lockedScrollY}px` : "";
    if (scrollLockedOnMobile && !isMobile) window.scrollTo(0, lockedScrollY);
    scrollLockedOnMobile = isMobile;
  }

  function closeDialog() {
    if (!dialog.open || closing) return;
    focusCloseOnOpen = false;
    closing = true;
    dialog.classList.remove("is-open");
    dialog.classList.add("is-closing");
    const closeDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 200;
    if (closeDelay) closeTimer = window.setTimeout(finishClose, closeDelay);
    else finishClose();
  }

  function requestClose() {
    if (pushed && history.state?.projectDetails === historyEntry) {
      history.back();
    } else if (window.location.hash) {
      history.replaceState(history.state, "", `${window.location.pathname}${window.location.search}`);
      closeDialog();
    } else {
      closeDialog();
    }
  }

  function open(project, card, addHistory = true) {
    const slug = projectSlug(project);
    if (!slug) return;
    focusCloseOnOpen = !dialog.open;
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (closing) dialog.classList.remove("is-closing");
    closing = false;
    render(project);
    if (!dialog.open) {
      origin = card || document.activeElement;
      lockedScrollY = window.scrollY;
      dialog.showModal();
      updateScrollLock();
    }
    requestAnimationFrame(() => {
      dialog.classList.add("is-open");
    });
    if (addHistory && currentSlug() !== slug) {
      historyEntry = `${Date.now()}-${Math.random()}`;
      history.pushState({ projectDetails: historyEntry }, "", `#${encodeURIComponent(slug)}`);
      pushed = true;
    }
  }

  function syncHash(fromHistory = false) {
    if (fromHistory) {
      pushed = false;
      historyEntry = null;
    }
    const project = projectBySlug.get(currentSlug());
    if (project) {
      pushed = history.state?.projectDetails === historyEntry;
      open(project, null, false);
    }
    else closeDialog();
  }

  close.addEventListener("click", requestClose);
  close.addEventListener("pointerdown", () => close.classList.remove("is-initial-focus"));
  dialog.addEventListener("focusin", (event) => {
    if (event.target !== close) close.classList.remove("is-initial-focus");
  });
  dialog.addEventListener("toggle", () => {
    if (!dialog.open) {
      focusCloseOnOpen = false;
      close.classList.remove("is-initial-focus");
      return;
    }
    if (!focusCloseOnOpen || focusFrame) return;
    focusFrame = requestAnimationFrame(() => {
      focusFrame = null;
      if (!focusCloseOnOpen || !dialog.open || closing) return;
      focusCloseOnOpen = false;
      close.classList.add("is-initial-focus");
      close.focus({ preventScroll: true });
    });
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    requestClose();
  });
  dialog.addEventListener("click", (event) => {
    if (window.matchMedia("(max-width: 599px)").matches) return;
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const clickedBackdrop = event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (clickedBackdrop) requestClose();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll("button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])")]
      .filter((node) => !node.hidden && node.getClientRects().length);
    if (!focusable.length) return;
    const current = focusable.indexOf(document.activeElement);
    if (event.shiftKey && (current <= 0)) {
      event.preventDefault();
      focusable.at(-1).focus();
    } else if (!event.shiftKey && current === focusable.length - 1) {
      event.preventDefault();
      focusable[0].focus();
    }
  });
  window.addEventListener("resize", updateScrollLock);

  return { dialog, open, syncHash };
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
  skills.append(...(data.skills || []).map((skill) => {
    const value = String(skill);
    const mobileValue = value.split("·", 1)[0].trim();
    if (labels.skillsShortenedOnMobile !== true || !value.includes("·")) {
      return element("span", "skill-chip", value);
    }

    const chip = element("span", "skill-chip skill-chip--shortened-mobile");
    chip.title = value;
    chip.setAttribute("aria-label", value);
    const full = element("span", "skill-chip__full", value);
    const shortened = element("span", "skill-chip__shortened", mobileValue);
    full.setAttribute("aria-hidden", "true");
    shortened.setAttribute("aria-hidden", "true");
    chip.append(full, shortened);
    return chip;
  }));
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

  links.classList.toggle("link-list--labels-hidden-mobile", labels.linksTitleHiddenOnMobile === true);
  links.dataset.count = String(linkCount);
  links.style.setProperty("--link-basis-desktop", `calc(${100 / preferredColumns}% - var(--link-gap))`);
  links.append(...visibleLinks.map((item) => createProfileLink(item, labels.linksTitleHiddenOnMobile === true)));

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
  projectDialog = createProjectDialog(projects);
  const grid = element("section", "project-grid");
  if (projects.length) {
    grid.append(...projects.map((project) => createProjectCard(project, projectDialog.open)));
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

  return [createAmbient(), main, projectDialog.dialog];
}

function renderPage(data) {
  document.body.classList.remove("project-dialog-open");
  projectDialog = null;
  document.body.className = page === "portfolio" ? "portfolio-page" : "home-page";
  const nodes = page === "portfolio" ? createPortfolio(data) : createHome(data);
  app.replaceChildren(...nodes);
  if (projectDialog) projectDialog.syncHash();
}

function applyTheme() {
  if (!themeConfig) return;
  const values = themeConfig.themes?.dark || {};
  Object.entries(values).forEach(([name, value]) => {
    document.documentElement.style.setProperty(`--${name}`, value);
  });

  const themeColor = themeConfig.browser?.dark || values.bg;
  if (themeColor) {
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute("content", themeColor);
    });

    const tileColor = document.querySelector('meta[name="msapplication-TileColor"]');
    if (tileColor) tileColor.setAttribute("content", themeColor);
  }
}

async function loadJson(path) {
  const response = await fetch(path, { headers: { Accept: "application/json" } });

  if (!response.ok) throw new Error(`Unable to load ${path}: ${response.status}`);
  return response.json();
}

function revealPage() {
  app.setAttribute("aria-busy", "false");
}

function showFatalError(error) {
  console.error(error);
  document.body.className = "error-page";

  const title = element("h1", "", "The site configuration could not be loaded");
  const message = element(
    "p",
    "",
    window.location.protocol === "file:"
      ? "Open the site through start.sh or python3 serve.py instead of opening index.html directly."
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

  themeConfig = theme;
  applyTheme();
  renderPage(site);
  revealPage();
}

async function init() {
  try {
    await loadInitialConfig();
    window.addEventListener("popstate", () => projectDialog?.syncHash(true));
    window.addEventListener("hashchange", () => projectDialog?.syncHash(true));
  } catch (error) {
    showFatalError(error);
  }
}

init();
