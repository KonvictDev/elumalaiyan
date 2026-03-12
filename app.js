/**
 * Elumalaiyan Enterprises - Global App Controller
 * Version: 2.5 (Live GitHub Data Integration)
 */

// Your live GitHub data source
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/KonvictDev/elumalaiyan/refs/heads/main/products.json';

async function productEngine({ category = null, featuredOnly = false, containerId, searchBoxId = null }) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    // Loading State
    grid.innerHTML = `<div class="col-span-full text-center py-10 opacity-50 uppercase tracking-widest text-xs">Synchronizing with Catalog...</div>`;

    try {
        const response = await fetch(GITHUB_JSON_URL);
        
        if (!response.ok) throw new Error(`Network Error: ${response.status}`);

        const allProducts = await response.json();

        const render = (items) => {
            if (items.length === 0) {
                grid.innerHTML = `<p class="col-span-full text-center py-10 text-gray-400">No items found in this category.</p>`;
                return;
            }
            grid.innerHTML = items.map(p => `
                <article class="bg-white dark:bg-neutral-900 rounded-xl p-5 border border-gray-200 dark:border-neutral-800 hover:border-brand transition-all group animate-fade-in shadow-sm hover:shadow-xl">
                    <div class="h-52 bg-gray-50 dark:bg-white rounded mb-4 overflow-hidden flex items-center justify-center">
                        <img src="${p.image}" alt="${p.name}" loading="lazy" class="max-h-full object-contain group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <span class="text-[10px] uppercase font-bold text-brand/70 tracking-widest">${p.category}</span>
                    <h3 class="font-bold text-gray-900 dark:text-gray-200 uppercase tracking-tighter mt-1">${p.name}</h3>
                    <p class="text-xs text-gray-500 mt-1 font-medium uppercase tracking-widest">${p.brands}</p>
                    <a href="https://wa.me/919876543210?text=Inquiry about ${p.name}" class="mt-4 block text-center border border-gray-200 dark:border-neutral-800 py-2.5 rounded-lg font-bold hover:bg-brand hover:text-black hover:border-brand transition-all">INQUIRE PRICE</a>
                </article>
            `).join('');
        };

        let filtered = allProducts;
        if (category) filtered = filtered.filter(p => p.category === category);
        if (featuredOnly) filtered = filtered.filter(p => p.featured === true);

        render(filtered);

        // Search functionality
        if (searchBoxId) {
            const searchInput = document.getElementById(searchBoxId);
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const searched = filtered.filter(p => 
                    p.name.toLowerCase().includes(term) || 
                    p.brands.toLowerCase().includes(term) ||
                    p.category.toLowerCase().includes(term)
                );
                render(searched);
            });
        }

    } catch (err) {
        console.error("REMOTE FETCH ERROR:", err);
        grid.innerHTML = `
            <div class="col-span-full text-center py-10 border-2 border-dashed border-red-200 dark:border-red-900/30 rounded-2xl">
                <p class="text-red-500 font-bold uppercase tracking-widest text-xs">Remote Connection Failed</p>
                <p class="text-[10px] text-gray-500 mt-2 italic">Error: ${err.message}</p>
            </div>`;
    }
}

// Global UI Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Theme Logic
    const t = document.getElementById('theme-toggle');
    const i = document.getElementById('theme-icon');
    if (t && i) {
        const updateIcon = (isDark) => i.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        if (document.documentElement.classList.contains('dark')) updateIcon(true);
        t.onclick = () => {
            const dark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('color-theme', dark ? 'dark' : 'light');
            updateIcon(dark);
        };
    }

    // Mobile Navigation Logic
    const mb = document.getElementById('mobile-menu-button');
    const mm = document.getElementById('mobile-menu');
    if (mb && mm) mb.onclick = () => mm.classList.toggle('hidden');
});
