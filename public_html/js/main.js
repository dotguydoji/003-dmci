document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.length > 1 && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(25, 43, 82, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.21)';
    }
});
const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const nextButton = document.querySelector('.carousel-nav.next');
const prevButton = document.querySelector('.carousel-nav.prev');
const indicatorsContainer = document.querySelector('.carousel-indicators');
let currentSlide = 0;
function createIndicators() {
    if (indicatorsContainer && slides.length > 0) {
        indicatorsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                showSlide(index);
            });
            indicatorsContainer.appendChild(indicator);
        });
    }
}
function updateCarousel() {
    slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
            slide.style.opacity = '1';
            slide.style.zIndex = '2';
        } else {
            slide.style.opacity = '0';
            slide.style.zIndex = '1';
        }
    });
    const indicators = document.querySelectorAll('.carousel-indicator, .carousel-indicators .indicator');
    indicators.forEach((ind, idx) => {
        if (idx === currentSlide) {
            ind.classList.add('active');
        } else {
            ind.classList.remove('active');
        }
    });
}
function showSlide(idx) {
    currentSlide = (idx + slides.length) % slides.length;
    updateCarousel();
}
if (slides.length > 0) {
    slides.forEach((slide, idx) => {
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.transition = 'opacity 1s ease-in-out';
        slide.style.opacity = idx === 0 ? '1' : '0';
        slide.style.zIndex = idx === 0 ? '2' : '1';
        slide.style.display = 'grid';
        slide.style.gridTemplateColumns = '70% 30%';
        slide.style.alignItems = 'center';
    });
    createIndicators();
    updateCarousel();
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }
}
const newsletterBtn = document.querySelector('.newsletter button');
const newsletterInput = document.querySelector('.newsletter input[type="email"]');
if (newsletterBtn && newsletterInput) {
    newsletterBtn.addEventListener('click', () => {
        const email = newsletterInput.value.trim();
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Thank you for subscribing!');
            newsletterInput.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    });
}
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        hero.style.backgroundPosition = `center ${scrolled * 0.1}px`;
    }
});
function isCarouselSectionInView() {
    const carouselSection = document.querySelector('.carousel-section');
    if (!carouselSection) return false;
    const rect = carouselSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    return rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5;
}
document.addEventListener('keydown', (e) => {
    if (window.innerWidth <= 768) return;
    if (!isCarouselSectionInView()) return;
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showSlide(currentSlide + 1);
    }
});
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let isDragging = false;
let isHorizontalSwipe = false;
function handleTouchStart(e) {
    if (window.innerWidth <= 768) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        isHorizontalSwipe = false;
    }
}
function handleTouchMove(e) {
    if (!isDragging || window.innerWidth > 768) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = Math.abs(currentX - startX);
    const deltaY = Math.abs(currentY - startY);
    if (deltaX > 10 || deltaY > 10) {
        if (deltaX > deltaY) {
            isHorizontalSwipe = true;
            e.preventDefault();
        } else {
            isHorizontalSwipe = false;
        }
    }
}
function handleTouchEnd(e) {
    if (!isDragging || window.innerWidth > 768 || !isHorizontalSwipe) {
        isDragging = false;
        return;
    }
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    const swipeThreshold = 50;
    const swipeDistance = startX - endX;
    const verticalDistance = Math.abs(startY - endY);
    if (Math.abs(swipeDistance) > swipeThreshold && verticalDistance < 100) {
        if (swipeDistance > 0) {
            showSlide(currentSlide + 1);
        } else {
            showSlide(currentSlide - 1);
        }
    }
    isDragging = false;
    isHorizontalSwipe = false;
}
const carouselTrack = document.querySelector('.carousel-track');
if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: true });
    carouselTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
    carouselTrack.addEventListener('touchend', handleTouchEnd, { passive: true });
}
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        const searchInput = document.getElementById('search-bar');
        const searchContainer = document.querySelector('.search-container');
        const containerInput = document.querySelector('.container-input');
        const resultsContainer = document.getElementById('results');
        if (searchInput) {
            console.log('Search input found:', searchInput);
            searchInput.style.pointerEvents = 'auto';
            searchInput.style.cursor = 'text';
            searchInput.style.position = 'relative';
            searchInput.style.zIndex = '1003';
            if (containerInput) {
                containerInput.style.pointerEvents = 'auto';
            }
            if (searchContainer) {
                searchContainer.style.pointerEvents = 'auto';
            }
            const svgIcon = containerInput?.querySelector('svg');
            if (svgIcon) {
                svgIcon.style.pointerEvents = 'none';
                svgIcon.style.zIndex = '1004';
            }
            let isExpanded = false;
            searchInput.addEventListener('focus', function () {
                console.log('Input focused - expanding');
                this.style.width = '250px';
                this.style.opacity = '1';
                isExpanded = true;
            });
            searchInput.addEventListener('blur', function () {
                console.log('Input lost focus - checking if should shrink');
                setTimeout(() => {
                    if (!this.value.trim()) {
                        this.style.width = '150px';
                        this.style.opacity = '0.8';
                        isExpanded = false;
                        if (resultsContainer) {
                            resultsContainer.style.display = 'none';
                        }
                    }
                }, 150);
            });
            searchInput.addEventListener('input', function () {
                if (this.value.trim()) {
                    this.style.width = '250px';
                    this.style.opacity = '1';
                    isExpanded = true;
                } else {
                    if (resultsContainer) {
                        resultsContainer.style.display = 'none';
                    }
                }
            });
            searchInput.addEventListener('click', function (e) {
                console.log('Input clicked successfully!');
                this.focus();
                e.stopPropagation();
            });
            searchInput.addEventListener('mouseenter', function () {
                if (!isExpanded) {
                    this.style.opacity = '0.9';
                }
            });
            searchInput.addEventListener('mouseleave', function () {
                if (!isExpanded && document.activeElement !== this) {
                    this.style.opacity = '0.8';
                }
            });
        } else {
            console.error('Search input not found! Check if element ID "search-bar" exists.');
        }
    }, 100);
});
document.addEventListener('click', function (e) {
    const searchInput = document.getElementById('search-bar');
    const searchContainer = document.querySelector('.search-container');
    const resultsContainer = document.getElementById('results');
    const isDropdownItem = e.target.classList.contains('dropdown-item') ||
        e.target.closest('.dropdown-item');
    if (isDropdownItem) {
        console.log('Dropdown item clicked - allowing navigation');
        return;
    }
    if (searchInput && searchContainer && !searchContainer.contains(e.target)) {
        console.log('Clicked outside search - shrinking input');
        if (!searchInput.value.trim()) {
            searchInput.style.width = '150px';
            searchInput.style.opacity = '0.8';
            searchInput.blur();
        }
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }
    else if (searchContainer && searchContainer.contains(e.target) &&
        e.target !== searchInput && !resultsContainer.contains(e.target)) {
        if (searchInput) {
            console.log('Clicked on search area - focusing input');
            searchInput.focus();
        }
    }
});
document.addEventListener('keydown', function (e) {
    const searchInput = document.getElementById('search-bar');
    const resultsContainer = document.getElementById('results');
    if (e.key === 'Escape' && searchInput) {
        console.log('Escape pressed - shrinking search');
        searchInput.blur();
        if (!searchInput.value.trim()) {
            searchInput.style.width = '150px';
            searchInput.style.opacity = '0.8';
        }
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }
});
window.addEventListener('resize', function () {
    const searchInput = document.getElementById('search-bar');
    if (searchInput && window.innerWidth <= 768) {
        if (!document.activeElement === searchInput) {
            searchInput.style.width = '120px';
        }
    }
});