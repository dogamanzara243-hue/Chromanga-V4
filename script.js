
const USER = "dogamanzara243-hue";
const REPO = "Chromanga-V4";
const BASE = `https://raw.githubusercontent.com/${USER}/${REPO}/main`;
const AFIS = "https://i.ibb.co/Pz1MC49Z/unnamed.jpg";

window.onload = () => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get('manga'), b = p.get('bolum');
    m && b ? loadReader(m, b) : loadHome();
};

async function loadHome() {
    const list = document.getElementById('manga-list');
    try {
        const r = await fetch(`${BASE}/manga-listesi.json?v=${Date.now()}`);
        const data = await r.json();
        list.innerHTML = data.map(m => `
            <div class="manga-card" onclick="location.href='reader.html?manga=${m.slug}&bolum=1'">
                <img src="${m.cover}" referrerpolicy="no-referrer">
                <h3>${m.title}</h3>
            </div>`).join('');
    } catch(e) { list.innerHTML = "<h3>Mangalar yükleniyor...</h3>"; }
}

async function loadReader(s, b) {
    const container = document.getElementById('image-container');
    try {
        const r = await fetch(`${BASE}/veriler/${s}/bolum-${b}.json?v=${Date.now()}`);
        const data = await r.json();
        let html = `<div class="reklam-alani"><img src="${AFIS}"></div>`;
        html += data.images.map(img => `<img src="${img}" referrerpolicy="no-referrer" class="manga-page">`).join('');
        html += `<div class="reklam-alani"><img src="${AFIS}"></div>`;
        container.innerHTML = html;
        updateNav(s, b);
        window.scrollTo(0, 0);
    } catch(e) { container.innerHTML = "<h3>Bölüm henüz eklenmemiş.</h3>"; }
}

function updateNav(s, b) {
    const n = parseInt(b) + 1, p = Math.max(1, parseInt(b) - 1);
    document.getElementById('reader-nav').innerHTML = `
        <button class="nav-btn" onclick="location.href='reader.html?manga=${s}&bolum=${p}'">⬅️ Geri</button>
        <button class="nav-btn" onclick="location.href='index.html'">🏠 Liste</button>
        <button class="nav-btn" onclick="location.href='reader.html?manga=${s}&bolum=${n}'">İleri ➡️</button>
    `;
}
    