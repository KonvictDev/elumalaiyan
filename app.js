/**
 * Elumalaiyan Enterprises - Global App Controller
 * Version: 2.2 (CORS Protection & Debugging)
 */

async function productEngine({ category = null, featuredOnly = false, containerId, searchBoxId = null }) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = `<div class="col-span-full text-center py-10 opacity-50 uppercase tracking-widest text-xs">Loading Catalog...</div>`;

    try {
        // We use an absolute path for local fetching
        const response = await fetch('./products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const allProducts = await response.json();

        const render = (items) => {
            if (items.length === 0) {
                grid.innerHTML = `<p class="col-span-full text-center py-10 text-gray-400">No products found.</p>`;
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
        console.error("CATALOG ERROR:", err);
        grid.innerHTML = `
            <div class="col-span-full text-center py-10 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/50">
                <p class="text-red-500 font-bold">Catalog Load Failed</p>
                <p class="text-xs text-gray-500 mt-2">Error: ${err.message}</p>
                <div class="mt-6 text-[10px] space-y-2 uppercase tracking-widest">
                    <p class="text-gray-900 dark:text-white font-bold">Solution:</p>
                    <p>1. Open VS Code</p>
                    <p>2. Install "Live Server" Extension</p>
                    <p>3. Right-click index.html -> "Open with Live Server"</p>
                </div>
            </div>`;
    }
}

// Global UI Initialization
document.addEventListener('DOMContentLoaded', () => {
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
    const mb = document.getElementById('mobile-menu-button');
    const mm = document.getElementById('mobile-menu');
    if (mb && mm) mb.onclick = () => mm.classList.toggle('hidden');
});