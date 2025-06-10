
const otherImages = [
    // Hero section background image (from CSS)
    'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748836155107.jpg',

    // Featured projects section background images
    'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748836402049.jpg',
    'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748837636316.jpg',
    'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748837255254.jpg',

    // Carousel section slide images
    'images/bg-onedelta.jpg',
    'images/bg-solmera.jpg',
    'images/bg-fortis.jpg',
    'images/bg-aston.jpg',
    'images/bg-alder.jpg',
    'images/bg-allegra.jpg',
    'images/bg-kalea.jpg',
    'images/bg-oriana.jpg'
];

window.addEventListener('load', () => {
    otherImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});
