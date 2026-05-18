import heroImg from './assets/hero.png';

// Base path for GitHub Pages compatibility
const BASE = import.meta.env.BASE_URL;

function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // If it starts with a leading slash, remove it and prepend BASE
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${BASE}${cleanUrl}`;
}


// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Navbar scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile Menu
const mobileBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
if (mobileBtn && navLinks) {
  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('active'));
  });
}

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

function initAnimations() {
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// Animated counters
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

// Parallax hero
const heroBg = document.querySelector('.hero-background img');
window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.25}px)`;
  }
});

// Load Distinctions
function renderDistinctions(distinctions) {
  const grid = document.getElementById('distinctions-grid');
  if (!grid || !distinctions?.length) return;

  const icons = { award: '🏆', competition: '🥇', media: '📺' };
  const typeLabel = { award: 'Prix', competition: 'Concours', media: 'Médias' };

  grid.innerHTML = distinctions.map(d => {
    let mediaHtml = '';
    if (d.video) {
      if (d.video.startsWith('<iframe') || d.video.startsWith('<div')) {
        mediaHtml = `<div class="dist-video-wrap">${d.video}</div>`;
      } else {
        const ytMatch = d.video.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
        if (ytMatch) {
          mediaHtml = `<div class="dist-video-wrap"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" allowfullscreen></iframe></div>`;
        } else {
          mediaHtml = `<div class="dist-video-wrap"><video src="${d.video}" controls></video></div>`;
        }
      }
    } else if (d.image) {
      mediaHtml = `<div class="dist-img-wrap" style="cursor: pointer;" onclick="openLightbox('${d.image}')"><img src="${d.image}" alt="${d.title}" loading="lazy"></div>`;
    }

    let galleryHtml = '';
    if (d.gallery && d.gallery.length > 0) {
      galleryHtml = `
        <div class="dist-gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 0.5rem; margin-top: 1.2rem; margin-bottom: 0.5rem;">
          ${d.gallery.map(imgSrc => `
            <div class="dist-gallery-thumb" style="aspect-ratio: 1; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); cursor: pointer;" onclick="openLightbox('${imgSrc}')">
              <img src="${imgSrc}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            </div>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="distinction-card fade-up ${d.type === 'media' ? 'distinction-type-media' : ''}" style="display: flex; flex-direction: column;">
        <p class="distinction-year">${typeLabel[d.type] || ''} · ${d.year}</p>
        <div class="distinction-icon">${icons[d.type] || '⭐'}</div>
        ${mediaHtml}
        <h3 class="distinction-title">${d.title}</h3>
        <p class="distinction-desc" style="flex-grow: 1;">${d.description}</p>
        ${galleryHtml}
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

window.openLightbox = (src) => {
  const lb = document.createElement('div');
  lb.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; z-index: 9999; opacity: 0; transition: opacity 0.3s ease;";
  
  const img = document.createElement('img');
  img.src = src;
  img.style.cssText = "max-width: 90%; max-height: 90vh; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);";
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = "position: absolute; top: 2rem; right: 2rem; color: #fff; font-size: 3rem; cursor: pointer; background: none; border: none; font-family: sans-serif; line-height: 1;";
  
  lb.appendChild(img);
  lb.appendChild(closeBtn);
  document.body.appendChild(lb);
  
  requestAnimationFrame(() => lb.style.opacity = '1');

  const closeLb = () => {
    lb.style.opacity = '0';
    setTimeout(() => lb.remove(), 300);
  };
  
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target === closeBtn) closeLb();
  });
  
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { closeLb(); document.removeEventListener('keydown', handler); }
  });
};

// Load Projects
function createProjectCard(project) {
  const div = document.createElement('div');
  div.className = 'project-card fade-up';

  const media = project.image
    ? `<img src="${project.image}" alt="${project.title}" loading="lazy">`
    : `<div class="placeholder-img">📐 Visuel à venir</div>`;

  div.innerHTML = `
    <div class="project-image">${media}</div>
    <div class="project-info">
      <h4>${project.title}</h4>
      <p class="project-meta">${project.meta}</p>
      <p>${project.description}</p>
      <span class="project-link">Voir le projet →</span>
    </div>`;

  div.addEventListener('click', (e) => {
    if (e.target.tagName === 'IFRAME') return;
    window.location.href = `${BASE}project.html?id=${project.id}`;
  });
  return div;
}

async function loadProjects() {
  try {
    const res = await fetch(`${BASE}projects.json`);
    if (!res.ok) return;
    const projects = await res.json();
    
    // Resolve all project asset URLs dynamically relative to BASE
    projects.forEach(p => {
      if (p.image) p.image = resolveUrl(p.image);
      if (p.video && !p.video.includes('<iframe') && !p.video.includes('youtube.com') && !p.video.includes('youtu.be')) {
        p.video = resolveUrl(p.video);
      }
      if (p.gallery) p.gallery = p.gallery.map(resolveUrl);
      if (p.galleryDocs) p.galleryDocs = p.galleryDocs.map(resolveUrl);
      if (p.galleryRealisation) p.galleryRealisation = p.galleryRealisation.map(resolveUrl);
      if (p.galleryBefore) p.galleryBefore = p.galleryBefore.map(resolveUrl);
      if (p.galleryAfter) p.galleryAfter = p.galleryAfter.map(resolveUrl);
    });

    const tnGrid = document.getElementById('tunisia-projects');
    const qcGrid = document.getElementById('quebec-projects');
    const concGrid = document.getElementById('concours-projects');
    if (!tnGrid || !qcGrid || !concGrid) return;

    tnGrid.innerHTML = '';
    qcGrid.innerHTML = '';
    concGrid.innerHTML = '';
    let qcCount = 0;

    projects.forEach(p => {
      const card = createProjectCard(p);
      if (p.region === 'quebec') { 
        qcGrid.appendChild(card); 
        qcCount++; 
      } else if (p.region === 'concours') { 
        concGrid.appendChild(card); 
      } else { 
        tnGrid.appendChild(card); 
      }
    });

    if (qcCount === 0) {
      qcGrid.innerHTML = `
        <div class="project-card fade-up">
          <div class="project-image"><div class="placeholder-img"><div class="overlay-soon">Mise à jour imminente</div></div></div>
          <div class="project-info"><h4>Projets Nord-Américains</h4><p class="project-meta">2021–2025</p>
          <p>La documentation visuelle de mes réalisations au Québec sera disponible prochainement.</p></div>
        </div>`;
    }
    
    // Init Hero Slider with project images
    const projectImages = projects.map(p => p.image).filter(Boolean);
    if (projectImages.length > 0) {
      initHeroSlider(projectImages);
    } else {
      initHeroSlider([heroImg]); // fallback
    }
    
    initAnimations();
  } catch (e) { console.error('Projects load error', e); }
}

// Load General Content
async function loadContent() {
  try {
    const res = await fetch(`${BASE}content.json`);
    if (!res.ok) return;
    const c = await res.json();

    // Resolve CV link and distinctions asset URLs dynamically relative to BASE
    if (c.cvLink) c.cvLink = resolveUrl(c.cvLink);
    if (c.distinctions) {
      c.distinctions.forEach(d => {
        if (d.image) d.image = resolveUrl(d.image);
        if (d.video && !d.video.includes('<iframe') && !d.video.includes('youtube.com') && !d.video.includes('youtu.be')) {
          d.video = resolveUrl(d.video);
        }
        if (d.gallery) d.gallery = d.gallery.map(resolveUrl);
      });
    }

    const set = (id, val, isHtml = false) => {
      const el = document.getElementById(id);
      if (el && val) { isHtml ? el.innerHTML = val : el.textContent = val; }
    };

    set('hero-subtitle', c.heroSubtitle);
    if (c.heroTitleHtml) {
      const titleEl = document.getElementById('hero-title');
      if (titleEl) titleEl.innerHTML = c.heroTitleHtml;
    }
    
    const logoEl = document.getElementById('site-logo');
    if (logoEl) {
      if (c.logoText) {
        logoEl.innerHTML = c.logoText;
        logoEl.style.display = 'block';
      } else {
        logoEl.style.display = 'none';
      }
    }
    set('hero-description', c.heroDescription);
    set('about-text', c.aboutText);
    set('contact-email', c.contactEmail);
    set('contact-phone', c.contactPhone);
    set('contact-address', c.contactAddress);

    if (c.contactEmail) {
      const el = document.getElementById('contact-email-link');
      if (el) el.href = `mailto:${c.contactEmail}`;
    }
    if (c.contactLinkedin) {
      set('contact-linkedin', c.contactLinkedin);
      const el = document.getElementById('contact-linkedin-link');
      if (el) el.href = c.contactLinkedin.startsWith('http') ? c.contactLinkedin : `https://${c.contactLinkedin}`;
    }
    if (c.cvLink) {
      ['cv-link', 'cv-link-contact'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.href = c.cvLink;
      });
    }
    if (c.distinctions) renderDistinctions(c.distinctions);
  } catch (e) { console.error('Content load error', e); }
}

function initHeroSlider(images) {
  const slider = document.getElementById('hero-slider');
  if (!slider || !images.length) return;
  
  images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'hero-slide' + (i === 0 ? ' active' : '');
    slider.appendChild(img);
  });
  
  if (images.length > 1) {
    let current = 0;
    setInterval(() => {
      const slides = slider.querySelectorAll('.hero-slide');
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 7000); // 7s interval
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadContent();
  loadProjects();
  initAnimations();
});
