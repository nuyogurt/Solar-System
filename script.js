'use strict';

/* ==========================================================
   Tata Surya Interaktif — script.js
   ========================================================== */

const TAU = Math.PI * 2;
const EARTH_PERIOD = 12; // detik nyata untuk 1 tahun Bumi pada kecepatan 1×
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Data benda langit ----------
   radius & size = satuan dunia (px pada zoom 1), sengaja tidak berskala asli
   agar semua planet tetap terlihat. years = periode orbit asli (tahun Bumi). */
const BODIES = [
    {
        id: 'sun', name: 'Matahari', type: 'Bintang · Katai kuning G2V', img: 'sunn.png',
        color: '#ffb347', size: 90, radius: 0, years: 0, focus: 1.8, earthRatio: 109,
        tagline: 'Pusat tata surya dan sumber energi bagi seluruh kehidupan di Bumi.',
        stats: [
            ['ri-ruler-2-line', 'Diameter', '1,39 juta km'],
            ['ri-temp-hot-line', 'Suhu permukaan', '±5.500 °C'],
            ['ri-fire-line', 'Suhu inti', '±15 juta °C'],
            ['ri-restart-line', 'Rotasi', '±27 hari'],
            ['ri-scales-3-line', 'Massa', '333.000× Bumi'],
            ['ri-hourglass-line', 'Usia', '4,6 miliar tahun'],
        ],
        fact: 'Matahari menyimpan sekitar 99,86% dari seluruh massa tata surya.',
    },
    {
        id: 'mercury', name: 'Merkurius', type: 'Planet kebumian', img: '2-mer.png',
        color: '#c9b8a6', size: 16, radius: 72, years: 0.24, focus: 5, earthRatio: 0.38,
        tagline: 'Planet terkecil dan paling dekat dengan Matahari.',
        stats: planetStats('4.879 km', '57,9 juta km', '88 hari', '58,6 hari', '0', '−173 s.d. 427 °C'),
        fact: 'Meski paling dekat dengan Matahari, Merkurius bukan planet terpanas — gelar itu milik Venus.',
    },
    {
        id: 'venus', name: 'Venus', type: 'Planet kebumian', img: '3-ven.png',
        color: '#eab86b', size: 24, radius: 102, years: 0.615, focus: 4.2, earthRatio: 0.95,
        tagline: 'Planet terpanas, terselimuti awan asam sulfat yang sangat tebal.',
        stats: planetStats('12.104 km', '108,2 juta km', '225 hari', '243 hari (terbalik)', '0', '464 °C'),
        fact: 'Satu hari di Venus (243 hari Bumi) lebih lama daripada satu tahunnya (225 hari).',
    },
    {
        id: 'earth', name: 'Bumi', type: 'Planet kebumian', img: '4-bum.png',
        color: '#4fa3ff', size: 26, radius: 140, years: 1, focus: 4, earthRatio: 1,
        tagline: 'Rumah kita — satu-satunya dunia yang diketahui memiliki kehidupan.',
        stats: planetStats('12.742 km', '149,6 juta km', '365,25 hari', '23 j 56 m', '1', '15 °C'),
        fact: 'Bumi adalah satu-satunya planet yang diketahui memiliki air cair di permukaannya.',
    },
    {
        id: 'mars', name: 'Mars', type: 'Planet kebumian', img: '5-mars.png',
        color: '#ff6b4a', size: 20, radius: 182, years: 1.88, focus: 4.4, earthRatio: 0.53,
        tagline: 'Planet merah berdebu, target utama misi penjelajahan manusia.',
        stats: planetStats('6.779 km', '227,9 juta km', '687 hari', '24 j 37 m', '2', '−63 °C'),
        fact: 'Mars adalah rumah Olympus Mons, gunung berapi tertinggi di tata surya (±22 km).',
    },
    {
        id: 'jupiter', name: 'Jupiter', type: 'Raksasa gas', img: '6-jup.png',
        color: '#e0a872', size: 56, radius: 265, years: 11.86, focus: 2.6, earthRatio: 10.97,
        tagline: 'Raksasa gas terbesar, lebih masif dari gabungan semua planet lain.',
        stats: planetStats('139.820 km', '778,5 juta km', '11,9 tahun', '9 j 56 m', '95', '−110 °C'),
        fact: 'Bintik Merah Besar di Jupiter adalah badai raksasa yang lebih lebar dari Bumi.',
    },
    {
        id: 'saturn', name: 'Saturnus', type: 'Raksasa gas', img: '7-sat.png',
        color: '#f1d27a', size: 70, radius: 340, years: 29.46, focus: 2.4, earthRatio: 9.14,
        tagline: 'Permata tata surya dengan sistem cincin yang menakjubkan.',
        stats: planetStats('116.460 km', '1,43 miliar km', '29,5 tahun', '10 j 34 m', '274', '−140 °C'),
        fact: 'Kerapatan Saturnus lebih rendah dari air — secara teori ia bisa mengapung.',
    },
    {
        id: 'uranus', name: 'Uranus', type: 'Raksasa es', img: '8-ura.png',
        color: '#7fe0e6', size: 38, radius: 405, years: 84, focus: 3, earthRatio: 3.98,
        tagline: 'Raksasa es yang berotasi miring, seolah berguling di orbitnya.',
        stats: planetStats('50.724 km', '2,87 miliar km', '84 tahun', '17 j 14 m (terbalik)', '29', '−195 °C'),
        fact: 'Sumbu rotasi Uranus miring sekitar 98°, jadi kutubnya bergantian menghadap Matahari.',
    },
    {
        id: 'neptune', name: 'Neptunus', type: 'Raksasa es', img: '9-nep.png',
        color: '#5b7cff', size: 36, radius: 465, years: 164.8, focus: 3, earthRatio: 3.86,
        tagline: 'Planet terjauh, biru pekat dan diterpa angin super kencang.',
        stats: planetStats('49.244 km', '4,50 miliar km', '164,8 tahun', '16 j 6 m', '16', '−200 °C'),
        fact: 'Neptunus punya angin tercepat di tata surya, bisa mencapai ±2.100 km/jam.',
    },
];

function planetStats(diameter, distance, orbit, rotation, moons, temp) {
    return [
        ['ri-ruler-2-line', 'Diameter', diameter],
        ['ri-route-line', 'Jarak dari Matahari', distance],
        ['ri-repeat-2-line', 'Periode orbit', orbit],
        ['ri-restart-line', 'Rotasi', rotation],
        ['ri-moon-line', 'Satelit alami', moons],
        ['ri-temp-cold-line', 'Suhu', temp],
    ];
}

const BELT = { inner: 205, outer: 232, years: 4.6 };
const MOON = { radius: 22, size: 8, period: 2.4 };
const COMPARE_MAX = 11.2; // skala bar perbandingan ukuran (Jupiter ≈ 11× Bumi)

/* ---------- Elemen ---------- */
const $ = (sel) => document.querySelector(sel);
const viewport = $('#viewport');
const world = $('#world');
const rail = $('#rail');
const panel = $('#panel');
const panelContent = $('#panelContent');
const playBtn = $('#playBtn');
const speedInput = $('#speed');
const speedOut = $('#speedOut');
const simYearsEl = $('#simYears');
const helpDialog = $('#help');
const hint = $('#hint');

/* ---------- State ---------- */
const state = {
    playing: true,
    speed: 1,
    simTime: 0,
    selected: null,
    panelOpen: false,
    ready: false,
};

const cam = {
    x: 0, y: 0, z: 0.1,      // posisi kamera saat ini
    tx: 0, ty: 0, tz: 0.1,   // target kamera
    ox: 0, oy: 0,            // geseran layar (memberi ruang untuk panel)
    focus: null,             // benda yang sedang diikuti
    follow: { t: 1, fx: 0, fy: 0 },
};

let fit = computeFit();
let lastZ = -1;

/* ---------- Bangun dunia ---------- */
function el(tag, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
}

function buildWorld() {
    // Orbit dulu agar berada di bawah planet
    BODIES.forEach((b) => {
        b.period = EARTH_PERIOD * Math.sqrt(b.years); // dipadatkan supaya planet luar tetap bergerak
        b.phase = Math.random() * TAU;
        b.x = 0;
        b.y = 0;
        if (!b.radius) return;
        b.orbitEl = el('div', 'orbit');
        b.orbitEl.style.setProperty('--r', `${b.radius}px`);
        b.orbitEl.style.setProperty('--c', b.color);
        b.trailEl = el('div', 'orbit__trail');
        b.orbitEl.append(b.trailEl);
        world.append(b.orbitEl);
    });

    BELT.el = createBelt();
    world.append(BELT.el);

    MOON.orbitEl = el('div', 'orbit orbit--moon');
    MOON.orbitEl.style.setProperty('--r', `${MOON.radius}px`);
    world.append(MOON.orbitEl);

    BODIES.forEach((b) => {
        const btn = el('button', `body ${b.id === 'sun' ? 'sun' : 'planet'}`);
        btn.style.setProperty('--size', `${b.size}px`);
        btn.style.setProperty('--c', b.color);
        btn.setAttribute('aria-label', `${b.name} — lihat detail`);
        btn.innerHTML =
            (b.id === 'sun' ? '<span class="sun__glow"></span><span class="sun__corona"></span>' : '') +
            `<img src="${b.img}" alt="" draggable="false"><span class="label">${b.name}</span>`;
        btn.addEventListener('click', () => {
            if (pointer.moved) return;
            select(b);
        });
        b.el = btn;
        world.append(btn);
    });

    MOON.el = el('div', 'body moon');
    MOON.el.style.setProperty('--size', `${MOON.size}px`);
    MOON.el.style.setProperty('--c', '#cfd3e0');
    MOON.el.innerHTML = '<img src="moon.png" alt="" draggable="false">';
    world.append(MOON.el);
}

function createBelt() {
    const half = BELT.outer + 4;
    const res = 2; // resolusi ekstra agar tetap tajam saat di-zoom
    const canvas = el('canvas', 'belt');
    canvas.width = canvas.height = half * 2 * res;
    Object.assign(canvas.style, {
        width: `${half * 2}px`,
        height: `${half * 2}px`,
        left: `${-half}px`,
        top: `${-half}px`,
    });
    const ctx = canvas.getContext('2d');
    ctx.scale(res, res);
    ctx.translate(half, half);
    for (let i = 0; i < 900; i++) {
        const a = Math.random() * TAU;
        // distribusi menumpuk di tengah sabuk
        const t = (Math.random() + Math.random() + Math.random()) / 3;
        const r = BELT.inner + (BELT.outer - BELT.inner) * t;
        const s = Math.random() ** 2 * 1.3 + 0.3;
        const shade = 150 + Math.random() * 70;
        ctx.fillStyle = `rgba(${shade}, ${shade * 0.88}, ${shade * 0.76}, ${0.35 + Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * r, Math.sin(a) * r, s, 0, TAU);
        ctx.fill();
    }
    return canvas;
}

function buildRail() {
    BODIES.forEach((b, i) => {
        const btn = el('button', 'rail__item');
        btn.dataset.name = b.name;
        btn.style.setProperty('--c', b.color);
        btn.setAttribute('aria-label', `${b.name} (${i})`);
        btn.innerHTML = `<img src="${b.img}" alt="" draggable="false">`;
        btn.addEventListener('click', () => select(b));
        b.railEl = btn;
        rail.append(btn);
    });
}

/* ---------- Seleksi & panel ---------- */
function select(b) {
    if (state.selected) {
        state.selected.el.classList.remove('is-selected');
        state.selected.railEl.classList.remove('is-active');
        state.selected.orbitEl?.classList.remove('is-active');
    }
    state.selected = b;
    b.el.classList.add('is-selected');
    b.railEl.classList.add('is-active');
    b.orbitEl?.classList.add('is-active');
    b.railEl.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });

    cam.focus = b;
    cam.follow = { t: 0, fx: cam.x, fy: cam.y };
    cam.tz = clampZoom(fit * b.focus);

    renderPanel(b);
    openPanel();
    dismissHint();
}

function deselect() {
    if (!state.selected) return;
    state.selected.el.classList.remove('is-selected');
    state.selected.railEl.classList.remove('is-active');
    state.selected.orbitEl?.classList.remove('is-active');
    state.selected = null;
    closePanel();
}

function step(dir) {
    const i = state.selected ? BODIES.indexOf(state.selected) : (dir > 0 ? -1 : 0);
    select(BODIES[(i + dir + BODIES.length) % BODIES.length]);
}

function renderPanel(b) {
    const i = BODIES.indexOf(b);
    const prev = BODIES[(i - 1 + BODIES.length) % BODIES.length];
    const next = BODIES[(i + 1) % BODIES.length];
    const pct = Math.min(100, (b.earthRatio / COMPARE_MAX) * 100);
    const ratio = b.earthRatio.toLocaleString('id-ID');

    panel.style.setProperty('--c', b.color);
    panelContent.innerHTML = `
        <div class="panel__hero"><img src="${b.img}" alt="${b.name}"></div>
        <span class="panel__type">${b.type}</span>
        <h2 id="panelTitle">${b.name}</h2>
        <p class="panel__tagline">${b.tagline}</p>
        <div class="stats">
            ${b.stats.map(([icon, label, value]) => `
                <div class="stat"><i class="${icon}"></i><span>${label}</span><strong>${value}</strong></div>
            `).join('')}
        </div>
        <div class="compare">
            <div class="compare__head"><span>Ukuran dibanding Bumi</span><strong>${ratio}×</strong></div>
            <div class="compare__track">
                <div class="compare__fill" style="--w:${pct}%"></div>
                <div class="compare__earth" style="left:${(1 / COMPARE_MAX) * 100}%"></div>
            </div>
            ${b.earthRatio > COMPARE_MAX ? '<div class="compare__scale">Melebihi skala — diameternya ±109× Bumi.</div>' : '<div class="compare__scale">&nbsp;</div>'}
        </div>
        <div class="fact"><i class="ri-lightbulb-flash-line"></i><p>${b.fact}</p></div>
        <div class="panel__nav">
            <button class="nav-btn" data-go="-1"><i class="ri-arrow-left-s-line"></i><span><small>Sebelumnya</small>${prev.name}</span></button>
            <button class="nav-btn nav-btn--next" data-go="1"><span><small>Berikutnya</small>${next.name}</span><i class="ri-arrow-right-s-line"></i></button>
        </div>`;
    panel.scrollTop = 0;
}

function openPanel() {
    state.panelOpen = true;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('panel-open');
}

function closePanel() {
    state.panelOpen = false;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('panel-open');
}

panel.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-go]');
    if (nav) step(Number(nav.dataset.go));
});

$('#panelClose').addEventListener('click', () => {
    deselect();
    resetView();
});

/* ---------- Kamera ---------- */
function computeFit() {
    const narrow = window.innerWidth < 760;
    // Di layar sempit cukup sampai Saturnus; sisanya bisa di-zoom out
    const reach = narrow ? 370 : 500;
    const usableW = window.innerWidth - (narrow ? 16 : 180);
    const usableH = window.innerHeight - (narrow ? 230 : 170);
    return Math.max(0.2, Math.min(usableW, usableH) / (reach * 2));
}

function clampZoom(z) {
    return Math.min(fit * 10, Math.max(fit * 0.45, z));
}

function zoomAt(sx, sy, factor) {
    const nz = clampZoom(cam.tz * factor);
    if (!cam.focus) {
        // Pertahankan titik di bawah kursor
        const cx = window.innerWidth / 2 + cam.ox;
        const cy = window.innerHeight / 2 + cam.oy;
        const wx = cam.tx + (sx - cx) / cam.tz;
        const wy = cam.ty + (sy - cy) / cam.tz;
        cam.tx = wx - (sx - cx) / nz;
        cam.ty = wy - (sy - cy) / nz;
    }
    cam.tz = nz;
}

function zoomCenter(factor) {
    zoomAt(window.innerWidth / 2 + cam.ox, window.innerHeight / 2 + cam.oy, factor);
}

function resetView() {
    releaseFocus();
    cam.tx = 0;
    cam.ty = 0;
    cam.tz = fit;
}

function releaseFocus() {
    cam.focus = null;
    cam.tx = cam.x;
    cam.ty = cam.y;
}

function panelOffset() {
    if (!state.panelOpen) return [0, 0];
    if (window.innerWidth > 760) return [-(panel.offsetWidth + 20) / 2, 0];
    return [0, -panel.offsetHeight / 2];
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/* ---------- Input: geser, cubit, scroll ---------- */
const pointer = { map: new Map(), moved: false, pinch: 0 };

viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    pointer.map.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY });
    pointer.moved = false;
    if (pointer.map.size === 2) pointer.pinch = pinchDistance();
    viewport.classList.add('is-dragging');
    dismissHint();
});

window.addEventListener('pointermove', (e) => {
    mouse.tx = e.clientX / window.innerWidth - 0.5;
    mouse.ty = e.clientY / window.innerHeight - 0.5;

    const p = pointer.map.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;

    if (pointer.map.size === 2) {
        const d = pinchDistance();
        const [a, b] = [...pointer.map.values()];
        if (pointer.pinch) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, d / pointer.pinch);
        pointer.pinch = d;
        pointer.moved = true;
        return;
    }

    if (!pointer.moved && Math.hypot(e.clientX - p.sx, e.clientY - p.sy) > 5) {
        pointer.moved = true;
        if (cam.focus) releaseFocus();
    }
    if (pointer.moved) {
        cam.x -= dx / cam.z;
        cam.y -= dy / cam.z;
        cam.tx = cam.x;
        cam.ty = cam.y;
    }
});

function endPointer(e) {
    pointer.map.delete(e.pointerId);
    if (pointer.map.size < 2) pointer.pinch = 0;
    if (pointer.map.size === 0) {
        viewport.classList.remove('is-dragging');
        // reset setelah event click (yang menyusul pointerup) selesai diproses
        setTimeout(() => { pointer.moved = false; }, 0);
    }
}

window.addEventListener('pointerup', endPointer);
window.addEventListener('pointercancel', endPointer);

function pinchDistance() {
    const [a, b] = [...pointer.map.values()];
    return Math.hypot(a.x - b.x, a.y - b.y) || 1;
}

viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    zoomAt(e.clientX, e.clientY, Math.exp(-delta * 0.0015));
    dismissHint();
}, { passive: false });

/* ---------- Kontrol ---------- */
function setPlaying(on) {
    state.playing = on;
    playBtn.innerHTML = `<i class="ri-${on ? 'pause' : 'play'}-fill"></i>`;
    playBtn.setAttribute('aria-label', on ? 'Jeda' : 'Lanjutkan');
    playBtn.dataset.tip = on ? 'Jeda (Spasi)' : 'Lanjutkan (Spasi)';
}

function updateSpeed() {
    const v = Number(speedInput.value);
    state.speed = 10 ** ((v - 50) / 50); // 0,1× … 10× (logaritmik)
    speedInput.style.setProperty('--p', `${v}%`);
    speedOut.textContent = `${state.speed.toLocaleString('id-ID', {
        minimumFractionDigits: state.speed < 1 ? 2 : 1,
        maximumFractionDigits: state.speed < 1 ? 2 : 1,
    })}×`;
}

function toggleWorldClass(btn, cls) {
    const shown = !world.classList.toggle(cls);
    btn.classList.toggle('is-active', shown);
    btn.setAttribute('aria-pressed', String(shown));
}

function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
}

const orbitBtn = $('#orbitBtn');
const labelBtn = $('#labelBtn');
const fullBtn = $('#fullBtn');

playBtn.addEventListener('click', () => setPlaying(!state.playing));
speedInput.addEventListener('input', updateSpeed);
orbitBtn.addEventListener('click', () => toggleWorldClass(orbitBtn, 'hide-orbits'));
labelBtn.addEventListener('click', () => toggleWorldClass(labelBtn, 'hide-labels'));
$('#zoomInBtn').addEventListener('click', () => zoomCenter(1.5));
$('#zoomOutBtn').addEventListener('click', () => zoomCenter(1 / 1.5));
$('#resetBtn').addEventListener('click', () => { deselect(); resetView(); });
fullBtn.addEventListener('click', toggleFullscreen);
$('#helpBtn').addEventListener('click', () => helpDialog.showModal());
$('#helpClose').addEventListener('click', () => helpDialog.close());
helpDialog.addEventListener('click', (e) => { if (e.target === helpDialog) helpDialog.close(); });

document.addEventListener('fullscreenchange', () => {
    fullBtn.innerHTML = `<i class="ri-fullscreen${document.fullscreenElement ? '-exit' : ''}-line"></i>`;
});

document.addEventListener('keydown', (e) => {
    if (helpDialog.open || e.ctrlKey || e.metaKey || e.altKey) return;
    const onInput = e.target instanceof HTMLInputElement;
    const k = e.key;

    if (k === ' ' && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); setPlaying(!state.playing); }
    else if (k === 'ArrowRight' && !onInput) { e.preventDefault(); step(1); }
    else if (k === 'ArrowLeft' && !onInput) { e.preventDefault(); step(-1); }
    else if (k === '+' || k === '=') zoomCenter(1.5);
    else if (k === '-' || k === '_') zoomCenter(1 / 1.5);
    else if (/^[0-8]$/.test(k)) select(BODIES[Number(k)]);
    else if (k === 'r' || k === 'R') { deselect(); resetView(); }
    else if (k === 'o' || k === 'O') toggleWorldClass(orbitBtn, 'hide-orbits');
    else if (k === 'l' || k === 'L') toggleWorldClass(labelBtn, 'hide-labels');
    else if (k === 'f' || k === 'F') toggleFullscreen();
    else if (k === '?') helpDialog.showModal();
    else if (k === 'Escape' && state.selected) { deselect(); resetView(); }
});

let hintTimer = 0;
function dismissHint() {
    clearTimeout(hintTimer);
    hint.classList.add('is-hidden');
}

/* ---------- Langit berbintang ---------- */
const sky = { canvas: $('#sky'), stars: [], shooting: [], nextShoot: 3, w: 0, h: 0 };
sky.ctx = sky.canvas.getContext('2d');
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
const STAR_TINTS = ['255,255,255', '255,255,255', '200,220,255', '255,236,210', '180,200,255'];
const DEPTHS = [0.15, 0.4, 0.8];

function resizeSky() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sky.w = window.innerWidth;
    sky.h = window.innerHeight;
    sky.canvas.width = sky.w * dpr;
    sky.canvas.height = sky.h * dpr;
    sky.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(1000, Math.round((sky.w * sky.h) / 1700));
    sky.stars = Array.from({ length: count }, () => {
        const d = DEPTHS[Math.floor(Math.random() * DEPTHS.length)];
        return {
            x: Math.random() * sky.w,
            y: Math.random() * sky.h,
            r: (Math.random() ** 3 * 1.2 + 0.3) * (0.6 + d * 0.6),
            d,
            a: 0.35 + Math.random() * 0.65,
            tw: 0.6 + Math.random() * 2.2,
            ph: Math.random() * TAU,
            tint: STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)],
        };
    });
}

function drawSky(t, dt) {
    const { ctx, w, h } = sky;
    ctx.clearRect(0, 0, w, h);

    mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 3);
    mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 3);
    const camSX = cam.x * cam.z;
    const camSY = cam.y * cam.z;

    for (const s of sky.stars) {
        const ox = -camSX * 0.04 * s.d - mouse.x * 24 * s.d;
        const oy = -camSY * 0.04 * s.d - mouse.y * 24 * s.d;
        const x = (((s.x + ox) % w) + w) % w;
        const y = (((s.y + oy) % h) + h) % h;
        const alpha = reduceMotion ? s.a : s.a * (0.6 + 0.4 * Math.sin(t * s.tw + s.ph));
        ctx.fillStyle = `rgba(${s.tint},${alpha.toFixed(3)})`;
        if (s.r < 0.9) {
            ctx.fillRect(x, y, s.r * 1.6, s.r * 1.6);
        } else {
            ctx.beginPath();
            ctx.arc(x, y, s.r, 0, TAU);
            ctx.fill();
        }
    }

    if (reduceMotion) return;

    // Bintang jatuh sesekali
    sky.nextShoot -= dt;
    if (sky.nextShoot <= 0) {
        const angle = Math.PI * (0.15 + Math.random() * 0.2);
        const v = 700 + Math.random() * 500;
        sky.shooting.push({
            x: Math.random() * w * 0.8,
            y: Math.random() * h * 0.4,
            vx: Math.cos(angle) * v,
            vy: Math.sin(angle) * v,
            life: 1,
        });
        sky.nextShoot = 5 + Math.random() * 9;
    }

    sky.shooting = sky.shooting.filter((m) => m.life > 0);
    for (const m of sky.shooting) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        m.life -= dt * 1.1;
        const tx = m.x - m.vx * 0.12;
        const ty = m.y - m.vy * 0.12;
        const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, `rgba(255,255,255,${Math.max(0, m.life)})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
    }
}

/* ---------- Loop utama ---------- */
let last = performance.now();

function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (state.playing) state.simTime += dt * state.speed;
    const T = state.simTime;

    // Posisi planet (berlawanan arah jarum jam, seperti dilihat dari utara)
    for (const b of BODIES) {
        if (!b.radius) continue;
        const a = b.phase + (T / b.period) * TAU;
        b.x = Math.cos(a) * b.radius;
        b.y = -Math.sin(a) * b.radius;
        b.el.style.transform = `translate(${b.x}px, ${b.y}px) translate(-50%, -50%)`;
        b.trailEl.style.transform = `rotate(${90 - (a * 180) / Math.PI}deg)`;
    }
    BODIES[0].el.style.transform = 'translate(-50%, -50%)';

    const earth = BODIES[3];
    const ma = (T / MOON.period) * TAU;
    const mx = earth.x + Math.cos(ma) * MOON.radius;
    const my = earth.y - Math.sin(ma) * MOON.radius;
    MOON.orbitEl.style.transform = `translate(${earth.x}px, ${earth.y}px)`;
    MOON.el.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    BELT.el.style.transform = `rotate(${(-T / (EARTH_PERIOD * Math.sqrt(BELT.years))) * 360}deg)`;

    // Kamera
    const k = 1 - Math.exp(-dt * 5);
    if (cam.focus) {
        cam.follow.t = Math.min(1, cam.follow.t + dt / 1.2);
        const e = easeInOut(cam.follow.t);
        cam.x = cam.follow.fx + (cam.focus.x - cam.follow.fx) * e;
        cam.y = cam.follow.fy + (cam.focus.y - cam.follow.fy) * e;
    } else {
        cam.x += (cam.tx - cam.x) * k;
        cam.y += (cam.ty - cam.y) * k;
    }
    cam.z = Math.exp(Math.log(cam.z) + (Math.log(cam.tz) - Math.log(cam.z)) * k);
    const [tox, toy] = panelOffset();
    cam.ox += (tox - cam.ox) * k;
    cam.oy += (toy - cam.oy) * k;

    const vx = window.innerWidth / 2 + cam.ox - cam.x * cam.z;
    const vy = window.innerHeight / 2 + cam.oy - cam.y * cam.z;
    world.style.transform = `translate(${vx}px, ${vy}px) scale(${cam.z})`;
    if (Math.abs(cam.z - lastZ) / cam.z > 0.002) {
        world.style.setProperty('--z', cam.z.toFixed(4));
        lastZ = cam.z;
    }

    simYearsEl.textContent = (T / EARTH_PERIOD).toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    drawSky(now / 1000, dt);
    requestAnimationFrame(frame);
}

/* ---------- Mulai ---------- */
window.addEventListener('resize', () => {
    const oldFit = fit;
    fit = computeFit();
    cam.tz = clampZoom(cam.tz * (fit / oldFit));
    resizeSky();
});

buildWorld();
buildRail();
updateSpeed();
resizeSky();
cam.z = cam.tz = fit * 0.15;
requestAnimationFrame(frame);

window.addEventListener('load', () => {
    setTimeout(() => {
        $('#loader').classList.add('is-hidden');
        document.body.classList.add('is-ready');
        cam.tz = fit; // animasi zoom masuk
        hintTimer = setTimeout(dismissHint, 8000);
    }, 500);
});
