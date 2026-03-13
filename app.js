/**
 * Elumalaiyan Enterprises - Global App Controller
 * Version: 4.0 (Product Details Routing & Advanced Filtering)
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

    setInterval(moveSlide, 6000);
}

// --- Multi-Filter Product Engine ---
async function productEngine({ category = null, featuredOnly = false, containerId, searchBoxId = null, filters = false }) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = `
        <div class="col-span-full flex flex-col items-center py-20 opacity-40">
            <div class="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="uppercase tracking-[0.5em] text-[9px] font-black">Connecting to Catalog</p>
        </div>`;

    try {
        const cacheBusterUrl = `${GITHUB_JSON_URL}?t=${new Date().getTime()}`;
        const response = await fetch(cacheBusterUrl, { cache: 'no-store' });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const allProducts = await response.json();

        // 1. Initial Filtering (Category / Featured)
        let baseProducts = allProducts;
        if (category) baseProducts = baseProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
        if (featuredOnly) baseProducts = baseProducts.filter(p => p.featured === true);

        // 2. Populate Dynamic Dropdowns (if on catalog page)
        if (filters) {
            const brandSelect = document.getElementById('filter-brand');
            const typeSelect = document.getElementById('filter-type');
            
            if (brandSelect && typeSelect) {
                // Extract unique values
                const brands = [...new Set(baseProducts.map(p => p.brand).filter(Boolean))].sort();
                const types = [...new Set(baseProducts.map(p => p.type).filter(Boolean))].sort();

                brands.forEach(b => {
                    const opt = document.createElement('option');
                    opt.value = b; opt.textContent = b;
                    brandSelect.appendChild(opt);
                });

                types.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t; opt.textContent = t;
                    typeSelect.appendChild(opt);
                });
            }
        }

        // 3. Render Function (Routing to Details Page)
        const render = (items) => {
            if (items.length === 0) {
                grid.innerHTML = `<p class="col-span-full text-center py-20 text-neutral-500 font-black uppercase tracking-[0.3em] text-[10px]">No matches found</p>`;
                return;
            }
            grid.innerHTML = items.map(p => `
                <a href="product-details.html?id=${p.id}" class="group liquid-glass rounded-[40px] p-4 border border-white/40 dark:border-white/10 hover:-translate-y-2 transition-all duration-500 flex flex-col relative z-10 shadow-2xl block">
                    <div class="relative w-full h-64 md:h-72 rounded-[32px] overflow-hidden mb-6 bg-neutral-200 dark:bg-neutral-800">
                        <img src="${p.image}" alt="${p.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                        <div class="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-[9px] font-black tracking-widest uppercase border border-white/20 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 bg-brand rounded-full animate-pulse"></span>
                            ${p.type || p.category}
                        </div>
                    </div>
                    <div class="px-2 pb-2 flex flex-col flex-grow justify-between">
                        <div>
                            <h3 class="font-serif text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tighter mb-2">${p.name}</h3>
                            <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.15em] mb-6">${p.brand || p.brands}</p>
                        </div>
                        <div class="mt-auto flex items-center justify-between w-full bg-neutral-900 dark:bg-white text-white dark:text-black px-6 py-4 rounded-3xl font-black text-[10px] tracking-[0.4em] group-hover:bg-brand group-hover:text-black transition-all shadow-xl">
                            <span>VIEW DETAILS</span>
                            <i class="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-sm"></i>
                        </div>
                    </div>
                </a>
            `).join('');
        };

        render(baseProducts);

        // 4. Multi-Filter Logic Setup
        const applyFilters = () => {
            const searchTerm = searchBoxId && document.getElementById(searchBoxId) ? document.getElementById(searchBoxId).value.toLowerCase() : '';
            const selectedBrand = filters && document.getElementById('filter-brand') ? document.getElementById('filter-brand').value : 'all';
            const selectedType = filters && document.getElementById('filter-type') ? document.getElementById('filter-type').value : 'all';

            let result = baseProducts;

            if (searchTerm) {
                result = result.filter(p => p.name.toLowerCase().includes(searchTerm) || (p.brand || p.brands).toLowerCase().includes(searchTerm));
            }
            if (selectedBrand !== 'all') {
                result = result.filter(p => p.brand === selectedBrand);
            }
            if (selectedType !== 'all') {
                result = result.filter(p => p.type === selectedType);
            }

            render(result);
        };

        if (searchBoxId && document.getElementById(searchBoxId)) document.getElementById(searchBoxId).addEventListener('input', applyFilters);
        if (filters && document.getElementById('filter-brand')) document.getElementById('filter-brand').addEventListener('change', applyFilters);
        if (filters && document.getElementById('filter-type')) document.getElementById('filter-type').addEventListener('change', applyFilters);

    } catch (err) {
        grid.innerHTML = `<div class="col-span-full text-center py-20 text-red-500 font-black tracking-widest text-[10px] uppercase">Connection Error</div>`;
    }
}

// --- Individual Product Details Engine ---
async function productDetailsEngine(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        container.innerHTML = `<div class="text-center py-40"><h2 class="text-4xl font-serif font-black uppercase">Product Not Found</h2><a href="products.html" class="text-brand mt-4 inline-block font-black tracking-[0.3em] uppercase text-[10px] hover:underline">Return to Catalog</a></div>`;
        return;
    }

    try {
        const cacheBusterUrl = `${GITHUB_JSON_URL}?t=${new Date().getTime()}`;
        const response = await fetch(cacheBusterUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const allProducts = await response.json();
        const product = allProducts.find(p => p.id == productId);

        if (!product) {
            container.innerHTML = `<div class="text-center py-40"><h2 class="text-4xl font-serif font-black uppercase">Product Not Found</h2><a href="products.html" class="text-brand mt-4 inline-block font-black tracking-[0.3em] uppercase text-[10px] hover:underline">Return to Catalog</a></div>`;
            return;
        }

        // Generate Features List
        const featuresHtml = product.features && product.features.length > 0 
            ? `<ul class="space-y-4 mb-10">
                ${product.features.map(f => `<li class="flex items-start gap-4 text-sm md:text-base font-medium text-neutral-600 dark:text-neutral-400"><i class="fa-solid fa-check text-brand mt-1"></i> ${f}</li>`).join('')}
               </ul>`
            : '';

        // Generate Specs Table
        let specsHtml = '';
        if (product.specifications) {
            specsHtml = `<div class="mt-12"><h3 class="text-brand font-black text-[10px] tracking-[0.3em] uppercase mb-6">Technical Specifications</h3><div class="liquid-glass rounded-3xl border border-white/40 dark:border-white/10 overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800">`;
            for (const [key, value] of Object.entries(product.specifications)) {
                specsHtml += `
                    <div class="grid grid-cols-3 p-4 md:p-6 text-xs md:text-sm">
                        <div class="font-black tracking-widest uppercase text-neutral-500">${key}</div>
                        <div class="col-span-2 font-bold text-right md:text-left">${value}</div>
                    </div>`;
            }
            specsHtml += `</div></div>`;
        }

        // Render Page Layout (NO PRICE SHOWN)
        container.innerHTML = `
            <a href="javascript:history.back()" class="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase hover:text-brand transition-colors mb-12">
                <i class="fa-solid fa-arrow-left"></i> Back to Catalog
            </a>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                <div class="liquid-glass rounded-[40px] border border-white/40 dark:border-white/10 p-4 h-[500px] md:h-[600px]">
                    <div class="w-full h-full rounded-[32px] overflow-hidden relative">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                        <div class="absolute top-6 left-6 bg-black/40 backdrop-blur-md text-white px-5 py-3 rounded-full text-[10px] font-black tracking-[0.3em] uppercase border border-white/20 flex items-center gap-2 shadow-2xl">
                            <span class="w-2 h-2 bg-brand rounded-full animate-pulse"></span>
                            ${product.brand}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col justify-center">
                    <span class="text-brand font-black text-[10px] tracking-[0.5em] uppercase mb-4">${product.type}</span>
                    <h1 class="text-5xl md:text-6xl font-serif font-black tracking-tighter uppercase leading-none mb-8">${product.name}</h1>
                    
                    <p class="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed mb-10">
                        ${product.description}
                    </p>

                    ${featuresHtml}

                    <a href="https://wa.me/919629287903?text=Hello, I would like to inquire about the pricing and availability of the ${encodeURIComponent(product.name)} (ID: ${product.id})" target="_blank" class="flex items-center justify-center gap-4 w-full md:w-max bg-brand text-black px-12 py-5 rounded-3xl font-black text-[10px] tracking-[0.4em] hover:bg-white transition-all shadow-xl uppercase mt-4">
                        <i class="fa-brands fa-whatsapp text-lg"></i> Inquire Price on WhatsApp
                    </a>

                    ${specsHtml}
                </div>
            </div>
        `;

    } catch (err) {
        container.innerHTML = `<div class="text-center py-40 text-red-500 font-black tracking-widest text-[10px] uppercase">Failed to load product details.</div>`;
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