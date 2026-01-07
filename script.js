// Variables globales
let currentSlide = 0;
const totalSlides = 5;
let dragonCount = 0;
let petHappiness = 50;
let petEnergy = 50;
let gameActive = false;
let gameScore = 0;
let dragonPosition = 50;
let coinInterval;
let scoreInterval;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initFireParticles();
    initCursorDragon();
    initSlideNavigation();
    initDragonCounter();
    setupKeyboardControls();
    activateEasterEggs();

    // Restaurar cursor normal para elementos interactivos
    const interactiveElements = document.querySelectorAll('button, a, .project-card, .tech-item');
    interactiveElements.forEach(el => {
        el.style.cursor = 'pointer';
    });
});

// Sistema de partículas de fuego
function initFireParticles() {
    const canvas = document.getElementById('fireParticles');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    class FireParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? '#ff6b35' : '#ff8c42';
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.opacity -= 0.005;

            if (this.opacity <= 0 || this.y < 0) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Crear partículas
    for (let i = 0; i < 50; i++) {
        particles.push(new FireParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Redimensionar canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Dragón cursor que sigue al mouse
function initCursorDragon() {
    const cursorDragon = document.getElementById('cursorDragon');
    let mouseX = 0, mouseY = 0;
    let dragonX = 0, dragonY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function followMouse() {
        const dx = mouseX - dragonX;
        const dy = mouseY - dragonY;

        dragonX += dx * 0.1;
        dragonY += dy * 0.1;

        cursorDragon.style.left = dragonX + 'px';
        cursorDragon.style.top = dragonY + 'px';

        // Rotar el dragón hacia el movimiento
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        cursorDragon.style.transform = `rotate(${angle}deg)`;

        requestAnimationFrame(followMouse);
    }

    followMouse();
}

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
        spawnSecretDragon();
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
        spawnSecretDragon();
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
            case 'd':
            case 'D':
                if (gameActive) {
                    moveDragon('right');
                }
                break;
            case 'a':
            case 'A':
                if (gameActive) {
                    moveDragon('left');
                }
                break;
        }
    });
}

// Funciones del dragón mascota
function feedDragon() {
    const pet = document.getElementById('dragonPet');
    const happinessEl = document.getElementById('happiness');
    const energyEl = document.getElementById('energy');

    petHappiness = Math.min(100, petHappiness + 15);
    petEnergy = Math.min(100, petEnergy + 10);

    happinessEl.textContent = petHappiness;
    energyEl.textContent = petEnergy;

    pet.classList.add('jump');
    setTimeout(() => pet.classList.remove('jump'), 500);

    createFloatingText('¡Ñam ñam! 🍖', pet);
    incrementDragonCount();
}

function playWithDragon() {
    const pet = document.getElementById('dragonPet');
    const happinessEl = document.getElementById('happiness');
    const energyEl = document.getElementById('energy');

    if (petEnergy < 10) {
        createFloatingText('¡Estoy cansado! 😴', pet);
        return;
    }

    petHappiness = Math.min(100, petHappiness + 20);
    petEnergy = Math.max(0, petEnergy - 10);

    happinessEl.textContent = petHappiness;
    energyEl.textContent = petEnergy;

    pet.classList.add('spin');
    setTimeout(() => pet.classList.remove('spin'), 1000);

    createFloatingText('¡Wheee! 🎉', pet);
    incrementDragonCount();
}

function dragonBreatheFire() {
    const pet = document.getElementById('dragonPet');
    const energyEl = document.getElementById('energy');

    if (petEnergy < 20) {
        createFloatingText('¡Sin energía! ⚡', pet);
        return;
    }

    petEnergy = Math.max(0, petEnergy - 20);
    energyEl.textContent = petEnergy;

    pet.classList.add('fire-effect');
    setTimeout(() => pet.classList.remove('fire-effect'), 500);

    // Crear efecto de fuego
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const fire = document.createElement('div');
            fire.textContent = '🔥';
            fire.style.position = 'absolute';
            fire.style.fontSize = '2rem';
            fire.style.left = pet.offsetLeft + Math.random() * 100 - 50 + 'px';
            fire.style.top = pet.offsetTop + 'px';
            fire.style.transition = 'all 1s ease-out';
            fire.style.pointerEvents = 'none';
            pet.parentElement.appendChild(fire);

            setTimeout(() => {
                fire.style.transform = `translateY(-100px) translateX(${Math.random() * 100 - 50}px)`;
                fire.style.opacity = '0';
            }, 10);

            setTimeout(() => fire.remove(), 1000);
        }, i * 100);
    }

    createFloatingText('¡FUEGO! 🔥🔥🔥', pet);
    incrementDragonCount();
}

// Texto flotante
function createFloatingText(text, element) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'absolute';
    floatingText.style.fontSize = '1.5rem';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.color = '#ffd700';
    floatingText.style.textShadow = '0 0 10px #ff6b35';
    floatingText.style.left = element.offsetLeft + element.offsetWidth / 2 + 'px';
    floatingText.style.top = element.offsetTop + 'px';
    floatingText.style.transition = 'all 2s ease-out';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '1000';

    element.parentElement.appendChild(floatingText);

    setTimeout(() => {
        floatingText.style.transform = 'translateY(-100px)';
        floatingText.style.opacity = '0';
    }, 10);

    setTimeout(() => floatingText.remove(), 2000);
}

// Minijuego: Atrapa las monedas
document.getElementById('startGame')?.addEventListener('click', startGame);

function startGame() {
    if (gameActive) return;

    gameActive = true;
    gameScore = 0;
    dragonPosition = 50;

    document.getElementById('score').textContent = gameScore;
    document.getElementById('startGame').textContent = '¡Jugando!';
    document.getElementById('startGame').disabled = true;

    const gameDragon = document.getElementById('gameDragon');
    gameDragon.style.left = dragonPosition + '%';

    // Spawn monedas
    coinInterval = setInterval(spawnCoin, 1000);

    // Timer del juego (30 segundos)
    setTimeout(endGame, 30000);
}

function endGame() {
    gameActive = false;
    clearInterval(coinInterval);

    document.getElementById('startGame').textContent = `¡Fin! Puntuación: ${gameScore}`;
    document.getElementById('startGame').disabled = false;

    createFloatingText(`¡${gameScore} monedas! 🏆`, document.getElementById('gameArea'));

    if (gameScore > 20) {
        spawnSecretDragon();
        spawnSecretDragon();
    }
}

function spawnCoin() {
    const gameArea = document.getElementById('gameArea');
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.textContent = '🪙';
    coin.style.left = Math.random() * 90 + '%';

    gameArea.appendChild(coin);

    // Animación de caída
    const fallDuration = 3000;
    const startTime = Date.now();

    const fall = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / fallDuration;

        if (progress >= 1) {
            clearInterval(fall);
            coin.remove();
            return;
        }

        const coinRect = coin.getBoundingClientRect();
        const dragonRect = document.getElementById('gameDragon').getBoundingClientRect();

        // Detectar colisión
        if (checkCollision(coinRect, dragonRect)) {
            gameScore++;
            document.getElementById('score').textContent = gameScore;
            coin.remove();
            clearInterval(fall);

            // Efecto visual
            const gameDragon = document.getElementById('gameDragon');
            gameDragon.classList.add('shake');
            setTimeout(() => gameDragon.classList.remove('shake'), 500);

            incrementDragonCount();
        }
    }, 16);
}

function moveDragon(direction) {
    const gameDragon = document.getElementById('gameDragon');

    if (direction === 'right') {
        dragonPosition = Math.min(95, dragonPosition + 5);
    } else {
        dragonPosition = Math.max(5, dragonPosition - 5);
    }

    gameDragon.style.left = dragonPosition + '%';
}

function checkCollision(rect1, rect2) {
    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

// Contador de dragones (Easter egg)
function initDragonCounter() {
    const counter = document.querySelector('.dragon-counter');

    counter.addEventListener('click', () => {
        incrementDragonCount(10);
        counter.classList.add('shake');
        setTimeout(() => counter.classList.remove('shake'), 500);
    });
}

function incrementDragonCount(amount = 1) {
    dragonCount += amount;
    document.getElementById('dragonCount').textContent = dragonCount;

    // Easter eggs por hitos
    if (dragonCount === 10) {
        createGlobalFloatingText('¡10 dragones! 🎉');
        spawnSecretDragon();
    } else if (dragonCount === 50) {
        createGlobalFloatingText('¡50 dragones! ¡Eres un maestro! 🏆');
        for (let i = 0; i < 5; i++) {
            setTimeout(() => spawnSecretDragon(), i * 200);
        }
    } else if (dragonCount === 100) {
        createGlobalFloatingText('¡100 DRAGONES! ¡LEYENDA DEL REINO! 👑');
        dragonRain();
    }
}

function createGlobalFloatingText(text) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'fixed';
    floatingText.style.top = '50%';
    floatingText.style.left = '50%';
    floatingText.style.transform = 'translate(-50%, -50%)';
    floatingText.style.fontSize = '3rem';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.color = '#ffd700';
    floatingText.style.textShadow = '0 0 20px #ff6b35';
    floatingText.style.zIndex = '10000';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.transition = 'all 2s ease-out';

    document.body.appendChild(floatingText);

    setTimeout(() => {
        floatingText.style.transform = 'translate(-50%, -150%) scale(1.5)';
        floatingText.style.opacity = '0';
    }, 100);

    setTimeout(() => floatingText.remove(), 2100);
}

// Dragón secreto que cruza la pantalla
function spawnSecretDragon() {
    const secretDragon = document.createElement('div');
    secretDragon.className = 'secret-dragon';

    const dragons = ['🐉', '🐲', '🐉', '🐲', '🔥'];
    secretDragon.textContent = dragons[Math.floor(Math.random() * dragons.length)];

    secretDragon.style.top = Math.random() * 80 + 10 + '%';

    document.body.appendChild(secretDragon);

    secretDragon.addEventListener('click', () => {
        incrementDragonCount(5);
        secretDragon.style.animation = 'spin 0.5s';
    });

    setTimeout(() => secretDragon.remove(), 5000);
}

// Lluvia de dragones
function dragonRain() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const dragon = document.createElement('div');
            dragon.textContent = ['🐉', '🐲', '🔥'][Math.floor(Math.random() * 3)];
            dragon.style.position = 'fixed';
            dragon.style.left = Math.random() * 100 + '%';
            dragon.style.top = '-50px';
            dragon.style.fontSize = '2rem';
            dragon.style.zIndex = '10000';
            dragon.style.pointerEvents = 'none';
            dragon.style.transition = 'all 3s ease-in';

            document.body.appendChild(dragon);

            setTimeout(() => {
                dragon.style.top = '110vh';
                dragon.style.transform = `rotate(${Math.random() * 720 - 360}deg)`;
            }, 10);

            setTimeout(() => dragon.remove(), 3000);
        }, i * 100);
    }
}

// Easter eggs
function activateEasterEggs() {
    // Doble click en el logo
    const logo = document.querySelector('.dragon-logo');
    if (logo) {
        logo.addEventListener('dblclick', () => {
            logo.classList.add('spin');
            setTimeout(() => logo.classList.remove('spin'), 1000);
            incrementDragonCount(3);
            createGlobalFloatingText('¡Dragón secreto desbloqueado! 🎉');
        });
    }

    // Hover en tarjetas de proyectos
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const element = card.dataset.element;
            const effects = {
                'fire': '🔥',
                'ice': '❄️',
                'lightning': '⚡',
                'shadow': '🌑'
            };

            if (Math.random() > 0.7) {
                createFloatingText(effects[element] || '✨', card);
            }
        });
    });

    // Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            createGlobalFloatingText('¡CÓDIGO KONAMI! ¡PODER MÁXIMO! 🚀');
            dragonRain();
            incrementDragonCount(30);
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
        item.classList.add('fire-effect');
        setTimeout(() => item.classList.remove('fire-effect'), 500);
        incrementDragonCount();
    });
});

// Auto-avance de slides (opcional, comentado por defecto)
/*
let autoAdvanceInterval = setInterval(() => {
    if (currentSlide < totalSlides - 1) {
        nextSlide();
    } else {
        goToSlide(0);
    }
}, 10000);

// Pausar auto-avance en interacción
document.addEventListener('click', () => {
    clearInterval(autoAdvanceInterval);
});
*/

// Efectos de sonido (simulados con vibración en móviles)
function vibrateIfPossible(pattern = 50) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

// Añadir vibración a botones importantes
document.querySelectorAll('.dragon-button, .nav-button, .feed-button, .play-button, .fire-button').forEach(button => {
    button.addEventListener('click', () => vibrateIfPossible(50));
});

// Reducir energía del dragón mascota con el tiempo
setInterval(() => {
    if (petEnergy > 0) {
        petEnergy = Math.max(0, petEnergy - 1);
        document.getElementById('energy').textContent = petEnergy;
    }

    if (petHappiness > 0) {
        petHappiness = Math.max(0, petHappiness - 0.5);
        document.getElementById('happiness').textContent = Math.floor(petHappiness);
    }
}, 5000);

// Mensaje de bienvenida en consola
console.log('%c🐉 ¡Bienvenido al Reino del Código! 🐉', 'font-size: 20px; color: #ff6b35; font-weight: bold;');
console.log('%cPista: Intenta hacer doble clic en el logo del dragón...', 'font-size: 14px; color: #ffd700;');
console.log('%c¿Conoces el código Konami? 👀', 'font-size: 14px; color: #ff8c42;');

// Efectos parallax en scroll (para navegación con rueda)
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

console.log('%c✨ Presentación cargada con éxito! ✨', 'font-size: 16px; color: #4CAF50; font-weight: bold;');
