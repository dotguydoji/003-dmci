const otherImages = [
    '/bm-img/sorrel-residences-featured-image-large_5_orig.jpg',
    '/bm-img/the-camden-place-building-297-medium_8.jpg',
    '/bm-img/torre.jpg',
    '/bm-img/illumina.jpg',
    '/bm-img/fortis.jpg',
    '/bm-img/brio.jpg',
    '/bm-img/fairway.jpg',
    '/bm-img/laverti.jpg',
    '/bm-img/aston.jpg',
    '/bm-img/anissa.webp',
    '/bm-img/quezon-property1.jpg',
    '/bm-img/quezon-property2.jpg',
    '/bm-img/mandaluyong-property1.jpg',
    '/bm-img/mandaluyong-property2.jpg',
    '/bm-img/pasig-property1.jpg',
    '/bm-img/pasig-property2.jpg',
    '/bm-img/taguig-property1.jpg',
    '/bm-img/taguig-property2.jpg',
    '/bm-img/caloocan-property1.jpg',
    '/bm-img/caloocan-property2.jpg',
    '/bm-img/laspinas-property1.jpg',
    '/bm-img/laspinas-property2.jpg',
    '/bm-img/paranaque-property1.jpg',
    '/bm-img/paranaque-property2.jpg',
    '/bm-img/muntinlupa-property1.jpg',
    '/bm-img/muntinlupa-property2.jpg',
    '/bm-img/benguet-property1.jpg',
    '/bm-img/benguet-property2.jpg',
    '/bm-img/batangas-property1.jpg',
    '/bm-img/batangas-property2.jpg',
    '/bm-img/cavite-property1.jpg',
    '/bm-img/cavite-property2.jpg',
    '/bm-img/baguio-property1.jpg',
    '/bm-img/baguio-property2.jpg',
    '/bm-img/boracay-property1.jpg',
    '/bm-img/boracay-property2.jpg',
    '/bm-img/kalea.jpg',
    '/bm-img/verdon.jpg'
];
window.addEventListener('load', () => {
    setTimeout(() => {
        otherImages.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onerror = () => {
                console.warn(`Failed to preload image: ${src}`);
            };
            img.onload = () => {
                console.log(`Successfully preloaded: ${src}`);
            };
        });
    }, 100);
});
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.scrollspy-nav a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const targetId = link.getAttribute('href').substring(1);
            const sectionImages = otherImages.filter(src =>
                src.includes(targetId) ||
                (targetId === 'manila' && ['sorrel', 'camden', 'torre', 'illumina'].some(name => src.includes(name))) ||
                (targetId === 'makati' && ['fortis', 'brio'].some(name => src.includes(name))) ||
                (targetId === 'pasay' && ['fairway', 'laverti', 'aston', 'anissa'].some(name => src.includes(name))) ||
                (targetId === 'cebu' && src.includes('kalea')) ||
                (targetId === 'davao' && src.includes('verdon'))
            );
            sectionImages.forEach(src => {
                const img = new Image();
                img.src = src;
            });
        }, { once: true });
    });
});