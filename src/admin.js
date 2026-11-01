const BASE = import.meta.env.BASE_URL;
let editingLang = 'fr';

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

// ===== GitHub Direct API Configuration =====
const GH_OWNER = 'Anisden';
const GH_REPO = 'portfolio';
const GH_BRANCH = 'main';
const GH_TOKEN_KEY = 'portfolio_gh_token';

function getGhToken() {
  return (localStorage.getItem(GH_TOKEN_KEY) || '').trim();
}

function updateGhTokenButtonUI() {
  const btn = document.getElementById('gh-token-btn');
  if (!btn) return;
  if (getGhToken()) {
    btn.textContent = '🟢 GitHub connecté';
    btn.style.borderColor = 'rgba(46, 204, 113, 0.5)';
    btn.style.color = '#2ecc71';
  } else {
    btn.textContent = '🔑 Connecter GitHub';
    btn.style.borderColor = 'rgba(212, 175, 55, 0.4)';
    btn.style.color = 'var(--accent)';
  }
}

function promptGhToken() {
  return new Promise((resolve) => {
    const modal = document.getElementById('gh-modal');
    const input = document.getElementById('gh-token-input');
    const saveBtn = document.getElementById('gh-modal-save');
    const cancelBtn = document.getElementById('gh-modal-cancel');
    if (!modal || !input || !saveBtn || !cancelBtn) {
      resolve('');
      return;
    }
    input.value = getGhToken();
    modal.style.display = 'flex';
    input.focus();

    const cleanup = () => {
      modal.style.display = 'none';
      saveBtn.removeEventListener('click', onSave);
      cancelBtn.removeEventListener('click', onCancel);
    };
    const onSave = () => {
      const val = input.value.trim();
      if (val) {
        localStorage.setItem(GH_TOKEN_KEY, val);
      } else {
        localStorage.removeItem(GH_TOKEN_KEY);
      }
      updateGhTokenButtonUI();
      cleanup();
      resolve(val);
    };
    const onCancel = () => {
      cleanup();
      resolve('');
    };
    saveBtn.addEventListener('click', onSave);
    cancelBtn.addEventListener('click', onCancel);
  });
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64.replace(/\s/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function ghGetFileJson(repoPath) {
  const token = getGhToken();
  if (!token) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${repoPath}?ref=${GH_BRANCH}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.content) {
      return JSON.parse(base64ToUtf8(data.content));
    }
  } catch (e) {
    console.warn('GitHub read fallback:', e);
  }
  return null;
}

async function ghPutFile(repoPath, base64Content, commitMessage) {
  let token = getGhToken();
  if (!token) {
    token = await promptGhToken();
    if (!token) return false;
  }

  const apiUrl = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${repoPath}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json'
  };

  // Get current file SHA if it exists
  let sha = undefined;
  const getRes = await fetch(`${apiUrl}?ref=${GH_BRANCH}`, { headers, cache: 'no-store' });
  if (getRes.status === 401 || getRes.status === 403) {
    toast('❌ Token GitHub invalide ou expiré. Veuillez le reconfigurer.');
    localStorage.removeItem(GH_TOKEN_KEY);
    updateGhTokenButtonUI();
    return false;
  }
  if (getRes.ok) {
    const existing = await getRes.json();
    sha = existing.sha;
  }

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: commitMessage,
      content: base64Content,
      ...(sha ? { sha } : {}),
      branch: GH_BRANCH
    })
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    console.error('GitHub PUT error:', errText);
    return false;
  }
  return true;
}

// ===== API Helper (local Vite dev server if running on localhost) =====
async function apiFetch(endpoint, options) {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return null;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const candidates = [`/${cleanEndpoint}`, `${BASE}${cleanEndpoint}`];
  for (const url of [...new Set(candidates)]) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
    } catch (_) {}
  }
  return null;
}

// ===== Image Upload Preview =====
async function uploadFile(file) {
  const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  try {
    // 1. Try local server if on localhost
    const res = await apiFetch('/api/upload-image', {
      method: 'POST',
      headers: { 'x-filename': encodeURIComponent(filename) },
      body: file
    });
    if (res && res.ok) {
      return await res.text();
    }

    // 2. Otherwise upload directly to GitHub repository
    const base64 = await fileToBase64(file);
    const ok = await ghPutFile(`public/uploads/${filename}`, base64, `Upload ${filename} via Admin`);
    if (ok) {
      return `/uploads/${filename}`;
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
  previewEl.innerHTML = urls.map((url, i) => {
    const isPdf = url.toLowerCase().endsWith('.pdf');
    const resolved = url.startsWith('/') ? `${BASE}${url.slice(1)}` : url;
    const shortName = decodeURIComponent(url.split('/').pop().replace(/^\d+_/, ''));
    const mediaHtml = isPdf
      ? `<div style="width:100%;height:62px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(212,175,55,0.12);color:var(--accent);font-size:0.65rem;padding:2px;text-align:center;overflow:hidden;" title="${shortName}"><span style="font-size:1.3rem;line-height:1;">📄</span><span style="max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${shortName}</span></div>`
      : `<img src="${resolved}" alt="Photo ${i+1}" title="${shortName}" onerror="this.outerHTML='<div style=\\'width:100%;height:62px;display:flex;align-items:center;justify-content:center;font-size:0.65rem;color:#aaa;text-align:center;padding:2px;\\'>🖼️ Fichier</div>'">`;
    return `
    <div class="gallery-thumb">
      ${mediaHtml}
      <div class="thumb-controls">
        <button type="button" class="thumb-btn btn-move" onclick="moveGalleryItem(${i}, -1, '${idPrefix}')" title="Reculer" ${i === 0 ? 'disabled style="opacity:0.3;cursor:default;"' : ''}>◀</button>
        <button type="button" class="thumb-btn btn-move" onclick="moveGalleryItem(${i}, 1, '${idPrefix}')" title="Avancer" ${i === urls.length - 1 ? 'disabled style="opacity:0.3;cursor:default;"' : ''}>▶</button>
        <button type="button" class="thumb-btn btn-remove" onclick="removeGalleryItem(${i}, '${idPrefix}')" title="Supprimer">✕</button>
      </div>
    </div>`;
  }).join('');
}

window.moveGalleryItem = (index, direction, idPrefix = '') => {
  let el = document.getElementById(idPrefix ? `${idPrefix}-gallery` : 'gallery');
  if (idPrefix && !el) {
    el = document.getElementById(idPrefix);
  }
  if (!el) return;
  const lines = el.value.split('\n').map(s => s.trim()).filter(Boolean);
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= lines.length) return;
  const temp = lines[index];
  lines[index] = lines[targetIndex];
  lines[targetIndex] = temp;
  el.value = lines.join('\n');
  updateGalleryPreview(idPrefix);
};

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
    const filename = editingLang === 'fr' ? 'projects.json' : `projects_${editingLang}.json`;
    const ghData = await ghGetFileJson(`public/${filename}`);
    if (ghData) {
      projects = ghData;
    } else {
      const res = await fetch(`${BASE}${filename}?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        projects = await res.json();
      } else {
        const fallbackRes = await fetch(`${BASE}projects.json?t=${Date.now()}`, { cache: 'no-store' });
        if (fallbackRes.ok) projects = await fallbackRes.json();
      }
    }
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
  document.getElementById('project-year').value = p.year || '';
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
  ['project-id','title','meta','project-year','image','video','description','longDescription','budget','tasks','gallery','galleryDocs','galleryRealisation','galleryBefore','galleryAfter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  
  // Keep PDF / Docs section visible by default
  const specialCard = document.getElementById('special-rubrics-card');
  const groupIssat = document.getElementById('group-issat');
  const groupBeforeAfter = document.getElementById('group-before-after');
  if (specialCard) specialCard.style.display = 'block';
  if (groupIssat) groupIssat.style.display = 'block';
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
  const year = parseInt(document.getElementById('project-year').value) || 2010;

  const region = document.getElementById('region').value;
  // If editing, preserve currency if not changing region, otherwise set default
  let currency = 'EUR';
  if (region === 'quebec') currency = 'CAD';
  else if (region === 'tunisia' || region === 'concours') currency = 'TND';

  const proj = {
    id: id !== '' ? projects[parseInt(id)].id : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
    title, region,
    year,
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

  // Sort projects chronologically descending (newest first)
  projects.sort((a, b) => (b.year || 0) - (a.year || 0));

  renderProjectList();
  saveProjectsToServer(); // Auto-save
  resetProjectForm();
});

document.getElementById('new-btn')?.addEventListener('click', resetProjectForm);

// Helper to save projects to disk / GitHub
async function saveProjectsToServer() {
  const data = JSON.stringify(projects, null, 2);
  const suffix = editingLang && editingLang !== 'fr' ? `_${editingLang}` : '';
  try {
    // 1. Local Vite dev server if running on localhost
    const res = await apiFetch('/api/save-projects', {
      method: 'POST',
      headers: { 'x-lang': editingLang },
      body: data
    });
    if (res && res.ok) { 
      toast('✅ Projets enregistrés et sauvegardés !'); 
      return true;
    }

    // 2. Direct commit to GitHub repository
    toast('⏳ Enregistrement sur GitHub en cours...');
    const base64 = utf8ToBase64(data);
    const ok = await ghPutFile(`public/projects${suffix}.json`, base64, `Update projects${suffix}.json via Admin`);
    if (ok) {
      if (!suffix) {
        await ghPutFile('public/projects_fr.json', base64, 'Sync projects_fr.json via Admin');
        // Auto-sync media/structural fields to EN and AR so uploaded photos/PDFs appear in all languages
        const mediaFields = ['image', 'video', 'gallery', 'galleryDocs', 'galleryRealisation', 'galleryBefore', 'galleryAfter', 'year', 'region', 'showDistinctionBtn'];
        for (const lang of ['en', 'ar']) {
          const langProjs = await ghGetFileJson(`public/projects_${lang}.json`);
          if (Array.isArray(langProjs)) {
            let changed = false;
            for (const fp of projects) {
              const match = langProjs.find(lp => lp.id === fp.id);
              if (match) {
                for (const mf of mediaFields) {
                  if (JSON.stringify(match[mf]) !== JSON.stringify(fp[mf])) {
                    match[mf] = fp[mf];
                    changed = true;
                  }
                }
              } else {
                langProjs.push({ ...fp });
                changed = true;
              }
            }
            if (changed) {
              langProjs.sort((a, b) => (b.year || 0) - (a.year || 0));
              await ghPutFile(`public/projects_${lang}.json`, utf8ToBase64(JSON.stringify(langProjs, null, 2)), `Sync media to projects_${lang}.json via Admin`);
            }
          }
        }
      }
      toast('✅ Enregistré directement sur GitHub ! (Site mis à jour dans ~45s)', 5000);
      return true;
    }
  } catch (e) { console.error('Save error:', e); }
  
  toast('❌ Enregistrement annulé ou échoué. Vérifiez votre Token GitHub.');
  return false;
}

// Helper to save content to disk / GitHub
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
  const suffix = editingLang && editingLang !== 'fr' ? `_${editingLang}` : '';
  try {
    // 1. Local Vite dev server if running on localhost
    const res = await apiFetch('/api/save-content', {
      method: 'POST',
      headers: { 'x-lang': editingLang },
      body: data
    });
    if (res && res.ok) { 
      toast('✅ Contenu enregistré et sauvegardé !'); 
      return true;
    }

    // 2. Direct commit to GitHub repository
    toast('⏳ Enregistrement sur GitHub en cours...');
    const base64 = utf8ToBase64(data);
    const ok = await ghPutFile(`public/content${suffix}.json`, base64, `Update content${suffix}.json via Admin`);
    if (ok) {
      if (!suffix) {
        await ghPutFile('public/content_fr.json', base64, 'Sync content_fr.json via Admin');
      }
      toast('✅ Enregistré directement sur GitHub ! (Site mis à jour dans ~45s)', 5000);
      return true;
    }
  } catch (e) { console.error('Save error:', e); }
  
  toast('❌ Enregistrement annulé ou échoué. Vérifiez votre Token GitHub.');
  return false;
}

document.getElementById('export-btn')?.addEventListener('click', saveProjectsToServer);
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
    const filename = editingLang === 'fr' ? 'content.json' : `content_${editingLang}.json`;
    const ghData = await ghGetFileJson(`public/${filename}`);
    if (ghData) {
      generalContent = ghData;
    } else {
      const res = await fetch(`${BASE}${filename}?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        generalContent = await res.json();
      } else {
        const fallbackRes = await fetch(`${BASE}content.json?t=${Date.now()}`, { cache: 'no-store' });
        if (fallbackRes.ok) generalContent = await fallbackRes.json();
      }
    }
    
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

// ===== Experiences (Parcours) =====
let experiences = [];

function renderExperiencesList() {
  const el = document.getElementById('experiences-admin-list');
  if (!el) return;
  if (!experiences.length) {
    el.innerHTML = '<p style="color:#666;padding:1rem">Aucune étape de parcours.</p>';
    return;
  }
  const regionIcons = { quebec: '🇨🇦', tunisie: '🇹🇳', international: '🌍' };
  el.innerHTML = experiences.map((exp, i) => `
    <div class="distinction-item">
      <div style="flex:1; min-width:0;">
        <span class="item-year">${regionIcons[exp.region] || '📍'} ${exp.date}</span>
        <strong style="display:block; margin-top:.2rem; font-size:.95rem;">${exp.company}</strong>
        <small style="color:#666; font-size:.8rem;">${exp.role}</small>
      </div>
      <div class="item-actions">
        <button class="btn-sm btn-edit" onclick="editExperience(${i})">✏️ Modifier</button>
        <button class="btn-sm btn-danger" onclick="deleteExperience(${i})">🗑</button>
      </div>
    </div>`).join('');
}

window.editExperience = (i) => {
  const exp = experiences[i];
  document.getElementById('exp-id').value = i;
  document.getElementById('exp-company').value = exp.company || '';
  document.getElementById('exp-region').value = exp.region || 'quebec';
  document.getElementById('exp-location').value = exp.location || '';
  document.getElementById('exp-date').value = exp.date || '';
  document.getElementById('exp-role').value = exp.role || '';
  document.getElementById('exp-desc').value = exp.description || '';
  document.getElementById('exp-form-title').textContent = '✏️ Modifier l\'étape';
  document.querySelector('[data-tab="experiences"]').click();
  document.getElementById('exp-company').scrollIntoView({ behavior: 'smooth' });
};

window.deleteExperience = (i) => {
  if (confirm(`Supprimer l'étape "${experiences[i].company}" ?`)) {
    experiences.splice(i, 1);
    renderExperiencesList();
    generalContent.experiences = experiences;
    saveContentToServer();
    toast('Étape supprimée.');
  }
};

function resetExperienceForm() {
  ['exp-id', 'exp-company', 'exp-location', 'exp-date', 'exp-role', 'exp-desc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('exp-region').value = 'quebec';
  document.getElementById('exp-form-title').textContent = '➕ Ajouter une étape';
}

document.getElementById('exp-add-btn')?.addEventListener('click', async () => {
  const company = document.getElementById('exp-company').value.trim();
  if (!company) { alert('Le nom de l\'entreprise est requis.'); return; }
  const id = document.getElementById('exp-id').value;
  const exp = {
    company,
    region: document.getElementById('exp-region').value,
    location: document.getElementById('exp-location').value.trim(),
    date: document.getElementById('exp-date').value.trim(),
    role: document.getElementById('exp-role').value.trim(),
    description: document.getElementById('exp-desc').value.trim()
  };
  if (id !== '') experiences[parseInt(id)] = exp;
  else experiences.push(exp);
  renderExperiencesList();
  generalContent.experiences = experiences;
  await saveContentToServer();
  resetExperienceForm();
});

document.getElementById('exp-new-btn')?.addEventListener('click', resetExperienceForm);
document.getElementById('save-experiences-btn')?.addEventListener('click', () => {
  generalContent.experiences = experiences;
  saveContentToServer();
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
  
  // Event photo & link fields
  const eventPhotoInput = document.getElementById('dist-event-photo');
  if (eventPhotoInput) eventPhotoInput.value = d.eventPhoto || '';
  const eventLinkInput = document.getElementById('dist-event-link');
  if (eventLinkInput) eventLinkInput.value = d.eventLink || '';
  const eventPhotoPreview = document.getElementById('dist-event-photo-preview');
  if (eventPhotoPreview) {
    if (d.eventPhoto) { eventPhotoPreview.src = d.eventPhoto; eventPhotoPreview.style.display = 'block'; }
    else { eventPhotoPreview.style.display = 'none'; }
  }
  
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
  ['dist-id','dist-year','dist-title','dist-desc','dist-image','dist-video','dist-gallery','dist-event-photo','dist-event-link'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('dist-type').value = 'award';
  const preview = document.getElementById('dist-image-preview');
  if (preview) { preview.src = ''; preview.style.display = 'none'; }
  const eventPhotoPreview = document.getElementById('dist-event-photo-preview');
  if (eventPhotoPreview) { eventPhotoPreview.src = ''; eventPhotoPreview.style.display = 'none'; }
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
    gallery: document.getElementById('dist-gallery').value.split('\n').map(s => s.trim()).filter(Boolean),
    eventPhoto: (document.getElementById('dist-event-photo')?.value || '').trim(),
    eventLink: (document.getElementById('dist-event-link')?.value || '').trim()
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

// ===== Security & Authentication =====
const AUTH_KEY = 'portfolio_admin_auth';
const CORRECT_HASH = '3c6b2a3f5c08024e078b0176e2a369342e806a9005b0aa0335b63c5dedd72e5d'; // Hash for Kaki0762*

async function hashPassword(passwd) {
  const encoder = new TextEncoder();
  const data = encoder.encode(passwd);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyAndUnlock() {
  const passwordInput = document.getElementById('admin-password');
  const errorEl = document.getElementById('lockscreen-error');
  if (!passwordInput) return;
  
  const passwd = passwordInput.value;
  const hashed = await hashPassword(passwd);
  
  if (hashed === CORRECT_HASH) {
    localStorage.setItem(AUTH_KEY, hashed);
    document.body.classList.remove('locked');
    const lockScreen = document.getElementById('lockscreen');
    if (lockScreen) lockScreen.style.display = 'none';
    
    // Complete page initialization after successful unlock
    await completeInit();
  } else {
    if (errorEl) errorEl.style.display = 'block';
    passwordInput.value = '';
    passwordInput.focus();
  }
}

async function completeInit() {
  await initContent();
  await initProjects();
  distinctions = generalContent.distinctions || [];
  renderDistinctionsList();
  experiences = generalContent.experiences || [];
  renderExperiencesList();
  resetProjectForm();
  resetExperienceForm();
  resetDistinctionForm();
}

// ===== Init =====
async function init() {
  // Bind lockscreen button and Enter key
  const unlockBtn = document.getElementById('unlock-btn');
  const passwordInput = document.getElementById('admin-password');
  
  unlockBtn?.addEventListener('click', verifyAndUnlock);
  passwordInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') verifyAndUnlock();
  });

  // Bind language selector
  const langSelect = document.getElementById('admin-lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', async () => {
      editingLang = langSelect.value;
      toast(`🌐 Passage à la langue d'édition : ${editingLang.toUpperCase()}`);
      await completeInit();
    });
  }
  
  // Bind GitHub token button
  updateGhTokenButtonUI();
  document.getElementById('gh-token-btn')?.addEventListener('click', async () => {
    const saved = await promptGhToken();
    if (saved) {
      toast('🔑 Token GitHub enregistré !');
      await completeInit();
    }
  });

  // Bind logout button
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
  });

  // Check stored auth session
  const storedHash = localStorage.getItem(AUTH_KEY);
  if (storedHash === CORRECT_HASH) {
    document.body.classList.remove('locked');
    const lockScreen = document.getElementById('lockscreen');
    if (lockScreen) lockScreen.style.display = 'none';
    await completeInit();
  } else {
    // If not unlocked, focus on password field
    setTimeout(() => passwordInput?.focus(), 100);
  }

  // Setup Projects UI elements
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
  setupImagePreview('dist-event-photo-file', 'dist-event-photo-preview', 'dist-event-photo');
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
