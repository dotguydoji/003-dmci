

// ######################### SMOOTSCROLLING EFFECTS
document.addEventListener('DOMContentLoaded', function () {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSection = document.querySelector(this.getAttribute('href'));
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ############################## SCROLL SPY FUNCTION 
  const sections = document.querySelectorAll('.location-section');
  const navLinks = document.querySelectorAll('.scrollspy-nav a');

  function updateActiveLink() {
    const fromTop = window.scrollY + 100;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const correspondingLink = document.querySelector(`.scrollspy-nav a[href="#${section.id}"]`);
      
      navLinks.forEach(link => link.classList.remove('active'));
      if (fromTop >= sectionTop && fromTop <= sectionTop + sectionHeight && correspondingLink) {
        correspondingLink.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // ######################################## Disable right-click and key combinations
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', function (e) {
    if (
      e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || 
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
    }
  });

  // ####################################### Detect if DevTools is open
  (function () {
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function () {
        alert('Developer tools are open!');
      }
    });
    console.log(element);
  })();
});
