// Variables globales
let currentSlide = 0;
const totalSlides = 5;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initSlideNavigation();
    setupKeyboardControls();
});

// Navegación de slides
function initSlideNavigation() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    // Remover clase active de todos
    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.classList.remove('prev');
    });

    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });

    // Aplicar transición
    if (index > currentSlide) {
        slides[currentSlide].classList.add('prev');
    }

    // Activar nuevo slide
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// Controles de teclado
function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowRight':
                nextSlide();
                break;
            case 'ArrowLeft':
                previousSlide();
                break;
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
        }
    });
}

// Pantalla completa
function toggleFullscreen() {
    const icon = document.getElementById('fullscreenIcon');

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        icon.textContent = '⛶';
    } else {
        document.exitFullscreen();
        icon.textContent = '⛶';
    }
}

// Efectos en las cards de tecnología
document.querySelectorAll('.tech-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.add('shake');
        setTimeout(() => item.classList.remove('shake'), 500);
    });
});

// Navegación con rueda del ratón
let scrollTimeout;
document.addEventListener('wheel', (e) => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    }, 50);
}, { passive: true });

// Animaciones cuando los elementos entran en viewport
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos animables
document.querySelectorAll('.project-card, .tech-item, .adventure-item').forEach(el => {
    observer.observe(el);
});

// Mensaje de bienvenida en consola
console.log('%c✨ Bienvenido a mi portafolio! ✨', 'font-size: 20px; color: #ff6b35; font-weight: bold;');
console.log('%cGracias por visitar mi sitio web', 'font-size: 14px; color: #ffd700;');
