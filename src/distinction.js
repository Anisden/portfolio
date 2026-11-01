// Distinction Page Logic — High-Craft Architectural Grid Layout
import { initBlueprintCanvas } from './blueprint.js';
const BASE = import.meta.env.BASE_URL;

// Language handling
const SUPPORTED_LANGS = ['fr', 'en', 'ar'];
let currentLang = localStorage.getItem('portfolio_lang') || 'fr';
if (!SUPPORTED_LANGS.includes(currentLang)) currentLang = 'fr';

let uiTranslations = {};

function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // Convert absolute local paths starting with '/' to relative paths starting with './'
  let cleanUrl = url;
  if (cleanUrl.startsWith('/')) {
    cleanUrl = cleanUrl.slice(1);
  }
  return `./${cleanUrl}`;
}

const ICONS = { award: '🏆', competition: '🥇', media: '📺', press: '📰' };

async function initLanguageSelector() {
  const langBtn = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  
  if (langBtn && langDropdown) {
    // Prevent duplicated listener bindings
    const newBtn = langBtn.cloneNode(true);
    langBtn.parentNode.replaceChild(newBtn, langBtn);
    
    newBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
      langDropdown.classList.remove('active');
    });
    
    langDropdown.querySelectorAll('.lang-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const lang = opt.dataset.lang;
        localStorage.setItem('portfolio_lang', lang);
        // Refresh to reload distinctions in the chosen language
        window.location.reload();
      });
    });
  }
  
  // Set properties on documentElement
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  
  // Load UI translations
  try {
    const res = await fetch(`${BASE}ui_translations.json`);
    if (res.ok) {
      uiTranslations = await res.json();
      translateUI();
    }
  } catch (e) { console.error('UI translation load error', e); }

  // Update navbar indicator
  const langIndicator = document.getElementById('current-lang');
  if (langIndicator) langIndicator.textContent = currentLang.toUpperCase();
  
  document.querySelectorAll('.lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === currentLang);
  });
}

function translateUI() {
  const dict = uiTranslations[currentLang];
  if (!dict) return;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

// JAC 2019 Distinction Full Gallery Items with Category and Multilingual Captions
const JAC_GALLERY = [
  {
    src: '/uploads/jac_remise_prix.jpg',
    category: 'ceremony',
    badge: { fr: 'Trophée JAC', en: 'JAC Trophy', ar: 'تتويج قرطاج' },
    fr: 'Remise du Prix JAC 2019 — Architectes Anis Bouden & Jalel Sakli',
    en: 'JAC 2019 Award Ceremony — Architects Anis Bouden & Jalel Sakli',
    ar: 'تسليم جائزة أيام قرطاج 2019 — المهندسان أنيس بودن وجلال صكلي'
  },
  {
    src: '/uploads/1779116465000_75446727_1378021255709514_25495716873182.avif',
    category: 'ceremony',
    badge: { fr: 'Cérémonie Officielle', en: 'Official Ceremony', ar: 'الحفل الرسمي' },
    fr: 'Cérémonie officielle de clôture et proclamation du palmarès JAC 2019',
    en: 'Official closing ceremony and awards proclamation of JAC 2019',
    ar: 'الحفل الرسمي لاختتام أيام قرطاج المعمارية وتتويج الفائزين 2019'
  },
  {
    src: '/uploads/1779116561582_04_-_issat_kairouan_jalel_sakli.jpg',
    category: 'ceremony',
    badge: { fr: 'Affiche Concours', en: 'Competition Poster', ar: 'ملصق المسابقة' },
    fr: 'Affiche officielle du Projet Lauréat — Concours National & Équipe',
    en: 'Official Winning Project Poster — National Competition & Consortium',
    ar: 'الملصق الرسمي للمشروع الفائز — المسابقة الوطنية وفريق المهندسين'
  },
  {
    src: '/uploads/1779016324608_IMG_20191009_132232.jpg',
    category: 'facades',
    badge: { fr: 'Façade Principale', en: 'Main Facade', ar: 'الواجهة الرئيسية' },
    fr: 'Façade monumentale, tour signal et colonnade dorée',
    en: 'Monumental facade, landmark tower and golden colonnade',
    ar: 'الواجهة الرئيسية والبرج المعماري البارز مع كواسر الشمس'
  },
  {
    src: '/uploads/1779016324606_afpnu-djjb5.jpg',
    category: 'interiors',
    badge: { fr: 'Ombrière & Préau', en: 'Shade Canopy', ar: 'المظلة الكبرى' },
    fr: 'Grande ombrière bioclimatique et préau d\'accueil',
    en: 'Bioclimatic shade canopy and covered entrance plaza',
    ar: 'المظلة البيومناخية الكبرى وفضاء الاستقبال المظلل'
  },
  {
    src: '/uploads/1779016324607_amphi_300.jpg',
    category: 'interiors',
    badge: { fr: 'Amphithéâtre', en: 'Auditorium', ar: 'المدرج الجامعي' },
    fr: 'Grand amphithéâtre universitaire de 300 places',
    en: '300-seat university lecture hall auditorium',
    ar: 'المدرج الجامعي الرئيسي المتطور (300 مقعد)'
  },
  {
    src: '/uploads/1779016324607_DSCN6289.jpg',
    category: 'interiors',
    badge: { fr: 'Patio Central', en: 'Central Patio', ar: 'الفناء الداخلي' },
    fr: 'Patio central arboré et puits de lumière naturelle',
    en: 'Central landscaped courtyard and natural skylight',
    ar: 'الفناء الداخلي المشجر ومصدر الإضاءة الطبيعية'
  },
  {
    src: '/uploads/1779016324607_DSCN6304bis.jpg',
    category: 'facades',
    badge: { fr: 'Brise-Soleil', en: 'Sun Louvers', ar: 'كواسر الشمس' },
    fr: 'Colonnade brise-soleil en pierre dorée locale de Kairouan',
    en: 'Vertical sunbreaker colonnade in local golden limestone',
    ar: 'كواسر الشمس العمودية المنفذة بالحجر المحلي الأصيل'
  },
  {
    src: '/uploads/1779016324607_DSCN6281.JPG',
    category: 'interiors',
    badge: { fr: 'Circulations', en: 'Circulations', ar: 'الأروقة والجسور' },
    fr: 'Galeries de circulation et passerelles intérieures',
    en: 'Circulation galleries and interior pedestrian bridges',
    ar: 'أروقة التوزيع والجسور الداخلية المعلقة'
  },
  {
    src: '/uploads/1779016324613_IMG_20191009_132311bis.jpg',
    category: 'interiors',
    badge: { fr: 'Moucharabieh', en: 'Mashrabiya', ar: 'المشربية' },
    fr: 'Moucharabieh contemporain ajouré et jeux d\'ombres solaires',
    en: 'Contemporary geometric mashrabiya screen with light patterns',
    ar: 'المشربية المعاصرة وتداخل الضوء والظل في بهو الاستقبال'
  },
  {
    src: '/uploads/1779016324614_IMG_20191009_132339.jpg',
    category: 'facades',
    badge: { fr: 'Parvis d\'Accès', en: 'Entrance Plaza', ar: 'الساحة الأمامية' },
    fr: 'Parvis d\'accès piéton et perspective du bâtiment',
    en: 'Pedestrian entrance esplanade and building perspective',
    ar: 'الساحة الأمامية للمشاة ومدخل المعهد الرئيسي'
  },
  {
    src: '/uploads/1779016324614_IMG_20191009_132320.jpg',
    category: 'facades',
    badge: { fr: 'Volumétrie', en: 'Volumetrics', ar: 'الكتل المعمارية' },
    fr: 'Perspective d\'angle et articulation géométrique des volumes',
    en: 'Corner perspective and geometric volumetric articulation',
    ar: 'منظور زاوي وتناسق الكتل المعمارية الحديثة'
  },
  {
    src: '/uploads/1779016324611_IMG_20191009_132304_BURST002.jpg',
    category: 'facades',
    badge: { fr: 'Tour Signal', en: 'Landmark Tower', ar: 'البرج البارز' },
    fr: 'Cadrage vertical sur la tour signal et fenestration',
    en: 'Vertical architectural framing of the landmark tower',
    ar: 'تأطير عمودي للبرج المميز والنوافذ المعمارية'
  },
  {
    src: '/uploads/1779016238476_IMG_20181025_115601_bisbis.jpg',
    category: 'facades',
    badge: { fr: 'Toiture Terrasse', en: 'Roof Terrace', ar: 'الشرفة العلوية' },
    fr: 'Structure moucharabieh métallique en toiture terrasse',
    en: 'Metal mashrabiya trellis structure on the upper terrace',
    ar: 'هيكل المشربية المعدني على الشرفة العلوية المطلة'
  },
  {
    src: '/uploads/1779016324614_IMG_20191009_132510.jpg',
    category: 'interiors',
    badge: { fr: 'Ombres & Lumières', en: 'Light & Shadow', ar: 'الظلال والضوء' },
    fr: 'Ombres portées et dessin au sol sous l\'ombrière métallique',
    en: 'Cast shadows and rhythmic floor patterns under the canopy',
    ar: 'الظلال الهندسية المتغيرة المنعكسة على الأرضية'
  },
  {
    src: '/uploads/1779016324614_IMG_20191009_132619bis.jpg',
    category: 'interiors',
    badge: { fr: 'Ateliers & Salles', en: 'Studios & Rooms', ar: 'قاعات التدريس' },
    fr: 'Ateliers et espaces d\'apprentissage baignés de lumière',
    en: 'Classrooms and sunlit flexible learning studios',
    ar: 'قاعات التدريس وفضاءات التعليم المضيئة'
  },
  {
    src: '/uploads/1779016324615_IMG_20191009_132743bis.jpg',
    category: 'facades',
    badge: { fr: 'Vue Panoramique', en: 'Panoramic View', ar: 'مشهد بانورامي' },
    fr: 'Vue panoramique d\'ensemble du campus universitaire',
    en: 'Panoramic overview of the university campus',
    ar: 'إطلالة بانورامية شاملة على الحرم الجامعي والمرافق'
  },
  {
    src: '/uploads/1779016324608_DSCN6318.jpg',
    category: 'facades',
    badge: { fr: 'Intégration', en: 'Integration', ar: 'الاندماج' },
    fr: 'Composition des volumes et insertion paysagère',
    en: 'Volumetric composition and landscape integration',
    ar: 'التكوين المعماري والاندماج مع المحيط الطبيعي'
  }
];

// Active lightbox state
let activeLightboxGallery = [];
let activeLightboxIndex = 0;

async function init() {
  initBlueprintCanvas();
  await initLanguageSelector();

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  let res = await fetch(`${BASE}content_${currentLang}.json?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) res = await fetch(`${BASE}content.json?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) return;
  const content = await res.json();

  // Populate dynamic logo
  const logoEl = document.getElementById('site-logo');
  if (logoEl && content.logoText) {
    logoEl.innerHTML = content.logoText;
  }

  const distinctions = content.distinctions || [];
  if (!distinctions.length) return;

  const LABELS = {
    award: currentLang === 'ar' ? 'جائزة رفيعة' : (currentLang === 'en' ? 'Award' : 'Prix'),
    competition: currentLang === 'ar' ? 'مسابقة معمارية' : (currentLang === 'en' ? 'Competition' : 'Concours'),
    media: currentLang === 'ar' ? 'تغطية إعلامية' : (currentLang === 'en' ? 'Media' : 'Médias'),
    press: currentLang === 'ar' ? 'مقال صحفي' : (currentLang === 'en' ? 'Press' : 'Presse')
  };

  // Resolve URLs
  distinctions.forEach(d => {
    if (d.image) d.image = resolveUrl(d.image);
    if (d.image2) d.image2 = resolveUrl(d.image2);
    if (d.pdfLink) d.pdfLink = resolveUrl(d.pdfLink);
    if (d.eventPhoto) d.eventPhoto = resolveUrl(d.eventPhoto);
    if (d.video && !d.video.includes('<iframe') && !d.video.includes('youtube.com') && !d.video.includes('youtu.be')) {
      d.video = resolveUrl(d.video);
    }
    if (d.gallery) d.gallery = d.gallery.map(resolveUrl);
  });
  JAC_GALLERY.forEach(item => {
    item.src = resolveUrl(item.src);
  });

  const container = document.getElementById('distinctions-container');
  const awardsGrid = document.getElementById('awards-grid');
  const pressGrid = document.getElementById('press-grid');
  const mediaGrid = document.getElementById('media-grid');

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const scrollToIdx = parseInt(params.get('i'), 10);

  // Render all distinctions
  distinctions.forEach((d, idx) => {
    const block = document.createElement('div');
    block.id = `distinction-${idx}`;

    if (d.title.includes('JAC') || d.title.includes('Carthage') || d.title.includes('قرطاج')) {
      // 1. Wix Custom Layout for JAC 2019
      const groupPhoto = d.gallery.find(src => src.includes('bouden_et_jalel')) || d.gallery[1] || d.image;
      const otherPhoto = d.gallery.find(src => !src.includes('bouden_et_jalel')) || d.gallery[0];
      
      const vVal = d.video ? d.video.trim() : '';
      let frameHtml = '';
      if (vVal) {
        if (vVal.startsWith('<iframe') || vVal.startsWith('<div')) {
          frameHtml = vVal;
        } else if (vVal.includes('youtube.com') || vVal.includes('youtu.be')) {
          const match = vVal.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
          if (match && match[1]) {
            frameHtml = `<iframe src="https://www.youtube.com/embed/${match[1]}" allowfullscreen></iframe>`;
          }
        } else {
          frameHtml = `<video src="${vVal}" controls></video>`;
        }
      }

      const jacTitle = currentLang === 'ar' ? 'جائزة أيام قرطاج المعمارية 2019' : (currentLang === 'en' ? 'Carthage Architectural Days Award' : 'Prix des JAC 2019');
      const jacSubtitleText = currentLang === 'ar' ? 'الدورة الأولى للمعرض مع تتويج المشاريع الكبرى' : (currentLang === 'en' ? 'Journées Architecturales de Carthage' : 'Journées Architecturales de Carthage');
      const bestProjectLabel = currentLang === 'ar' ? 'جائزة أفضل مشروع للمباني المدنية والمؤسسية' : (currentLang === 'en' ? 'Best Civil & Public Building Award' : 'Prix du meilleur projet de Bâtiment civil');
      const groupmentLabel = currentLang === 'ar' ? 'الائتلاف المعماري الفائز: م. جلال صكلي وم. محمد علي بن عافية وم. أنيس بودن' : (currentLang === 'en' ? 'Architectural Consortium: Mr. Jalel Sakli, Mr. Mohamed Ali Ben Afia, Mr. Anis Bouden' : "Groupement d'Architectes: M. JALEL SAKLI & M. MOHAMED ALI BEN AFIA & M. ANIS BOUDEN");
      const laureatLabel = currentLang === 'ar' ? 'المشروع الفائز: المعهد العالي للعلوم التطبيقية والتكنولوجيا بالقيروان (ISSAT Kairouan)' : (currentLang === 'en' ? 'Winning Project: Higher Institute of Applied Sciences and Technology of Kairouan (ISSAT Kairouan)' : 'Projet lauréat: Institut Supérieur des Sciences Appliquées et de la Technologie de Kairouan (ISSAT Kairouan)');
      const viewIssatProjectLabel = currentLang === 'ar' ? '🏛️ عرض صفحة مشروع المعهد العالي بالقيروان (ISSAT Kairouan) ←' : (currentLang === 'en' ? '🏛️ View Full ISSAT Kairouan Project Page →' : '🏛️ Voir la fiche complète du projet ISSAT Kairouan →');
      const aboutEventLabel = currentLang === 'ar' ? 'حول الفعالية المعمارية' : (currentLang === 'en' ? 'About the Event' : "A propos de l'événement");
      const viewEventLabel = currentLang === 'ar' ? '🔗 زيارة الصفحة الرسمية للفعالية' : (currentLang === 'en' ? '🔗 View Official Event Page' : "🔗 Voir la page de l'événement");
      const videoTitle = currentLang === 'ar' ? 'فيديو عرض المشروع التوضيحي أمام لجنة التحكيم' : (currentLang === 'en' ? 'Project presentation video to the jury' : 'Vidéo de présentation du projet au jury');
      const galleryTitleText = currentLang === 'ar' ? 'معرض الصور المعمارية وحفل التتويج' : (currentLang === 'en' ? 'Architectural Photo Gallery & Award Ceremony' : 'Galerie Photographique — Projet & Cérémonie');
      const gallerySubtitleText = currentLang === 'ar'
        ? 'توثيق شامل لمراسم التتويج بجائزة أيام قرطاج المعمارية 2019 ومختلف فضاءات وواجهات معهد ISSAT القيروان المنفذ على أرض الواقع.'
        : (currentLang === 'en'
          ? 'Comprehensive photography of the official JAC 2019 ceremony and real-world architectural achievements of ISSAT Kairouan (facades, bioclimatic canopy, auditorium, circulation spaces).'
          : 'Reportage photographique complet de la remise des prix JAC 2019 et des réalisations architecturales de l\'institut ISSAT Kairouan (façades, ombrière bioclimatique, amphithéâtre, circulations et détails).');

      const filterAllText = currentLang === 'ar' ? `الكل (${JAC_GALLERY.length})` : (currentLang === 'en' ? `All (${JAC_GALLERY.length})` : `Tous (${JAC_GALLERY.length})`);
      const filterCeremonyText = currentLang === 'ar' ? '🏆 حفل التتويج والملصق' : (currentLang === 'en' ? '🏆 Ceremony & Trophy' : '🏆 Cérémonie & Trophée');
      const filterFacadesText = currentLang === 'ar' ? '🏛️ الواجهات والبرج' : (currentLang === 'en' ? '🏛️ Facades & Tower' : '🏛️ Façades & Extérieurs');
      const filterInteriorsText = currentLang === 'ar' ? '📐 الفضاءات والمظلة' : (currentLang === 'en' ? '📐 Interiors & Canopy' : '📐 Intérieurs & Ombrière');

      block.className = 'dist-block jac-custom-block';
      block.innerHTML = `
        <div class="jac-header-container">
          <div class="jac-header-title-box">
            <h2 class="jac-main-title">${jacTitle}</h2>
            <p class="jac-subtitle">${jacSubtitleText}</p>
          </div>
        </div>
        
        <div class="jac-grid">
          <!-- Left Column (Group photo + text) -->
          <div class="jac-col jac-col-left">
            <div class="jac-card group-card">
              <div class="jac-image-container dist-image-wrapper" data-src="${groupPhoto}">
                <img src="${groupPhoto}" alt="${bestProjectLabel}" class="jac-photo" loading="lazy">
              </div>
              <div class="jac-card-content">
                <h3 class="jac-card-title">${bestProjectLabel}</h3>
                <p class="jac-card-text groupment">${groupmentLabel}</p>
                <p class="jac-card-text laureat">${laureatLabel}</p>
                <div style="margin-top: 1.25rem;">
                  <a href="${BASE}project.html?id=issat" class="jac-event-link" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(212, 175, 55, 0.14); border: 1px solid var(--accent); padding: 0.65rem 1.2rem; border-radius: 8px; color: var(--accent); font-weight: 700; text-decoration: none;">${viewIssatProjectLabel}</a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right Column (Event photo + link) -->
          <div class="jac-col jac-col-right">
            <div class="jac-card poster-card">
              <div class="jac-image-container poster-image-wrap">
                ${d.eventPhoto
                  ? `<div class="dist-image-wrapper" data-src="${d.eventPhoto}"><img src="${d.eventPhoto}" alt="Photo de l'événement" class="jac-photo poster-photo" loading="lazy"></div>`
                  : `<a href="${d.image}" target="_blank" rel="noopener" class="jac-poster-link-wrapper">
                      <img src="${d.image}" alt="Poster" class="jac-photo poster-photo" loading="lazy">
                    </a>`
                }
              </div>
              <div class="jac-card-content">
                <h3 class="jac-card-title">${aboutEventLabel}</h3>
                ${d.eventLink ? `<a href="${d.eventLink}" target="_blank" rel="noopener" class="jac-event-link">${viewEventLabel}</a>` : ''}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bottom Video Section -->
        ${frameHtml ? `
        <div class="jac-video-section">
          <h3 class="jac-video-title">
            <span class="video-play-icon"></span> ${videoTitle}
          </h3>
          <div class="jac-video-wrapper">
            ${frameHtml}
          </div>
        </div>
        ` : ''}
        
        <!-- Full Enhanced Architectural Photo Gallery -->
        <div class="jac-gallery-section" id="jac-gallery-section">
          <div class="jac-gallery-header">
            <div class="jac-gallery-title-box">
              <h3 class="jac-gallery-main-title">${galleryTitleText}</h3>
              <p class="jac-gallery-desc">${gallerySubtitleText}</p>
            </div>
            <div class="jac-gallery-filter-tabs">
              <button class="jac-filter-btn active" data-filter="all">${filterAllText}</button>
              <button class="jac-filter-btn" data-filter="ceremony">${filterCeremonyText}</button>
              <button class="jac-filter-btn" data-filter="facades">${filterFacadesText}</button>
              <button class="jac-filter-btn" data-filter="interiors">${filterInteriorsText}</button>
            </div>
          </div>
          
          <div class="jac-gallery-grid" id="jac-gallery-grid">
            ${JAC_GALLERY.map((item, gIdx) => {
              const caption = item[currentLang] || item.fr;
              const badgeTxt = (item.badge && item.badge[currentLang]) || item.badge?.fr || '';
              return `
                <div class="jac-gallery-card" data-category="${item.category}" data-gallery-index="${gIdx}">
                  <div class="jac-gallery-media">
                    <img src="${item.src}" alt="${caption}" loading="lazy">
                    <div class="jac-gallery-overlay">
                      <span class="jac-gallery-badge">${badgeTxt}</span>
                      <span class="jac-gallery-zoom-icon">🔍</span>
                    </div>
                  </div>
                  <div class="jac-gallery-caption">
                    <p class="jac-gallery-caption-title">${caption}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

    } else if (d.type === 'press') {
      // 2. Wix Custom Layout for Press Section
      const titleMatch = d.title.match(/^([^(]+)(?:\s*\(([^)]+)\))?/);
      const mainTitle = titleMatch ? titleMatch[1].trim() : d.title;
      const subtitle = titleMatch && titleMatch[2] ? `(${titleMatch[2]})` : '';
      
      block.className = 'dist-block press-custom-block';
      block.innerHTML = `
        <div class="press-item-header">
          <div class="press-title-row">
            <h3 class="press-main-title">${mainTitle}</h3>
            ${subtitle ? `<span class="press-year-tag">${subtitle}</span>` : ''}
          </div>
          <p class="press-subtitle">${d.description}</p>
        </div>
        <div class="press-pdf-container">
          <iframe src="${d.pdfLink}" width="100%" height="750px" class="press-iframe" style="border: 1px solid var(--border-muted); border-radius: var(--r-md); background: #ffffff;"></iframe>
        </div>
      `;

    } else {
      // 3. Standard Layout for other cards
      const icon = ICONS[d.type] || '⭐';
      const label = LABELS[d.type] || 'Distinction';

      const lines = (d.description || '').split('\n').map(l => l.trim()).filter(Boolean);
      const specs = [];
      const paragraphs = [];

      lines.forEach(line => {
        if (line.includes(':')) {
          const parts = line.split(':');
          const key = parts[0].trim();
          const val = parts.slice(1).join(':').trim();
          specs.push({ key, val });
        } else {
          paragraphs.push(line);
        }
      });

      let specsHtml = '';
      if (specs.length > 0) {
        specsHtml = `
          <div class="dist-spec-list">
            ${specs.map(s => {
              let valHtml = s.val.replace(
                /(https?:\/\/[^\s<]+)/g,
                '<a href="$1" target="_blank" rel="noopener">$1</a>'
              );
              return `
                <div class="dist-spec-row">
                  <span class="dist-spec-label">${s.key}</span>
                  <strong class="dist-spec-value">${valHtml}</strong>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      let paraHtml = '';
      if (paragraphs.length > 0) {
        paraHtml = paragraphs.map(p => {
          let textHtml = p.replace(
            /(https?:\/\/[^\s<]+)/g,
            '<a href="$1" target="_blank" rel="noopener">$1</a>'
          );
          return `<p class="dist-block-paragraph">${textHtml}</p>`;
        }).join('');
      }

      let videoCardHtml = '';
      if (d.video) {
        const vVal = d.video.trim();
        let frameHtml = '';

        if (vVal.startsWith('<iframe') || vVal.startsWith('<div')) {
          const srcMatch = vVal.match(/src="([^"]+)"/);
          if (srcMatch) {
            frameHtml = `<iframe src="${srcMatch[1]}" allowfullscreen></iframe>`;
          } else {
            frameHtml = vVal;
          }
        } else if (vVal.includes('youtube.com') || vVal.includes('youtu.be')) {
          const match = vVal.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
          if (match && match[1]) {
            frameHtml = `<iframe src="https://www.youtube.com/embed/${match[1]}" allowfullscreen></iframe>`;
          }
        } else {
          frameHtml = `<video src="${vVal}" controls></video>`;
        }

        const presentationVideoLabel = currentLang === 'ar' ? 'فيديو عرض تقديمي للمشروع' : (currentLang === 'en' ? 'Project presentation video' : 'Vidéo de présentation du projet');
        videoCardHtml = `
          <div class="dist-media-card">
            <div class="dist-video-wrapper">
              ${frameHtml}
            </div>
            <div class="dist-media-caption">${presentationVideoLabel}</div>
          </div>
        `;
      }

      let imageCardHtml = '';
      if (d.image) {
        const zoomImageLabel = currentLang === 'ar' ? 'رؤية معمارية للمشروع - اضغط للتكبير' : (currentLang === 'en' ? 'Project rendering - Click to enlarge' : 'Visuel du projet - Cliquer pour agrandir');
        imageCardHtml = `
          <div class="dist-media-card dist-image-wrapper" data-src="${d.image}">
            <img src="${d.image}" alt="${d.title}" loading="lazy">
            <div class="dist-media-caption">${zoomImageLabel}</div>
          </div>
        `;
      }

      let pdfCardHtml = '';
      if (d.pdfLink) {
        pdfCardHtml = `
          <div class="dist-pdf-viewer">
            <iframe src="${d.pdfLink}" width="100%" height="800px" style="border:1px solid var(--border-muted); border-radius:var(--r-md); background: #fff;"></iframe>
          </div>
        `;
      }

      let galleryHtml = '';
      const galleryTitleText = currentLang === 'ar' ? 'معرض الصور المعمارية وحفل التتويج' : (currentLang === 'en' ? 'Architectural Photo Gallery & Award Ceremony' : 'Galerie Photographique — Projet & Cérémonie');
      const gallerySubtitleText = currentLang === 'ar'
        ? 'توثيق شامل لمراسم التتويج بجائزة أيام قرطاج المعمارية 2019 ومختلف فضاءات وواجهات معهد ISSAT القيروان المنفذ على أرض الواقع.'
        : (currentLang === 'en'
          ? 'Comprehensive photography of the official JAC 2019 ceremony and real-world architectural achievements of ISSAT Kairouan (facades, bioclimatic canopy, auditorium, circulation spaces).'
          : 'Reportage photographique complet de la remise des prix JAC 2019 et des réalisations architecturales de l\'institut ISSAT Kairouan (façades, ombrière bioclimatique, amphithéâtre, circulations et détails).');

      const filterAllText = currentLang === 'ar' ? `الكل (${JAC_GALLERY.length})` : (currentLang === 'en' ? `All (${JAC_GALLERY.length})` : `Tous (${JAC_GALLERY.length})`);
      const filterCeremonyText = currentLang === 'ar' ? '🏆 حفل التتويج والملصق' : (currentLang === 'en' ? '🏆 Ceremony & Trophy' : '🏆 Cérémonie & Trophée');
      const filterFacadesText = currentLang === 'ar' ? '🏛️ الواجهات والبرج' : (currentLang === 'en' ? '🏛️ Facades & Tower' : '🏛️ Façades & Extérieurs');
      const filterInteriorsText = currentLang === 'ar' ? '📐 الفضاءات والمظلة' : (currentLang === 'en' ? '📐 Interiors & Canopy' : '📐 Intérieurs & Ombrière');
      if (d.gallery && d.gallery.length > 0) {
        galleryHtml = `
          <div class="dist-gallery-section">
            <h3 class="dist-gallery-title">${galleryTitleText}</h3>
            <div class="dist-gallery-grid">
              ${d.gallery.map(src => `
                <div class="dist-gallery-thumb" data-src="${src}">
                  <img src="${src}" alt="Photo" loading="lazy">
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      block.className = 'dist-block standard-custom-block';
      block.innerHTML = `
        <div class="dist-block-header">
          <div class="dist-block-icon">${icon}</div>
          <div class="dist-block-meta">
            <span class="dist-block-type">${label}</span>
            <span class="dist-block-year">${d.year}</span>
          </div>
        </div>
        <h2 class="dist-block-title">${d.title}</h2>
        
        ${(d.description2 && d.image2) ? `
          <!-- Layout Alterné Spécifique -->
          <div class="dist-alt-row">
            <div class="dist-info-pane alt-left">
              <p class="dist-block-paragraph">${d.description.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="dist-media-pane alt-right">
              <div class="dist-media-card dist-image-wrapper" data-src="${d.image}">
                <img src="${d.image}" alt="Photo 1" loading="lazy">
              </div>
            </div>
          </div>
          <div class="dist-alt-row" style="margin-top: 3.5rem;">
            <div class="dist-media-pane alt-left">
              <div class="dist-media-card dist-image-wrapper" data-src="${d.image2}">
                ${d.image2Link ? `<a href="${d.image2Link}" target="_blank" rel="noopener" style="display:block;">` : ''}
                <img src="${d.image2}" alt="Photo 2" loading="lazy">
                ${d.image2Link ? `</a>` : ''}
              </div>
            </div>
            <div class="dist-info-pane alt-right">
              <p class="dist-block-paragraph">${d.description2.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          ${d.video ? `
          <div class="dist-video-fullwidth" style="margin-top: 3.5rem;">
            ${videoCardHtml}
          </div>
          ` : ''}
        ` : `
          <!-- Layout Standard -->
          <div class="dist-block-grid">
            <div class="dist-info-pane">
              ${specsHtml}
              ${paraHtml}
              ${(d.title.includes('ISSAT') || (d.description && d.description.includes('ISSAT'))) ? `
                <div style="margin-top: 1.25rem;">
                  <a href="${BASE}project.html?id=issat" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(212, 175, 55, 0.14); border: 1px solid var(--accent); padding: 0.65rem 1.2rem; border-radius: 8px; color: var(--accent); font-weight: 700; text-decoration: none;">
                    ${currentLang === 'ar' ? '🏛️ عرض صفحة مشروع المعهد العالي بالقيروان (ISSAT Kairouan) ←' : (currentLang === 'en' ? '🏛️ View Full ISSAT Kairouan Project Page →' : '🏛️ Voir la fiche complète du projet ISSAT Kairouan →')}
                  </a>
                </div>
              ` : ''}
            </div>
            <div class="dist-media-pane">
              ${videoCardHtml}
              ${imageCardHtml}
              ${pdfCardHtml}
            </div>
          </div>
        `}
        
        ${galleryHtml}
      `;
    }

    if (d.type === 'award' || d.type === 'competition') {
      if (awardsGrid) awardsGrid.appendChild(block);
    } else if (d.type === 'press') {
      if (pressGrid) pressGrid.appendChild(block);
    } else if (d.type === 'media') {
      if (mediaGrid) mediaGrid.appendChild(block);
    } else {
      if (awardsGrid) awardsGrid.appendChild(block);
    }
  });

  // Hide empty sections
  if (awardsGrid && awardsGrid.children.length === 0) {
    const s = document.getElementById('awards-section');
    if (s) s.style.display = 'none';
  }
  if (pressGrid && pressGrid.children.length === 0) {
    const s = document.getElementById('press-section');
    if (s) s.style.display = 'none';
  }
  if (mediaGrid && mediaGrid.children.length === 0) {
    const s = document.getElementById('media-section');
    if (s) s.style.display = 'none';
  }

  // JAC Gallery Interactive Filter Tabs
  const filterBtns = container.querySelectorAll('.jac-filter-btn');
  const galleryCards = container.querySelectorAll('.jac-gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.classList.remove('card-hidden');
        } else {
          card.style.display = 'none';
          card.classList.add('card-hidden');
        }
      });
    });
  });

  // JAC Gallery Click Handlers -> Lightbox
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const gIdx = parseInt(card.dataset.galleryIndex, 10);
      openLightbox(JAC_GALLERY, isNaN(gIdx) ? 0 : gIdx);
    });
  });

  // Standard Image wrappers and generic gallery thumbnails
  container.querySelectorAll('.dist-image-wrapper').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.dataset.src;
      if (src) {
        const foundIdx = JAC_GALLERY.findIndex(item => item.src === src);
        if (foundIdx !== -1) {
          openLightbox(JAC_GALLERY, foundIdx);
        } else {
          openLightbox([{ src, fr: '' }], 0);
        }
      }
    });
  });

  container.querySelectorAll('.dist-gallery-thumb').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.dataset.src;
      if (src) openLightbox([{ src, fr: '' }], 0);
    });
  });

  // Mobile Menu
  const mBtn = document.querySelector('.mobile-menu-btn');
  const nLinks = document.querySelector('.nav-links');
  if (mBtn && nLinks) {
    mBtn.addEventListener('click', () => nLinks.classList.toggle('active'));
    nLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => nLinks.classList.remove('active'));
    });
  }

  // Smooth scroll auto-scroll to param
  if (!isNaN(scrollToIdx) && scrollToIdx >= 0 && scrollToIdx < distinctions.length) {
    setTimeout(() => {
      const target = document.getElementById(`distinction-${scrollToIdx}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 350);
  }
}

// State-of-the-Art Architectural Lightbox with Prev/Next, Counter & Keyboard Control
function openLightbox(galleryList, startIndex = 0) {
  if (!galleryList || galleryList.length === 0) return;
  activeLightboxGallery = galleryList;
  activeLightboxIndex = startIndex;

  let lb = document.getElementById('dist-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'dist-lightbox';
    lb.className = 'lightbox';
    document.body.appendChild(lb);
  }

  const renderCurrent = () => {
    const item = activeLightboxGallery[activeLightboxIndex];
    const src = typeof item === 'string' ? item : item.src;
    const title = typeof item === 'string' ? '' : (item[currentLang] || item.fr || '');
    const counterText = `${activeLightboxIndex + 1} / ${activeLightboxGallery.length}`;

    lb.innerHTML = `
      <div class="lightbox-dialog" role="dialog" aria-modal="true">
        <div class="lightbox-header">
          <span class="lightbox-counter">${counterText}</span>
          <button class="lightbox-close" aria-label="Fermer">&times;</button>
        </div>
        
        <div class="lightbox-body">
          ${activeLightboxGallery.length > 1 ? `
            <button class="lightbox-nav-btn lightbox-prev" aria-label="Précédent">&#10094;</button>
          ` : ''}
          
          <div class="lightbox-img-wrapper">
            <img src="${src}" alt="${title}" class="lightbox-image">
          </div>
          
          ${activeLightboxGallery.length > 1 ? `
            <button class="lightbox-nav-btn lightbox-next" aria-label="Suivant">&#10095;</button>
          ` : ''}
        </div>
        
        ${title ? `
          <div class="lightbox-caption">
            <p>${title}</p>
          </div>
        ` : ''}
      </div>
    `;

    // Bind event handlers
    const closeBtn = lb.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.onclick = closeLb;

    const prevBtn = lb.querySelector('.lightbox-prev');
    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.stopPropagation();
        activeLightboxIndex = (activeLightboxIndex - 1 + activeLightboxGallery.length) % activeLightboxGallery.length;
        renderCurrent();
      };
    }

    const nextBtn = lb.querySelector('.lightbox-next');
    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.stopPropagation();
        activeLightboxIndex = (activeLightboxIndex + 1) % activeLightboxGallery.length;
        renderCurrent();
      };
    }
  };

  const closeLb = () => {
    lb.classList.remove('active');
    window.removeEventListener('keydown', handleKey);
    setTimeout(() => { lb.style.display = 'none'; }, 300);
  };

  const handleKey = (e) => {
    if (e.key === 'Escape') {
      closeLb();
    } else if (e.key === 'ArrowLeft') {
      if (activeLightboxGallery.length > 1) {
        activeLightboxIndex = (activeLightboxIndex - 1 + activeLightboxGallery.length) % activeLightboxGallery.length;
        renderCurrent();
      }
    } else if (e.key === 'ArrowRight') {
      if (activeLightboxGallery.length > 1) {
        activeLightboxIndex = (activeLightboxIndex + 1) % activeLightboxGallery.length;
        renderCurrent();
      }
    }
  };

  lb.onclick = (e) => {
    if (e.target === lb || e.target.classList.contains('lightbox-body') || e.target.classList.contains('lightbox-img-wrapper')) {
      closeLb();
    }
  };

  window.addEventListener('keydown', handleKey);

  renderCurrent();
  lb.style.display = 'flex';
  requestAnimationFrame(() => lb.classList.add('active'));
}

init();
