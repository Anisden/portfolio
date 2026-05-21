import heroImg from './assets/hero.png';
import { initBlueprintCanvas } from './blueprint.js';

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

  grid.innerHTML = distinctions.map((d, idx) => {
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
      mediaHtml = `<div class="dist-img-wrap"><img src="${d.image}" alt="${d.title}" loading="lazy"></div>`;
    }

    return `
      <div class="distinction-card fade-up ${d.type === 'media' ? 'distinction-type-media' : ''}" data-dist-index="${idx}" style="display: flex; flex-direction: column; cursor: pointer;">
        <p class="distinction-year">${typeLabel[d.type] || ''} · ${d.year}</p>
        <div class="distinction-icon">${icons[d.type] || '⭐'}</div>
        ${mediaHtml}
        <h3 class="distinction-title">${d.title}</h3>
        <p class="distinction-desc" style="flex-grow: 1;">${d.description}</p>
        <span class="distinction-link">Voir la distinction →</span>
      </div>
    `;
  }).join('');

  // Make cards clickable
  grid.querySelectorAll('.distinction-card').forEach(card => {
    apply3DTilt(card);
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'IFRAME') return;
      const idx = card.dataset.distIndex;
      window.location.href = `${BASE}distinction.html?i=${idx}`;
    });
  });

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

// 3D Tilt Micro-interactions
function apply3DTilt(card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;
    const tiltX = -(dy / yc) * 8; // Max 8 degrees for premium subtlety
    const tiltY = (dx / xc) * 8;
    
    card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease, border-color 0.1s ease';
    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

// initBlueprintCanvas imported from blueprint.js

// Load Projects
let allProjects = [];

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
    allProjects = await res.json();
    
    // Resolve all project asset URLs dynamically relative to BASE
    allProjects.forEach(p => {
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

    // Render initially
    renderFilteredProjects('all');
    setupFilters();

    // Init Infinite Marquee with projects
    initProjectMarquee(allProjects);
    
    initAnimations();
  } catch (e) { console.error('Projects load error', e); }
}

function renderFilteredProjects(filter) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.style.opacity = '0';

  setTimeout(() => {
    grid.innerHTML = '';
    
    let filtered = [];
    if (filter === 'all') {
      filtered = allProjects;
    } else if (filter === 'quebec') {
      filtered = allProjects.filter(p => p.region === 'quebec');
    } else if (filter === 'tunisie') {
      filtered = allProjects.filter(p => p.region !== 'quebec' && p.region !== 'concours');
    } else if (filter === 'concours') {
      filtered = allProjects.filter(p => p.region === 'concours');
    } else if (filter === 'sous-traitance') {
      filtered = allProjects.filter(p => p.subcontract === true);
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="project-card fade-up" style="grid-column: 1 / -1; cursor: default;">
          <div class="placeholder-img" style="min-height: 200px;">
            <div class="overlay-soon">Mise à jour imminente</div>
          </div>
        </div>`;
    } else {
      filtered.forEach(p => {
        const card = createProjectCard(p);
        grid.appendChild(card);
        apply3DTilt(card);
      });
    }

    grid.style.opacity = '1';
    grid.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }, 200);
}

function setupFilters() {
  const filterTabs = document.getElementById('project-filters');
  if (!filterTabs) return;

  const tabs = filterTabs.querySelectorAll('.filter-tab');
  const slider = document.getElementById('filter-slider');

  function updateSlider(tab) {
    if (!slider) return;
    slider.style.left = `${tab.offsetLeft}px`;
    slider.style.width = `${tab.offsetWidth}px`;
  }

  // Set initial slider position on the active tab
  const activeTab = filterTabs.querySelector('.filter-tab.active');
  if (activeTab) {
    // Wait a tiny bit for rendering/styles to apply
    setTimeout(() => updateSlider(activeTab), 150);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateSlider(tab);
      
      const filter = tab.dataset.filter;
      renderFilteredProjects(filter);
    });
  });

  // Handle window resizing to keep slider aligned
  window.addEventListener('resize', () => {
    const currentActive = filterTabs.querySelector('.filter-tab.active');
    if (currentActive) updateSlider(currentActive);
  });
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

function initProjectMarquee(projects) {
  const track = document.getElementById('marquee-track');
  if (!track || !projects?.length) return;

  // Filter projects with valid cover images
  const validProjects = projects.filter(p => p.image);
  if (!validProjects.length) return;

  // Clone projects list to ensure a seamless infinite scroll loop
  const marqueeItems = [...validProjects, ...validProjects];

  track.innerHTML = marqueeItems.map(p => {
    return `
      <a href="${BASE}project.html?id=${p.id}" class="marquee-item" aria-label="Projet ${p.title}">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <div class="marquee-item-overlay">
          <span class="marquee-item-title">${p.title}</span>
        </div>
      </a>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  initBlueprintCanvas();
  loadContent();
  loadProjects();
  initAnimations();
});
