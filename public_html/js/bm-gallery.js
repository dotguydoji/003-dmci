document.addEventListener('DOMContentLoaded', function () {
  const gallery = document.querySelector('.gallery');
  const modal = document.querySelector('.modal');
  const modalImg = modal.querySelector('img');
  const closeBtn = modal.querySelector('.close-btn');
  const prevBtn = modal.querySelector('.prev-btn');
  const nextBtn = modal.querySelector('.next-btn');
  const dotsContainer = modal.querySelector('.dots-container');
  let currentImageIndex = 0;
  const images = Array.from(gallery.querySelectorAll('img'));
  images.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.addEventListener('click', () => showImage(index));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);
  gallery.addEventListener('click', function (e) {
    const clickedItem = e.target.closest('.gallery-item');
    if (!clickedItem) return;
    const clickedImg = clickedItem.querySelector('img');
    currentImageIndex = images.indexOf(clickedImg);
    showImage(currentImageIndex);
    modal.style.display = 'block';
  });
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showImage(currentImageIndex);
  });
  nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex);
  });
  document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'none') return;
    if (e.key === 'ArrowLeft') {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      showImage(currentImageIndex);
    }
    else if (e.key === 'ArrowRight') {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      showImage(currentImageIndex);
    }
    else if (e.key === 'Escape') {
      modal.style.display = 'none';
    }
  });
  function showImage(index) {
    modalImg.src = images[index].src;
    modalImg.alt = images[index].alt;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
});
document.addEventListener('DOMContentLoaded', function () {
  const gallery = document.querySelector('.property-gallery');
  const modal = document.querySelector('.property-modal');
  const modalImg = modal.querySelector('img');
  const closeBtn = modal.querySelector('.property-close-btn');
  const prevBtn = modal.querySelector('.property-prev-btn');
  const nextBtn = modal.querySelector('.property-next-btn');
  const dotsContainer = modal.querySelector('.property-dots-container');
  let currentImageIndex = 0;
  const images = Array.from(gallery.querySelectorAll('img'));
  images.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('property-dot');
    dot.addEventListener('click', () => showImage(index));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);
  gallery.addEventListener('click', function (e) {
    const clickedItem = e.target.closest('.property-gallery-item');
    if (!clickedItem) return;
    const clickedImg = clickedItem.querySelector('img');
    currentImageIndex = images.indexOf(clickedImg);
    showImage(currentImageIndex);
    modal.style.display = 'block';
  });
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showImage(currentImageIndex);
  });
  nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex);
  });
  document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'none') return;
    if (e.key === 'ArrowLeft') {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      showImage(currentImageIndex);
    }
    else if (e.key === 'ArrowRight') {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      showImage(currentImageIndex);
    }
    else if (e.key === 'Escape') {
      modal.style.display = 'none';
    }
  });
  function showImage(index) {
    modalImg.src = images[index].src;
    modalImg.alt = images[index].alt;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
});