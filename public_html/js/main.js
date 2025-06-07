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

// Carousel functionality
const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const nextButton = document.querySelector('.carousel-nav.next');
const prevButton = document.querySelector('.carousel-nav.prev');
const indicators = Array.from(document.querySelectorAll('.carousel-indicator, .carousel-indicators .indicator'));

let currentSlide = 0;

function updateCarousel() {
    slides.forEach((slide, idx) => {
        slide.style.display = idx === currentSlide ? 'grid' : 'none';
    });
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
    updateCarousel();

    nextButton.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });

    prevButton.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });

    indicators.forEach((indicator, idx) => {
        indicator.addEventListener('click', () => {
            showSlide(idx);
        });
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


// Add this to your existing main.js file

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