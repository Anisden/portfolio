// ===== Toast =====
function toast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ===== Tabs =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// ===== Image Upload Preview =====
async function uploadFile(file) {
  const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { 'x-filename': encodeURIComponent(filename) },
      body: file
    });
    if (res.ok) {
      return await res.text();
    }
  } catch (e) {
    console.error('Upload error:', e);
  }
  return null;
}

function setupImagePreview(fileInputId, previewId, urlInputId) {
  const fileInput = document.getElementById(fileInputId);
  const preview = document.getElementById(previewId);
  const urlInput = document.getElementById(urlInputId);
  if (!fileInput || !preview) return;

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    
    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Upload and get server path
    toast('📤 Téléchargement de l\'image...');
    const serverPath = await uploadFile(file);
    if (serverPath) {
      if (urlInput) urlInput.value = serverPath;
      toast('✅ Image téléchargée !');
    } else {
      toast('❌ Erreur de téléchargement.');
    }
  });

  if (urlInput) {
    urlInput.addEventListener('input', () => {
      const val = urlInput.value.trim();
      if (val) {
        preview.src = val;
        preview.style.display = 'block';
        preview.onerror = () => { preview.style.display = 'none'; };
      }
    });
  }
}

// ===== Gallery Preview =====
function updateVideoPreview(idPrefix = '') {
  const videoInput = document.getElementById(idPrefix ? `${idPrefix}-video` : 'video');
  const previewDiv = document.getElementById(idPrefix ? `${idPrefix}-video-preview` : 'video-preview');
  const thumb = document.getElementById(idPrefix ? `${idPrefix}-video-thumb` : 'video-thumb');
  const container = document.getElementById(idPrefix ? `${idPrefix}-video-preview-container` : 'video-preview-container');
  if (!videoInput || !previewDiv || !container) return;
  
  const val = videoInput.value.trim();
  if (!val) {
    previewDiv.style.display = 'none';
    return;
  }

  previewDiv.style.display = 'block';

  if (val.startsWith('<iframe') || val.startsWith('<div')) {
    container.innerHTML = val;
    container.style.display = 'block';
    if (thumb) thumb.style.display = 'none';
  } else {
    container.style.display = 'none';
    const ytMatch = val.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (ytMatch && thumb) {
      thumb.src = `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
      thumb.style.display = 'block';
    } else if (thumb) {
      thumb.style.display = 'none';
    }
  }
}

function updateGalleryPreview(idPrefix = '') {
  let galleryInput = document.getElementById(idPrefix ? `${idPrefix}-gallery` : 'gallery');
  if (idPrefix && !galleryInput) {
    galleryInput = document.getElementById(idPrefix);
  }
  
  let previewEl = document.getElementById(idPrefix ? `${idPrefix}-gallery-preview` : 'gallery-preview');
  if (idPrefix && !previewEl) {
    previewEl = document.getElementById(`${idPrefix}-preview`);
  }

  if (!galleryInput || !previewEl) return;
  const urls = galleryInput.value.split('\n').map(s => s.trim()).filter(Boolean);
  previewEl.innerHTML = urls.map((url, i) => `
    <div class="gallery-thumb">
      <img src="${url}" alt="Photo ${i+1}" onerror="this.parentElement.style.display='none'">
      <button class="remove-thumb" onclick="removeGalleryItem(${i}, '${idPrefix}')">✕</button>
    </div>`).join('');
}

window.removeGalleryItem = (index, idPrefix = '') => {
  let el = document.getElementById(idPrefix ? `${idPrefix}-gallery` : 'gallery');
  if (idPrefix && !el) {
    el = document.getElementById(idPrefix);
  }
  if (!el) return;
  const lines = el.value.split('\n').map(s => s.trim()).filter(Boolean);
  lines.splice(index, 1);
  el.value = lines.join('\n');
  updateGalleryPreview(idPrefix);
};

// ===== Projects =====
let projects = [];

async function initProjects() {
  try {
    const res = await fetch('/projects.json');
    if (res.ok) projects = await res.json();
    renderProjectList();
  } catch (e) { console.error(e); }
}

function renderProjectList() {
  const el = document.getElementById('admin-project-list');
  if (!el) return;
  if (projects.length === 0) { el.innerHTML = '<p style="color:#666;padding:1rem">Aucun projet.</p>'; return; }
  el.innerHTML = projects.map((p, i) => `
    <div class="project-list-item">
      <div class="item-info">
        <strong>${p.region === 'quebec' ? '🇨🇦' : (p.region === 'concours' ? '🏆' : '🇹🇳')} ${p.title}</strong>
        <small>${p.meta || ''}</small>
      </div>
      <div class="item-actions">
        <button class="btn-sm btn-edit" onclick="editProject(${i})">✏️ Modifier</button>
        <button class="btn-sm btn-danger" onclick="deleteProject(${i})">🗑 Supprimer</button>
      </div>
    </div>`).join('');
}

window.editProject = (i) => {
  const p = projects[i];
  document.getElementById('project-id').value = i;
  document.getElementById('form-title').textContent = '✏️ Modifier le projet';
  const addBtn = document.getElementById('add-btn');
  if (addBtn) addBtn.textContent = '✅ Valider les modifications';
  document.getElementById('title').value = p.title || '';
  document.getElementById('region').value = p.region || 'tunisia';
  document.getElementById('meta').value = p.meta || '';
  document.getElementById('image').value = p.image || '';
  document.getElementById('video').value = p.video || '';
  document.getElementById('description').value = p.description || '';
  document.getElementById('longDescription').value = p.longDescription || '';
  document.getElementById('budget').value = p.budget || '';
  document.getElementById('tasks').value = (p.tasks || []).join('\n');
  document.getElementById('gallery').value = (p.gallery || []).join('\n');

  // Show/Hide Special sections based on Project ID
  const specialCard = document.getElementById('special-rubrics-card');
  const groupIssat = document.getElementById('group-issat');
  const groupBeforeAfter = document.getElementById('group-before-after');
  
  if (specialCard) specialCard.style.display = 'block';
  
  if (p.id === 'coke-studio' || p.id === 'maracana') {
    if (groupIssat) groupIssat.style.display = 'none';
    if (groupBeforeAfter) groupBeforeAfter.style.display = 'block';
  } else {
    if (groupIssat) groupIssat.style.display = 'block';
    if (groupBeforeAfter) groupBeforeAfter.style.display = 'none';
  }

  // Special rubrics fields
  document.getElementById('showDistinctionBtn').checked = !!p.showDistinctionBtn;
  document.getElementById('galleryDocs').value = (p.galleryDocs || []).join('\n');
  document.getElementById('galleryRealisation').value = (p.galleryRealisation || []).join('\n');
  document.getElementById('galleryBefore').value = (p.galleryBefore || []).join('\n');
  document.getElementById('galleryAfter').value = (p.galleryAfter || []).join('\n');

  const preview = document.getElementById('image-preview');
  if (p.image) { preview.src = p.image; preview.style.display = 'block'; }
  updateGalleryPreview();
  updateGalleryPreview('galleryDocs');
  updateGalleryPreview('galleryRealisation');
  updateGalleryPreview('galleryBefore');
  updateGalleryPreview('galleryAfter');
  updateVideoPreview();
  document.querySelector('[data-tab="projects"]').click();
  document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
};

window.deleteProject = (i) => {
  if (confirm(`Supprimer "${projects[i].title}" ?`)) {
    projects.splice(i, 1);
    renderProjectList();
    toast('Projet supprimé. N\'oubliez pas de sauvegarder.');
  }
};

function resetProjectForm() {
  ['project-id','title','meta','image','video','description','longDescription','budget','tasks','gallery','galleryDocs','galleryRealisation','galleryBefore','galleryAfter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  
  // Hide special sections
  const specialCard = document.getElementById('special-rubrics-card');
  const groupIssat = document.getElementById('group-issat');
  const groupBeforeAfter = document.getElementById('group-before-after');
  if (specialCard) specialCard.style.display = 'none';
  if (groupIssat) groupIssat.style.display = 'none';
  if (groupBeforeAfter) groupBeforeAfter.style.display = 'none';

  document.getElementById('showDistinctionBtn').checked = false;
  const preview = document.getElementById('image-preview');
  if (preview) { preview.src = ''; preview.style.display = 'none'; }
  
  // Reset previews
  ['gallery-preview', 'galleryDocs-preview', 'galleryRealisation-preview', 'galleryBefore-preview', 'galleryAfter-preview'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
  
  const videoPreview = document.getElementById('video-preview');
  if (videoPreview) videoPreview.style.display = 'none';
  document.getElementById('form-title').textContent = '➕ Ajouter un projet';
  const addBtn = document.getElementById('add-btn');
  if (addBtn) addBtn.textContent = '➕ Ajouter à la liste';
}

document.getElementById('add-btn')?.addEventListener('click', () => {
  const title = document.getElementById('title').value.trim();
  if (!title) { alert('Le titre est requis.'); return; }
  const id = document.getElementById('project-id').value;
  const tasks = document.getElementById('tasks').value.split('\n').map(s => s.trim()).filter(Boolean);
  const gallery = document.getElementById('gallery').value.split('\n').map(s => s.trim()).filter(Boolean);
  
  const galleryDocs = document.getElementById('galleryDocs').value.split('\n').map(s => s.trim()).filter(Boolean);
  const galleryRealisation = document.getElementById('galleryRealisation').value.split('\n').map(s => s.trim()).filter(Boolean);
  const galleryBefore = document.getElementById('galleryBefore').value.split('\n').map(s => s.trim()).filter(Boolean);
  const galleryAfter = document.getElementById('galleryAfter').value.split('\n').map(s => s.trim()).filter(Boolean);
  const showDistinctionBtn = document.getElementById('showDistinctionBtn').checked;

  const region = document.getElementById('region').value;
  // If editing, preserve currency if not changing region, otherwise set default
  let currency = 'EUR';
  if (region === 'quebec') currency = 'CAD';
  else if (region === 'tunisia' || region === 'concours') currency = 'TND';

  const proj = {
    id: id !== '' ? projects[parseInt(id)].id : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
    title, region,
    meta: document.getElementById('meta').value,
    description: document.getElementById('description').value,
    longDescription: document.getElementById('longDescription').value,
    image: document.getElementById('image').value,
    video: document.getElementById('video').value,
    budget: document.getElementById('budget').value,
    currency, tasks, gallery,
    galleryDocs, galleryRealisation, galleryBefore, galleryAfter, showDistinctionBtn
  };
  if (id !== '') projects[parseInt(id)] = proj;
  else projects.push(proj);
  renderProjectList();
  saveProjectsToServer(); // Auto-save
  resetProjectForm();
});

document.getElementById('new-btn')?.addEventListener('click', resetProjectForm);

// Helper to save projects to disk
async function saveProjectsToServer() {
  const data = JSON.stringify(projects, null, 2);
  try {
    const res = await fetch('/api/save-projects', { method: 'POST', body: data });
    if (res.ok) { 
      toast('✅ Projets enregistrés et sauvegardés !'); 
      return true;
    }
  } catch (e) { console.error('Save error:', e); }
  
  // Fallback if API fails
  const a = document.createElement('a');
  a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
  a.download = 'projects.json';
  a.click();
  toast('📥 Serveur indisponible. Fichier téléchargé, remplacez-le dans /public/.');
  return false;
}

// Helper to save content to disk
async function saveContentToServer() {
  // Update generalContent object from form fields
  generalContent = {
    ...generalContent,
    heroSubtitle: document.getElementById('c-heroSubtitle').value,
    heroTitleHtml: document.getElementById('c-heroTitleHtml').value,
    heroDescription: document.getElementById('c-heroDescription').value,
    aboutText: document.getElementById('c-aboutText').value,
    logoText: document.getElementById('c-logoText').value,
    contactEmail: document.getElementById('c-contactEmail').value,
    contactPhone: document.getElementById('c-contactPhone').value,
    contactLinkedin: document.getElementById('c-contactLinkedin').value,
    contactAddress: document.getElementById('c-contactAddress').value,
    cvLink: document.getElementById('c-cvLink').value
  };

  const data = JSON.stringify(generalContent, null, 2);
  try {
    const res = await fetch('/api/save-content', { method: 'POST', body: data });
    if (res.ok) { 
      toast('✅ Contenu enregistré et sauvegardé !'); 
      return true;
    }
  } catch (e) { console.error('Save error:', e); }
  
  // Fallback
  const a = document.createElement('a');
  a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
  a.download = 'content.json';
  a.click();
  toast('📥 Serveur indisponible. Fichier téléchargé, remplacez-le dans /public/.');
  return false;
}

document.getElementById('export-btn')?.addEventListener('click', saveProjectsToServer);
document.getElementById('export-content-btn')?.addEventListener('click', saveContentToServer);
document.getElementById('save-distinctions-btn')?.addEventListener('click', saveContentToServer);

// Gallery & Video live preview
document.getElementById('gallery')?.addEventListener('input', () => updateGalleryPreview());
document.getElementById('video')?.addEventListener('input', () => updateVideoPreview());
document.getElementById('dist-gallery')?.addEventListener('input', () => updateGalleryPreview('dist'));
document.getElementById('dist-video')?.addEventListener('input', () => updateVideoPreview('dist'));

// ===== General Content =====
let generalContent = {};

async function initContent() {
  try {
    const res = await fetch('/content.json');
    if (res.ok) {
      generalContent = await res.json();
      document.getElementById('c-heroSubtitle').value = generalContent.heroSubtitle || '';
      document.getElementById('c-heroTitleHtml').value = generalContent.heroTitleHtml || '';
      document.getElementById('c-heroDescription').value = generalContent.heroDescription || '';
      document.getElementById('c-aboutText').value = generalContent.aboutText || '';
      document.getElementById('c-contactEmail').value = generalContent.contactEmail || '';
      document.getElementById('c-contactPhone').value = generalContent.contactPhone || '';
      document.getElementById('c-contactLinkedin').value = generalContent.contactLinkedin || '';
      document.getElementById('c-contactAddress').value = generalContent.contactAddress || '';
      document.getElementById('c-cvLink').value = generalContent.cvLink || '';
      
      
      const logoEl = document.getElementById('c-logoText');
      if (logoEl) logoEl.value = generalContent.logoText || '';
    }
  } catch (e) { console.error(e); }
}



document.getElementById('save-content-btn')?.addEventListener('click', saveContentToServer);

document.getElementById('export-content-btn')?.addEventListener('click', () => {
  const data = JSON.stringify(generalContent, null, 2);
  const a = document.createElement('a');
  a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
  a.download = 'content.json';
  a.click();
  toast('📥 content.json téléchargé. Copiez-le dans /public/.');
});

// ===== Distinctions =====
let distinctions = [];

function renderDistinctionsList() {
  const el = document.getElementById('distinctions-admin-list');
  if (!el) return;
  if (!distinctions.length) { el.innerHTML = '<p style="color:#666;padding:1rem">Aucune distinction.</p>'; return; }
  const icons = { award: '🏆', competition: '🥇', media: '📺' };
  el.innerHTML = distinctions.map((d, i) => `
    <div class="distinction-item">
      <div>
        <span class="item-year">${d.year}</span>
        <strong>${icons[d.type] || '⭐'} ${d.title}</strong>
      </div>
      <div class="item-actions">
        <button class="btn-sm btn-edit" onclick="editDistinction(${i})">✏️</button>
        <button class="btn-sm btn-danger" onclick="deleteDistinction(${i})">🗑</button>
      </div>
    </div>`).join('');
}

window.editDistinction = (i) => {
  const d = distinctions[i];
  document.getElementById('dist-id').value = i;
  document.getElementById('dist-year').value = d.year || '';
  document.getElementById('dist-type').value = d.type || 'award';
  document.getElementById('dist-title').value = d.title || '';
  document.getElementById('dist-desc').value = d.description || '';
  document.getElementById('dist-image').value = d.image || '';
  document.getElementById('dist-video').value = d.video || '';
  document.getElementById('dist-gallery').value = (d.gallery || []).join('\n');
  
  const preview = document.getElementById('dist-image-preview');
  if (d.image) { preview.src = d.image; preview.style.display = 'block'; }
  else { preview.style.display = 'none'; }
  
  updateGalleryPreview('dist');
  updateVideoPreview('dist');
  
  document.getElementById('dist-form-title').textContent = '✏️ Modifier la distinction';
  document.querySelector('[data-tab="distinctions"]').click();
};

window.deleteDistinction = (i) => {
  if (confirm('Supprimer cette distinction ?')) {
    distinctions.splice(i, 1);
    renderDistinctionsList();
    generalContent.distinctions = distinctions;
    saveContentToServer();
  }
};

function resetDistinctionForm() {
  ['dist-id','dist-year','dist-title','dist-desc','dist-image','dist-video','dist-gallery'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('dist-type').value = 'award';
  const preview = document.getElementById('dist-image-preview');
  if (preview) { preview.src = ''; preview.style.display = 'none'; }
  const galleryPreview = document.getElementById('dist-gallery-preview');
  if (galleryPreview) galleryPreview.innerHTML = '';
  const videoPreview = document.getElementById('dist-video-preview');
  if (videoPreview) videoPreview.style.display = 'none';
  document.getElementById('dist-form-title').textContent = '➕ Ajouter une distinction';
}

document.getElementById('dist-add-btn')?.addEventListener('click', async () => {
  const title = document.getElementById('dist-title').value.trim();
  if (!title) { alert('Le titre est requis.'); return; }
  const id = document.getElementById('dist-id').value;
  const d = {
    year: document.getElementById('dist-year').value,
    type: document.getElementById('dist-type').value,
    title,
    description: document.getElementById('dist-desc').value,
    image: document.getElementById('dist-image').value,
    video: document.getElementById('dist-video').value,
    gallery: document.getElementById('dist-gallery').value.split('\n').map(s => s.trim()).filter(Boolean)
  };
  if (id !== '') distinctions[parseInt(id)] = d;
  else distinctions.push(d);
  renderDistinctionsList();
  generalContent.distinctions = distinctions;
  await saveContentToServer(); // Explicit auto-save to content.json on server
  resetDistinctionForm();
});

document.getElementById('dist-new-btn')?.addEventListener('click', resetDistinctionForm);

// ===== Gallery Multi-Upload =====
function setupGalleryUpload(idPrefix = '') {
  let fileInputId = 'gallery-file';
  let textAreaId = 'gallery';
  
  if (idPrefix) {
    fileInputId = document.getElementById(`${idPrefix}-file`) ? `${idPrefix}-file` : `${idPrefix}-gallery-file`;
    textAreaId = document.getElementById(idPrefix) ? idPrefix : `${idPrefix}-gallery`;
  }
  
  const galleryFileInput = document.getElementById(fileInputId);
  const galleryTextArea = document.getElementById(textAreaId);
  
  if (!galleryFileInput || !galleryTextArea) {
    console.warn(`[setupGalleryUpload] Skipping prefix '${idPrefix}' (Input: ${fileInputId}, TextArea: ${textAreaId} not found)`);
    return;
  }

  // File selection change event
  galleryFileInput.addEventListener('change', async () => {
    const files = Array.from(galleryFileInput.files);
    if (files.length === 0) return;

    toast(`📤 Téléchargement de ${files.length} fichiers...`);
    const uploadPromises = files.map(file => uploadFile(file));
    const results = await Promise.all(uploadPromises);
    
    const successfulUploads = results.filter(Boolean);
    if (successfulUploads.length > 0) {
      const currentVal = galleryTextArea.value.trim();
      const newVal = (currentVal ? currentVal + '\n' : '') + successfulUploads.join('\n');
      galleryTextArea.value = newVal;
      updateGalleryPreview(idPrefix);
      toast(`✅ ${successfulUploads.length} fichiers ajoutés !`);
    } else {
      toast('❌ Erreur lors du téléchargement.');
    }
  });

  // Drag and drop event listeners on parent upload area
  const uploadAreaId = idPrefix ? `${idPrefix}-upload-area` : 'gallery-upload-area';
  const uploadArea = document.getElementById(uploadAreaId);
  if (uploadArea) {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadArea.addEventListener(eventName, () => {
        uploadArea.style.borderColor = 'var(--accent)';
        uploadArea.style.background = 'rgba(212,175,55,0.08)';
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, () => {
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
      }, false);
    });

    // Handle dropped files (Supports PDFs and images)
    uploadArea.addEventListener('drop', async (e) => {
      const dt = e.dataTransfer;
      const files = Array.from(dt.files);
      if (files.length === 0) return;

      toast(`📤 Téléchargement de ${files.length} fichiers...`);
      const uploadPromises = files.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      
      const successfulUploads = results.filter(Boolean);
      if (successfulUploads.length > 0) {
        const currentVal = galleryTextArea.value.trim();
        const newVal = (currentVal ? currentVal + '\n' : '') + successfulUploads.join('\n');
        galleryTextArea.value = newVal;
        updateGalleryPreview(idPrefix);
        toast(`✅ ${successfulUploads.length} fichiers ajoutés !`);
      } else {
        toast('❌ Erreur de téléchargement.');
      }
    });

    // Make clicking the drag box trigger the input file selector
    uploadArea.style.cursor = 'pointer';
    uploadArea.addEventListener('click', (e) => {
      // Prevent click loops if clicking input itself
      if (e.target !== galleryFileInput) {
        galleryFileInput.click();
      }
    });
  }
}

// ===== Init =====
async function init() {
  await initContent();
  await initProjects();
  distinctions = generalContent.distinctions || [];
  renderDistinctionsList();
  
  // Projects
  setupImagePreview('image-file', 'image-preview', 'image');
  setupGalleryUpload();
  setupGalleryUpload('galleryDocs');
  setupGalleryUpload('galleryRealisation');
  setupGalleryUpload('galleryBefore');
  setupGalleryUpload('galleryAfter');

  // Input event listeners for special galleries
  document.getElementById('galleryDocs')?.addEventListener('input', () => updateGalleryPreview('galleryDocs'));
  document.getElementById('galleryRealisation')?.addEventListener('input', () => updateGalleryPreview('galleryRealisation'));
  document.getElementById('galleryBefore')?.addEventListener('input', () => updateGalleryPreview('galleryBefore'));
  document.getElementById('galleryAfter')?.addEventListener('input', () => updateGalleryPreview('galleryAfter'));
  
  // Distinctions
  setupImagePreview('dist-image-file', 'dist-image-preview', 'dist-image');
  setupGalleryUpload('dist');
  
  // Hero Images Carousel Upload
  setupGalleryUpload('c-heroImages');
  
  // CV Upload logic
  const cvFileInput = document.getElementById('cv-file-input');
  const cvLinkInput = document.getElementById('c-cvLink');
  if (cvFileInput && cvLinkInput) {
    cvFileInput.addEventListener('change', async () => {
      const file = cvFileInput.files[0];
      if (!file) return;
      toast('📤 Téléchargement du CV...');
      const serverPath = await uploadFile(file);
      if (serverPath) {
        cvLinkInput.value = serverPath;
        toast('✅ CV mis à jour !');
      } else {
        toast('❌ Erreur de téléchargement.');
      }
    });
  }
}

init();
