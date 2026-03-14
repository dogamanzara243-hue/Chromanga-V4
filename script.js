
const BASE = `https://raw.githubusercontent.com/dogamanzara243-hue/Chromanga-V4/main`;
const AFIS_URL = "https://i.ibb.co/Pz1MC49Z/unnamed.jpg";

window.onload = () => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get('manga'), b = p.get('bolum');
    
    if (m && b) {
        loadReader(m, b);
    } else if (m) {
        loadChapterList(m);
    } else {
        loadHome();
    }
};

async function loadHome() {
    const list = document.getElementById('manga-list');
    const r = await fetch(`${BASE}/manga-listesi.json?v=${Date.now()}`);
    const data = await r.json();
    list.innerHTML = data.map(m => `
        <div class="manga-card" onclick="location.href='index.html?manga=${m.slug}'">
            <img src="${m.cover}" referrerpolicy="no-referrer">
            <h3>${m.title}</h3>
        </div>`).join('');
}

async function loadChapterList(s) {
    const list = document.getElementById('manga-list');
    list.innerHTML = "<h2>Bölümler Yükleniyor...</h2>";
    
    // Manga başlığını listeden bulalım
    const rL = await fetch(`${BASE}/manga-listesi.json`);
    const listData = await rL.json();
    const manga = listData.find(x => x.slug === s);

    // Basitçe 1'den 100'e kadar olan JSON dosyalarını kontrol edebiliriz
    // Veya çekilen bölümleri ayrı bir JSON'da tutabiliriz. Şimdilik hızlı çözüm:
    let html = `<h2>${manga ? manga.title : s} - Bölüm Listesi</h2><div class='chapter-grid'>`;
    for(let i=1; i<=100; i++) {
        html += `<button class="nav-btn" onclick="location.href='reader.html?manga=${s}&bolum=${i}'">Bölüm ${i}</button>`;
    }
    html += "</div>";
    list.innerHTML = html;
}

async function loadReader(s, b) {
    const container = document.getElementById('image-container');
    const r = await fetch(`${BASE}/veriler/${s}/bolum-${b}.json`);
    const data = await r.json();
    let html = `<div class="reklam-alani"><img src="${AFIS_URL}"></div>`;
    html += data.images.map(img => `<img src="${img}" referrerpolicy="no-referrer" class="manga-page">`).join('');
    html += `<div class="reklam-alani"><img src="${AFIS_URL}"></div>`;
    container.innerHTML = html;
    updateNav(s, b);
    window.scrollTo(0, 0);
}

function updateNav(s, b) {
    const n = parseInt(b) + 1, p = Math.max(1, parseInt(b) - 1);
    document.getElementById('reader-nav').innerHTML = `
        <button class="nav-btn" onclick="location.href='reader.html?manga=${s}&bolum=${p}'">⬅️ Geri</button>
        <button class="nav-btn" onclick="location.href='index.html?manga=${s}'">📂 Bölümler</button>
        <button class="nav-btn" onclick="location.href='reader.html?manga=${s}&bolum=${n}'">İleri ➡️</button>
    `;
}
