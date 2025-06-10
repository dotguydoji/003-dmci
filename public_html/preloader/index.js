const otherImages = [
    'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748836402049.jpg',
    'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748837636316.jpg',
    'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748837255254.jpg',
    'images/bg-onedelta.jpg',
    'images/bg-solmera.jpg',
    'images/bg-fortis.jpg',
    'images/bg-aston.jpg',
    'images/bg-alder.jpg',
    'images/bg-allegra.jpg',
    'images/bg-kalea.jpg',
    'images/bg-oriana.jpg'
];
const preloadConfig = {
    delay: 150,
    enableLogging: false,
    enableProgressTracking: true,
    priorityImages: [
        'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748836402049.jpg',
        'images/bg-onedelta.jpg',
        'images/bg-solmera.jpg'
    ],
    retryAttempts: 2,
    retryDelay: 1000
};
let loadedCount = 0;
let totalImages = otherImages.length;
let failedImages = [];
function log(message, type = 'info') {
    if (preloadConfig.enableLogging) {
        console[type](`[Image Preload] ${message}`);
    }
}
function preloadImage(src, retries = 0) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            log(`✓ Successfully preloaded: ${src}`);
            if (preloadConfig.enableProgressTracking) {
                updateProgress();
            }
            resolve(src);
        };
        img.onerror = () => {
            if (retries < preloadConfig.retryAttempts) {
                log(`⚠ Retrying (${retries + 1}/${preloadConfig.retryAttempts}): ${src}`, 'warn');
                setTimeout(() => {
                    preloadImage(src, retries + 1).then(resolve).catch(reject);
                }, preloadConfig.retryDelay);
            } else {
                failedImages.push(src);
                log(`✗ Failed to preload after ${preloadConfig.retryAttempts} attempts: ${src}`, 'error');
                reject(src);
            }
        };
        img.src = src;
    });
}
function updateProgress() {
    const progress = Math.round((loadedCount / totalImages) * 100);
    log(`Progress: ${loadedCount}/${totalImages} (${progress}%)`);
    window.dispatchEvent(new CustomEvent('imagePreloadProgress', {
        detail: {
            loaded: loadedCount,
            total: totalImages,
            percentage: progress,
            failed: failedImages.length
        }
    }));
    if (loadedCount === totalImages) {
        log(`🎉 All images preloaded successfully! Failed: ${failedImages.length}`);
        window.dispatchEvent(new CustomEvent('imagePreloadComplete', {
            detail: {
                totalLoaded: loadedCount,
                totalFailed: failedImages.length,
                failedImages: failedImages
            }
        }));
    }
}
function preloadWithPriority() {
    log('Starting image preload...');
    const priorityImages = otherImages.filter(src =>
        preloadConfig.priorityImages.includes(src)
    );
    const regularImages = otherImages.filter(src =>
        !preloadConfig.priorityImages.includes(src)
    );
    if (priorityImages.length > 0) {
        log(`Loading ${priorityImages.length} priority images first...`);
        Promise.allSettled(priorityImages.map(src => preloadImage(src)))
            .then(() => {
                log('Priority images loaded, starting regular images...');
                Promise.allSettled(regularImages.map(src => preloadImage(src)))
                    .then(() => {
                        log('Regular images loading complete');
                    });
            });
    } else {
        Promise.allSettled(otherImages.map(src => preloadImage(src)))
            .then(() => {
                log('All images loading complete');
            });
    }
}
function isSlowConnection() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        return connection.effectiveType === 'slow-2g' ||
            connection.effectiveType === '2g' ||
            connection.saveData === true;
    }
    return false;
}
window.addEventListener('load', () => {
    if (isSlowConnection()) {
        log('Slow connection detected, reducing preload scope...');
        const limitedImages = preloadConfig.priorityImages;
        totalImages = limitedImages.length;
        Promise.allSettled(limitedImages.map(src => preloadImage(src)));
        return;
    }
    setTimeout(() => {
        preloadWithPriority();
    }, preloadConfig.delay);
});
document.addEventListener('DOMContentLoaded', () => {
    const sectionImageMap = {
        '#section2': [
            'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748836402049.jpg',
            'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748837636316.jpg',
            'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748837255254.jpg'
        ],
        '#carousel-section': [
            'images/bg-onedelta.jpg',
            'images/bg-solmera.jpg',
            'images/bg-fortis.jpg',
            'images/bg-aston.jpg',
            'images/bg-alder.jpg',
            'images/bg-allegra.jpg',
            'images/bg-kalea.jpg',
            'images/bg-oriana.jpg'
        ]
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = `#${entry.target.id}`;
                const sectionImages = sectionImageMap[sectionId];
                if (sectionImages) {
                    log(`Section ${sectionId} in view, preloading its images...`);
                    sectionImages.forEach(src => {
                        if (!document.querySelector(`img[src="${src}"]`)) {
                            preloadImage(src);
                        }
                    });
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        rootMargin: '100px'
    });
    Object.keys(sectionImageMap).forEach(sectionId => {
        const section = document.querySelector(sectionId);
        if (section) {
            observer.observe(section);
        }
    });
});
window.addEventListener('imagePreloadProgress', (event) => {
});
window.addEventListener('imagePreloadComplete', (event) => {
});
document.addEventListener('DOMContentLoaded', () => {
    const carouselTriggers = document.querySelectorAll('[data-bs-slide], .carousel-control-prev, .carousel-control-next');
    carouselTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            const carouselImages = [
                'images/bg-onedelta.jpg',
                'images/bg-solmera.jpg',
                'images/bg-fortis.jpg',
                'images/bg-aston.jpg',
                'images/bg-alder.jpg',
                'images/bg-allegra.jpg',
                'images/bg-kalea.jpg',
                'images/bg-oriana.jpg'
            ];
            carouselImages.forEach(src => preloadImage(src));
        }, { once: true });
    });
    const featuredSection = document.querySelector('#section2');
    if (featuredSection) {
        featuredSection.addEventListener('mouseenter', () => {
            const featuredImages = [
                'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748836402049.jpg',
                'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748837636316.jpg',
                'https://www.dmcihomes.com/uploads/news/dmci-homes-to-introduce-premium-loft-units-1748837255254.jpg'
            ];
            featuredImages.forEach(src => preloadImage(src));
        }, { once: true });
    }
});