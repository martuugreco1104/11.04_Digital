'use strict';

/* ============================================================
   11.04_DIGITAL — SCRIPT v3
   Bilingual (ES/EN) + All interactions
   ============================================================ */

// ── LOADER ──────────────────────────────────────────────────
const loader = document.getElementById('loader');
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('gone');
    document.body.style.overflow = '';
    document.querySelectorAll('#hero .reveal, #hero .reveal-up, #hero .reveal-up-2, #hero .reveal-up-3')
      .forEach(el => el.classList.add('visible'));
  }, 1100);
});

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-up, .reveal-up-2, .reveal-up-3').forEach(el => {
  if (!el.closest('#hero')) revealObs.observe(el);
});

// ── NAVBAR ───────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── MOBILE NAV ───────────────────────────────────────────────
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
burger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  burger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
function closeNav() {
  mobileNav.classList.remove('open');
  burger.classList.remove('open');
  document.body.style.overflow = '';
}

// ── YEAR ─────────────────────────────────────────────────────
document.getElementById('yr').textContent = new Date().getFullYear();

// ── PLAN CARD DIMMING ─────────────────────────────────────────
const planCards = document.querySelectorAll('.plan-card');
planCards.forEach(card => {
  card.addEventListener('mouseenter', () => planCards.forEach(c => c.style.opacity = c === card ? '1' : '0.45'));
  card.addEventListener('mouseleave', () => planCards.forEach(c => c.style.opacity = '1'));
});

// ── HERO PARALLAX (handled natively via CSS background-attachment: fixed) ──

// ══════════════════════════════════════════════════════════════
//  BILINGUAL SYSTEM
// ══════════════════════════════════════════════════════════════

const html = document.documentElement;

/**
 * Apply language: swap <html> class, update .t spans,
 * toggle lang-btn active state, persist to localStorage.
 * Zero CLS: we use opacity+max-height in CSS, not display:none.
 */
let currentPlan = null; // Global tracker for selected plan

function updateContactLinks() {
  const whatsappBtn = document.querySelector('.cta-btns .btn-primary');
  const emailBtn = document.querySelector('.cta-btns .btn-outline');
  if (!whatsappBtn || !emailBtn) return;

  const lang = html.classList.contains('lang-en') ? 'en' : 'es';
  const phone = '5491100000000'; // Target phone

  let text = '';
  let mailSubject = '';
  let mailBody = '';

  if (lang === 'es') {
    if (currentPlan) {
      const planName = currentPlan.toUpperCase();
      text = `Hola, quiero solicitar el plan [${planName}] de 11.04_DIGITAL y comenzar a potenciar mi identidad digital.`;
      mailSubject = `Solicitud de Plan ${planName} — 11.04_DIGITAL`;
      mailBody = `Hola,\n\nQuiero solicitar más información o iniciar la contratación del plan [${planName}] para mi EPK interactivo.\n\nSaludos!`;
    } else {
      text = 'Hola, quiero info sobre un EPK con 11.04_DIGITAL';
      mailSubject = 'Consulta de EPK interactivo — 11.04_DIGITAL';
      mailBody = 'Hola,\n\nQuiero solicitar información sobre el sistema de EPK interactivo y webs de alto rendimiento.\n\nSaludos!';
    }
  } else {
    if (currentPlan) {
      const planName = currentPlan.toUpperCase();
      text = `Hi, I would like to request the [${planName}] plan from 11.04_DIGITAL to upgrade my digital identity.`;
      mailSubject = `Plan Request ${planName} — 11.04_DIGITAL`;
      mailBody = `Hi,\n\nI would like to request more information or start hiring the [${planName}] plan for my interactive EPK.\n\nBest regards!`;
    } else {
      text = 'Hi, I would like info about an EPK with 11.04_DIGITAL';
      mailSubject = 'Interactive EPK inquiry — 11.04_DIGITAL';
      mailBody = 'Hi,\n\nI would like to request information about the interactive EPK system and high-performance websites.\n\nBest regards!';
    }
  }

  whatsappBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  emailBtn.href = `mailto:hola@1104digital.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
}

function setLang(lang) {
  // 1. Toggle class on <html>
  html.classList.remove('lang-es', 'lang-en');
  html.classList.add('lang-' + lang);
  html.lang = lang === 'es' ? 'es' : 'en';

  // 2. Swap all .t spans (data-es / data-en)
  document.querySelectorAll('.t[data-' + lang + ']').forEach(el => {
    el.textContent = el.dataset[lang];
  });

  // 3. Update active state on all lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // 4. Persist preference
  try { localStorage.setItem('1104_lang', lang); } catch (e) {}

  // 5. Update close button aria-label for accessibility
  const modalClose = document.getElementById('modal-close');
  if (modalClose) {
    modalClose.setAttribute('aria-label', lang === 'en' ? 'Close modal' : 'Cerrar modal');
  }

  // 6. Update WhatsApp and Email links text dynamically
  updateContactLinks();
}

// Wire up all lang buttons (desktop + mobile)
document.querySelectorAll('.lang-btn').forEach(btn => {
  // Derive lang from button id: btn-es, btn-es-m → 'es'
  const lang = btn.id.replace('btn-', '').replace('-m', '');
  btn.dataset.lang = lang;
  btn.addEventListener('click', () => setLang(lang));
});

// Init language from localStorage or default ES
const savedLang = (() => { try { return localStorage.getItem('1104_lang'); } catch(e) { return null; } })();
setLang(savedLang === 'en' ? 'en' : 'es');

// Wire up plan buttons for dynamic checkout text
document.querySelectorAll('.plan-card .btn-plan').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.plan-card');
    if (card) {
      currentPlan = card.dataset.plan || null;
      updateContactLinks();
    }
  });
});

// ── SMOOTH ANCHOR ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ══════════════════════════════════════════════════════════════
//  SYSTEM COMPONENTS MODAL SYSTEM
// ══════════════════════════════════════════════════════════════

// Bilingual content and specifications data mapping
const COMPONENT_DATA = {
  soundcloud: {
    code: "SYS_COMP_01",
    title: { es: "SoundCloud Player", en: "SoundCloud Player" },
    benefits: {
      es: "Permite a los bookers y promotores escuchar tus sets o tracks directamente en tu EPK sin tener que abandonar la página. Incrementa el tiempo de permanencia en tu web y la tasa de conversión de reservas.",
      en: "Allows bookers and promoters to listen to your sets or tracks directly in your EPK without leaving the page. Increases dwell time on your site and booking conversion rate."
    },
    specs: {
      es: [
        "Reproductor de audio nativo embebido sin fricción.",
        "Carga perezosa (lazy-loading) para no penalizar la velocidad de la web.",
        "Personalización de colores e interfaz brutalista de corte premium."
      ],
      en: [
        "Zero-friction native embedded audio player.",
        "Lazy-loaded to keep page load speeds lightning-fast.",
        "Bespoke layout customization matching brand color palette."
      ]
    },
    graphic: "soundcloud"
  },
  booking: {
    code: "SYS_COMP_02",
    title: { es: "Booking System", en: "Booking System" },
    benefits: {
      es: "Simplifica el proceso de contratación. Los promotores completan un formulario simplificado de solicitud de gig con fecha, lugar y presupuesto, centralizando tus consultas y eliminando intermediarios lentos.",
      en: "Simplifies the hiring process. Promoters complete a streamlined gig request form with date, venue, and budget, centralizing your inquiries and bypassing slow intermediaries."
    },
    specs: {
      es: [
        "Formulario directo sin fricción optimizado para móviles.",
        "Notificaciones instantáneas por correo o mensajería rápida.",
        "Filtro técnico inteligente para descartar ofertas spam."
      ],
      en: [
        "Mobile-optimized direct contact form with zero friction.",
        "Instant notifications via email or instant messaging webhook.",
        "Technical smart filter to discard spam requests."
      ]
    },
    graphic: "booking"
  },
  rider: {
    code: "SYS_COMP_03",
    title: { es: "Technical Rider", en: "Technical Rider" },
    benefits: {
      es: "Evita malentendidos en cabina. Tu ficha de equipamiento técnico e input list digital e interactivo se visualizan con un solo click. Ahorra tiempo en la producción del festival o club.",
      en: "Avoids booth misunderstandings. Your digital interactive technical equipment sheet and input list are displayed with a single click. Saves massive coordination time with festival and club crews."
    },
    specs: {
      es: [
        "Visualizador e input-list interactivo de consolas Pioneer y CDJs.",
        "Descarga directa en formato PDF vectorizado de alta resolución.",
        "Estructura modular adaptable según el set (Live / DJ Set)."
      ],
      en: [
        "Interactive input-list and stage plot visualizer for CDJs & Mixers.",
        "Direct download in high-resolution vectorized PDF format.",
        "Modular structure adaptable based on the set type (Live vs DJ Set)."
      ]
    },
    graphic: "rider"
  },
  photos: {
    code: "SYS_COMP_04",
    title: { es: "Press Photos", en: "Press Photos" },
    benefits: {
      es: "Brinda material de prensa de calidad para flyeres y cartelería. Galería optimizada en cuadrícula donde agencias o promotores pueden descargar tus fotos oficiales en alta resolución con un solo toque.",
      en: "Provides top-quality press assets for flyers and billings. Optimized grid gallery where agencies and promoters can download your high-resolution official photos with a single tap."
    },
    specs: {
      es: [
        "Galería de imágenes optimizada con lazy-loading progresivo.",
        "Descarga directa zip de alta resolución (300 DPI) para imprenta.",
        "Visualizador inmersivo a pantalla completa."
      ],
      en: [
        "Optimized image gallery with progressive lazy-loading.",
        "Direct zip downloads in high resolution (300 DPI) for print assets.",
        "Immersive full-screen visualizer overlay."
      ]
    },
    graphic: "photos"
  },
  analytics: {
    code: "SYS_COMP_05",
    title: { es: "Analytics & Tracking", en: "Analytics & Tracking" },
    benefits: {
      es: "Descubre quién tiene interés en ti. Monitorea en tiempo real qué agencias, bookers o promotores abren tu EPK, cuánto tiempo pasan escuchando tus sets y desde qué ciudades del mundo te buscan.",
      en: "Discover who is interested in you. Monitor in real time which agencies, bookers, or promoters open your EPK, how much time they spend listening to your sets, and from which cities around the world."
    },
    specs: {
      es: [
        "Tracking silencioso sin cookies invasivas, cumpliendo con GDPR.",
        "Reportes gráficos de permanencia y tasa de clicks.",
        "Métricas avanzadas de conversión de booking integradas."
      ],
      en: [
        "Silent tracking without invasive cookies, fully GDPR compliant.",
        "Visual graphic reports on dwell time and click-through rates.",
        "Integrated advanced booking conversion metrics dashboard."
      ]
    },
    graphic: "analytics"
  },
  mobile: {
    code: "SYS_COMP_06",
    title: { es: "Mobile Optimized", en: "Mobile Optimized" },
    benefits: {
      es: "Diseñado para smartphones. Como los bookers acceden principalmente desde Instagram en móviles, la web se adapta al milímetro con layouts fluidos, tipografía editorial y tiempos de carga instantáneos.",
      en: "Designed for smartphones. Since bookers mostly access from Instagram on mobile, the web adapts to the pixel with fluid layouts, editorial typography, and instant load speeds."
    },
    specs: {
      es: [
        "Desarrollo Mobile-First real con layouts fluidos.",
        "Imágenes y videos responsive auto-optimizados por resolución.",
        "Micro-interacciones táctiles suaves de 60fps."
      ],
      en: [
        "Real Mobile-First engineering with fluid responsive layouts.",
        "Responsive auto-optimized images and video resolutions.",
        "Smooth 60fps tactile micro-interactions."
      ]
    },
    graphic: "mobile"
  },
  seo: {
    code: "SYS_COMP_07",
    title: { es: "SEO Técnico", en: "Technical SEO" },
    benefits: {
      es: "Aparece primero cuando te buscan. Optimizamos los metadatos, etiquetas Open Graph y la arquitectura interna de la web para que Google te indexe como artista verificado en la escena global.",
      en: "Rank first when searched. We optimize metadata, Open Graph tags, and internal site architecture so that Google indexes you as a verified artist in the global scene."
    },
    specs: {
      es: [
        "Marcado estructurado JSON-LD específico para artistas musicales.",
        "Puntuación perfecta de SEO técnico de 100/100 en Google Lighthouse.",
        "Metadatos Open Graph optimizados para previsualizaciones en WhatsApp/Instagram."
      ],
      en: [
        "Structured JSON-LD schema markup tailored for musical artists.",
        "Perfect 100/100 Technical SEO score on Google Lighthouse audits.",
        "Optimized Open Graph tags for previews on WhatsApp, Slack, and Instagram."
      ]
    },
    graphic: "seo"
  },
  language: {
    code: "SYS_COMP_08",
    title: { es: "Multi-language Bio", en: "Multi-language Bio" },
    benefits: {
      es: "Alcance global inmediato. Cambia instantáneamente tu biografía e información comercial entre Castellano e Inglés de forma limpia, sin recargas de página y sin retrasar los tiempos de carga.",
      en: "Immediate global reach. Instantly swap your biography and booking info between Spanish and English cleanly, with no page reload and zero performance layout shifts."
    },
    specs: {
      es: [
        "Traducción selectiva de clases en tiempo de ejecución con Zero CLS.",
        "Persistencia del idioma seleccionado mediante LocalStorage.",
        "Soporte multilenguaje unificado en el mismo archivo index.html."
      ],
      en: [
        "Runtime class toggling with zero Cumulative Layout Shift (CLS).",
        "Language preference persistence saved via client LocalStorage.",
        "Unified multi-language content in a single index.html file."
      ]
    },
    graphic: "language"
  },
  cdn: {
    code: "SYS_COMP_09",
    title: { es: "CDN Global", en: "Global CDN" },
    benefits: {
      es: "Velocidad brutal en cualquier rincón del planeta. Distribuimos tu EPK interactivo en una red de servidores perimetrales globales, entregando la web en milisegundos a promotores en Europa, América o Asia.",
      en: "Brutal speed in any corner of the planet. We distribute your interactive EPK across a network of global edge servers, delivering the site in milliseconds to promoters in Europe, America, or Asia."
    },
    specs: {
      es: [
        "Alojamiento perimetral distribuido globalmente.",
        "Compresión avanzada de assets de última generación.",
        "Latencia ultrabaja en la entrega de contenidos críticos."
      ],
      en: [
        "Globally distributed perimeter edge server hosting.",
        "Cutting-edge assets compression protocols.",
        "Ultra-low latency in critical content delivery path."
      ]
    },
    graphic: "cdn"
  }
};

const modal = document.getElementById('feat-modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalCode = document.getElementById('modal-code');
const modalBenefits = document.getElementById('modal-benefits');
const modalSpecs = document.getElementById('modal-specs');
const graphicContainer = document.getElementById('modal-graphic-container');

// Open Modal logic
document.querySelectorAll('.feat-card[data-comp]').forEach(card => {
  card.addEventListener('click', () => {
    const compKey = card.dataset.comp;
    const data = COMPONENT_DATA[compKey];
    if (!data) return;

    const lang = (document.documentElement.classList.contains('lang-en')) ? 'en' : 'es';

    // Populate text
    modalTitle.textContent = data.title[lang];
    modalCode.textContent = `[${data.code}]`;
    modalBenefits.textContent = data.benefits[lang];

    // Populate specifications
    modalSpecs.innerHTML = '';
    data.specs[lang].forEach(spec => {
      const li = document.createElement('li');
      li.textContent = spec;
      modalSpecs.appendChild(li);
    });

    // Populate custom technical graphic
    renderModalGraphic(data.graphic);

    // Active state and scroll lock
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

// Close Modal logic
function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

// Render dynamic animated CSS graphics inside modal
function renderModalGraphic(type) {
  graphicContainer.innerHTML = '';
  let html = '';

  switch (type) {
    case 'soundcloud':
      html = `
        <div class="mock-soundcloud-player">
          <div class="mock-player-header">
            <div class="mock-play-btn">▶</div>
            <div class="mock-meta-text mono">
              <span class="mock-meta-track">FUTURA_SESSION_2026.wav</span>
              <span class="mock-meta-artist">PIONEER_STREAMING_NATIVE</span>
            </div>
          </div>
          <div class="mock-audio-wave">
            <div class="mock-wave-bar active"></div>
            <div class="mock-wave-bar active" style="animation-duration: 0.8s"></div>
            <div class="mock-wave-bar active" style="animation-duration: 1.4s"></div>
            <div class="mock-wave-bar active" style="animation-duration: 0.9s"></div>
            <div class="mock-wave-bar active" style="animation-duration: 1.1s"></div>
            <div class="mock-wave-bar active" style="animation-duration: 0.7s"></div>
            <div class="mock-wave-bar active" style="animation-duration: 1.3s"></div>
            <div class="mock-wave-bar active" style="animation-duration: 1.0s"></div>
            <div class="mock-wave-bar active" style="animation-duration: 1.5s"></div>
            <div class="mock-wave-bar active" style="animation-duration: 0.6s"></div>
            <div class="mock-wave-bar active" style="animation-duration: 1.2s"></div>
            <div class="mock-wave-bar active" style="animation-duration: 0.9s"></div>
          </div>
        </div>
      `;
      break;

    case 'booking':
      html = `
        <div class="mock-booking-calendar mono">
          <div class="mock-cal-header">
            <span>[JULY_2026]</span>
            <span>AVAILABLE_SLOTS</span>
          </div>
          <div class="mock-cal-grid">
            <div class="mock-cal-day">01</div>
            <div class="mock-cal-day">02</div>
            <div class="mock-cal-day booked">03</div>
            <div class="mock-cal-day">04</div>
            <div class="mock-cal-day active">05</div>
            <div class="mock-cal-day">06</div>
            <div class="mock-cal-day">07</div>
            <div class="mock-cal-day">08</div>
            <div class="mock-cal-day active">09</div>
            <div class="mock-cal-day">10</div>
            <div class="mock-cal-day booked">11</div>
            <div class="mock-cal-day">12</div>
            <div class="mock-cal-day">13</div>
            <div class="mock-cal-day">14</div>
            <div class="mock-cal-day">15</div>
            <div class="mock-cal-day active">16</div>
            <div class="mock-cal-day">17</div>
            <div class="mock-cal-day">18</div>
            <div class="mock-cal-day booked">19</div>
            <div class="mock-cal-day">20</div>
            <div class="mock-cal-day active">21</div>
          </div>
        </div>
      `;
      break;

    case 'rider':
      html = `
        <div class="mock-mixer-deck">
          <div class="mock-mixer-channel">
            <div class="mock-knob"></div>
            <div class="mock-mixer-fader"><div class="mock-fader-knob"></div></div>
          </div>
          <div class="mock-mixer-channel">
            <div class="mock-knob" style="transform: rotate(50deg)"></div>
            <div class="mock-mixer-fader"><div class="mock-fader-knob"></div></div>
          </div>
          <div class="mock-mixer-channel">
            <div class="mock-knob" style="transform: rotate(-30deg)"></div>
            <div class="mock-mixer-fader"><div class="mock-fader-knob"></div></div>
          </div>
        </div>
      `;
      break;

    case 'photos':
      html = `
        <div class="mock-press-photo">
          <div class="mock-crop-guides"></div>
          <div class="mock-crop-info mono">
            <span>PRESS_SHOT_04.jpg</span><br/>
            <span>6000 x 4000 PX (300 DPI)</span>
          </div>
        </div>
      `;
      break;

    case 'analytics':
      html = `
        <div class="mock-analytics-chart mono">
          <div class="mock-chart-header">
            <span>TRAFFIC_METRIC</span>
            <span class="blue-text">+340% CONV</span>
          </div>
          <svg class="mock-chart-svg" viewBox="0 0 100 40">
            <path class="mock-chart-line" d="M 5 35 Q 25 30 45 15 T 85 5 T 95 2"/>
            <line x1="5" y1="35" x2="95" y2="35" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
          </svg>
        </div>
      `;
      break;

    case 'mobile':
      html = `
        <div class="mock-phone-frame">
          <div class="mock-phone-screen">
            <div class="mock-screen-title"></div>
            <div class="mock-screen-line" style="width: 90%"></div>
            <div class="mock-screen-line" style="width: 40%"></div>
            <div class="mock-screen-hero"></div>
            <div class="mock-screen-line" style="width: 100%"></div>
          </div>
        </div>
      `;
      break;

    case 'seo':
      html = `
        <div class="mock-google-seo mono">
          <div class="mock-seo-search">https://google.com/search?q=jansound</div>
          <div class="mock-seo-result">
            <span class="mock-seo-url">https://jansound.com</span>
            <span class="mock-seo-title">JANSOUND — Official Website & EPK</span>
            <span class="mock-seo-snippet">Electronic music producer and DJ. Bookings available for 2026/2027 global tours. Stream sets and technical rider specs.</span>
          </div>
        </div>
      `;
      break;

    case 'language':
      html = `
        <div class="mock-lang-code">
          <div class="mock-lang-panel active">
            <h5>LANG_ES</h5>
            <span>"bio": "Arquitectura digital nativa..."</span>
          </div>
          <div class="mock-lang-panel">
            <h5>LANG_EN</h5>
            <span>"bio": "Native digital architecture..."</span>
          </div>
        </div>
      `;
      break;

    case 'cdn':
      html = `
        <div class="mock-cdn-nodes">
          <div class="mock-cdn-center"></div>
          <div class="mock-cdn-node n1"></div>
          <div class="mock-cdn-node n2"></div>
          <div class="mock-cdn-node n3"></div>
          <div class="mock-cdn-node n4"></div>
          <div class="mock-cdn-pulse"></div>
          <div class="mock-cdn-pulse" style="animation-delay: 0.7s"></div>
        </div>
      `;
      break;
  }

  graphicContainer.innerHTML = html;
}
