/* =========================================================
   NJU HAM · interactions
   No dependencies. Everything degrades gracefully.
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Clock ---------- */

  const localClock = $("#localClock");
  const footerClock = $("#footerClock");

  const timeFormatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const shortTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  function updateClock() {
    const now = new Date();
    if (localClock) localClock.textContent = shortTimeFormatter.format(now);
    if (footerClock) footerClock.textContent = `${timeFormatter.format(now)} CST`;
  }

  updateClock();
  window.setInterval(updateClock, 1000);

  /* ---------- Header, progress, active nav ---------- */

  const header = $("#siteHeader");
  const scrollBar = $("#scrollBar");
  const navLinks = $$(".primary-nav a");
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      return href && href.startsWith("#") ? document.getElementById(href.slice(1)) : null;
    })
    .filter(Boolean);

  let lastScrollY = -1;
  let ticking = false;

  function updateScrollUI() {
    const y = window.scrollY;
    if (y !== lastScrollY) {
      lastScrollY = y;
      header?.classList.toggle("scrolled", y > 26);
    }

    if (scrollBar) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      scrollBar.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
    }
    ticking = false;
  }

  function requestScrollUI() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }

  updateScrollUI();
  window.addEventListener("scroll", requestScrollUI, { passive: true });
  window.addEventListener("resize", requestScrollUI, { passive: true });

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible.length) return;

        const activeId = visible[0].target.id;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${activeId}`;
          link.classList.toggle("is-active", isActive);
          if (isActive) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0, 0.1, 0.5],
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- Mobile navigation ---------- */

  const menuToggle = $(".menu-toggle");
  const primaryNav = $("#primaryNav");

  function closeMenu() {
    document.body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "打开导航菜单");
  }

  function openMenu() {
    document.body.classList.add("nav-open");
    menuToggle?.setAttribute("aria-expanded", "true");
    menuToggle?.setAttribute("aria-label", "关闭导航菜单");
    const firstLink = primaryNav?.querySelector("a");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => firstLink?.focus());
    });
  }

  menuToggle?.addEventListener("click", () => {
    if (document.body.classList.contains("nav-open")) closeMenu();
    else openMenu();
  });

  header?.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) closeMenu();
  });

  primaryNav?.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      closeMenu();
      menuToggle?.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) return;
    const target = event.target;
    if (target instanceof Node && header && !header.contains(target)) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1020) closeMenu();
  });

  /* ---------- Reveal on scroll ---------- */

  const revealElements = $$("[data-reveal]");

  revealElements.forEach((element) => {
    const siblings = Array.from(element.parentElement?.children || []).filter((child) =>
      child.hasAttribute("data-reveal")
    );
    const index = Math.max(0, siblings.indexOf(element));
    element.style.setProperty("--reveal-delay", `${Math.min(index * 65, 260)}ms`);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -7% 0px",
        threshold: 0.08,
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* ---------- Band explorer ---------- */

  const bandData = {
    hf: {
      range: "7.000 — 7.200",
      name: "40 米 · 短波",
      desc: "短波可以借助电离层反射，完成数百到数千公里的通联。夜幕降临，远方的呼号会变得格外清晰。",
      wave: "40 m",
      modes: "CW / SSB / FT8",
      distance: "3000+ km",
      rigBand: "40 M",
      rigFreq: "7.100.00",
      rigMode: "USB / CW",
      dial: "40m",
      angle: -58,
    },
    vhf: {
      range: "144.000 — 148.000",
      name: "2 米 · 甚高频",
      desc: "适合本地中继、卫星上行与城市间的直通联络，是新手第一次 On Air 的常见起点。",
      wave: "2 m",
      modes: "FM / SSB / APRS",
      distance: "10–50 km",
      rigBand: "2 M",
      rigFreq: "145.000.00",
      rigMode: "FM / APRS",
      dial: "2m",
      angle: 4,
    },
    uhf: {
      range: "430.000 — 440.000",
      name: "70 厘米 · 特高频",
      desc: "穿透力强、天线小巧，适合城市手持台、数字语音与中继通信，也常用于卫星和应急通信。",
      wave: "70 cm",
      modes: "FM / DMR / C4FM",
      distance: "5–30 km",
      rigBand: "70 CM",
      rigFreq: "435.000.00",
      rigMode: "FM / DMR",
      dial: "70cm",
      angle: 64,
    },
  };

  const tabs = $$("[role='tab'][data-band]");
  const bandRange = $("#bandRange");
  const bandName = $("#bandName");
  const bandDesc = $("#bandDesc");
  const bandWave = $("#bandWave");
  const bandModes = $("#bandModes");
  const bandDistance = $("#bandDistance");
  const rigBandLabel = $("#rigBandLabel");
  const rigFreq = $("#rigFreq");
  const rigMode = $("#rigMode");
  const dialBand = $("#dialBand");
  const dialNeedle = $("#dialNeedle");
  const bandPanel = $("#bandPanel");

  function setBand(key, focusTab = false) {
    const data = bandData[key];
    if (!data) return;

    tabs.forEach((tab) => {
      const selected = tab.dataset.band === key;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });

    if (bandRange) bandRange.textContent = data.range;
    if (bandName) bandName.textContent = data.name;
    if (bandDesc) bandDesc.textContent = data.desc;
    if (bandWave) bandWave.textContent = data.wave;
    if (bandModes) bandModes.textContent = data.modes;
    if (bandDistance) bandDistance.textContent = data.distance;
    if (rigBandLabel) rigBandLabel.textContent = data.rigBand;
    if (rigFreq) rigFreq.textContent = data.rigFreq;
    if (rigMode) rigMode.textContent = data.rigMode;
    if (dialBand) dialBand.textContent = data.dial;
    if (dialNeedle) dialNeedle.style.transform = `rotate(${data.angle}deg)`;
    if (bandPanel) bandPanel.setAttribute("aria-labelledby", `tab-${key}`);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setBand(tab.dataset.band));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      setBand(tabs[nextIndex].dataset.band, true);
    });
  });

  /* ---------- Morse audio ---------- */

  const morseButton = $("#morseBtn");
  const morseMap = {
    A: ".-",
    C: "-.-.",
    D: "-..",
    E: ".",
    H: "....",
    J: ".---",
    M: "--",
    N: "-.",
    Q: "--.-",
    U: "..-",
  };

  let audioState = null;
  const originalMorseLabel = $(".morse-label small")?.textContent || "CQ · CQ · DE NJU HAM";

  function resetMorseButton() {
    morseButton?.classList.remove("is-playing");
    morseButton?.setAttribute("aria-label", "播放摩尔斯电码呼号 CQ DE NJU HAM");
    const small = $(".morse-label small");
    if (small) small.textContent = originalMorseLabel;
    audioState = null;
  }

  function stopMorse() {
    if (!audioState) return;
    try {
      if (audioState.oscillator) audioState.oscillator.stop();
      if (audioState.context && audioState.context.state !== "closed") audioState.context.close();
    } catch (error) {
      /* no-op */
    }
    if (audioState.endTimer) window.clearTimeout(audioState.endTimer);
    resetMorseButton();
  }

  function playMorse() {
    if (audioState) {
      stopMorse();
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      showToast("当前浏览器暂不支持音频播放");
      return;
    }

    const message = "CQ DE NJU HAM";
    const unit = 0.078;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 620;
    gain.gain.value = 0.0001;
    oscillator.connect(gain);
    gain.connect(context.destination);

    const start = context.currentTime + 0.06;
    let cursor = start;

    message.split("").forEach((character) => {
      if (character === " ") {
        cursor += unit * 7;
        return;
      }

      const code = morseMap[character];
      if (!code) return;

      code.split("").forEach((symbol) => {
        const duration = symbol === "." ? unit : unit * 3;
        gain.gain.setValueAtTime(0.0001, cursor);
        gain.gain.linearRampToValueAtTime(0.12, cursor + 0.006);
        gain.gain.setValueAtTime(0.12, Math.max(cursor + 0.007, cursor + duration - 0.007));
        gain.gain.linearRampToValueAtTime(0.0001, cursor + duration);
        cursor += duration + unit;
      });

      cursor += unit * 2;
    });

    const totalSeconds = cursor - start + 0.12;
    oscillator.start(start);
    oscillator.stop(start + totalSeconds + 0.05);

    audioState = {
      context,
      oscillator,
      endTimer: window.setTimeout(() => {
        try {
          context.close();
        } catch (error) {
          /* no-op */
        }
        resetMorseButton();
      }, totalSeconds * 1000 + 160),
    };

    morseButton?.classList.add("is-playing");
    morseButton?.setAttribute("aria-label", "停止播放摩尔斯电码呼号");
    const small = $(".morse-label small");
    if (small) small.textContent = "正在发送 · 73";

    context.resume().catch(() => {});
  }

  morseButton?.addEventListener("click", playMorse);

  /* ---------- Copy QQ number ---------- */

  let toastTimer;

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        /* fall through to legacy method */
      }
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      textarea.remove();
      return success;
    } catch (error) {
      return false;
    }
  }

  $$("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy");
      if (!value) return;
      const copied = await copyText(value);
      if (!copied) {
        showToast(`群号：${value}`);
        return;
      }
      showToast("群号已复制，我们群里见！");
      const original = button.textContent;
      button.textContent = "已复制 ✓";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1800);
    });
  });

  /* ---------- Paged navigation ---------- */

  const pages = $$(".page");
  const pagerDots = $$(".pager-dots button");
  const pagerCurrent = $("#pagerCurrent");
  const pagePrev = $("#pagePrev");
  const pageNext = $("#pageNext");

  function getHeaderHeight() {
    const value = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--header-h")
    );
    return Number.isFinite(value) ? value : 88;
  }

  function setActivePage(index) {
    if (!pages.length) return;

    const safeIndex = Math.max(0, Math.min(pages.length - 1, index));
    pages.forEach((page, pageIndex) => {
      page.classList.toggle("is-current", pageIndex === safeIndex);
    });

    pagerDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === safeIndex;
      dot.classList.toggle("is-active", isActive);
      if (isActive) dot.setAttribute("aria-current", "page");
      else dot.removeAttribute("aria-current");
    });

    if (pagerCurrent) pagerCurrent.textContent = String(safeIndex + 1).padStart(2, "0");
    if (pagePrev) pagePrev.disabled = safeIndex === 0;
    if (pageNext) pageNext.disabled = safeIndex === pages.length - 1;
  }

  function scrollToPage(index) {
    if (!pages.length) return;
    const safeIndex = Math.max(0, Math.min(pages.length - 1, index));
    const target = pages[safeIndex];
    const top =
      safeIndex === 0
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - getHeaderHeight() + 1;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  let pageTicking = false;

  function updatePageUI() {
    if (!pages.length) {
      pageTicking = false;
      return;
    }

    const marker = getHeaderHeight() + 34;
    let activeIndex = 0;

    pages.forEach((page, index) => {
      if (page.getBoundingClientRect().top <= marker) activeIndex = index;
    });

    setActivePage(activeIndex);
    pageTicking = false;
  }

  function requestPageUI() {
    if (!pageTicking) {
      pageTicking = true;
      window.requestAnimationFrame(updatePageUI);
    }
  }

  pagerDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      scrollToPage(Number(dot.getAttribute("data-page-index")) || 0);
    });
  });

  pagePrev?.addEventListener("click", () => {
    const current = pagerDots.findIndex((dot) => dot.classList.contains("is-active"));
    scrollToPage(current - 1);
  });

  pageNext?.addEventListener("click", () => {
    const current = pagerDots.findIndex((dot) => dot.classList.contains("is-active"));
    scrollToPage(current + 1);
  });

  if (pages.length) {
    updatePageUI();
    window.addEventListener("scroll", requestPageUI, { passive: true });
    window.addEventListener("resize", requestPageUI, { passive: true });
  }

  /* ---------- Photo lightbox ---------- */

  const photoCards = $$(".photo-card");
  const photoDialog = $("#photoDialog");
  const photoDialogImage = $("#photoDialogImage");
  const photoDialogCaption = $("#photoDialogCaption");
  const photoDialogIndex = $("#photoDialogIndex");
  const photoDialogClose = $("#photoDialogClose");
  const photoDialogPrev = $("#photoDialogPrev");
  const photoDialogNext = $("#photoDialogNext");

  if (photoDialog && photoDialogImage && photoCards.length) {
    const photos = photoCards.map((card) => {
      const image = card.querySelector("img");
      return {
        card,
        src: card.getAttribute("data-full") || image?.getAttribute("src") || "",
        caption: card.getAttribute("data-caption") || image?.getAttribute("alt") || "",
        alt: image?.getAttribute("alt") || "",
      };
    });

    let activePhoto = 0;
    let lastPhotoTrigger = null;

    function renderPhoto(index) {
      activePhoto = (index + photos.length) % photos.length;
      const photo = photos[activePhoto];
      photoDialogImage.src = photo.src;
      photoDialogImage.alt = photo.alt;
      if (photoDialogCaption) photoDialogCaption.textContent = photo.caption;
      if (photoDialogIndex) {
        photoDialogIndex.textContent = `${String(activePhoto + 1).padStart(2, "0")} / ${String(
          photos.length
        ).padStart(2, "0")}`;
      }
    }

    function openPhoto(index, trigger) {
      lastPhotoTrigger = trigger || null;
      renderPhoto(index);
      document.body.classList.add("lightbox-open");
      if (typeof photoDialog.showModal === "function") photoDialog.showModal();
      else photoDialog.setAttribute("open", "");
    }

    function closePhoto() {
      document.body.classList.remove("lightbox-open");
      if (typeof photoDialog.close === "function") photoDialog.close();
      else photoDialog.removeAttribute("open");
      lastPhotoTrigger?.focus();
    }

    photoCards.forEach((card, index) => {
      card.addEventListener("click", () => openPhoto(index, card));
    });

    photoDialogClose?.addEventListener("click", closePhoto);
    photoDialogPrev?.addEventListener("click", () => renderPhoto(activePhoto - 1));
    photoDialogNext?.addEventListener("click", () => renderPhoto(activePhoto + 1));

    photoDialog.addEventListener("click", (event) => {
      if (event.target === photoDialog) closePhoto();
    });

    photoDialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        renderPhoto(activePhoto - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        renderPhoto(activePhoto + 1);
      }
    });

    photoDialog.addEventListener("close", () => {
      document.body.classList.remove("lightbox-open");
    });
  }
})();
