(() => {
'use strict';

/* ---------- datos de contacto (cámbialos aquí) ---------- */
const WHATSAPP = ''; // número con indicativo, sin + ni espacios. Ej: '573001234567'
const wa = (txt) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const backOut = (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
const FINE = matchMedia('(pointer:fine)').matches;

/* ---------- piezas (fotos recortadas en img/) ---------- */
const IMG = {};
for (const k of ['sapo', 'ciervo', 'diablillo', 'amanita', 'mascara', 'mano', 'cabra', 'manitos', 'orca', 'hada']) {
  const im = new Image(); im.src = `img/${k}.webp`; im.decoding = 'async'; IMG[k] = im;
}

/* ---------- contenido ---------- */
const PIECES = [
  { key: 'sapo', short: 'Sapo punk', name: 'Sapo punk', origin: 'Serie sapos de barrio',
    desc: 'Chaqueta de cuero con taches, botas gastadas y una taza dorada en la mano. Se sienta en el borde de la mesa como si el parche fuera suyo.',
    stats: [['Detalle', 5], ['Brillo', 4], ['Rareza', 4], ['Actitud', 5]], ideal: 'Escritorios con actitud y bordes de repisa.' },
  { key: 'ciervo', short: 'Ciervo', name: 'Ciervo carmesí', origin: 'Criatura del páramo',
    desc: 'Cuerpo oscuro y brillante, astas doradas y una cara roja escondida en la capucha. Tierno e inquietante al mismo tiempo.',
    stats: [['Detalle', 4], ['Brillo', 5], ['Rareza', 5], ['Actitud', 3]], ideal: 'Repisas con plantas y luz cálida.' },
  { key: 'diablillo', short: 'Diablillo', name: 'Diablillo dorado', origin: 'Diablito de feria',
    desc: 'Flaco, de piernas largas y cara de luna dorada. Lleva la cola enroscada entre los pies y mira como si supiera un secreto.',
    stats: [['Detalle', 5], ['Brillo', 5], ['Rareza', 4], ['Actitud', 4]], ideal: 'Coleccionistas de lo raro y lo elegante.' },
  { key: 'amanita', short: 'Amanita', name: 'Amanita andante', origin: 'Hongo con piernas',
    desc: 'Sombrero rojo con pecas blancas y un tallo que decidió salir a caminar. Textura de corteza y acabado mate.',
    stats: [['Detalle', 4], ['Brillo', 2], ['Rareza', 4], ['Actitud', 4]], ideal: 'Mesas de noche y amantes del bosque.' },
  { key: 'mascara', size: 0.85, short: 'Máscara', name: 'Máscara de fuego', origin: 'Máscara ritual',
    desc: 'Rojo encendido con destellos dorados, cuernos torcidos y cinco ojos plateados que te devuelven la mirada.',
    stats: [['Detalle', 4], ['Brillo', 5], ['Rareza', 5], ['Actitud', 5]], ideal: 'Paredes con carácter y altares personales.' },
  { key: 'hada', short: 'Hada', name: 'Hada de papel', origin: 'En proceso · próxima pieza',
    desc: 'Un esqueleto de alambre vestido de papel, con cuatro alas abiertas y una varita en la mano. Todavía está en el taller, esperando color y barniz.',
    stats: [['Detalle', 3], ['Brillo', 1], ['Rareza', 5], ['Actitud', 4]], ideal: 'Quien quiera seguirle el proceso desde el principio.' },
];

const STEPS = [
  { key: 'hada', tab: 'Estructura', word: 'ALMA', title: 'Estructura', pct: 15, bg: '#2f3a4a', theme: 'dark',
    desc: 'Primero va el esqueleto: alambre para la pose y papel para darle cuerpo. Aquí se decide cómo se va a parar la pieza.' },
  { key: 'mano', tab: 'Modelado', word: 'FORMA', title: 'Modelado', pct: 30, bg: '#efe6d8', theme: 'light',
    desc: 'Todo se modela a mano, sin moldes: dedo a dedo, nudillo a nudillo. Por eso ninguna pieza sale igual a otra.' },
  { key: 'amanita', tab: 'Textura', word: 'PIEL', title: 'Textura', pct: 55, bg: '#f3cfa2', theme: 'light',
    desc: 'Con herramientas pequeñas se marcan vetas, poros y pliegues. Es lo que hace que la pieza se sienta viva en la mano.' },
  { key: 'cabra', tab: 'Pintura', word: 'COLOR', title: 'Pintura', pct: 80, bg: '#ffd84d', theme: 'light',
    desc: 'Capas finas de pintura, de la base a los detalles: los ojos rojos, la nariz, los cuernos. Aquí aparece la personalidad.' },
  { key: 'diablillo', tab: 'Barniz', word: 'BRILLO', title: 'Barniz', pct: 100, bg: '#161b33', theme: 'dark',
    desc: 'La última capa sella todo y le da ese brillo de caramelo. La pieza queda lista para viajar a su nueva casa.' },
];

const OPTS = {
  tipo: [['figura', 'Figura'], ['colgante', 'Colgante'], ['aretes', 'Aretes'], ['llavero', 'Llavero']],
  paleta: [['verde', 'verde sapo', '#2f9e44'], ['rojo', 'rojo fuego', '#d2401f'], ['dorado', 'dorado', '#d9a520'], ['negro', 'negro brillante', '#2a2522'], ['hueso', 'blanco hueso', '#efe6d6'], ['vino', 'vinotinto', '#7b1e2b']],
  acabado: [['brillante', 'Brillante'], ['mate', 'Mate'], ['metal', 'Metalizado']],
  tamano: [['mini', 'Mini'], ['mediano', 'Mediano'], ['grande', 'Grande']],
};
const TIPO_IMG = { figura: 'sapo', colgante: 'cabra', aretes: 'manitos', llavero: 'orca' };
const TIPO_TXT = { figura: 'una figura de escritorio', colgante: 'un colgante', aretes: 'un par de aretes', llavero: 'un llavero' };
const TAM_SCALE = { mini: 0.7, mediano: 0.85, grande: 1 };
const ACABADO_FX = { brillante: 'contrast(1.06) saturate(1.08)', mate: 'saturate(.8) contrast(.92) brightness(1.04)', metal: 'sepia(.3) saturate(1.45) contrast(1.12) brightness(1.04)' };

const SHOP = [
  { key: 'manitos', name: 'Manitos rock', type: 'Aretes', meta: 'Par único', tags: ['Uñas negras', 'Con argolla', 'Livianos'], tint: '#e8e4dc',
    text: 'Dos manos haciendo los cuernos del rock, con uñas negras y argollas para colgar. Sirven para el concierto y para la oficina.' },
  { key: 'cabra', name: 'Cabrita', type: 'Colgante', meta: 'Pieza única', tags: ['Ojos rojos', 'Con argolla'], tint: '#f3d9d4',
    text: 'Una cabrita blanca con cuernos negros y mirada de travesura. Cuelga de una argolla metálica, lista para collar o llavero.' },
  { key: 'orca', name: 'Orca vino', type: 'Colgante', meta: 'Pieza única', tags: ['Cordón incluido', 'Mate'], tint: '#d7dde6',
    text: 'Una orca vinotinto con sus manchas blancas, colgada de un cordón trenzado. Pequeña, liviana y con mucho carácter.' },
];

const SECTION_BG = { inicio: ['#f2ebe1', 'light'], coleccion: ['#1d1916', 'dark'], encarga: ['#e6ece2', 'light'], tienda: ['#f6d58e', 'light'] };
const FIT = { inicio: 2.4, coleccion: 1.15, proceso: 1.2, encarga: 1.25, tienda: 1.5 };
const crea = { tipo: 'figura', paleta: 'verde', acabado: 'brillante', tamano: 'grande' };

/* ---------- secciones y scroll ---------- */
const secs = $$('.sec').map((el) => ({ el, id: el.id, steps: +el.dataset.steps, panel: $(`.panel[data-for="${el.id}"]`), back: $(`.back[data-for="${el.id}"]`) }));
for (const s of secs) {
  s.el.style.setProperty('--steps', s.steps);
  s.anchor = $('.anchor', s.panel);
  for (let i = 0; i < s.steps; i++) {
    const m = document.createElement('div');
    m.className = 'snap'; m.style.top = `calc(${i} * 100svh)`;
    s.el.appendChild(m);
  }
}
const byId = (id) => secs.find((s) => s.id === id);
const unit = () => secs[0].el.offsetHeight || innerHeight;
const snaps = () => secs.flatMap((s) => Array.from({ length: s.steps }, (_, i) => s.el.offsetTop + i * unit()));
function goTo(id, step = 0, smooth = true) {
  const s = byId(id);
  if (s) window.scrollTo({ top: s.el.offsetTop + clamp(step, 0, s.steps - 1) * unit(), behavior: smooth ? 'smooth' : 'auto' });
}
function readState() {
  const u = unit(), y = scrollY + u / 2;
  let s = secs[0];
  for (const x of secs) if (y >= x.el.offsetTop && x.el.offsetHeight) s = x;
  return { s, step: clamp(Math.round((scrollY - s.el.offsetTop) / u) || 0, 0, s.steps - 1) };
}
function nearestSnap() {
  const list = snaps();
  let i = 0;
  list.forEach((p, j) => { if (Math.abs(p - scrollY) < Math.abs(list[i] - scrollY)) i = j; });
  return { list, i };
}
$('#up').addEventListener('click', () => { const { list, i } = nearestSnap(); if (i > 0) scrollTo({ top: list[i - 1], behavior: 'smooth' }); });
$('#down').addEventListener('click', () => { const { list, i } = nearestSnap(); if (i < list.length - 1) scrollTo({ top: list[i + 1], behavior: 'smooth' }); });
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input') || !$('#modal').hidden) return;
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); $('#down').click(); }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); $('#up').click(); }
});
$$('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); goTo(a.dataset.go); }));

/* ---------- sonido: golpecito de barro y tintineo de cerámica ---------- */
let actx = null, soundOn = true;
const ac = () => {
  if (!soundOn) return null;
  try { actx ||= new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { return null; }
  return actx;
};
function thud() {
  const c = ac(); if (!c) return;
  const t = c.currentTime, o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.25);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.4);
  const len = 0.08, buf = c.createBuffer(1, c.sampleRate * len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
  const n = c.createBufferSource(), f = c.createBiquadFilter(), ng = c.createGain();
  n.buffer = buf; f.type = 'lowpass'; f.frequency.value = 900; ng.gain.value = 0.35;
  n.connect(f).connect(ng).connect(c.destination); n.start(t);
}
function clink() {
  const c = ac(); if (!c) return;
  const t = c.currentTime, p = 0.92 + Math.random() * 0.2;
  for (const [fr, amp, dec] of [[1320, 0.16, 0.9], [2970, 0.07, 0.5], [4410, 0.035, 0.3]]) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = fr * p;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(amp, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dec + 0.05);
  }
}
$('#sound').addEventListener('click', (e) => {
  soundOn = !soundOn; e.currentTarget.setAttribute('aria-pressed', soundOn);
  if (soundOn) clink();
});

/* ---------- colección ---------- */
const rDots = $('#rDots');
PIECES.forEach((b, i) => {
  const bt = document.createElement('button');
  bt.textContent = b.short; bt.addEventListener('click', () => goTo('coleccion', i));
  rDots.appendChild(bt);
});
let rIdx = -1;
function showPiece(i) {
  if (i === rIdx) return;
  rIdx = i;
  const b = PIECES[i];
  $('#rIdx').textContent = `0${i + 1} / 0${PIECES.length}`;
  $('#rName').textContent = b.name; $('#rOrigin').textContent = b.origin; $('#rDesc').textContent = b.desc; $('#rIdeal').textContent = b.ideal;
  $('#rStats').innerHTML = b.stats.map(([k, v]) => `<li>${k}<div><i style="transform:scaleX(0)" data-v="${v / 5}"></i></div></li>`).join('');
  requestAnimationFrame(() => requestAnimationFrame(() => $$('#rStats i').forEach((el) => { el.style.transform = `scaleX(${el.dataset.v})`; })));
  $$('button', rDots).forEach((bt, j) => bt.classList.toggle('on', j === i));
  const act = rDots.children[i];
  if (act && rDots.scrollWidth > rDots.clientWidth) rDots.scrollTo({ left: act.offsetLeft - (rDots.clientWidth - act.offsetWidth) / 2, behavior: 'smooth' });
  for (const el of [$('.r-name'), $('#rOrigin'), $('#rDesc'), $('.r-right')]) { el.classList.remove('swap-in'); void el.offsetWidth; el.classList.add('swap-in'); }
}

/* ---------- proceso ---------- */
const mList = $('#mList');
STEPS.forEach((m, i) => {
  const li = document.createElement('li');
  li.textContent = m.tab; li.addEventListener('click', () => goTo('proceso', i));
  mList.appendChild(li);
});
let mIdx = -1, wordTimer;
function showStep(i) {
  if (i === mIdx) return;
  mIdx = i;
  const m = STEPS[i];
  $('#mStep').textContent = `0${i + 1} / 0${STEPS.length}`;
  $('#mTitle').textContent = m.title; $('#mDesc').textContent = m.desc;
  $('#gVal').style.strokeDashoffset = 100 - m.pct;
  countTo($('#gNum'), m.pct);
  $$('li', mList).forEach((li, j) => li.classList.toggle('on', j === i));
  $('#zzz').classList.toggle('on', i === STEPS.length - 1);
  const w = $('#moodWord');
  w.classList.add('swap'); clearTimeout(wordTimer);
  wordTimer = setTimeout(() => { w.textContent = m.word; w.classList.remove('swap'); }, 220);
  for (const el of [$('#mTitle'), $('#mDesc')]) { el.classList.remove('swap-in'); void el.offsetWidth; el.classList.add('swap-in'); }
}
function countTo(el, to) {
  const from = parseInt(el.textContent, 10) || 0, t0 = performance.now();
  const step = (n) => { const k = Math.min(1, (n - t0) / 900); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))) + '%'; if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ---------- encarga la tuya ---------- */
for (const [opt, list] of Object.entries(OPTS)) {
  const box = $(`[data-opt="${opt}"]`);
  for (const [val, label, color] of list) {
    const b = document.createElement('button');
    b.dataset.val = val; b.setAttribute('aria-label', label);
    if (opt === 'paleta') b.style.setProperty('--c', color);
    else b.textContent = label;
    b.addEventListener('click', () => { crea[opt] = val; syncCrea(); clink(); bubble(); });
    box.appendChild(b);
  }
}
const opt = (o, v) => OPTS[o].find((x) => x[0] === v);
function summary() {
  const name = $('#catName').value.trim() || 'Bicho';
  return `${name} será ${TIPO_TXT[crea.tipo]} tamaño ${opt('tamano', crea.tamano)[1].toLowerCase()}, con paleta ${opt('paleta', crea.paleta)[1]} y acabado ${opt('acabado', crea.acabado)[1].toLowerCase()}.`;
}
function syncCrea() {
  for (const o of Object.keys(OPTS)) $$(`[data-opt="${o}"] button`).forEach((b) => b.classList.toggle('on', b.dataset.val === crea[o]));
  const s = summary();
  $('#cSum').textContent = s;
  $('#cOrder').href = wa(`Hola, quiero encargar una pieza: ${s}`);
  $('#halo').style.setProperty('--halo', opt('paleta', crea.paleta)[2]);
  if (activeSec && activeSec.id === 'encarga') want = wantFor(activeSec, 0);
}
$('#catName').addEventListener('input', syncCrea);
$('#cRandom').addEventListener('click', () => {
  for (const [o, list] of Object.entries(OPTS)) crea[o] = list[(Math.random() * list.length) | 0][0];
  syncCrea(); clink(); bubble('¡Nueva pieza!');
});
let bubbleT;
function bubble(txt = '¡Hola!') {
  const b = $('#bubble');
  b.textContent = txt; b.classList.add('on');
  clearTimeout(bubbleT); bubbleT = setTimeout(() => b.classList.remove('on'), 1300);
}

/* ---------- tienda ---------- */
$('#cards').innerHTML = SHOP.map((c, i) => `
  <button class="card" data-i="${i}">
    <img src="img/${c.key}.webp" alt="${c.name} (${c.type.toLowerCase()})" style="--tint:${c.tint}">
    <div><h3>${c.name}</h3><p>${c.type} &middot; ${c.meta}</p><ul>${c.tags.map((t) => `<li>${t}</li>`).join('')}</ul></div>
  </button>`).join('');
$$('.card').forEach((card) => card.addEventListener('click', () => {
  const c = SHOP[+card.dataset.i];
  $('#mdImg').src = `img/${c.key}.webp`; $('#mdImg').alt = c.name; $('#mdImg').style.setProperty('--tint', c.tint);
  $('#mdName').textContent = c.name; $('#mdMeta').textContent = `${c.type} · ${c.meta} · ${c.tags.join(' · ')}`;
  $('#mdText').textContent = c.text;
  $('#mdCta').href = wa(`Hola, me interesa la pieza "${c.name}" (${c.type.toLowerCase()}). ¿Sigue disponible?`);
  $('#modal').hidden = false; $('#mdClose').focus(); clink();
}));
const closeModal = () => { $('#modal').hidden = true; };
$('#mdClose').addEventListener('click', closeModal);
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
$('#sub').addEventListener('submit', (e) => { e.preventDefault(); $('.sub-row').style.display = 'none'; $('#subOk').hidden = false; });

/* ---------- escenario: la pieza que viaja entre secciones ---------- */
const piece = $('#piece'), shadow = $('#shadow'), halo = $('#halo');
const look = { yaw: 0, pitch: 0 }, lookT = { yaw: 0, pitch: 0 };
const box = { x: innerWidth / 2, y: innerHeight * 0.8, w: 0, h: 0 };
let want = null, curKey = null, grow = 0, placed = false, t = 0, last = performance.now();
let activeSec = null, activeStep = -1, jump = 0, jumpV = 0, happy = 0, spinY = 0;
const ptr = { x: innerWidth / 2, y: innerHeight / 2, moved: -10 };

function wantFor(s, step) {
  if (s.id === 'coleccion') return { key: PIECES[step].key, sec: s, scale: PIECES[step].size };
  if (s.id === 'proceso') return { key: STEPS[step].key, sec: s };
  if (s.id === 'encarga') return { key: TIPO_IMG[crea.tipo], sec: s, scale: TAM_SCALE[crea.tamano], fx: ACABADO_FX[crea.acabado] };
  if (s.id === 'tienda') return { key: 'ciervo', sec: s };
  return { key: 'sapo', sec: s };
}

function applyState({ s, step }) {
  const changed = s !== activeSec;
  activeSec = s; activeStep = step;
  if (changed) {
    for (const x of secs) { x.panel.classList.toggle('on', x === s); x.back?.classList.toggle('on', x === s); }
    $$('.nav a').forEach((a) => a.classList.toggle('on', a.dataset.go === s.id));
  }
  let bg = SECTION_BG[s.id];
  if (s.id === 'coleccion') showPiece(step);
  if (s.id === 'proceso') { showStep(step); bg = [STEPS[step].bg, STEPS[step].theme]; }
  want = wantFor(s, step);
  document.body.style.backgroundColor = bg[0];
  document.body.dataset.theme = bg[1];
  $('meta[name=theme-color]').content = bg[0];
  $$('.sw').forEach((el) => el.style.setProperty('--bgc', bg[0]));
  $('#laser').classList.toggle('on', FINE && s.id === 'inicio');
  halo.classList.toggle('on', s.id === 'encarga');
  const { list, i } = nearestSnap();
  $('#up').disabled = i === 0; $('#down').disabled = i === list.length - 1;
}

function targetBox(w) {
  const r = w.sec.anchor.getBoundingClientRect(), im = IMG[w.key];
  const nw = im.naturalWidth || 1, nh = im.naturalHeight || 1;
  const fit = innerWidth <= 760 || innerWidth < innerHeight ? 1 : FIT[w.sec.id];
  const sc = Math.min((r.width * fit) / nw, r.height / nh, 1.6) * (w.scale || 1);
  return { x: r.left + r.width / 2, y: r.bottom, w: nw * sc, h: nh * sc, r };
}

function tick(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now; t += dt;
  const st = readState();
  if (st.s !== activeSec || st.step !== activeStep) applyState(st);

  const ready = IMG[want.key].complete && IMG[want.key].naturalWidth;
  if (want.key !== curKey) { grow = Math.max(0, grow - dt * 4.5); if (grow === 0 && ready) { piece.src = IMG[want.key].src; curKey = want.key; const nb = targetBox(want); box.w = nb.w; box.h = nb.h; } }
  else grow = Math.min(1, grow + dt * 2.2);

  // salto con rebote
  jumpV -= dt * 2600; jump = Math.max(0, jump + jumpV * dt);
  if (jump === 0) jumpV = 0;
  happy = Math.max(0, happy - dt * 0.8);

  const tracking = (activeSec.id === 'inicio' || activeSec.id === 'encarga') && t - ptr.moved < 6;
  const tg = curKey ? targetBox({ ...want, key: curKey }) : null;
  if (tracking && tg) {
    lookT.yaw = clamp((ptr.x - tg.x) / innerWidth * 2.2, -0.75, 0.75);
    lookT.pitch = clamp((ptr.y - (tg.y - tg.h * 0.6)) / innerHeight * 1.6, -0.45, 0.5);
  } else {
    lookT.yaw = Math.sin(t * 0.37) * 0.35 + Math.sin(t * 0.13) * 0.2;
    lookT.pitch = Math.sin(t * 0.29) * 0.1;
  }
  const lk = 1 - Math.exp(-dt * 6);
  for (const k in look) look[k] += (lookT[k] - look[k]) * lk;

  if (tg) {
    const k = placed ? 1 - Math.exp(-dt * 5) : 1;
    for (const p of ['x', 'y', 'w', 'h']) box[p] += (tg[p] - box[p]) * k;
    placed = true;
    const s = Math.max(0.001, grow < 1 && want.key === curKey ? backOut(grow) : grow);
    const id = activeSec.id;
    const yaw = id === 'coleccion' ? Math.sin(t * 0.45) * 0.55
      : id === 'proceso' ? -0.42 + Math.sin(t * 0.3) * 0.08
      : id === 'tienda' ? -0.55
      : look.yaw * 0.9 + Math.sin(t * 0.25) * 0.06;
    spinY += (yaw - spinY) * (1 - Math.exp(-dt * 3));
    const rotY = spinY * 22, rotX = -look.pitch * 12 + 3;
    const bob = Math.sin(t * 1.6) * box.h * 0.012;
    const wig = Math.sin(t * 22) * 6 * happy;
    piece.style.width = box.w + 'px';
    piece.style.transform = `translate3d(${box.x - box.w / 2}px,${box.y - box.h - jump + bob}px,0) perspective(1000px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotate(${wig}deg) scale(${s})`;
    piece.style.filter = `${want.fx || 'none'} drop-shadow(0 ${10 + jump * 0.1}px 18px rgba(0,0,0,.28))`.replace('none ', '');
    const sw = box.w * 0.78 * s * (1 - Math.min(jump, 160) / 400);
    shadow.style.transform = `translate3d(${box.x - sw / 2}px,${box.y - 12}px,0)`;
    shadow.style.width = sw + 'px';
    shadow.style.opacity = (0.55 - Math.min(jump, 160) / 500) * Math.min(1, s);
    const hs = Math.max(box.w, box.h) * 1.5;
    halo.style.width = halo.style.height = hs + 'px';
    halo.style.transform = `translate3d(${box.x - hs / 2}px,${box.y - box.h / 2 - hs / 2}px,0) scale(${0.9 + Math.sin(t * 1.2) * 0.04})`;
  }
  requestAnimationFrame(tick);
}

/* ---------- puntero: láser, huellas, saludos ---------- */
const laser = $('#laser'), fxBox = $('#fx');
let lastPaw = null, pawSide = 1;
addEventListener('pointermove', (e) => {
  ptr.x = e.clientX; ptr.y = e.clientY; ptr.moved = t;
  laser.classList.add('ready');
  laser.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  if (!FINE || e.pointerType !== 'mouse') return;
  if (!lastPaw) { lastPaw = { x: e.clientX, y: e.clientY }; return; }
  const dx = e.clientX - lastPaw.x, dy = e.clientY - lastPaw.y, d = Math.hypot(dx, dy);
  if (d < 70) return;
  const a = Math.atan2(dy, dx), nx = -Math.sin(a) * 9 * pawSide, ny = Math.cos(a) * 9 * pawSide;
  pawSide *= -1; lastPaw = { x: e.clientX, y: e.clientY };
  if (activeSec?.id === 'inicio') return;
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  p.setAttribute('class', 'paw'); p.innerHTML = '<use href="#i-paw"/>';
  p.style.left = e.clientX + nx + 'px'; p.style.top = e.clientY + ny + 'px';
  p.style.transform = `rotate(${a + Math.PI / 2}rad)`;
  fxBox.appendChild(p); setTimeout(() => p.remove(), 1400);
}, { passive: true });

function hearts(x, y) {
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('span');
    h.className = 'heart'; h.textContent = '♥';
    h.style.left = x + (Math.random() - 0.5) * 40 + 'px'; h.style.top = y - 10 + 'px';
    h.style.setProperty('--dx', (Math.random() - 0.5) * 120 + 'px'); h.style.setProperty('--r', (Math.random() - 0.5) * 50 + 'deg');
    h.style.animationDelay = i * 0.07 + 's'; h.style.fontSize = 16 + Math.random() * 16 + 'px';
    fxBox.appendChild(h); setTimeout(() => h.remove(), 1800);
  }
}
addEventListener('pointerup', (e) => {
  const id = activeSec?.id;
  if ((id !== 'inicio' && id !== 'encarga') || !$('#modal').hidden) return;
  if (e.target.closest('a,button,input,label,.c-panel,.c-card,.hdr')) return;
  ptr.x = e.clientX; ptr.y = e.clientY; ptr.moved = t;
  const onPiece = e.clientX > box.x - box.w * 0.6 && e.clientX < box.x + box.w * 0.6 && e.clientY > box.y - box.h && e.clientY < box.y;
  if (onPiece) {
    happy = 1; hearts(e.clientX, e.clientY);
    if (id === 'encarga') { clink(); bubble(); } else thud();
  } else if (id === 'inicio') {
    jumpV = 640; thud();
  }
});

/* ---------- tarjeta descargable ---------- */
function roundRect(x, X, Y, w, h, r) { x.beginPath(); x.roundRect ? x.roundRect(X, Y, w, h, r) : x.rect(X, Y, w, h); }
function downloadCard() {
  const out = document.createElement('canvas'); out.width = 900; out.height = 1200;
  const x = out.getContext('2d');
  x.fillStyle = '#1c1917'; x.fillRect(0, 0, 900, 1200);
  x.fillStyle = '#f2ebe1'; roundRect(x, 30, 30, 840, 1140, 40); x.fill();
  x.fillStyle = '#e6ece2'; roundRect(x, 70, 150, 760, 700, 30); x.fill();
  const col = opt('paleta', crea.paleta)[2];
  const g = x.createRadialGradient(450, 500, 10, 450, 500, 380);
  g.addColorStop(0, col + 'aa'); g.addColorStop(1, col + '00');
  x.fillStyle = g; x.fillRect(70, 150, 760, 700);
  const im = IMG[TIPO_IMG[crea.tipo]], k = TAM_SCALE[crea.tamano];
  const sc = Math.min(620 / im.naturalWidth, 600 / im.naturalHeight) * k, dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
  x.filter = ACABADO_FX[crea.acabado];
  x.drawImage(im, 450 - dw / 2, 820 - dh, dw, dh);
  x.filter = 'none';
  x.fillStyle = '#1c1917';
  x.font = '800 40px "Bricolage Grotesque", sans-serif'; x.fillText('TALLER ESCULTÓRICO', 70, 110);
  x.font = '500 22px "DM Sans", sans-serif'; x.textAlign = 'right'; x.fillText('Tarjeta de encargo', 830, 104); x.textAlign = 'left';
  const name = $('#catName').value.trim() || 'Bicho';
  x.font = '800 104px "Bricolage Grotesque", sans-serif'; x.fillText(name, 66, 975);
  x.fillStyle = '#6f665d'; x.font = '500 27px "DM Sans", sans-serif';
  const words = summary().split(' '); let line = '', y = 1030;
  for (const w of words) { if (x.measureText(line + w).width > 760) { x.fillText(line, 70, y); line = ''; y += 38; } line += w + ' '; }
  x.fillText(line, 70, y);
  x.fillStyle = '#ff6b3d'; x.beginPath(); x.arc(800, 975, 26, 0, 7); x.fill();
  try {
    out.toBlob((b) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = `encargo-${name.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-')}.png`;
      a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    });
    bubble('¡Guardado!');
  } catch (e) { bubble('Ábrela desde un servidor'); }
}
$('#cDownload').addEventListener('click', downloadCard);

/* ---------- arranque ---------- */
syncCrea();
const hash = location.hash.slice(1);
if (byId(hash)) goTo(hash, 0, false);
const start = () => requestAnimationFrame((n) => { last = n; tick(n); setTimeout(() => $('#loader').classList.add('done'), 200); });
IMG.sapo.complete ? start() : (IMG.sapo.onload = IMG.sapo.onerror = start);
})();
