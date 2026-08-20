/* ============================================================
    0. CONFIGURACIÓN Y ESTADO INICIAL
============================================================ */
const URL_API = "http://localhost:3000/registro";
const KEY_USUARIO = 'nombre_usuario_wt';

// Cargamos el carrito desde la memoria al iniciar
let carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];

/* ============================================================
    1. ELEMENTOS DEL DOM (SELECTORES)
============================================================ */
// Pop-up Login
const wrapper = document.querySelector('.wrapper');
const btnOpenLogin = document.querySelector('.btn-open-login'); // Icono usuario (invitado)
const iconClose = document.querySelector('.icon-close');


// Vistas de Navegación
const loggedOutView = document.getElementById('logged-out-view');
const loggedInView = document.getElementById('logged-in-view');
const userNameSpan = document.querySelector('.user-name');

// Dropdown de Perfil
const userProfileBtn = document.getElementById('userProfileBtn');
const userDropdown = document.getElementById('userDropdown');
const logoutLink = document.querySelector('.logout-link');

// Carrito (Sidebar)
const cartLink = document.querySelector('.cart-link'); 
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartBtn = document.querySelector('.close-cart');
const btnProcederPago = document.getElementById('btn-pago-final');

/* ============================================================
    2. LÓGICA DE IDENTIDAD (LOGIN, DROPDOWN Y LOGOUT)
============================================================ */

/*login nuevo*/


// --- ACTUALIZAR NAVEGACIÓN ---
function actualizarNavegacion() {
    const usuarioGuardado = localStorage.getItem(KEY_USUARIO);

    if (usuarioGuardado) {
        if (loggedOutView) loggedOutView.style.display = 'none';
        if (loggedInView) loggedInView.style.display = 'flex';
        if (userNameSpan) userNameSpan.textContent = usuarioGuardado;
    } else {
        if (loggedOutView) loggedOutView.style.display = 'block';
        if (loggedInView) loggedInView.style.display = 'none';
    }
}

// --- POP-UP LOGIN (ABRIR/CERRAR) ---
if (btnOpenLogin) {
    btnOpenLogin.addEventListener('click', () => wrapper.classList.add('active-popup'));
}
if (iconClose) {
    iconClose.addEventListener('click', () => wrapper.classList.remove('active-popup'));
}

// --- FORMULARIO DE LOGIN ---


// --- DROPDOWN DEL PERFIL ---
if (userProfileBtn && userDropdown) {
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Alternamos visibilidad
        const isVisible = userDropdown.style.display === 'block';
        userDropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', () => {
        userDropdown.style.display = 'none';
    });
}

// --- CERRAR SESIÓN ---
if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("¿Estás seguro de que quieres salir, Mago?")) {
            localStorage.removeItem(KEY_USUARIO);
            window.location.reload(); // Recarga para limpiar todo el estado
        }
    });
}


/* ============================================================
    3. LOGICA GLOBAL DEL CARRITO - WIZARDS OF TOMORROW
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. ESTADO Y SELECTORES PRINCIPALES
    let carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];

    const cartSidebar = document.getElementById('cart-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    const cartCountLabel = document.querySelector('.cart-count');
    
    // Selectores de la página de producto
    const btnMinus = document.querySelector('.qty-btn-m');
    const btnPlus = document.querySelector('.qty-btn-\\+');
    const inputQty = document.getElementById('main-qty');
    const btnBuy = document.querySelector('.btn-buy');

    /* ============================================================
        A. FUNCIONES DE INTERFAZ (UI)
    ============================================================ */
    
    function abrirSidebar() {
        if (cartSidebar) cartSidebar.classList.add('active');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        renderizarSidebar();
    }

    function cerrarSidebar() {
        if (cartSidebar) cartSidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    }

    // Guardar en LocalStorage y refrescar todo
    function guardarYActualizar() {
        localStorage.setItem('carrito_wizards', JSON.stringify(carrito));
        renderizarSidebar();
    }

    window.renderizarSidebar = function() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (carrito.length === 0) {
            cartItemsContainer.innerHTML = '<p class="mensaje-vacio">El caldero está vacío.</p>';
        } else {
            carrito.forEach((item, index) => {
                total += item.precio * item.cantidad;
                totalItems += item.cantidad;
                cartItemsContainer.innerHTML += `
                    <div class="cart-item">
                        <div class="cart-item-qty">${item.cantidad}x</div>
                        <div class="cart-item-image"><img src="${item.imagen}"></div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-name">${item.nombre}</h4>
                            <p class="cart-item-price">$${(item.precio * item.cantidad).toFixed(2)}</p>
                        </div>
                        <button class="remove-item" onclick="eliminarDelCarrito(${index})">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>`;
            });
        }
        if (totalPriceElement) totalPriceElement.innerText = `$${total.toFixed(2)}`;
        if (cartCountLabel) cartCountLabel.innerText = totalItems;
    };

    window.eliminarDelCarrito = (index) => {
        carrito.splice(index, 1);
        guardarYActualizar();
    };

    /* ============================================================
        B. LÓGICA DE AGREGAR PRODUCTOS
    ============================================================ */
    
    function masterAgregar(nuevoProd) {
        const index = carrito.findIndex(item => item.id === nuevoProd.id);
        if (index !== -1) {
            carrito[index].cantidad += nuevoProd.cantidad;
        } else {
            carrito.push(nuevoProd);
        }
        guardarYActualizar();
        abrirSidebar(); // Abre siempre al añadir para dar feedback
    }

    // Escuchar clics globales (Delegación de eventos)
    document.addEventListener('click', (e) => {
        // 1. Abrir/Cerrar Sidebar
        if (e.target.closest('.cart-link')) { e.preventDefault(); abrirSidebar(); }
        if (e.target.closest('.close-cart') || e.target === sidebarOverlay) { cerrarSidebar(); }

        // 2. Cards de la Home
        const cardHome = e.target.closest('.card-products');
        if (cardHome && e.target.closest('.add-cart')) {
            masterAgregar({
                id: cardHome.dataset.id,
                nombre: cardHome.dataset.name,
                precio: parseFloat(cardHome.dataset.price),
                imagen: cardHome.querySelector('img').src,
                cantidad: 1
            });
        }

        // 3. Recomendaciones
        const cardRecomend = e.target.closest('.recomend-card');
        if (cardRecomend && e.target.closest('.add-cart-btn')) {
            masterAgregar({
                id: cardRecomend.dataset.id,
                nombre: cardRecomend.dataset.name,
                precio: parseFloat(cardRecomend.dataset.price),
                imagen: cardRecomend.querySelector('img').src,
                cantidad: 1
            });
        }
    });

    /* ============================================================
        C. CONTADOR Y BOTÓN COMPRAR (PÁGINA PRODUCTO)
    ============================================================ */
    if (btnMinus && btnPlus && inputQty) {
        btnMinus.onclick = () => {
            let val = parseInt(inputQty.value) || 1;
            if (val > 1) inputQty.value = val - 1;
        };
        btnPlus.onclick = () => {
            let val = parseInt(inputQty.value) || 1;
            inputQty.value = val + 1;
        };
    }

    if (btnBuy) {
        btnBuy.onclick = () => {
            const container = document.querySelector('.container-product-info');
            if (!container) return;

            masterAgregar({
                id: container.dataset.id || "prod-main",
                nombre: container.dataset.name || container.querySelector('.product-title').innerText,
                precio: parseFloat(container.dataset.price) || parseFloat(container.querySelector('.product-price').innerText.replace('$', '')),
                imagen: document.getElementById('current-main-img')?.src || '',
                cantidad: parseInt(inputQty.value) || 1
            });
        };
    }

    /* ============================================================
        D. BOTÓN PROCEDER AL PAGO
    ============================================================ */
    const btnPay = document.querySelector('.btn-pay');
    if (btnPay) {
        btnPay.onclick = (e) => {
            e.preventDefault();
            if (carrito.length === 0) {
                alert("⚠️ ¡Mago! Tu caldero está vacío.");
            } else {
                window.location.href = 'carrito.html';
            }
        };
    }

    // Inicialización al cargar la página
    renderizarSidebar();
});

/*==========
 Check-Out 
 ============*/

document.addEventListener('DOMContentLoaded', () => {
    const contenedorLista = document.querySelector('.lista-compra');
    const totalElement = document.querySelector('.total-destacado');
    const subtotalElement = document.getElementById('subtotal-pago');

    function renderizarCheckout() {
        // Leemos la "Fuente de Verdad" (LocalStorage)
        let carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
        
        if (!contenedorLista) return;

        // ESCENARIO A: EL CALDERO ESTÁ VACÍO
        if (carrito.length === 0) {
            contenedorLista.innerHTML = `
                <div class="carrito-vacio-feedback">
                    <i class="fa-solid fa-wand-sparkles" style="font-size: 4rem; color: #8338EC; margin-bottom: 20px;"></i>
                    <h2 style="color: #000;">Tu caldero está vacío, mago</h2>
                    <p class="mensaje-vacio">Parece que aún no has invocado ningún artefacto.</p>
                    <a href="index.html" class="btn-arcano-vacio">Volver a la tienda</a>
                </div>
            `;
            actualizarTotales(0);
            return;
        }

        // ESCENARIO B: HAY ARTEFACTOS
        contenedorLista.innerHTML = ''; // Limpiamos para redibujar
        let sumaTotal = 0;

        carrito.forEach((item, index) => {
            const subtotalItem = item.precio * item.cantidad;
            sumaTotal += subtotalItem;

            // Construcción con el orden: Cantidad | Imagen | Info (Nombre + Precio) | Acciones
            contenedorLista.innerHTML += `
                <div class="item-checkout">
                    <div class="item-lado-izquierdo">
                        <div class="item-quantity">
                            <button class="qty-btn" onclick="cambiarCantidad(${index}, -1)">-</button>
                            <input type="text" value="${item.cantidad}" readonly>
                            <button class="qty-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>

                        <img src="${item.imagen}" alt="${item.nombre}" class="img-cart">

                        <div class="item-detalles">
                            <h3 class="nombre-producto">${item.nombre}</h3>
                            <p class="precio-producto">$${item.precio.toFixed(2)} c/u</p>
                        </div>
                    </div>
                    
                    <div class="item-acciones" style="display: flex; align-items: center; gap: 20px;">
                        <span class="precio-subtotal" style="font-weight: bold; color: #8338EC;">
                            $${subtotalItem.toFixed(2)}
                        </span>
                        <button class="btn-quitar-solo" onclick="quitarDelTodo(${index})" title="Eliminar artefacto">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        actualizarTotales(sumaTotal);
    }

    /* --- Lógica de Totales --- */
    function actualizarTotales(monto) {
        if (subtotalElement) subtotalElement.innerText = `$${monto.toFixed(2)}`;
        if (totalElement) totalElement.innerText = `$${monto.toFixed(2)}`;
    }

    /* --- Función: Cambiar Cantidad (+ / -) --- */
    window.cambiarCantidad = (index, delta) => {
        let carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
        
        if (carrito[index]) {
            carrito[index].cantidad += delta;

            // Si llega a 0, lo borramos automáticamente
            if (carrito[index].cantidad <= 0) {
                carrito.splice(index, 1);
            }

            localStorage.setItem('carrito_wizards', JSON.stringify(carrito));
            renderizarCheckout(); // Refrescamos la página
            
            // Si tienes la sidebar cargada en esta página, la actualizamos también
            if (typeof window.renderizarSidebar === 'function') window.renderizarSidebar();
        }
    };

    /* --- Función: Eliminar por completo --- */
    window.quitarDelTodo = (index) => {
        let carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
        carrito.splice(index, 1);
        
        localStorage.setItem('carrito_wizards', JSON.stringify(carrito));
        renderizarCheckout();
        
        if (typeof window.renderizarSidebar === 'function') window.renderizarSidebar();
    };

    // Ejecución inicial
    renderizarCheckout();
});

/* ==============
finalizar compra
================ */
const steps = document.querySelectorAll('.step-content');
const circles = document.querySelectorAll('.step-circle');
const progressBar = document.getElementById('progress-bar');
const stepTitle = document.getElementById('step-title');
const paymentExtra = document.getElementById('payment-extra');

let currentStep = 1;
const apiURL = "https://69d586dd1c120e733cccefc4.mockapi.io/v2/Pedidos";

// 1. RENDER DINÁMICO DE OPCIONES DE PAGO
// 1. Definimos la función de forma segura
function renderPaymentUI(type) {
    // Buscamos el contenedor donde se inyecta el HTML de pago
    const paymentExtra = document.getElementById('payment-extra');
    
    // Si el contenedor NO existe en esta página, salimos de la función de inmediato
    if (!paymentExtra) return;

    if (type === 'card') {
        paymentExtra.innerHTML = `
            <div class="details-grid" style="margin-top:15px; animation: slideUp 0.3s ease;">
                <div class="input-group">
                    <label>Número de Tarjeta</label>
                    <input type="text" id="card-number" placeholder="0000 0000 0000 0000">
                </div>
                <div class="input-group">
                    <label>Tipo</label>
                    <select id="card-type" class="select-arcano">
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                    </select>
                </div>
            </div>
        `;
    } else if (type === 'paypal') {
        paymentExtra.innerHTML = `
            <div class="input-group" style="margin-top:15px; animation: slideUp 0.3s ease;">
                <label>Selecciona Billetera</label>
                <select id="wallet-type" class="select-arcano">
                    <option value="Nequi">Nequi</option>
                    <option value="Wompi">Wompi</option>
                    <option value="PayPal">PayPal</option>
                </select>
            </div>
        `;
    }
}

// 2. Escuchar cambios en los radio buttons (Solo si existen)
const paymentRadios = document.querySelectorAll('input[name="payment"]');

// Solo recorremos los radios si la lista no está vacía
if (paymentRadios.length > 0) {
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => renderPaymentUI(e.target.value));
    });
}

// 2. NAVEGACIÓN Y VALIDACIÓN
function goToStep(step) {
    // Validación de campos antes de avanzar
    if (step > currentStep) {
        if (currentStep === 2) {
            const dir = document.getElementById('direccion').value.trim();
            const city = document.getElementById('ciudad').value.trim();
            const country = document.getElementById('pais').value.trim();
            if (!dir || !city || !country) {
                alert("⚠️ Completa los datos de envío.");
                return;
            }
        }
    }

    currentStep = step;
    steps.forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');

    circles.forEach(c => c.classList.toggle('active', parseInt(c.dataset.step) <= step));
    progressBar.style.width = `${((step - 1) / (circles.length - 1)) * 100}%`;
}

// Botones de "Continuar"
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-next-final')) {
        if (currentStep < 3) goToStep(currentStep + 1);
    }
});

// 3. ENVÍO FINAL AL MOCKAPI
async function procesarPagoFinal() {
    const email = document.getElementById('email-contacto').value.trim();
    const tel = document.getElementById('tel-contacto').value.trim();

    if (!email && !tel) {
        alert("⚠️ Necesitamos un medio de contacto.");
        return;
    }

    const btn = document.querySelector('.btn-pay-final');
    btn.innerText = "CONECTANDO CON EL BANCO...";
    btn.disabled = true;

    // Recoger info detallada del pago
    const method = document.querySelector('input[name="payment"]:checked').value;
    let paymentDetail = method;
    if (method === 'card') {
        const type = document.getElementById('card-type').value;
        paymentDetail = `Tarjeta: ${type}`;
    } else {
        const wallet = document.getElementById('wallet-type')?.value || "Billetera";
        paymentDetail = `Billetera: ${wallet}`;
    }

    const carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
    const total = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);

    const pedido = {
        email: email,
        direction: document.getElementById('direccion').value,
        date: new Date().toLocaleString(),
        products: carrito.map(p => `${p.nombre} (x${p.cantidad})`).join(", "),
        payment: paymentDetail, // Guardamos si fue Nequi, Visa, etc.
        city: document.getElementById('ciudad').value,
        country: document.getElementById('pais').value,
        phonenumber: tel || "N/A",
        price: total.toFixed(2)
    };

    try {
        const res = await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });

        if (res.ok) {
            alert("✨ ¡Hechizo lanzado! Pedido registrado en MockAPI.");
            localStorage.removeItem('carrito_wizards');
            window.location.href = "index.html"; 
        }
    } catch (err) {
        alert("❌ Error de conexión.");
        btn.disabled = false;
        btn.innerText = "IR AL PORTAL DE PAGO";
    }
}

// Inicializar el total
document.addEventListener('DOMContentLoaded', () => {
    const carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
    const total = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
    if(document.getElementById('monto-final')) {
        document.getElementById('monto-final').innerText = `$${total.toFixed(2)}`;
    }
    // Render inicial por defecto (Tarjeta)
    renderPaymentUI('card');
});

/* ============================================================
    LÓGICA DEL BOTÓN: FINALIZAR COMPRA
   ============================================================ */

function finalizarCompraArcana() {
    // 1. Verificamos la "Fuente de Verdad": el carrito
    const carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];

    // Si el caldero está vacío, ni siquiera intentamos validar login
    if (carrito.length === 0) {
        alert("⚠️ ¡Mago! Tu caldero está vacío. No puedes invocar un envío sin objetos.");
        return;
    }

    // 2. Comprobamos el estado del login
    // Buscamos un token o información del usuario en el localStorage
    const usuarioLogueado = JSON.parse(localStorage.getItem('wizard_session'));

    if (usuarioLogueado) {
        /* --------------------------------------------------------
           RUTA: USUARIO REGISTRADO
           (Aquí irá la lógica que me pidas después)
           -------------------------------------------------------- */
        console.log("Mago reconocido. Procediendo a confirmar pedido...");
        // Por ahora, solo un aviso o podrías mandarlo a un resumen final
        alert("Bienvenido de nuevo, " + usuarioLogueado.nombre);
        
    } else {
        /* --------------------------------------------------------
           RUTA: USUARIO NO REGISTRADO (Tu prioridad actual)
           -------------------------------------------------------- */
        console.log("Usuario no detectado. Abriendo portal de validación...");
        
        // Guardamos un marcador por si necesitamos saber que venía de un intento de compra
        localStorage.setItem('checkout_pending', 'true');
        
        // Redirección directa a la página de datos
        window.location.href = 'validacion.html';
    }
}

/*==========
 buscador 
 ============*/

const searchInput = document.querySelector('.search-input');
const resultsDropdown = document.getElementById('search-results');
const allProducts = document.querySelectorAll('.card-products');

searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase().trim();
    resultsDropdown.innerHTML = ''; 

    if (value.length > 0) {
        let found = false;
        
        allProducts.forEach(prod => {
            const name = prod.getAttribute('data-name');
            const img = prod.querySelector('img').src;
            const url = prod.getAttribute('data-url'); // Capturamos la URL

            if (name.toLowerCase().includes(value)) {
                found = true;
                const item = document.createElement('div');
                item.classList.add('result-item');
                
                // Estructura del resultado
                item.innerHTML = `
                    <img src="${img}" alt="${name}">
                    <div class="info">
                        <span class="name">${name}</span>
                        <span class="view-more">Ver hechizo...</span>
                    </div>
                `;
                
                // LA MAGIA: Redirección al hacer clic
                item.onclick = () => {
                    if (url) {
                        window.location.href = url;
                    } else {
                        console.error("Este producto no tiene una URL definida en data-url");
                    }
                };
                
                resultsDropdown.appendChild(item);
            }
        });
        resultsDropdown.style.display = found ? 'block' : 'none';
    } else {
        resultsDropdown.style.display = 'none';
    }
});

// Cerrar el buscador si se hace clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-item')) {
        resultsDropdown.style.display = 'none';
    }
});

/*====================
 Estrellas
======================  */

const products = document.querySelectorAll('.card-products');

products.forEach(product => {
    const productId = product.getAttribute('data-id');
    const stars = product.querySelectorAll('.star i');

    // 👉 Cargar rating guardado
    const savedRating = localStorage.getItem(`rating_${productId}`);
    if (savedRating) {
        paintStars(stars, savedRating);
    }

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = star.getAttribute('data-value');

            // 👉 Guardar rating
            localStorage.setItem(`rating_${productId}`, value);

            // 👉 Pintar estrellas
            paintStars(stars, value);
        });
    });
});

// 🎨 Función para pintar estrellas
function paintStars(stars, value) {
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= value) {
            star.classList.remove('fa-regular');
            star.classList.add('fa-solid');
            star.style.color = "gold";
        } else {
            star.classList.remove('fa-solid');
            star.classList.add('fa-regular');
            star.style.color = "#ccc";
        }
    });
}

// ==========================================
// ❤️ WISHLIST MEJORADA (BASADA EN TU SISTEMA)
// ==========================================

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;

    // 🛡️ 1. VERIFICACIÓN DE SESIÓN (La Barrera)
    const usuarioLogueado = localStorage.getItem(KEY_USUARIO);

    if (!usuarioLogueado) {
        console.warn("🔮 Wizards of Tomorrow: Acceso denegado. Se requiere identificación.");
        if (typeof wrapper !== 'undefined') {
            wrapper.classList.add('active-popup');
        }
        return; // Detenemos todo aquí
    }

    // 🪄 2. IDENTIFICACIÓN DEL PRODUCTO
    const card = btn.closest('.recomend-card, .card-products');
    if (!card) return; 

    const icon = btn.querySelector('i');

    const productoFavorito = {
        // Generamos un ID amigable para la URL a partir del título
        id: card.querySelector('h3').innerText.toLowerCase().replace(/ /g, '-'),
        nombre: card.querySelector('h3').innerText,
        // Limpiamos el precio para quedarnos solo con el número
        precio: card.querySelector('.price')?.innerText.split('$')[1]?.trim() || "0",
        imagen: card.querySelector('img').src
    };

    // 📦 3. GESTIÓN DEL INVENTARIO PERSONAL
    // Usamos una clave única por usuario para mayor privacidad
    const storageKey = `wishlist_wizards_${usuarioLogueado}`;
    let wishlist = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    const existeIndex = wishlist.findIndex(p => p.id === productoFavorito.id);

    if (existeIndex === -1) {
        // AGREGAR AL INVENTARIO
        wishlist.push(productoFavorito);
        icon.classList.replace('fa-regular', 'fa-solid');
        btn.classList.add('active');
        console.log(`✨ Objeto vinculado al alma de ${usuarioLogueado}:`, productoFavorito.nombre);
    } else {
        // REMOVER DEL INVENTARIO
        wishlist.splice(existeIndex, 1);
        icon.classList.replace('fa-solid', 'fa-regular');
        btn.classList.remove('active');
        console.log(`🌑 Objeto liberado del inventario de ${usuarioLogueado}.`);
    }

    // GUARDADO FINAL
    localStorage.setItem(storageKey, JSON.stringify(wishlist));
});


/*===========
compartir 
============*/

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.share-btn');
    if (!btn) return;

    const card = btn.closest('.card-products');
    if (!card) return;

    const nombre = card.dataset.name;
    const url = card.dataset.url 
        ? window.location.origin + "/" + card.dataset.url 
        : window.location.href;

    const shareData = {
        title: 'Wizards of Tomorrow',
        text: `🔥 Mira este producto: ${nombre}`,
        url: url
    };

    // 👉 Si el navegador soporta compartir
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log("Compartido"))
            .catch(err => console.log("Cancelado o error:", err));
    } 
    // 👉 Fallback: copiar link
    else {
        navigator.clipboard.writeText(url);

        const icon = btn.querySelector('i');
        const original = icon.className;

        icon.className = 'fa-solid fa-check';

        setTimeout(() => {
            icon.className = original;
        }, 2000);
    }
});

/*===========
filtros
=============*/

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.card-products');

    if (filterButtons.length === 0 || products.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {

            // 👉 Activar botón seleccionado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            products.forEach(product => {

                if (filter === 'all') {
                    product.style.display = 'block';
                } else if (product.classList.contains(filter)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }

            });
        });
    });
});

/*====================
contactanos
====================*/
document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('.contact-form');
    const textarea = document.getElementById('message');
    const counter = document.querySelector('.char-count');

    // =========================
    // 1. CONTADOR DE CARACTERES
    // =========================
    if (textarea && counter) {
        textarea.addEventListener('input', () => {
            const length = textarea.value.length;

            counter.textContent = `${length}/200 caracteres`;

            // Feedback visual
            counter.style.color = length > 180 ? "#ff0000" : "#8338EC";
        });
    }

    // =========================
    // 2. ENVÍO DEL FORMULARIO
    // =========================
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('.btn');
            const nameInput = form.querySelector('#name');
            const emailInput = document.getElementById('email-contacto');
            const textarea = form.querySelector('#message');

            if (!nameInput || !emailInput || !textarea) {
                console.error("No se encontraron los campos en el HTML");
                return;
            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const mensaje = textarea.value.trim();

            if (!name || !email || !mensaje) {
                alert("⚠️ Completa todos los campos");
                return;
            }

            const data = {
                name: name,
                email: email,
                message: mensaje,
                fecha: new Date().toISOString()
            };

            try {
                btn.textContent = "ENVIANDO...";
                btn.disabled = true;

                const res = await fetch("https://69d586dd1c120e733cccefc4.mockapi.io/v2/Mensajes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    btn.textContent = "ENVIADO ✅";
                    form.reset();

                    // Resetear contador también
                    if (counter) {
                        counter.textContent = "0/200 caracteres";
                        counter.style.color = "#8338EC";
                    }

                    setTimeout(() => {
                        btn.textContent = "ENVIAR";
                        btn.disabled = false;
                    }, 2000);

                } else {
                    throw new Error("Error en servidor: " + res.status);
                }

            } catch (error) {
                console.error("Error detallado:", error);
                btn.textContent = "ERROR ❌";

                setTimeout(() => {
                    btn.textContent = "ENVIAR";
                    btn.disabled = false;
                }, 2000);
            }
        });
    }

});

/*=============
pagina de producto
================= */

/*=============
miniaturas
=============== */
// ==========================================
// 📸 MÓDULO LIGHTBOX Y GALERÍA (ANTI-ERRORES)
// ==========================================

// 1. DECLARACIÓN GLOBAL (Mantener arriba para evitar problemas de alcance)
let imagenes = [];
let indexActual = 0;

// Ocultador de miniaturas sobrantes (+X)
document.addEventListener('DOMContentLoaded', () => {
    const thumbItems = document.querySelectorAll('.thumb-item');
    if (thumbItems.length <= 4) return;

    // Ocultamos desde la 5ta en adelante
    thumbItems.forEach((item, index) => {
        if (index > 3) {
            item.style.display = 'none';
        }
    });

    // Cantidad oculta
    const hiddenCount = thumbItems.length - 3;

    // La 4ta (index 3)
    const lastVisible = thumbItems[3];

    if (lastVisible) {
        // Creamos overlay
        const overlay = document.createElement('div');
        overlay.classList.add('thumb-overlay-plus');
        overlay.innerHTML = `<span>+${hiddenCount}</span>`;

        // Click abre lightbox
        overlay.addEventListener('click', () => {
            if (typeof window.openLightbox === 'function') {
                window.openLightbox();
            }
        });

        lastVisible.appendChild(overlay);
    }
});

// Cambiar de imagen principal al clickear miniatura
document.addEventListener('DOMContentLoaded', () => {
    const mainImg = document.getElementById('current-main-img');
    const thumbs = document.querySelectorAll('.thumb');

    // 🛡️ ESCUDO: Solo si existe la imagen principal en el HTML
    if (mainImg && thumbs.length > 0) {
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Cambiar imagen principal con transición
                mainImg.style.opacity = 0;

                setTimeout(() => {
                    mainImg.src = thumb.src;
                    mainImg.style.opacity = 1;
                }, 150);

                // Quitar active de todas
                thumbs.forEach(t => t.classList.remove('active'));

                // Activar la seleccionada
                thumb.classList.add('active');
            });
        });
    }
});

// Función centralizada para actualizar la imagen del Lightbox
function actualizarLightbox() {
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg && imagenes && imagenes[indexActual]) {
        lightboxImg.src = imagenes[indexActual];
        renderLightboxThumbs(); 
    }
}

// Ventana global para abrir el Lightbox
window.openLightbox = function() {
    const lightbox = document.getElementById('product-lightbox');
    const thumbs = document.querySelectorAll('.thumb');
    const mainImg = document.getElementById('current-main-img');

    // 🛡️ ESCUDO: Si no hay elementos del lightbox en esta página, abortamos en silencio
    if (!lightbox || !mainImg) return;

    imagenes = Array.from(thumbs).map(img => img.src);
    const currentSrc = mainImg.src;
    indexActual = imagenes.indexOf(currentSrc);

    if (indexActual === -1) indexActual = 0;

    lightbox.classList.add('active');
    actualizarLightbox();
};

// Renderizador de miniaturas internas del Lightbox
function renderLightboxThumbs() {
    const container = document.querySelector('.lightbox-thumbnails');
    if (!container) return;
    container.innerHTML = '';

    // 🛡️ ESCUDO: Por si las moscas, verificamos que el array tenga datos
    if (typeof imagenes !== 'undefined' && Array.isArray(imagenes)) {
        imagenes.forEach((src, i) => {
            const img = document.createElement('img');
            img.src = src;
            img.classList.add('lb-thumb');

            if (i === indexActual) img.classList.add('active');

            img.addEventListener('click', () => {
                indexActual = i;
                actualizarLightbox(); // Cambia la imagen al hacer clic
            });

            container.appendChild(img);
        });
    }
}

// Navegación con flechas del Lightbox
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.querySelector('.next-lb');
    const prevBtn = document.querySelector('.prev-lb');

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            if (imagenes.length === 0) return;
            indexActual = (indexActual + 1) % imagenes.length;
            actualizarLightbox();
        });

        prevBtn.addEventListener('click', () => {
            if (imagenes.length === 0) return;
            indexActual = (indexActual - 1 + imagenes.length) % imagenes.length;
            actualizarLightbox();
        });
    }
});

// Cerrar Lightbox
document.addEventListener('DOMContentLoaded', () => {
    const botonCerrarLightbox = document.querySelector('.close-lightbox');

    if (botonCerrarLightbox) {
        botonCerrarLightbox.addEventListener('click', () => {
            const lightbox = document.getElementById('product-lightbox');
            lightbox?.classList.remove('active');
        });
    }
});

// Zoom en la imagen del Lightbox
document.addEventListener('DOMContentLoaded', () => {
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightboxImg) return;

    let zoomActivo = false;

    lightboxImg.addEventListener('click', () => {
        zoomActivo = !zoomActivo;

        if (zoomActivo) {
            lightboxImg.classList.add('zoomed');
        } else {
            lightboxImg.classList.remove('zoomed');
            lightboxImg.style.transform = 'scale(1)';
        }
    });

    // Movimiento del mouse (solo si está en zoom)
    lightboxImg.addEventListener('mousemove', (e) => {
        if (!zoomActivo) return;

        const rect = lightboxImg.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        lightboxImg.style.transformOrigin = `${x * 100}% ${y * 100}%`;
    });
});

/* ===========================
Responsive
============================== */ 

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- INICIANDO DIAGNÓSTICO DE MENÚ ---");

    const menuBtn = document.getElementById('menu-open');
    const navMenu = document.querySelector('.navigation');

    // COMPROBACIÓN 1: ¿Existen los elementos en el HTML?
    if (!menuBtn) {
        console.error("❌ ERROR: No se encontró el botón con ID 'menu-open'");
    } else {
        console.log("✅ Botón 'menu-open' detectado");
    }

    if (!navMenu) {
        console.error("❌ ERROR: No se encontró el contenedor con clase '.navigation'");
    } else {
        console.log("✅ Menú '.navigation' detectado");
    }

    // Si ambos existen, procedemos al evento
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // COMPROBACIÓN 2: ¿El click fue registrado?
            console.log("🖱️ CLICK DETECTADO: El usuario presionó el botón circular");

            // Aplicamos el cambio de clase
            navMenu.classList.toggle('show');

            // COMPROBACIÓN 3: ¿Se aplicó la clase 'show'?
            if (navMenu.classList.contains('show')) {
                console.log("✨ CLASE APLICADA: El menú ahora tiene la clase 'show'");
                
                // COMPROBACIÓN 4: ¿El CSS lo está ocultando a la fuerza?
                const displayStyle = window.getComputedStyle(navMenu).display;
                console.log("🖥️ ESTADO CSS: El 'display' actual del menú es: " + displayStyle);
                
                if (displayStyle === 'none') {
                    console.warn("⚠️ ALERTA: El JS puso la clase 'show', pero el CSS sigue diciendo 'display: none'. Revisa tus Media Queries.");
                }
            } else {
                console.log("🌑 CLASE QUITADA: El menú ya no tiene la clase 'show'");
            }
        });
    }
});

/* slider */

// --- LÓGICA DEL SLIDER (CON AUTO-PLAY BLINDADO) ---
const sliderContainer = document.querySelector('.slider');

if (sliderContainer) {
    const btnNextSlide = document.querySelector('.btn-next');
    const btnPrevSlide = document.querySelector('.btn-prev');
    const sliderDots = document.querySelectorAll('.slider-nav a');
    let sliderIndex = 0;
    let autoPlayTimer; // Aquí guardamos el temporizador

    const runUpdate = (index) => {
        const width = sliderContainer.clientWidth;
        sliderContainer.scrollTo({
            left: width * index,
            behavior: 'smooth'
        });
        // Actualizar opacidad de los puntos
        sliderDots.forEach((dot, i) => {
            dot.style.opacity = i === index ? "1" : "0.5";
        });
    };

    const nextSlide = () => {
        sliderIndex = (sliderIndex + 1) % sliderDots.length;
        runUpdate(sliderIndex);
    };

    const prevSlide = () => {
        sliderIndex = (sliderIndex - 1 + sliderDots.length) % sliderDots.length;
        runUpdate(sliderIndex);
    };

    // Funciones para controlar el temporizador de 5 segundos
    const startAutoPlay = () => {
        autoPlayTimer = setInterval(nextSlide, 5000); 
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayTimer);
        startAutoPlay(); // Reinicia la cuenta regresiva
    };

    // Eventos con reinicio de temporizador para evitar saltos raros
    if (btnNextSlide) {
        btnNextSlide.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay(); 
        });
    }

    if (btnPrevSlide) {
        btnPrevSlide.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sliderIndex = index;
            runUpdate(sliderIndex);
            resetAutoPlay();
        });
    });

    // Encendemos el motor automático al cargar la página
    startAutoPlay();
}
// 1. Atrapamos los elementos del HTML usando sus IDs
// Atrapamos los elementos
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('reg-password'); // O el ID exacto que tengas

// 🛡️ SÓLO si el botón del ojo existe en esta página, activamos el click
if (togglePassword) {
    togglePassword.addEventListener('click', function() {
        if (passwordInput && passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.classList.replace('fa-eye', 'fa-eye-slash');
        } else if (passwordInput) {
            passwordInput.type = 'password';
            this.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
}

// Ojo para la segunda casilla (Confirmar Contraseña)
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const confirmPasswordInput = document.getElementById('reg-confirm-password');

// 🛡️ ESCUDO: Solo si existe el segundo ojo
if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener('click', function() {
        if (confirmPasswordInput) {
            if (confirmPasswordInput.type === 'password') {
                confirmPasswordInput.type = 'text';
                this.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                confirmPasswordInput.type = 'password';
                this.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }
    });
}

/*medidor de contraseña*/

// 1. Añadimos una variable bandera que controle si la clave es apta
let contrasenaValida = false;

const strengthBar = document.getElementById('strength-bar');

// 🛡️ ESCUDO: Solo si existe el input de contraseña y la barra medidora
if (passwordInput && strengthBar) {
    passwordInput.addEventListener('input', function() {
        const clave = passwordInput.value;
        let puntos = 0;

        if (clave.length >= 6) puntos++;
        if (/[A-Z]/.test(clave) && /[a-z]/.test(clave)) puntos++;
        if (/[0-9]/.test(clave) || /[^A-Za-z0-9]/.test(clave)) puntos++;

        // Controlamos el color de la barra y el estado del interruptor
        if (clave.length === 0) {
            strengthBar.style.width = '0%';
            strengthBar.style.backgroundColor = 'transparent';
            contrasenaValida = false; 
        } else if (puntos === 1) {
            strengthBar.style.width = '33%';
            strengthBar.style.backgroundColor = '#ff4d4d';
            contrasenaValida = false; // Débil
        } else if (puntos === 2) {
            strengthBar.style.width = '66%';
            strengthBar.style.backgroundColor = '#ffa500';
            contrasenaValida = false; // Media
        } else if (puntos === 3) {
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = '#2ecc71';
            contrasenaValida = true;  // 🎉 ¡Contraseña digna de un mago supremo!
        }
    });
}

// 2. ESCUCHAMOS EL ENVÍO DEL FORMULARIO
// (Asegúrate de que tu etiqueta <form> de registro tenga el id="registerForm")
const formularioRegistro = document.getElementById('registerForm');

// 🛡️ ESCUDO: Solo si el formulario de registro está presente en el HTML actual
if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', function(event) {
        // Candado 1: Fuerza de la clave (debe estar en verde)
        if (!contrasenaValida) {
            event.preventDefault(); 
            alert('Tu contraseña es demasiado débil. Asegúrate de que la barra esté en VERDE.');
            return; 
        }

        // Candado 2: Que sean idénticas
        if (passwordInput && confirmPasswordInput && passwordInput.value !== confirmPasswordInput.value) {
            event.preventDefault(); 
            alert('Las contraseñas no coinciden. Verifica que ambas sean exactamente iguales.');
            return;
        }
    });
}

/*verificación de contraseñas*/

// 🛡️ ESCUDO: Solo si el input de confirmación existe
if (confirmPasswordInput && passwordInput) {
    confirmPasswordInput.addEventListener('input', function() {
        // Si la casilla está vacía, limpia el borde
        if (confirmPasswordInput.value === '') {
            confirmPasswordInput.style.borderColor = '';
        } 
        // Si coincide con la primera contraseña, borde verde
        else if (passwordInput.value === confirmPasswordInput.value) {
            confirmPasswordInput.style.borderColor = '#2ecc71'; 
        } 
        // Si son diferentes, borde rojo
        else {
            confirmPasswordInput.style.borderColor = '#ff4d4d'; 
        }
    });
}

/*firebase*/

// ==========================================
// 🔥 MÓDULO DE AUTENTICACIÓN FIREBASE (BLINDADO)
// ==========================================

// 1. Importamos la base de Firebase y el módulo de Autenticación
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// 2. Tus llaves secretas de conexión
const firebaseConfig = {
  apiKey: "AIzaSyBAzScI-7xwDM-nX_sl9LO6EmeZmlju4fQ",
  authDomain: "wizards-of-tomorrow-2a9ba.firebaseapp.com",
  projectId: "wizards-of-tomorrow-2a9ba",
  storageBucket: "wizards-of-tomorrow-2a9ba.firebasestorage.app",
  messagingSenderId: "46730668492",
  appId: "1:46730668492:web:6bf28c75a4c448e7d19569"
};

// 3. Inicializamos Firebase y activamos el sistema de usuarios
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 4. Atrapamos el formulario de registro de tu Pop-up
const registerForm = document.getElementById('registerForm');

// 🛡️ ESCUDO PROTECTOR: Solo si el formulario de registro existe en la página actual
if (registerForm) {
    console.log("Firebase Auth inicializado y escuchando el formulario de registro.");

    registerForm.addEventListener('submit', function(event) {
      
      // Si tus validaciones previas (fuerza de clave, contraseñas iguales) frenaron el formulario, aquí nos detenemos
      if (event.defaultPrevented) return;
      
      // Frenamos el envío por defecto del HTML
      event.preventDefault();

      // Buscamos los inputs de forma ultra segura
      const emailInput = registerForm.email || registerForm.querySelector('input[type="email"]');
      const passwordInput = document.getElementById('reg-password') || document.getElementById('registerPassword');

      // Si no encuentra los campos en el HTML, frenamos para que no explote
      if (!emailInput || !passwordInput) {
          console.warn("No se encontraron los inputs de email o contraseña en este formulario.");
          return;
      }

      const email = emailInput.value;
      const password = passwordInput.value;

      console.log("Intentando registrar al mago en Firebase...");

      // 5. Le mandamos los datos en bandeja de plata a la nube de Google
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // ¡ÉXITO! El usuario se creó de verdad en la nube
          const user = userCredential.user;
          alert(`¡Mago registrado con éxito! Bienvenido: ${email}`);
          console.log("Usuario creado en Firebase:", user);
        })
        .catch((error) => {
          // Si algo sale mal (ej: el correo ya existe o la contraseña es muy corta)
          console.error("Error al registrar en Firebase:", error.code, error.message);
          
          if (error.code === 'auth/email-already-in-use') {
              alert("Este correo ya está registrado por otro mago.");
          } else {
              alert(`Error de Firebase: ${error.message}`);
          }
        });
    });
}

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Aquí se le dispara la validación a Firebase...
    });
}
// --- AL FINAL DE TU ARCHIVO JS ---

// Ejecutamos la función apenas cargue el script para recuperar la sesión
actualizarNavegacion();