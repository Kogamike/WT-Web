const track = document.querySelector('.container-pag-3-track');
let cards = document.querySelectorAll('.service-card');
const prevBtn = document.querySelector('.btn-prev');
const nextBtn = document.querySelector('.btn-next');

// Constantes exactas definidas en tu CSS
const inactiveWidth = 260;
const activeWidth = 420;
const gap = 30;

// 1. Clonar primera y última tarjeta para el bucle infinito
const firstCardClone = cards[0].cloneNode(true);
const lastCardClone = cards[cards.length - 1].cloneNode(true);

track.appendChild(firstCardClone);
track.insertBefore(lastCardClone, cards[0]);

cards = document.querySelectorAll('.service-card');

let currentIndex = 2; // Inicia en la segunda tarjeta real

function updateSlider(withTransition = true) {
    // 1. Asignamos la clase active
    cards.forEach((card, i) => {
        card.classList.toggle('active', i === currentIndex);
    });

    // 2. Cálculo matemático 100% determinista (sin medir elementos a medio animar)
    let distanceToActiveCenter = 0;
    for (let i = 0; i < currentIndex; i++) {
        distanceToActiveCenter += inactiveWidth + gap; // Suma las tarjetas anteriores (260px) + gap
    }
    distanceToActiveCenter += activeWidth / 2; // Suma la mitad de la tarjeta activa (420px / 2)

    // 3. Centrar exactamente en la mitad de la ventana visible
    const containerWidth = track.parentElement.offsetWidth;
    const targetPosition = (containerWidth / 2) - distanceToActiveCenter;

    if (withTransition) {
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    } else {
        track.style.transition = 'none';
    }

    track.style.transform = `translateX(${targetPosition}px)`;
}

// Botón Siguiente
nextBtn.addEventListener('click', () => {
    if (currentIndex >= cards.length - 1) return;
    currentIndex++;
    updateSlider(true);
});

// Botón Anterior
prevBtn.addEventListener('click', () => {
    if (currentIndex <= 0) return;
    currentIndex--;
    updateSlider(true);
});

// Control del bucle infinito invisible
track.addEventListener('transitionend', () => {
    if (currentIndex === 0) {
        currentIndex = cards.length - 2;
        updateSlider(false); // Salto instantáneo sin animación
    }
    if (currentIndex === cards.length - 1) {
        currentIndex = 1;
        updateSlider(false); // Salto instantáneo sin animación
    }
});

// Inicializar al cargar
window.addEventListener('DOMContentLoaded', () => {
    updateSlider(false);
});

// Recalcular si cambia el tamaño de ventana
window.addEventListener('resize', () => {
    updateSlider(false);
});


























const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');

// Abrir / Cerrar ventana al hacer clic en el botón flotante
chatToggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
});

// Cerrar con el botón de la "X"
chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});