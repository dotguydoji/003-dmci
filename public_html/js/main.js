// Smooth scrolling for navigation links
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

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(25, 43, 82, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.21)';
    }
});

// Carousel functionality with fade effect and dynamic indicators
const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const nextButton = document.querySelector('.carousel-nav.next');
const prevButton = document.querySelector('.carousel-nav.prev');
const indicatorsContainer = document.querySelector('.carousel-indicators');

let currentSlide = 0;

// Dynamically create indicators based on number of slides
function createIndicators() {
    if (indicatorsContainer && slides.length > 0) {
        // Clear existing indicators
        indicatorsContainer.innerHTML = '';

        // Create new indicators for each slide
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

    // Update indicators
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
    // Initialize carousel with fade effect
    slides.forEach((slide, idx) => {
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.transition = 'opacity 1s ease-in-out';
        slide.style.opacity = idx === 0 ? '1' : '0';
        slide.style.zIndex = idx === 0 ? '2' : '1';

        // Fix: Ensure proper grid layout is maintained
        slide.style.display = 'grid';
        slide.style.gridTemplateColumns = '70% 30%';
        slide.style.alignItems = 'center';
    });

    createIndicators();
    updateCarousel();

    nextButton.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });

    prevButton.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });
}

// Newsletter subscribe button (basic validation)
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

// Optional: Mobile nav toggle (if you add a hamburger menu)
// const navToggle = document.querySelector('.nav-toggle');
// const navLinks = document.querySelector('.nav-links');
// if (navToggle && navLinks) {
//     navToggle.addEventListener('click', () => {
//         navLinks.classList.toggle('active');
//     });
// }

// Parallax effect for .hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        // Adjust the 0.5 value for stronger/weaker effect
        hero.style.backgroundPosition = `center ${scrolled * 0.1}px`;
    }
});

// Check if carousel section is in view
function isCarouselSectionInView() {
    const carouselSection = document.querySelector('.carousel-section');
    if (!carouselSection) return false;

    const rect = carouselSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Section is considered "in view" if at least 50% is visible
    return rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.5;
}

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (!isCarouselSectionInView()) return;

    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showSlide(currentSlide + 1);
    }
});


// Add this to your main.js file (uncomment and update the existing mobile nav section)

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}// Add this to your main.js file - Touch navigation for mobile carousel

// Touch/Swipe functionality for mobile
let startX = 0;
let endX = 0;
let isDragging = false;

function handleTouchStart(e) {
    if (window.innerWidth <= 768) {
        startX = e.touches[0].clientX;
        isDragging = true;
    }
}

function handleTouchMove(e) {
    if (!isDragging || window.innerWidth > 768) return;
    e.preventDefault(); // Prevent scrolling
}

function handleTouchEnd(e) {
    if (!isDragging || window.innerWidth > 768) return;

    endX = e.changedTouches[0].clientX;
    const swipeThreshold = 50; // Minimum swipe distance
    const swipeDistance = startX - endX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe left - next slide
            showSlide(currentSlide + 1);
        } else {
            // Swipe right - previous slide
            showSlide(currentSlide - 1);
        }
    }

    isDragging = false;
}

// Add touch event listeners to carousel
const carouselTrack = document.querySelector('.carousel-track');
if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: false });
    carouselTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
    carouselTrack.addEventListener('touchend', handleTouchEnd, { passive: false });
}

// Update the existing keyboard navigation to work only on desktop
document.addEventListener('keydown', (e) => {
    // Only allow keyboard navigation on desktop
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