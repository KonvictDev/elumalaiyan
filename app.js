/**
 * Elumalaiyan Enterprises - Global App Controller
 * Version: 3.4 (Dynamic Slider & Unified UI)
 */

const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/KonvictDev/elumalaiyan/refs/heads/main/products.json';

// --- Slider Engine ---
function initHeroSlider() {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.hero-slide');
    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    const slideCount = slides.length;

    const updateSlider = () => {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    };

    // Auto-play every 5 seconds
    setInterval(nextSlide, 5000);
}

// --- Product Engine ---
async function productEngine({ category = null, featuredOnly = false, containerId, searchBoxId = null }) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = `
        <div class="col-span-full flex flex-col items-center py-20 opacity-40">
            <div class="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="uppercase tracking-[0.4em] text-[10px] font-black">Syncing Collection</p>
        </div>`;

    try {
        const response = await fetch(GITHUB_JSON_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const allProducts = await response.json();

        const render = (items) => {
            if (items.length === 0) {
                grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">No items found.</p>`;
                return;
            }
            grid.innerHTML = items.map(p => `
                <article class="group relative bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/20 dark:border-white/5 hover:border-brand/50 transition-all duration-700 shadow-xl hover:-translate-y-4">
                    <div class="h-60 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-800 dark:to-neutral-900 rounded-[2rem] mb-6 overflow-hidden flex items-center justify-center p-8 relative">
                        <img src="${p.image}" alt="${p.name}" loading="lazy" class="max-h-full object-contain group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000">
                    </div>
                    <div class="space-y-3 px-2">
                        <div class="flex items-center gap-2">
                            <span class="w-1.5 h-1.5 bg-brand rounded-full animate-pulse"></span>
                            <span class="text-[9px] uppercase font-black text-brand tracking-[0.3em]">${p.category}</span>
                        </div>
                        <h3 class="font-serif text-xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter">${p.name}</h3>
                        <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em]">${p.brands}</p>
                    </div>
                    <a href="https://wa.me/919876543210?text=Inquiry: ${encodeURIComponent(p.name)}" class="mt-8 flex items-center justify-center gap-3 w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black text-[10px] tracking-[0.3em] hover:bg-brand hover:text-black transition-all shadow-lg">INQUIRE PRICE</a>
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
        console.error("SYNC_ERROR:", err);
    }
}

// --- Global UI Init ---
document.addEventListener('DOMContentLoaded', () => {
    // Nav Scroll Effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            nav.classList.add('py-4', 'bg-white/70', 'dark:bg-black/70', 'backdrop-blur-2xl', 'shadow-2xl');
            nav.classList.remove('py-8');
        } else {
            nav.classList.remove('py-4', 'bg-white/70', 'dark:bg-black/70', 'backdrop-blur-2xl', 'shadow-2xl');
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

    // Mobile Menu
    const mb = document.getElementById('mobile-menu-button'), mm = document.getElementById('mobile-menu');
    if (mb && mm) mb.onclick = () => mm.classList.toggle('hidden');

    initHeroSlider();
});
