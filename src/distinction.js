// Distinction Page Logic — High-Craft Architectural Grid Layout
import { initBlueprintCanvas } from './blueprint.js';
const BASE = import.meta.env.BASE_URL;

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
const LABELS = { award: 'Prix', competition: 'Concours', media: 'Médias', press: 'Presse' };

async function init() {
  initBlueprintCanvas();
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const res = await fetch(`${BASE}content.json`);
  if (!res.ok) return;
  const content = await res.json();

  // Populate dynamic logo
  const logoEl = document.getElementById('site-logo');
  if (logoEl && content.logoText) {
    logoEl.innerHTML = content.logoText;
  }

  const distinctions = content.distinctions || [];

  if (!distinctions.length) return;

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

    if (d.title.includes('JAC') || d.title.includes('Carthage')) {
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

      block.className = 'dist-block jac-custom-block';
      block.innerHTML = `
        <div class="jac-header-container">
          <div class="jac-header-title-box">
            <h2 class="jac-main-title">Prix des <span class="highlight">JAC 2019</span></h2>
            <p class="jac-subtitle">Journées Architecturales de Carthage</p>
          </div>
        </div>
        
        <div class="jac-grid">
          <!-- Left Column (Group photo + text) -->
          <div class="jac-col jac-col-left">
            <div class="jac-card group-card">
              <div class="jac-image-container dist-image-wrapper" data-src="${groupPhoto}">
                <img src="${groupPhoto}" alt="Prix du meilleur projet de Bâtiment civil" class="jac-photo" loading="lazy">
              </div>
              <div class="jac-card-content">
                <h3 class="jac-card-title">Prix du meilleur projet de Bâtiment civil</h3>
                <p class="jac-card-text groupment">Groupement d'Architectes: M. JALEL SAKLI & M. MOHAMED ALI BEN AFIA & M. ANIS BOUDEN</p>
                <p class="jac-card-text laureat">Projet lauréat: Institut Supérieur des Sciences Appliquées et de la Technologie</p>
              </div>
            </div>
          </div>
          
          <!-- Right Column (Event photo + link) -->
          <div class="jac-col jac-col-right">
            <div class="jac-card poster-card">
              <div class="jac-image-container poster-image-wrap">
                ${d.eventPhoto
                  ? `<div class="dist-image-wrapper" data-src="${d.eventPhoto}"><img src="${d.eventPhoto}" alt="Photo de l'événement JAC" class="jac-photo poster-photo" loading="lazy"></div>`
                  : `<a href="${d.image}" target="_blank" rel="noopener" class="jac-poster-link-wrapper">
                      <img src="${d.image}" alt="Poster des Journées Architecturales de Carthage" class="jac-photo poster-photo" loading="lazy">
                    </a>`
                }
              </div>
              <div class="jac-card-content">
                <h3 class="jac-card-title">A propos de l'événement</h3>
                ${d.eventLink ? `<a href="${d.eventLink}" target="_blank" rel="noopener" class="jac-event-link">🔗 Voir la page de l'événement</a>` : ''}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bottom Video Section -->
        ${frameHtml ? `
        <div class="jac-video-section">
          <h3 class="jac-video-title">
            <span class="video-play-icon"></span> Vidéo de présentation du projet au jury
          </h3>
          <div class="jac-video-wrapper">
            ${frameHtml}
          </div>
        </div>
        ` : ''}
        
        <!-- Small photo gallery if there are extra photos -->
        ${otherPhoto ? `
        <div class="dist-gallery-section" style="margin-top: 3.5rem;">
          <h4 class="dist-gallery-title">Galerie photos</h4>
          <div class="dist-gallery-grid">
            <div class="dist-gallery-thumb" data-src="${otherPhoto}">
              <img src="${otherPhoto}" alt="Visuel ISSAT Kairouan" loading="lazy">
            </div>
            <div class="dist-gallery-thumb" data-src="${groupPhoto}">
              <img src="${groupPhoto}" alt="Cérémonie de remise de prix" loading="lazy">
            </div>
            <div class="dist-gallery-thumb" data-src="${d.image}">
              <img src="${d.image}" alt="Visuel Affiche JAC" loading="lazy">
            </div>
          </div>
        </div>
        ` : ''}
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

        videoCardHtml = `
          <div class="dist-media-card">
            <div class="dist-video-wrapper">
              ${frameHtml}
            </div>
            <div class="dist-media-caption">Vidéo de présentation du projet</div>
          </div>
        `;
      }

      let imageCardHtml = '';
      if (d.image) {
        imageCardHtml = `
          <div class="dist-media-card dist-image-wrapper" data-src="${d.image}">
            <img src="${d.image}" alt="${d.title}" loading="lazy">
            <div class="dist-media-caption">Visuel du projet - Cliquer pour agrandir</div>
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
      if (d.gallery && d.gallery.length > 0) {
        galleryHtml = `
          <div class="dist-gallery-section">
            <h3 class="dist-gallery-title">Galerie photos</h3>
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

  // Lightbox click handlers
  container.querySelectorAll('.dist-image-wrapper, .dist-gallery-thumb').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.dataset.src;
      if (src) openLightbox(src);
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

function openLightbox(src) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<button class="lightbox-close">&times;</button><img src="${src}">`;
  document.body.appendChild(lb);
  requestAnimationFrame(() => lb.classList.add('active'));

  const closeLb = () => {
    lb.classList.remove('active');
    setTimeout(() => lb.remove(), 300);
  };

  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('lightbox-close')) closeLb();
  });

  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { closeLb(); document.removeEventListener('keydown', handler); }
  });
}

init();
