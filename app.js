/**
 * Elumalaiyan Enterprises - Global App Controller
 * Version: 3.6 (Liquid Glass & Edge-to-Edge Images)
 */

const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/KonvictDev/elumalaiyan/refs/heads/main/products.json';

// --- Slider Logic ---
function initHeroSlider() {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.hero-slide');
    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    const moveSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    };

    // Auto-advance every 6 seconds for better readability
    setInterval(moveSlide, 6000);
}

// --- Product Engine ---
async function productEngine({ category = null, featuredOnly = false, containerId, searchBoxId = null }) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = `
        <div class="col-span-full flex flex-col items-center py-20 opacity-40">
            <div class="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="uppercase tracking-[0.5em] text-[9px] font-black">Connecting to Catalog</p>
        </div>`;

    try {
        const response = await fetch(GITHUB_JSON_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const allProducts = await response.json();

        const render = (items) => {
            if (items.length === 0) {
                grid.innerHTML = `<p class="col-span-full text-center py-20 text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Vault is empty</p>`;
                return;
            }
            grid.innerHTML = items.map(p => `
                <article class="group liquid-glass rounded-[40px] p-4 border border-white/40 dark:border-white/10 hover:-translate-y-2 transition-all duration-500 flex flex-col relative z-10 shadow-2xl">
                    
                    <div class="relative w-full h-64 md:h-72 rounded-[32px] overflow-hidden mb-6 bg-neutral-200 dark:bg-neutral-800">
                        <img src="${p.image}" alt="${p.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        
                        <div class="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-[9px] font-black tracking-widest uppercase border border-white/20 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 bg-brand rounded-full animate-pulse"></span>
                            ${p.category}
                        </div>
                    </div>
                    
                    <div class="px-2 pb-2 flex flex-col flex-grow justify-between">
                        <div>
                            <h3 class="font-serif text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter mb-2">${p.name}</h3>
                            <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em] mb-6">${p.brands}</p>
                        </div>
                        
                        <a href="https://wa.me/919876543210?text=Inquiry: ${encodeURIComponent(p.name)}" class="mt-auto flex items-center justify-between w-full bg-neutral-900 dark:bg-white text-white dark:text-black px-6 py-4 rounded-3xl font-black text-[10px] tracking-[0.4em] hover:bg-brand hover:text-black transition-all shadow-xl group/btn">
                            <span>INQUIRE</span>
                            <i class="fa-solid fa-arrow-right -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300 text-sm"></i>
                        </a>
                    </div>
                </article>
            `).join('');
        };

        let filtered = allProducts;
        if (category) filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
        if (featuredOnly) filtered = filtered.filter(p => p.featured === true);

        render(filtered);

        if (searchBoxId) {
            document.getElementById(searchBoxId).addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                render(filtered.filter(p => p.name.toLowerCase().includes(term) || p.brands.toLowerCase().includes(term)));
            });
        }
    } catch (err) {
        grid.innerHTML = `<div class="col-span-full text-center py-20 text-red-500 font-black tracking-widest text-[10px] uppercase">Connection Error</div>`;
    }
}

// --- Global Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Nav Scroll Effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            nav.classList.add('liquid-glass', 'py-4', 'shadow-2xl');
            nav.classList.remove('py-8');
        } else {
            nav.classList.remove('liquid-glass', 'py-4', 'shadow-2xl');
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

    // Mobile Navigation
    const mb = document.getElementById('mobile-menu-button'), mm = document.getElementById('mobile-menu');
    if (mb && mm) mb.onclick = () => mm.classList.toggle('hidden');

    initHeroSlider();
});