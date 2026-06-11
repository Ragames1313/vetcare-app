const API_BASE_URL = 'http://localhost:3000/api';
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

document.addEventListener('DOMContentLoaded', initApp);

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

function initApp() {
  const entity = document.body.dataset.entity;
  const view = document.body.dataset.view;

  if (entity === 'mascotas' && view === 'list') initMascotasList();
  if (entity === 'mascotas' && view === 'detail') initMascotaDetail();
  if (entity === 'mascotas' && view === 'create') initMascotaForm('create');
  if (entity === 'mascotas' && view === 'edit') initMascotaForm('edit');

  if (entity === 'citas' && view === 'list') initCitasList();
  if (entity === 'citas' && view === 'detail') initCitaDetail();
  if (entity === 'citas' && view === 'create') initCitaForm('create');
  if (entity === 'citas' && view === 'edit') initCitaForm('edit');
}

// API
async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload && payload.error ? payload.error : 'No se ha podido completar la operación.');
  }

  return payload;
}

// DOM
function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalize(value) {
  return String(value ?? '').trim();
}

function titleCase(value) {
  const text = normalize(value);
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

function getMessageArea() {
  let element = document.getElementById('page-message');

  if (element) return element;

  element = document.createElement('p');
  element.id = 'page-message';
  element.className = 'page-message';
  element.setAttribute('role', 'status');
  element.setAttribute('aria-live', 'polite');

  const anchor = qs('.page-heading, .detail-hero');
  if (anchor && anchor.parentNode) {
    anchor.insertAdjacentElement('afterend', element);
  }

  return element;
}

function setMessage(type, text) {
  const element = getMessageArea();

  if (!text) {
    element.hidden = true;
    element.textContent = '';
    element.className = 'page-message';
    return;
  }

  element.hidden = false;
  element.className = `page-message ${type}`;
  element.textContent = text;
}

function setBoxState(container, type, title, text, actionLabel = '', actionHref = '') {
  if (!container) return;

  container.innerHTML = `
    <div class="state-box ${type}">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
      ${actionLabel && actionHref ? `<a class="button primary" href="${actionHref}">${escapeHtml(actionLabel)}</a>` : ''}
    </div>
  `;
}

function setLoading(container, text) {
  setBoxState(container, 'loading', 'Cargando', text);
}

function setEmpty(container, title, text, actionLabel = '', actionHref = '') {
  setBoxState(container, 'empty', title, text, actionLabel, actionHref);
}

function getId() {
  const value = Number(new URLSearchParams(window.location.search).get('id'));
  return Number.isInteger(value) && value > 0 ? value : null;
}

function parseDateTime(value) {
  if (!value) return null;

  const date = new Date(String(value).replace(' ', 'T').replace('Z', ''));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatShortDate(value) {
  const date = parseDateTime(value);
  if (!date) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(date);
}

function formatDate(value) {
  const date = parseDateTime(value);
  if (!date) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

function formatTime(value) {
  const date = parseDateTime(value);
  if (!date) return 'Sin hora';

  return new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date);
}

function formatDateTime(value) {
  const date = parseDateTime(value);
  if (!date) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function toDateInputValue(value) {
  const date = parseDateTime(value);
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toDateTimeLocalValue(value) {
  const date = parseDateTime(value);
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toApiDateTime(value) {
  const text = normalize(value).replace('T', ' ');
  if (!text) return '';
  return text.length === 16 ? `${text}:00` : text;
}

function normalizeDateTimeForComparison(value) {
  const date = parseDateTime(value);
  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function toMinDateTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function isPastDateTime(value) {
  const date = parseDateTime(value);
  return date ? date < new Date() : false;
}

function initials(name) {
  const parts = normalize(name).split(' ').filter(Boolean);
  if (!parts.length) return 'VC';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function avatarClass(especie) {
  const text = normalize(especie).toLowerCase();
  if (text.includes('gato') || text.includes('felino')) return 'cat';
  if (text.includes('conejo') || text.includes('ave') || text.includes('pajaro')) return 'bird';
  return 'dog';
}

function citaStatusClass(estado) {
  const text = normalize(estado).toLowerCase();
  if (text === 'confirmada') return 'confirmed';
  if (text === 'finalizada') return 'finished';
  return 'pending';
}

function uniqueCount(items, field) {
  return new Set(items.map((item) => item[field]).filter(Boolean)).size;
}

function renderMascotaCard(mascota) {
  return `
    <article class="pet-card" data-id="${mascota.id_mascota}">
      <div class="pet-avatar ${avatarClass(mascota.especie)}" data-name="${escapeHtml(mascota.nombre)}">${escapeHtml(initials(mascota.nombre))}</div>
      <div class="pet-info">
        <h3>${escapeHtml(mascota.nombre)}</h3>
        <p>${escapeHtml(mascota.especie)}${normalize(mascota.raza) ? ` · ${escapeHtml(mascota.raza)}` : ''}${normalize(mascota.sexo) ? ` · ${escapeHtml(mascota.sexo)}` : ''}</p>
        <span>Dueño #${escapeHtml(mascota.id_dueno)}</span>
        ${normalize(mascota.observaciones) ? `<small class="card-note">${escapeHtml(mascota.observaciones)}</small>` : ''}
      </div>
      <div class="card-actions">
        <a class="button secondary" href="detalle.html?id=${mascota.id_mascota}">Ver</a>
        <a class="button ghost" href="editar.html?id=${mascota.id_mascota}">Editar</a>
        <button class="button danger js-delete-mascota" type="button" data-id="${mascota.id_mascota}">Eliminar</button>
      </div>
    </article>
  `;
}

function renderCitaCard(cita, mascotas = []) {
  const mascota = mascotas.find((item) => Number(item.id_mascota) === Number(cita.id_mascota));
  const mascotaLabel = mascota ? normalize(mascota.nombre) : `Mascota #${cita.id_mascota}`;

  return `
    <article class="appointment-card" data-id="${cita.id_cita}">
      <div class="appointment-date">
        <span>${escapeHtml(formatShortDate(cita.fecha_hora))}</span>
        <strong>${escapeHtml(formatTime(cita.fecha_hora))}</strong>
      </div>
      <div class="appointment-info">
        <h3>${escapeHtml(cita.motivo)}</h3>
        <p>${escapeHtml(mascotaLabel)} · Veterinario #${escapeHtml(cita.id_veterinario)}</p>
        <span class="status ${citaStatusClass(cita.estado)}">${escapeHtml(cita.estado)}</span>
        ${normalize(cita.observaciones) ? `<small class="card-note">${escapeHtml(cita.observaciones)}</small>` : ''}
      </div>
      <div class="card-actions">
        <a class="button secondary" href="detalle.html?id=${cita.id_cita}">Ver</a>
        <a class="button ghost" href="editar.html?id=${cita.id_cita}">Editar</a>
        <button class="button danger js-delete-cita" type="button" data-id="${cita.id_cita}">Eliminar</button>
      </div>
    </article>
  `;
}

function renderSummary(values) {
  qsa('.summary-value').forEach((element, index) => {
    if (values[index] !== undefined) {
      element.textContent = values[index];
    }
  });
}

function setNavTitle(entity, view, customLabel = '') {
  const title = qs('h1');
  const eyebrow = qs('.eyebrow');
  const description = qs('.heading-text');

  if (!title || !eyebrow || !description) return;

  if (view === 'list') {
    eyebrow.textContent = entity === 'citas' ? 'Agenda veterinaria' : 'Gestión de clínica veterinaria';
    title.textContent = entity === 'citas' ? 'Citas' : 'Mascotas';
    description.textContent = entity === 'citas'
      ? 'Listado real de atenciones programadas.'
      : 'Listado real de pacientes registrados en VetCare.';
    return;
  }

  if (view === 'create') {
    eyebrow.textContent = entity === 'citas' ? 'Alta de cita' : 'Alta de paciente';
    title.textContent = customLabel || (entity === 'citas' ? 'Nueva cita' : 'Nueva mascota');
    description.textContent = 'Formulario conectado con la API.';
    return;
  }

  if (view === 'edit') {
    eyebrow.textContent = entity === 'citas' ? 'Editar cita' : 'Editar paciente';
    title.textContent = customLabel || (entity === 'citas' ? 'Editar cita' : 'Editar mascota');
    description.textContent = entity === 'citas'
      ? 'Vista preparada para actualizar los datos de una cita.'
      : 'Vista preparada para actualizar los datos de una mascota.';
    return;
  }

  eyebrow.textContent = entity === 'citas' ? 'Ficha de cita' : 'Ficha de mascota';
  title.textContent = customLabel || (entity === 'citas' ? 'Detalle de cita' : 'Detalle de mascota');
  description.textContent = 'Información completa del registro seleccionado.';
}

function ensureDeleteButton(hero, className, label, onClick) {
  let button = qs(`.${className}`, hero);
  if (!button) {
    button = document.createElement('button');
    button.type = 'button';
    button.className = `button danger ${className}`;
    button.textContent = label;
    const primary = qs('.button.primary', hero);
    if (primary) {
      primary.insertAdjacentElement('afterend', button);
    } else {
      hero.appendChild(button);
    }
  }

  button.onclick = onClick;
}

function showListLoading(list, text) {
  list.innerHTML = `
    <div class="loading-state">
      <span class="loading-dot"></span>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

// Mascotas: listado
async function initMascotasList() {
  const list = qs('.pet-list');
  if (!list) return;

  setMessage('info', 'Cargando mascotas desde la API.');
  showListLoading(list, 'Cargando mascotas...');

  try {
    const mascotas = await apiRequest('/mascotas');
    let citas = [];

    try {
      citas = await apiRequest('/citas');
    } catch (error) {
      citas = [];
    }

    renderSummary([
      mascotas.length,
      uniqueCount(mascotas, 'id_dueno'),
      citas.filter((cita) => normalize(cita.estado).toLowerCase() === 'pendiente').length
    ]);

    if (!mascotas.length) {
      setEmpty(list, 'Todavía no hay mascotas', 'Crea la primera mascota para empezar a trabajar con la aplicación.', 'Nueva mascota', 'crear.html');
      setMessage('info', 'No hay mascotas registradas todavía.');
      return;
    }

    list.innerHTML = mascotas.map(renderMascotaCard).join('');
    qsa('.js-delete-mascota', list).forEach((button) => button.addEventListener('click', () => deleteMascota(button.dataset.id)));
    setMessage('success', 'Mascotas cargadas correctamente.');
  } catch (error) {
    setMessage('error', error.message);
    setEmpty(list, 'No se han podido cargar las mascotas', 'Revisa que el backend esté arrancado y vuelve a intentarlo.', 'Recargar', 'index.html');
  }
}

async function deleteMascota(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) return;

  if (!window.confirm('¿Seguro que quieres eliminar esta mascota?')) return;

  setMessage('info', 'Eliminando mascota...');

  try {
    await apiRequest(`/mascotas/${numericId}`, { method: 'DELETE' });
    setMessage('success', 'Mascota eliminada correctamente.');
    window.setTimeout(() => window.location.reload(), 700);
  } catch (error) {
    setMessage('error', error.message);
  }
}

// Mascotas: detalle
async function initMascotaDetail() {
  const hero = qs('.detail-hero');
  const panels = qsa('.detail-grid .content-panel');
  const dataPanel = panels[0];
  const notesPanel = panels[1];
  const editLink = qs('.detail-hero .button.primary');
  const id = getId();

  if (!hero || !dataPanel || !notesPanel || !editLink) return;

  if (!id) {
    setMessage('error', 'Falta el identificador de la mascota.');
    setEmpty(dataPanel, 'No se ha indicado una mascota', 'Vuelve al listado para abrir una ficha concreta.', 'Volver al listado', 'index.html');
    return;
  }

  setMessage('info', 'Cargando ficha de la mascota.');

  try {
    const mascota = await apiRequest(`/mascotas/${id}`);

    const avatar = qs('.pet-avatar', hero);
    if (avatar) {
      avatar.className = `pet-avatar large ${avatarClass(mascota.especie)}`;
      avatar.dataset.name = mascota.nombre;
      avatar.textContent = initials(mascota.nombre);
    }

    const title = qs('h1', hero);
    if (title) title.textContent = mascota.nombre;

    const heading = qs('.heading-text', hero);
    if (heading) heading.textContent = `${mascota.especie}${normalize(mascota.raza) ? ` · ${mascota.raza}` : ''}${normalize(mascota.sexo) ? ` · ${mascota.sexo}` : ''}`;

    editLink.href = `editar.html?id=${id}`;
    editLink.textContent = 'Editar ficha';

    ensureDeleteButton(hero, 'js-delete-mascota-detail', 'Eliminar', () => deleteMascotaFromDetail(id));

    const dataList = qs('.data-list', dataPanel);
    if (dataList) {
      dataList.innerHTML = `
        <div><dt>ID mascota</dt><dd>${escapeHtml(mascota.id_mascota)}</dd></div>
        <div><dt>ID dueño</dt><dd>${escapeHtml(mascota.id_dueno)}</dd></div>
        <div><dt>Fecha nacimiento</dt><dd>${escapeHtml(mascota.fecha_nacimiento ? formatDate(mascota.fecha_nacimiento) : 'Sin fecha')}</dd></div>
        <div><dt>Peso</dt><dd>${escapeHtml(mascota.peso !== null && mascota.peso !== undefined && mascota.peso !== '' ? `${mascota.peso} kg` : 'Sin peso')}</dd></div>
      `;
    }

    const noteText = qs('.note-text', notesPanel);
    if (noteText) {
      noteText.textContent = normalize(mascota.observaciones) || 'Sin observaciones.';
    }

    setMessage('success', 'Ficha de la mascota cargada correctamente.');
  } catch (error) {
    setMessage('error', error.message);
    setEmpty(dataPanel, 'No se ha podido cargar la mascota', 'La ficha no existe o el backend no está disponible.', 'Volver al listado', 'index.html');
  }
}

async function deleteMascotaFromDetail(id) {
  if (!window.confirm('¿Seguro que quieres eliminar esta mascota?')) return;

  setMessage('info', 'Eliminando mascota...');

  try {
    await apiRequest(`/mascotas/${id}`, { method: 'DELETE' });
    setMessage('success', 'Mascota eliminada correctamente. Volviendo al listado.');
    window.setTimeout(() => window.location.href = 'index.html', 700);
  } catch (error) {
    setMessage('error', error.message);
  }
}

// Mascotas: formulario
async function initMascotaForm(mode) {
  const form = qs('.pet-form');
  if (!form) return;

  const id = getId();
  const submit = qs('button[type="submit"]', form);
  const cancel = qs('.form-actions .button.ghost', form);
  const fields = {
    id_dueno: qs('input[name="id_dueno"]', form),
    nombre: qs('input[name="nombre"]', form),
    especie: qs('input[name="especie"]', form),
    raza: qs('input[name="raza"]', form),
    fecha_nacimiento: qs('input[name="fecha_nacimiento"]', form),
    sexo: qs('select[name="sexo"]', form),
    peso: qs('input[name="peso"]', form),
    observaciones: qs('textarea[name="observaciones"]', form)
  };

  if (mode === 'create' && cancel) cancel.href = 'index.html';
  if (mode === 'edit' && cancel) cancel.href = id ? `detalle.html?id=${id}` : 'index.html';

  if (mode === 'edit') {
    if (!id) {
      setMessage('error', 'Falta el identificador de la mascota a editar.');
      return;
    }

    setMessage('info', 'Cargando datos de la mascota.');

    try {
      const mascota = await apiRequest(`/mascotas/${id}`);
      fields.id_dueno.value = mascota.id_dueno ?? '';
      fields.nombre.value = mascota.nombre ?? '';
      fields.especie.value = mascota.especie ?? '';
      fields.raza.value = mascota.raza ?? '';
      fields.fecha_nacimiento.value = toDateInputValue(mascota.fecha_nacimiento);
      fields.sexo.value = normalize(mascota.sexo);
      fields.peso.value = mascota.peso ?? '';
      fields.observaciones.value = mascota.observaciones ?? '';
      setNavTitle('mascotas', 'edit', `Editar ${mascota.nombre}`);
      setMessage('info', 'Revisa los datos y guarda los cambios.');
    } catch (error) {
      setMessage('error', error.message);
      return;
    }
  }

  form.addEventListener('input', () => {
    if (submit) submit.disabled = !form.checkValidity();
  });

  if (submit) submit.disabled = !form.checkValidity();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      setMessage('error', 'Completa los campos obligatorios antes de guardar.');
      return;
    }

    const payload = {
      id_dueno: Number(fields.id_dueno.value),
      nombre: normalize(fields.nombre.value),
      especie: normalize(fields.especie.value),
      raza: normalize(fields.raza.value) || null,
      fecha_nacimiento: normalize(fields.fecha_nacimiento.value) || null,
      sexo: normalize(fields.sexo.value) || null,
      peso: normalize(fields.peso.value) === '' ? null : Number(fields.peso.value),
      observaciones: normalize(fields.observaciones.value) || null
    };

    if (!Number.isInteger(payload.id_dueno) || payload.id_dueno <= 0) {
      setMessage('error', 'El campo ID dueño debe ser un número válido.');
      return;
    }

    setMessage('info', mode === 'create' ? 'Guardando mascota...' : 'Actualizando mascota...');
    if (submit) submit.disabled = true;

    try {
      const saved = mode === 'create'
        ? await apiRequest('/mascotas', { method: 'POST', body: payload })
        : await apiRequest(`/mascotas/${id}`, { method: 'PUT', body: payload });

      setMessage('success', mode === 'create' ? 'Mascota creada correctamente.' : 'Mascota actualizada correctamente.');
      window.setTimeout(() => window.location.href = `detalle.html?id=${saved.id_mascota}`, 700);
    } catch (error) {
      setMessage('error', error.message);
      if (submit) submit.disabled = !form.checkValidity();
    }
  });
}

// Citas: listado
async function initCitasList() {
  const list = qs('.appointment-list');
  if (!list) return;

  setMessage('info', 'Cargando citas desde la API.');
  showListLoading(list, 'Cargando citas...');

  try {
    const citas = await apiRequest('/citas');
    let mascotas = [];

    try {
      mascotas = await apiRequest('/mascotas');
    } catch (error) {
      mascotas = [];
    }

    renderSummary([
      citas.length,
      citas.filter((cita) => normalize(cita.estado).toLowerCase() === 'pendiente').length,
      uniqueCount(citas, 'id_veterinario')
    ]);

    if (!citas.length) {
      setEmpty(list, 'Todavía no hay citas', 'Crea la primera cita para empezar a gestionar la agenda.', 'Nueva cita', 'crear.html');
      setMessage('info', 'No hay citas registradas todavía.');
      return;
    }

    list.innerHTML = citas.map((cita) => renderCitaCard(cita, mascotas)).join('');
    qsa('.js-delete-cita', list).forEach((button) => button.addEventListener('click', () => deleteCita(button.dataset.id)));
    setMessage('success', 'Citas cargadas correctamente.');
  } catch (error) {
    setMessage('error', error.message);
    setEmpty(list, 'No se han podido cargar las citas', 'Revisa que el backend esté arrancado y vuelve a intentarlo.', 'Recargar', 'index.html');
  }
}

async function deleteCita(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) return;

  if (!window.confirm('¿Seguro que quieres eliminar esta cita?')) return;

  setMessage('info', 'Eliminando cita...');

  try {
    await apiRequest(`/citas/${numericId}`, { method: 'DELETE' });
    setMessage('success', 'Cita eliminada correctamente.');
    window.setTimeout(() => window.location.reload(), 700);
  } catch (error) {
    setMessage('error', error.message);
  }
}

// Citas: detalle
async function initCitaDetail() {
  const hero = qs('.detail-hero');
  const panel = qs('.detail-grid .content-panel');
  const editLink = qs('.detail-hero .button.primary');
  const id = getId();

  if (!hero || !panel || !editLink) return;

  if (!id) {
    setMessage('error', 'Falta el identificador de la cita.');
    setEmpty(panel, 'No se ha indicado una cita', 'Vuelve al listado para abrir una ficha concreta.', 'Volver al listado', 'index.html');
    return;
  }

  setMessage('info', 'Cargando ficha de la cita.');

  try {
    const cita = await apiRequest(`/citas/${id}`);
    let mascota = null;

    try {
      mascota = await apiRequest(`/mascotas/${cita.id_mascota}`);
    } catch (error) {
      mascota = null;
    }

    const title = qs('h1', hero);
    if (title) title.textContent = normalize(cita.motivo) || 'Sin motivo';

    const heading = qs('.heading-text', hero);
    if (heading) heading.textContent = `${mascota ? normalize(mascota.nombre) : `Mascota #${cita.id_mascota}`} · Veterinario #${cita.id_veterinario}`;

    editLink.href = `editar.html?id=${id}`;
    editLink.textContent = 'Editar cita';

    const dateBox = qs('.appointment-date', hero);
    if (dateBox) {
      const dateLabel = qs('span', dateBox);
      const timeLabel = qs('strong', dateBox);
      if (dateLabel) dateLabel.textContent = formatShortDate(cita.fecha_hora);
      if (timeLabel) timeLabel.textContent = formatTime(cita.fecha_hora);
    }

    ensureDeleteButton(hero, 'js-delete-cita-detail', 'Eliminar', () => deleteCitaFromDetail(id));

    const dataList = qs('.data-list', panel);
    if (dataList) {
      dataList.innerHTML = `
        <div><dt>ID cita</dt><dd>${escapeHtml(cita.id_cita)}</dd></div>
        <div><dt>ID mascota</dt><dd>${escapeHtml(cita.id_mascota)}</dd></div>
        <div><dt>ID veterinario</dt><dd>${escapeHtml(cita.id_veterinario)}</dd></div>
        <div><dt>Fecha y hora</dt><dd>${escapeHtml(formatDateTime(cita.fecha_hora))}</dd></div>
        <div><dt>Estado</dt><dd>${escapeHtml(cita.estado)}</dd></div>
      `;
    }

    const noteText = qs('.note-text', panel);
    if (noteText) {
      noteText.textContent = normalize(cita.observaciones) || 'Sin observaciones.';
    }

    setMessage('success', 'Ficha de la cita cargada correctamente.');
  } catch (error) {
    setMessage('error', error.message);
    setEmpty(panel, 'No se ha podido cargar la cita', 'La ficha no existe o el backend no está disponible.', 'Volver al listado', 'index.html');
  }
}

async function deleteCitaFromDetail(id) {
  if (!window.confirm('¿Seguro que quieres eliminar esta cita?')) return;

  setMessage('info', 'Eliminando cita...');

  try {
    await apiRequest(`/citas/${id}`, { method: 'DELETE' });
    setMessage('success', 'Cita eliminada correctamente. Volviendo al listado.');
    window.setTimeout(() => window.location.href = 'index.html', 700);
  } catch (error) {
    setMessage('error', error.message);
  }
}

// Citas: formulario
async function initCitaForm(mode) {
  const form = qs('.pet-form');
  if (!form) return;

  const id = getId();
  const submit = qs('button[type="submit"]', form);
  const cancel = qs('.form-actions .button.ghost', form);
  const fields = {
    id_mascota: qs('input[name="id_mascota"]', form),
    id_veterinario: qs('input[name="id_veterinario"]', form),
    fecha_hora: qs('input[name="fecha_hora"]', form),
    motivo: qs('input[name="motivo"]', form),
    estado: qs('select[name="estado"]', form),
    observaciones: qs('textarea[name="observaciones"]', form)
  };

  if (fields.fecha_hora) fields.fecha_hora.min = toMinDateTime();
  if (mode === 'create' && cancel) cancel.href = 'index.html';
  if (mode === 'edit' && cancel) cancel.href = id ? `detalle.html?id=${id}` : 'index.html';

  let existingCitas = [];
  try {
    existingCitas = await apiRequest('/citas');
  } catch (error) {
    existingCitas = [];
  }

  if (mode === 'edit') {
    if (!id) {
      setMessage('error', 'Falta el identificador de la cita a editar.');
      return;
    }

    setMessage('info', 'Cargando datos de la cita.');

    try {
      const cita = await apiRequest(`/citas/${id}`);
      fields.id_mascota.value = cita.id_mascota ?? '';
      fields.id_veterinario.value = cita.id_veterinario ?? '';
      fields.fecha_hora.value = toDateTimeLocalValue(cita.fecha_hora);
      fields.motivo.value = cita.motivo ?? '';
      fields.estado.value = normalize(cita.estado) || 'Pendiente';
      fields.observaciones.value = cita.observaciones ?? '';
      setNavTitle('citas', 'edit', `Editar ${cita.motivo}`);
      setMessage('info', 'Revisa los datos y guarda los cambios.');
    } catch (error) {
      setMessage('error', error.message);
      return;
    }
  }

  const validate = () => {
    const payload = buildCitaPayload(fields);
    const issue = payload ? getCitaBusinessIssue(payload, existingCitas, mode === 'edit' ? id : null) : '';

    if (payload && issue) {
      setMessage('error', issue);
    } else if (payload) {
      setMessage('info', mode === 'edit' ? 'Revisa los datos y guarda los cambios.' : 'Completa los datos y guarda la cita.');
    } else {
      setMessage('info', 'Completa los datos de la cita.');
    }

    if (submit) submit.disabled = !form.checkValidity() || Boolean(issue);
  };

  form.addEventListener('input', validate);
  validate();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = buildCitaPayload(fields);
    if (!payload) {
      setMessage('error', 'Completa los campos obligatorios antes de guardar.');
      return;
    }

    const issue = getCitaBusinessIssue(payload, existingCitas, mode === 'edit' ? id : null);
    if (issue) {
      setMessage('error', issue);
      return;
    }

    if (submit) submit.disabled = true;
    setMessage('info', mode === 'create' ? 'Guardando cita...' : 'Actualizando cita...');

    try {
      const saved = mode === 'create'
        ? await apiRequest('/citas', { method: 'POST', body: payload })
        : await apiRequest(`/citas/${id}`, { method: 'PUT', body: payload });

      setMessage('success', mode === 'create' ? 'Cita creada correctamente.' : 'Cita actualizada correctamente.');
      window.setTimeout(() => window.location.href = `detalle.html?id=${saved.id_cita}`, 700);
    } catch (error) {
      setMessage('error', error.message);
      if (submit) submit.disabled = !form.checkValidity();
    }
  });
}

function buildCitaPayload(fields) {
  const idMascota = Number(fields.id_mascota.value);
  const idVeterinario = Number(fields.id_veterinario.value);
  const fechaHora = toApiDateTime(fields.fecha_hora.value);
  const motivo = normalize(fields.motivo.value);
  const estado = normalize(fields.estado.value);

  if (!Number.isInteger(idMascota) || idMascota <= 0) return null;
  if (!Number.isInteger(idVeterinario) || idVeterinario <= 0) return null;
  if (!fechaHora || !motivo || !estado) return null;

  return {
    id_mascota: idMascota,
    id_veterinario: idVeterinario,
    fecha_hora: fechaHora,
    motivo,
    estado,
    observaciones: normalize(fields.observaciones.value) || null
  };
}

function getCitaBusinessIssue(payload, existingCitas, currentId = null) {
  if (isPastDateTime(payload.fecha_hora)) {
    return 'No se puede crear o modificar una cita en una fecha pasada.';
  }

  const duplicate = existingCitas.find((cita) => {
    const sameVet = Number(cita.id_veterinario) === Number(payload.id_veterinario);
    const sameDate = normalizeDateTimeForComparison(cita.fecha_hora) === payload.fecha_hora;
    const isCurrent = currentId !== null && Number(cita.id_cita) === Number(currentId);
    return sameVet && sameDate && !isCurrent;
  });

  if (duplicate) {
    return 'El veterinario ya tiene una cita asignada en esa fecha y hora.';
  }

  return '';
}

function populateMascotaForm(fields, mascota) {
  fields.id_dueno.value = mascota.id_dueno ?? '';
  fields.nombre.value = mascota.nombre ?? '';
  fields.especie.value = mascota.especie ?? '';
  fields.raza.value = mascota.raza ?? '';
  fields.fecha_nacimiento.value = toDateInputValue(mascota.fecha_nacimiento);
  fields.sexo.value = normalize(mascota.sexo);
  fields.peso.value = mascota.peso ?? '';
  fields.observaciones.value = mascota.observaciones ?? '';
}

function populateCitaForm(fields, cita) {
  fields.id_mascota.value = cita.id_mascota ?? '';
  fields.id_veterinario.value = cita.id_veterinario ?? '';
  fields.fecha_hora.value = toDateTimeLocalValue(cita.fecha_hora);
  fields.motivo.value = cita.motivo ?? '';
  fields.estado.value = normalize(cita.estado) || 'Pendiente';
  fields.observaciones.value = cita.observaciones ?? '';
}

