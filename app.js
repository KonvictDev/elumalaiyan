/**
 * Elumalaiyan Enterprises - Global App Controller
 * Version: 3.0 (Glassmorphism & Skew UI)
 */

const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/KonvictDev/elumalaiyan/refs/heads/main/products.json';

async function productEngine({ category = null, featuredOnly = false, containerId, searchBoxId = null }) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = `
        <div class="col-span-full flex flex-col items-center py-20 opacity-40">
            <div class="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="uppercase tracking-[0.3em] text-[10px] font-bold">Refining Collection...</p>
        </div>`;

    try {
        const response = await fetch(GITHUB_JSON_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const allProducts = await response.json();

        const render = (items) => {
            if (items.length === 0) {
                grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400">No matching items in the vault.</p>`;
                return;
            }
            grid.innerHTML = items.map(p => `
                <article class="group relative bg-white dark:bg-neutral-900/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-white/5 hover:border-brand/50 transition-all duration-500 shadow-xl hover:-translate-y-2 overflow-hidden">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <i class="fa-solid fa-arrow-up-right-from-square text-brand"></i>
                    </div>
                    <div class="h-56 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl mb-6 overflow-hidden flex items-center justify-center p-8">
                        <img src="${p.image}" alt="${p.name}" loading="lazy" class="max-h-full object-contain group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center gap-2">
                            <span class="w-2 h-2 bg-brand rounded-full animate-pulse"></span>
                            <span class="text-[10px] uppercase font-black text-brand tracking-[0.2em]">${p.category}</span>
                        </div>
                        <h3 class="font-serif text-xl font-bold text-gray-900 dark:text-white leading-tight uppercase tracking-tighter">${p.name}</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">${p.brands}</p>
                    </div>
                    <a href="https://wa.me/919876543210?text=I am inquiring about the ${p.name}" 
                       class="mt-8 flex items-center justify-center gap-3 w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-black text-xs tracking-[0.2em] hover:bg-brand hover:text-black transition-all transform active:scale-95">
                       INQUIRE PRICE
                    </a>
                </article>
            `).join('');
        };

        let filtered = allProducts;
        if (category) filtered = filtered.filter(p => p.category === category);
        if (featuredOnly) filtered = filtered.filter(p => p.featured === true);

        render(filtered);

        if (searchBoxId) {
            document.getElementById(searchBoxId).addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                render(filtered.filter(p => p.name.toLowerCase().includes(term) || p.brands.toLowerCase().includes(term)));
            });
        }
    } catch (err) {
        grid.innerHTML = `<div class="col-span-full text-center py-20 text-red-500 font-bold uppercase tracking-widest text-xs">Catalog Sync Error</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Nav Scroll Effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            nav.classList.add('py-4', 'bg-white/80', 'dark:bg-black/80', 'backdrop-blur-xl', 'shadow-2xl');
            nav.classList.remove('py-8');
        } else {
            nav.classList.remove('py-4', 'bg-white/80', 'dark:bg-black/80', 'backdrop-blur-xl', 'shadow-2xl');
            nav.classList.add('py-8');
        }
    });

    // Theme Engine
    const t = document.getElementById('theme-toggle'), i = document.getElementById('theme-icon');
    if (t && i) {
        const update = (dark) => { i.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'; };
        if (document.documentElement.classList.contains('dark')) update(true);
        t.onclick = () => {
            const dark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('color-theme', dark ? 'dark' : 'light');
            update(dark);
        };
    }

    // Menu Logic
    const mb = document.getElementById('mobile-menu-button'), mm = document.getElementById('mobile-menu');
    if (mb && mm) mb.onclick = () => mm.classList.toggle('hidden');
});
