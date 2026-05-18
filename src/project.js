// Project Detail Page Logic
const BASE = import.meta.env.BASE_URL;

async function init() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  if (!projectId) {
    window.location.href = `${BASE}#projects`;
    return;
  }

  const res = await fetch(`${BASE}projects.json`);
  if (!res.ok) return;
  const projects = await res.json();

  const currentIndex = projects.findIndex(p => p.id === projectId);
  if (currentIndex === -1) {
    window.location.href = `${BASE}#projects`;
    return;
  }

  const project = projects[currentIndex];
  document.title = `${project.title} | Anis BOUDEN - Architecte`;

  // Hero Image
  const heroBg = document.getElementById('hero-bg');
  if (project.image) {
    heroBg.innerHTML = `<img src="${project.image}" alt="${project.title}"><div class="project-hero-overlay"></div>`;
  }

  // Titles & Info Banner
  document.getElementById('project-title').textContent = project.title;
  document.getElementById('info-region').textContent = project.region === 'quebec' ? '🇨🇦 Québec, Canada' : (project.region === 'concours' ? '🏆 Concours d\'Architecture, Tunisie' : '🇹🇳 Tunisie');
  document.getElementById('info-meta').textContent = project.meta;

  if (project.budget) {
    document.getElementById('budget-container').style.display = 'flex';
    const sym = project.currency === 'CAD' ? '$ CAD' : '€';
    document.getElementById('info-budget').textContent = `${project.budget} ${sym}`;
  }

  // Description
  const desc = project.longDescription || project.description;
  document.getElementById('project-long-desc').innerHTML = desc ? desc.replace(/\n/g, '<br>') : 'Description non disponible.';

  // Award Badge
  if (project.showDistinctionBtn) {
    const descCol = document.querySelector('.project-desc');
    if (descCol) {
      const badge = document.createElement('a');
      badge.href = '/#distinctions';
      badge.className = 'distinction-award-badge fade-up';
      badge.innerHTML = `
        <div class="badge-icon">🏆</div>
        <div class="badge-content">
          <strong>Projet Lauréat & Primé</strong>
          <span>Lauréat du Concours National & Prix des Journées Architecturales de Carthage · Voir les distinctions →</span>
        </div>
      `;
      descCol.insertBefore(badge, descCol.firstChild);
    }
  }

  // Responsibilities
  if (project.tasks && project.tasks.length > 0) {
    document.getElementById('tasks-container').style.display = 'block';
    const list = document.getElementById('tasks-list');
    project.tasks.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      list.appendChild(li);
    });
  }

  // Video Section
  if (project.video) {
    document.getElementById('project-video-section').style.display = 'block';
    const vc = document.getElementById('video-container');
    const vVal = project.video.trim();
    
    if (vVal.startsWith('<iframe') || vVal.startsWith('<div')) {
      // Direct HTML Embed
      vc.innerHTML = vVal;
      // Ensure iframe is responsive
      const iframe = vc.querySelector('iframe');
      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
      }
    } else if (vVal.includes('youtube.com') || vVal.includes('youtu.be')) {
      const match = vVal.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      if (match && match[1]) {
        vc.innerHTML = `<iframe src="https://www.youtube.com/embed/${match[1]}" allowfullscreen></iframe>`;
      } else {
        vc.innerHTML = `<p style="padding:2rem;color:red;">Lien YouTube invalide</p>`;
      }
    } else {
      vc.innerHTML = `<video src="${vVal}" controls style="width:100%;height:100%;object-fit:cover;"></video>`;
    }
  }

  // Gallery rendering (Special cases or default)
  const gallerySection = document.getElementById('project-gallery');
  const grid = document.getElementById('gallery-grid');
  
  const hasDocsRealisation = (project.galleryDocs && project.galleryDocs.length > 0) || (project.galleryRealisation && project.galleryRealisation.length > 0);
  const hasBeforeAfter = (project.galleryBefore && project.galleryBefore.length > 0) || (project.galleryAfter && project.galleryAfter.length > 0);

  if (hasDocsRealisation) {
    let html = `<h2 style="margin-bottom: 1.5rem;">Visualisation & Documents</h2>`;
    
    if (project.galleryDocs && project.galleryDocs.length > 0) {
      const docTitle = project.region === 'concours' || project.id === 'issat' ? '📂 Documents du Concours' : '📂 Documents du Projet';
      html += `
        <h3 style="margin-bottom: 1.5rem; color: #fff; font-family: var(--font-heading); font-size: 1.4rem;">${docTitle}</h3>
        <div id="pdf-direct-viewer-container" style="margin-bottom: 2rem; display: none;"></div>
        <div class="gallery-grid" id="grid-concours"></div>
      `;
    }

    const allImages = [...(project.galleryRealisation || []), ...(project.gallery || [])];
    if (allImages.length > 0) {
      html += `
        <h3 style="margin-bottom: 1.5rem; color: #fff; font-family: var(--font-heading); font-size: 1.4rem;">🖼️ Images du projet</h3>
        <div class="gallery-grid" id="grid-realisation" style="margin-bottom: 3rem;"></div>
      `;
    }

    gallerySection.innerHTML = html;
    
    const gridReal = document.getElementById('grid-realisation');
    const gridConc = document.getElementById('grid-concours');
    const pdfViewerContainer = document.getElementById('pdf-direct-viewer-container');
    
    if (gridReal) {
      const allImages = [...(project.galleryRealisation || []), ...(project.gallery || [])];
      if (allImages.length > 0) {
        populateGrid(gridReal, allImages);
      } else {
        // Hide the "Images du projet" title if there are no images at all
        const parentH3 = gridReal.previousElementSibling;
        if (parentH3 && parentH3.tagName === 'H3') parentH3.style.display = 'none';
        gridReal.style.display = 'none';
      }
    }
    
    if (gridConc && pdfViewerContainer) {
      const pdfs = project.galleryDocs.filter(src => src.toLowerCase().endsWith('.pdf'));
      const images = project.galleryDocs.filter(src => !src.toLowerCase().endsWith('.pdf'));
      
      if (pdfs.length > 0) {
        pdfViewerContainer.style.display = 'block';
        pdfViewerContainer.innerHTML = pdfs.map((pdfSrc, idx) => {
          let filename = pdfSrc.split('/').pop().replace(/^\d+_/g, '');
          try { filename = decodeURI(filename); } catch(e) {}
          // Fix for mojibake 'PrÃ©sentation'
          filename = filename.replace(/PrÃ©sentation/g, 'Présentation').replace(/Ã©/g, 'é').replace(/Ã/g, 'à');
          return `
            <div class="secure-pdf-direct-wrap" style="margin-bottom: 3rem; text-align: left;">
              <h4 style="color: var(--accent); margin-bottom: 1.2rem; font-family: var(--font-heading); font-size: 1.25rem; display: flex; align-items: center; gap: 0.6rem; font-weight: 600;">
                📄 Document : ${filename}
              </h4>
              <div class="secure-pdf-canvas-viewer" id="pdf-viewer-${idx}" style="position: relative; width: 100%; max-height: 85vh; overflow-y: auto; background: #151515; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.5); padding: 2rem 0; display: flex; flex-direction: column; align-items: center; gap: 2rem; user-select: none; -webkit-user-select: none;" oncontextmenu="return false;">
                <div class="pdf-loading" style="color: #888; font-size: 1rem; display: flex; align-items: center; gap: 0.5rem; padding: 3rem 0;">
                  Chargement sécurisé du document...
                </div>
              </div>
            </div>
          `;
        }).join('');

        pdfs.forEach((pdfSrc, idx) => {
          // Encode URI to avoid 404 for files with accents
          const encodedUrl = encodeURI(pdfSrc);
          renderPdfSecurely(encodedUrl, `pdf-viewer-${idx}`);
        });
      }
      
      if (images.length > 0) {
        if (pdfs.length > 0) {
          const subTitle = document.createElement('h4');
          subTitle.textContent = "🖼️ Dessins & Rendu 3D";
          subTitle.style.cssText = "color: #fff; font-family: var(--font-heading); margin-bottom: 1.5rem; font-size: 1.3rem; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.6rem; margin-top: 3rem; text-align: left;";
          gridConc.parentNode.insertBefore(subTitle, gridConc);
        }
        populateGrid(gridConc, images);
      } else {
        gridConc.style.display = 'none';
      }
    }
    
  } else if (hasBeforeAfter) {
    let sliderHtml = '';
    const mainBefore = project.galleryBefore ? project.galleryBefore[0] : null;
    const mainAfter = project.galleryAfter ? project.galleryAfter[0] : null;
    
    if (mainBefore && mainAfter) {
      sliderHtml = `
        <div class="before-after-container">
          <h3>↔️ Comparaison Avant / Après (Glisseur Interactif)</h3>
          <div class="before-after-slider">
            <div class="ba-image-after">
              <img src="${mainAfter}" alt="Après - Aménagement proposé">
            </div>
            <div class="ba-image-before">
              <img src="${mainBefore}" alt="Avant - Bâtiment existant">
            </div>
            <div class="ba-slider-handle">
              <div class="ba-handle-button">↔</div>
            </div>
            <div class="ba-label ba-label-before">Avant - Bâtiment existant</div>
            <div class="ba-label ba-label-after">Après - Aménagement proposé</div>
          </div>
        </div>
      `;
    }
    
    gallerySection.innerHTML = `
      ${sliderHtml}
      <h2 style="margin-bottom: 1.5rem;">Galeries Comparatives</h2>
      <div class="gallery-tabs">
        <button class="gallery-tab-btn active" data-tab="after-gallery">✨ Après (Aménagement proposé)</button>
        <button class="gallery-tab-btn" data-tab="before-gallery">🏚️ Avant (Bâtiment existant)</button>
      </div>
      
      <div class="tab-content active" id="tab-after-gallery">
        <div class="gallery-grid" id="grid-after"></div>
      </div>
      
      <div class="tab-content" id="tab-before-gallery">
        <div class="gallery-grid" id="grid-before"></div>
      </div>
    `;
    
    const gridBefore = document.getElementById('grid-before');
    const gridAfter = document.getElementById('grid-after');
    
    if (project.galleryBefore && project.galleryBefore.length > 0) {
      populateGrid(gridBefore, project.galleryBefore);
    } else {
      gridBefore.innerHTML = `<div class="gallery-empty">Aucun visuel existant.</div>`;
    }
    
    if (project.galleryAfter && project.galleryAfter.length > 0) {
      populateGrid(gridAfter, project.galleryAfter);
    } else {
      gridAfter.innerHTML = `<div class="gallery-empty">Aucune proposition disponible.</div>`;
    }
    
    setupTabListeners();
    if (mainBefore && mainAfter) {
      setTimeout(initBeforeAfterSliderLogic, 100);
    }
    
  } else {
    let hasGallery = false;
    if (project.gallery && project.gallery.length > 0) {
      hasGallery = true;
      populateGrid(grid, project.gallery);
    } else if (!project.video && project.image) {
      hasGallery = true;
      populateGrid(grid, [project.image]);
    }
    
    if (!hasGallery) {
      grid.innerHTML = `<div class="gallery-empty">Aucune photo dans la galerie</div>`;
    }
  }

  // Prev/Next Navigation
  const prevI = currentIndex > 0 ? currentIndex - 1 : projects.length - 1;
  const nextI = currentIndex < projects.length - 1 ? currentIndex + 1 : 0;
  
  document.getElementById('nav-prev').href = `${BASE}project.html?id=${projects[prevI].id}`;
  document.getElementById('prev-title').textContent = projects[prevI].title;
  
  document.getElementById('nav-next').href = `${BASE}project.html?id=${projects[nextI].id}`;
  document.getElementById('next-title').textContent = projects[nextI].title;

  // Year & Mobile Menu
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  const mBtn = document.querySelector('.mobile-menu-btn');
  const nLinks = document.querySelector('.nav-links');
  if (mBtn && nLinks) {
    mBtn.addEventListener('click', () => nLinks.classList.toggle('active'));
  }
}

function populateGrid(gridElement, itemsArray) {
  if (!gridElement) return;
  gridElement.innerHTML = '';
  
  itemsArray.forEach(src => {
    const isVideo = src.match(/\.(mp4|webm|ogg)$/i);
    const isPdf = src.toLowerCase().endsWith('.pdf');
    const div = document.createElement('div');
    
    if (isPdf) {
      div.className = 'pdf-card';
      const filename = src.split('/').pop().replace(/^\d+_/g, '');
      div.innerHTML = `
        <span class="pdf-icon">📄</span>
        <span class="pdf-filename">${decodeURIComponent(filename)}</span>
        <span class="pdf-action">Consulter le document</span>
      `;
      div.addEventListener('click', () => {
        openPdfLightbox(src);
      });
    } else {
      div.className = 'gallery-item';
      if (isVideo) {
        div.innerHTML = `<video src="${src}" controls muted></video>`;
      } else {
        div.innerHTML = `<img src="${src}" alt="Photo" loading="lazy">`;
        div.addEventListener('click', () => openLightbox(src));
      }
    }
    gridElement.appendChild(div);
  });
}

function openPdfLightbox(src) {
  const lb = document.createElement('div');
  lb.className = 'lightbox pdf-lightbox';
  
  // Disable toolbars, navpanes, and printing options in the PDF viewer URL
  const pdfUrl = `${src}#toolbar=0&navpanes=0&scrollbar=1&statusbar=0&messages=0`;
  
  lb.innerHTML = `
    <button class="lightbox-close">&times;</button>
    <div class="pdf-viewer-container" style="position: relative; width: 90%; height: 85vh; background: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
      <iframe src="${pdfUrl}" style="width: 100%; height: 100%; border: none;" oncontextmenu="return false;"></iframe>
      <!-- Overlay block to prevent right click directly over the iframe header on some browsers -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 56px; background: transparent; cursor: default;" oncontextmenu="return false;"></div>
    </div>
  `;
  
  document.body.appendChild(lb);
  requestAnimationFrame(() => lb.classList.add('active'));

  // Keyboard protection (blocks printing & saving hotkeys)
  const preventKeys = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      alert("⚠️ La sauvegarde et l'impression de ce document de concours sont désactivées pour protéger les droits d'auteur.");
    }
  };
  window.addEventListener('keydown', preventKeys);

  const closeLb = () => {
    lb.classList.remove('active');
    window.removeEventListener('keydown', preventKeys);
    setTimeout(() => lb.remove(), 300);
  };
  
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('lightbox-close')) closeLb();
  });
  
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { closeLb(); document.removeEventListener('keydown', handler); }
  });
}

function setupTabListeners() {
  const buttons = document.querySelectorAll('.gallery-tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tabs = document.querySelectorAll('.tab-content');
      tabs.forEach(tab => {
        if (tab.id === `tab-${tabId}`) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    });
  });
}

function initBeforeAfterSliderLogic() {
  const sliders = document.querySelectorAll('.before-after-slider');
  sliders.forEach(slider => {
    const beforeContainer = slider.querySelector('.ba-image-before');
    const handle = slider.querySelector('.ba-slider-handle');
    let isDragging = false;

    const setPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let position = ((clientX - rect.left) / rect.width) * 100;
      if (position < 0) position = 0;
      if (position > 100) position = 100;
      
      beforeContainer.style.width = `${position}%`;
      handle.style.left = `${position}%`;
    };

    const onStart = (e) => {
      isDragging = true;
      e.preventDefault();
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(clientX);
    };

    const onEnd = () => {
      isDragging = false;
    };

    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: true });
    
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    beforeContainer.style.width = '50%';
    handle.style.left = '50%';
  });
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

function renderPdfSecurely(pdfUrl, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Use PDF.js API to load document
  pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
    container.innerHTML = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const pageWrapper = document.createElement('div');
      pageWrapper.className = 'pdf-page-wrapper';
      pageWrapper.style.cssText = "position: relative; width: 95%; max-width: 1000px; background: #fff; box-shadow: 0 5px 25px rgba(0,0,0,0.5); margin: 0 auto 2rem auto; border-radius: 6px; overflow: hidden; display: block; flex-shrink: 0; min-height: 200px;";
      
      const canvas = document.createElement('canvas');
      canvas.style.cssText = "display: block; width: 100%; height: auto; pointer-events: none; margin: 0 auto;";
      pageWrapper.appendChild(canvas);
      container.appendChild(pageWrapper);

      pdf.getPage(pageNum).then(page => {
        // High-definition render: scale = 2.0 (super-sharp technical drawings)
        const viewport = page.getViewport({ scale: 2.0 });
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    }
  }).catch(err => {
    console.error('Error rendering secure PDF:', err);
    container.innerHTML = `<p style="padding: 3rem 0; color: #ff5555; font-size: 0.95rem; font-family: var(--font-heading); text-align: center;">⚠️ Impossible d'afficher le document de manière sécurisée.</p>`;
  });
}

init();
