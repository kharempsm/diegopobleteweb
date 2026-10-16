document.addEventListener("DOMContentLoaded", (event) => {
  let button = document.querySelector(".layout__menu-toggle");
  let icon_bars = document.querySelector(".layout__menu-toggle .fa-bars");
  let icon_xmark = document.querySelector(".layout__menu-toggle .fa-xmark");
  let aside = document.querySelector(".layout__aside");

  if (button && icon_bars && icon_xmark && aside) {
    // This behaviour is deliberately limited to the mobile breakpoint.
    // Desktop navigation keeps its original CSS-only interaction.
    const mobileMenuQuery = window.matchMedia("(max-width: 1060px)");
    const isMobileMenu = () => mobileMenuQuery.matches;

    const setMobileMenuState = (isOpen) => {
      aside.classList.toggle("layout__aside--visible", isOpen);
      document.body.classList.toggle("mobile-menu-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
      button.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      aside.setAttribute("aria-hidden", String(!isOpen));
      icon_bars.style.opacity = isOpen ? 0 : 1;
      icon_xmark.style.opacity = isOpen ? 1 : 0;
    };

    const closeMobileMenu = () => setMobileMenuState(false);

    button.setAttribute("aria-controls", aside.id || "primary-navigation-panel");
    if (!aside.id) aside.id = "primary-navigation-panel";
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      if (!isMobileMenu()) return;
      setMobileMenuState(!aside.classList.contains("layout__aside--visible"));
    });

    button.addEventListener("keydown", (event) => {
      if (!isMobileMenu() || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      setMobileMenuState(!aside.classList.contains("layout__aside--visible"));
    });

    // Never cancel the anchor's default navigation. Closing first only removes
    // the mobile overlay while the browser follows the link normally.
    aside.addEventListener("click", (event) => {
      if (!isMobileMenu() || !event.target.closest(".menu__link")) return;
      closeMobileMenu();
    });

    const syncMenuWithViewport = () => {
      if (isMobileMenu()) {
        closeMobileMenu();
      } else {
        aside.classList.remove("layout__aside--visible");
        document.body.classList.remove("mobile-menu-open");
        aside.removeAttribute("aria-hidden");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open navigation");
        icon_bars.style.opacity = 1;
        icon_xmark.style.opacity = 0;
      }
    };

    if (typeof mobileMenuQuery.addEventListener === "function") {
      mobileMenuQuery.addEventListener("change", syncMenuWithViewport);
    } else {
      // Safari versions that predate MediaQueryList.addEventListener.
      mobileMenuQuery.addListener(syncMenuWithViewport);
    }
    syncMenuWithViewport();
  }

  if (!document.querySelector(".language-switcher")) {
    const languageSwitcher = document.createElement("div");
    languageSwitcher.className = "language-switcher";
    languageSwitcher.innerHTML = `
      <div class="language-switcher__panel notranslate" translate="no">
        <span class="language-switcher__label"><i class="fa-solid fa-globe" aria-hidden="true"></i><span>Language</span></span>
        <div class="language-switcher__choices" role="group" aria-label="Select site language">
          <button class="language-switcher__choice language-switcher__choice--active" type="button" data-language="en" aria-pressed="true">EN</button>
          <button class="language-switcher__choice" type="button" data-language="es" aria-pressed="false">ES</button>
        </div>
      </div>
      <div id="google_translate_element" aria-hidden="true"></div>`;
    const profilePanel = aside?.querySelector(".aside__user-info");
    const footer = profilePanel?.querySelector(".user-info__footer");

    const syncLanguageControls = (language = "en") => {
      languageSwitcher.querySelectorAll(".language-switcher__choice").forEach((choice) => {
        const isActive = choice.dataset.language === language;
        choice.classList.toggle("language-switcher__choice--active", isActive);
        choice.setAttribute("aria-pressed", String(isActive));
      });
    };

    const applyLanguage = (language, attempt = 0) => {
      const translateSelect = document.querySelector("#google_translate_element .goog-te-combo");

      // Google crea el selector de forma asíncrona. Esperamos brevemente si aún no existe.
      if (!translateSelect) {
        if (attempt < 24) window.setTimeout(() => applyLanguage(language, attempt + 1), 250);
        return;
      }

      translateSelect.value = language;
      if (typeof translateSelect.onchange === "function") {
        translateSelect.onchange();
      } else {
        translateSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
      syncLanguageControls(language);
    };

    languageSwitcher.addEventListener("click", (event) => {
      const choice = event.target.closest(".language-switcher__choice");
      if (!choice) return;

      const language = choice.dataset.language;
      applyLanguage(language);
    });

    if (footer) {
      profilePanel.insertBefore(languageSwitcher, footer);
    } else if (profilePanel) {
      profilePanel.appendChild(languageSwitcher);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement({
        pageLanguage: "en",
        includedLanguages: "en,es",
        autoDisplay: false,
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      }, "google_translate_element");

      const storedLanguage = document.cookie.match(/(?:^|; )googtrans=\/[^/]+\/([^;]+)/)?.[1];
      syncLanguageControls(storedLanguage === "es" ? "es" : "en");
    };

    const translateScript = document.createElement("script");
    translateScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    translateScript.async = true;
    document.head.appendChild(translateScript);
  }

  const kpiCards = document.querySelectorAll(".layout__kpi");
  const animateNumber = (element) => {
    if (element.dataset.animated === "true") return;

    const rawValue = element.textContent.trim();
    const match = rawValue.match(/(-?\d+(?:[.,]\d+)?)(.*)/);
    if (!match) return;

    const target = Number.parseFloat(match[1].replace(",", "."));
    const suffix = match[2].trim();
    const valueNode = document.createElement("span");
    valueNode.className = "kpi__counter-value";
    valueNode.textContent = "0";

    element.replaceChildren(valueNode);
    if (suffix === "%") {
      const percent = document.createElement("sup");
      percent.textContent = "%";
      element.appendChild(percent);
    } else if (suffix) {
      element.append(` ${suffix}`);
    }

    element.dataset.animated = "true";
    const duration = 1400;
    const start = performance.now();
    const easeOut = (progress) => 1 - Math.pow(1 - progress, 4);

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      valueNode.textContent = String(Math.round(target * easeOut(progress)));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  if (kpiCards.length && "IntersectionObserver" in window) {
    const kpiObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("layout__kpi--visible");
        entry.target.querySelectorAll(".kpi-1 p").forEach(animateNumber);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    kpiCards.forEach((card) => kpiObserver.observe(card));
  } else {
    kpiCards.forEach((card) => {
      card.classList.add("layout__kpi--visible");
      card.querySelectorAll(".kpi-1 p").forEach(animateNumber);
    });
  }
});



// const messages = [
//   `<div>
//     <p>Hey there 👋</p>
//     <br>
//     <p>I'm here to help you with any questions or concerns you may have.😊</p>
//   </div>`,
  
//   `<div>
//     <p>¡Hola! tienes alguna consulta?</p>
//     <br>
//     <p>¿Cómo puedo ayudarte? 😊</p>
//   </div>`,

//   `<div>
//     <p>مرحبًا 👋</p>
//     <br>
//     <p>أنا هنا للمساعدة في أي أسئلة أو استفسارات قد تكون لديك.😊</p>
//   </div>`,

//   `<div>
//     <p>안녕하세요 👋</p>
//     <br>
//     <p>궁금한 점이나 걱정되는 부분이 있으면 도와드리겠습니다.😊</p>
//   </div>`,
// ];

// let currentMessageIndex = 0;

// // Función para actualizar el mensaje
// function updateMessage() {
//   const messageElement = document.querySelector(
//     ".ChatLayout__MessageContent-sc-ub8sor-7 .ChatLayout__Text-sc-ub8sor-8"
//   );

//   // Verificar si el mensaje ya existe
//   if (messageElement) {
//     const currentText = messageElement.innerHTML.trim();

//     // Solo actualizamos si el mensaje actual es diferente
//     if (currentText !== messages[currentMessageIndex]) {
//       messageElement.innerHTML = messages[currentMessageIndex];
//       currentMessageIndex = (currentMessageIndex + 1) % messages.length; // Cambia al siguiente mensaje
//     }
//   } else {
//     // Si no existe el mensaje, lo creamos
//     const chatContainer = document.querySelector(".ChatLayout__MessageContainer-sc-ub8sor-4");
//     if (chatContainer) {
//       const newMessageElement = document.createElement("div");
//       newMessageElement.classList.add("ChatLayout__MessageContent-sc-ub8sor-7", "qVqIO");
//       newMessageElement.innerHTML = `<div class="ChatLayout__MessageGroup-sc-ub8sor-10 bAgvJV">
//                                        <div class="ChatLayout__Text-sc-ub8sor-8 izDmXy">
//                                          ${messages[currentMessageIndex]}
//                                        </div>
//                                      </div>`;
//       chatContainer.appendChild(newMessageElement);
//       currentMessageIndex = (currentMessageIndex + 1) % messages.length; // Cambia al siguiente mensaje
//     }
//   }
// }

// // Cambia el mensaje cada 4 segundos
// setInterval(updateMessage, 4000);

// // Inicializa con el primer mensaje
// updateMessage();


// Reveal animations are scoped so they cannot collide with page-level scripts.
// index.html has its own `observer` variable; keeping this state local prevents
// a global `const` redeclaration from stopping the mobile menu initialization.
(() => {
  const menuRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = index * 0.2;
        setTimeout(() => {
          entry.target.classList.add('show');
        }, delay * 800);
      } else {
        entry.target.classList.remove('show');
      }
    });
  });

  const menuHiddenElements = document.querySelectorAll('.hidden');
  menuHiddenElements.forEach((el) => menuRevealObserver.observe(el));
})();
