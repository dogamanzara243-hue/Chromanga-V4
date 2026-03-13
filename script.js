
const USER = "dogamanzara243-hue";
const REPO = "Chromanga-V4";
const BASE = `https://raw.githubusercontent.com/${USER}/${REPO}/main`;

window.onload = () => {
    const p = new URLSearchParams(window.location.search);
    const m = p.get('manga'), b = p.get('bolum');
    m && b ? loadReader(m, b) : loadHome();
};

async function loadHome() {
    try {
        const r = await fetch(`${BASE}/manga-listesi.json?v=${Date.now()}`);
        const data = await r.json();
        window.mangaData = data;
        renderList(data);
        
        document.getElementById('mangaSearch').oninput = (e) => {
            const val = e.target.value.toLowerCase();
            renderList(window.mangaData.filter(m => m.title.toLowerCase().includes(val)));
        };
    } catch(e) { console.log("Veri bekleniyor..."); }
}

function renderList(data) {
    const list = document.getElementById('manga-list');
    list.innerHTML = data.map(m => `
        <div class="manga-card" onclick="showDetail('${m.slug}')">
            <img src="${m.cover}">
            <h3>${m.title}</h3>
        </div>`).join('');
}

async function showDetail(slug) {
    const manga = window.mangaData.find(m => m.slug === slug);
    document.getElementById('manga-list').classList.add('hidden');
    document.getElementById('manga-detail').classList.remove('hidden');
    
    document.getElementById('detail-title').innerText = manga.title;
    document.getElementById('detail-desc').innerText = manga.description || "Özet bulunamadı.";
    document.getElementById('detail-img').src = manga.cover;

    // Bölüm listesini oluştur (Örnek: 100 bölüm kontrolü)
    let chaptersHTML = '';
    for(let i=1; i<=150; i++) { // Bot kaç bölüm yüklediyse tıklandığında kontrol edilecek
        chaptersHTML += `<button class="chapter-btn" onclick="location.href='reader.html?manga=${slug}&bolum=${i}'">Bölüm ${i}</button>`;
    }
    document.getElementById('chapter-list').innerHTML = chaptersHTML;
}

function closeDetail() {
    document.getElementById('manga-detail').classList.add('hidden');
    document.getElementById('manga-list').classList.remove('hidden');
}

async function loadReader(s, b) {
    const container = document.getElementById('image-container');
    try {
        const r = await fetch(`${BASE}/veriler/${s}/bolum-${b}.json?v=${Date.now()}`);
        if(!r.ok) throw new Error();
        const data = await r.json();
        container.innerHTML = data.images.map(img => `<img src="${img}" loading="lazy">`).join('');
        
        document.getElementById('reader-nav').innerHTML = `
            <button onclick="location.href='reader.html?manga=${s}&bolum=${parseInt(b)-1}'">⬅ Geri</button>
            <button onclick="location.href='index.html'">Ev</button>
            <button onclick="location.href='reader.html?manga=${s}&bolum=${parseInt(b)+1}'">İleri ➡</button>
        `;
    } catch(e) {
        container.innerHTML = "<div style='text-align:center;padding:100px;'><h3>Bölüm henüz mevcut değil.</h3><a href='index.html' style='color:red'>Geri Dön</a></div>";
    }
}
