(() => {
  "use strict";

  const GTM_CONTAINER_ID = "GTM-WPFZR3FN";

  window.dataLayer = window.dataLayer || [];

  const hasGtmBootstrap = window.dataLayer.some(
    (entry) => entry && entry.event === "gtm.js"
  );

  // Some of the newer pages did not include the GTM snippet. Bootstrap it only
  // when it is missing so every page uses the same measurement container.
  if (!hasGtmBootstrap) {
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js"
    });

    const gtmScript = document.createElement("script");
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
    document.head.appendChild(gtmScript);
  }

  const compactText = (value) => String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);

  const pageContext = () => ({
    page_title: compactText(document.title),
    page_path: window.location.pathname || "/",
    page_type: document.body.className || "portfolio"
  });

  const pushEvent = (eventName, parameters = {}) => {
    window.dataLayer.push({
      event: eventName,
      ...pageContext(),
      ...parameters
    });
  };

  const getLinkUrl = (element) => {
    const href = element.getAttribute("href") || "";
    if (!href || href === "#") return "";

    try {
      const url = new URL(href, window.location.href);
      return `${url.pathname}${url.search}${url.hash}`.slice(0, 180);
    } catch {
      return href.slice(0, 180);
    }
  };

  document.addEventListener("click", (event) => {
    const target = event.target.closest("a, button");
    if (!target || target.hasAttribute("data-analytics-ignore")) return;

    const label = compactText(target.getAttribute("aria-label") || target.textContent);
    const linkUrl = getLinkUrl(target);

    if (target.matches(".user-info__btn--cv")) {
      const language = /spanish|español/i.test(label) ? "es" : "en";
      pushEvent("cv_download", {
        cv_language: language,
        file_name: (target.getAttribute("href") || "").split("/").pop(),
        link_text: label
      });
      return;
    }

    if (target.matches(".menu__link")) {
      pushEvent("navigation_click", {
        navigation_label: label,
        navigation_target: linkUrl
      });
      return;
    }

    if (target.matches(".language-switcher__choice")) {
      pushEvent("language_change", {
        language: target.dataset.language || "unknown"
      });
      return;
    }

    if (target.closest(".contact-panel")) {
      let contactMethod = "other";
      if (target.closest(".contact-panel--whatsapp")) contactMethod = "whatsapp";
      if (target.closest(".contact-panel--calendar")) contactMethod = "calendar";
      if (target.matches('[href^="mailto:"]')) contactMethod = "email";
      if (target.matches('[href^="tel:"]')) contactMethod = "phone";

      pushEvent("contact_click", {
        contact_method: contactMethod,
        contact_action: label
      });
      return;
    }

    if (target.matches("button, .form__button, .content__menu-link")) {
      pushEvent("button_click", {
        button_label: label,
        button_target: linkUrl || "onsite_action"
      });
    }
  }, { capture: true });

  document.addEventListener("DOMContentLoaded", () => {
    // GA4's standard page_view is sent by the GA4 Configuration tag in GTM.
    // This companion event adds page context without duplicating page_view.
    pushEvent("site_page_view");
  });
})();
