// ==========================================
// 0. CONFIGURACIÓN Y VARIABLES GLOBALES
// ==========================================
const URL_API = "https://69af4b16c8b37f499837d734.mockapi.io/api/v1/users";

// Elementos de la interfaz
const wrapper = document.querySelector('.wrapper');
const loginBtnNav = document.querySelector('.navigation a[href="login.html"]');
const iconClose = document.querySelector('.icon-close');
const menuIcon = document.querySelector('.menu-icon');
const navMenu = document.querySelector('.navigation ul');

// ==========================================
// 1. CONTROL DEL POP-UP (LOGIN)
// ==========================================

// MODIFICACIÓN: Añadimos #logged-out-view a la lista de selectores
const loginButtons = document.querySelectorAll('.navigation a[href="login.html"], .btn-open-login, #logged-out-view');

loginButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (!localStorage.getItem('nombre_usuario')) {
            e.preventDefault(); 
            
            if (wrapper) {
                // Tu efecto de apertura
                wrapper.classList.add('active-popup');
                console.log("Desplegando portal de acceso...");
            } else {
                window.location.href = "login.html";
            }
        }
    });
});

// Tu lógica de cierre (Mantenla tal cual, está perfecta)
if (iconClose) {
    iconClose.addEventListener('click', () => {
        wrapper.classList.remove('active-popup');
    });
}

// ==========================================
// 2. SESIÓN Y ESTADO DE USUARIO (LOGOUT)
// ==========================================
    const nombreEnMemoria = localStorage.getItem('nombre_usuario');

    if (nombreEnMemoria && loginBtnNav) {
        // 1. Cambiamos el contenido del botón por el nombre + un icono de salida
        // Usamos un color rojo neón para el "Salir" para que resalte del verde
        loginBtnNav.innerHTML = `
            <i class="fa-solid fa-user"></i> ${nombreEnMemoria} 
            <span id="logout-btn" style="margin-left:12px; color: #FF3131; font-weight: bold; cursor: pointer; font-size: 0.8em;">
                [SALIR]
            </span>
        `;
        loginBtnNav.style.color = "#8338EC"; 

        // 2. Evitamos que el clic en el botón de login intente abrir el pop-up de nuevo
        loginBtnNav.addEventListener('click', (e) => {
            e.preventDefault(); 
        });

        // 3. Lógica específica para el botón de "SALIR"
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Importante: evita que el clic "suba" al botón principal
                
                const confirmar = confirm(`¿Estás seguro de que quieres cerrar sesión, ${nombreEnMemoria}?`);
                
                if (confirmar) {
                    localStorage.removeItem('nombre_usuario'); // Borramos el rastro del nombre
                    alert("Sesión cerrada. ¡Vuelve pronto, ${nombreEnMemoria}!");
                    window.location.href = "index.html"; // Redirigimos al inicio para limpiar la interfaz
                }
            });
        }
    }



// ==========================================
// 4. LÓGICA DE AUTENTICACIÓN (LOGIN)
// ==========================================
const loginForm = document.querySelector('.form-box.login form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = loginForm.querySelector('input[type="email"]').value;
        const passInput = loginForm.querySelector('input[type="password"]').value;

        try {
            const respuesta = await fetch(URL_API);
            const usuarios = await respuesta.json();
            
            // Buscamos coincidencia en la API
            const usuarioValido = usuarios.find(u => u.email === emailInput && u.password === passInput);

            if (usuarioValido) {
                localStorage.setItem('nombre_usuario', usuarioValido.nombre);
                alert(`¡Bienvenido de nuevo, ${usuarioValido.nombre}!`);
                location.reload(); // Recargamos para actualizar el menú
            } else {
                alert("Correo o contraseña incorrectos.");
            }
        } catch (error) {
            console.error("Error en Login:", error);
            alert("Error al conectar con el servidor.");
        }
    });
}

// ==========================================
// 5. LÓGICA DE REGISTRO (PÁGINA APARTE)
// ==========================================
const registerForm = document.querySelector('.form-box.register-page form'); 

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. CAPTURAR Y LIMPIAR DATOS (.trim() quita espacios extra)
        const nombre = registerForm.querySelector('.input-nombre').value.trim();
        const email = registerForm.querySelector('.input-email').value.trim();
        const pass1 = registerForm.querySelector('.input-pass').value;
        const pass2 = registerForm.querySelectorAll('input[type="password"]')[1].value;
        const genero = registerForm.querySelector('select').value;

        // 2. VALIDACIONES DE SEGURIDAD
        if (pass1 !== pass2) {
            alert("⚠️ Las contraseñas no coinciden.");
            return;
        }

        if (pass1.length < 6) {
            alert("⚠️ La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // 3. PREPARAR EL OBJETO PARA EL SERVIDOR
        const nuevoUsuario = {
            nombre: nombre,
            email: email,
            password: pass1, 
            genero: genero,
            fecha_registro: new Date().toLocaleDateString() // Guardamos cuándo se creó
        };

        // 4. ENVÍO DE DATOS
        try {
            // Opcional: Podríamos verificar si el correo ya existe aquí
            const respuesta = await fetch(URL_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoUsuario)
            });

            if (respuesta.ok) {
                alert(`¡Felicidades ${nombre}! Tu cuenta en Wizards of Tomorrow ha sido creada.`);
                window.location.href = "inicio.html"; // Redirigir para que inicie sesión
            } else {
                alert("Hubo un problema con el servidor al crear la cuenta.");
            }
        } catch (error) {
            console.error("Error en Registro:", error);
            alert("No hay conexión con el servidor de Wizards.");
        }
    });
}

// ==========================================
// 6. LÓGICA DEL CARRITO (SIDEBAR Y CONTADOR)
// ==========================================
const cartSidebar = document.getElementById('cart-sidebar');
const cartBtn = document.querySelector('.cart-link'); // Cambiado para que coincida con tu HTML
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.querySelector('.total-price');



// ==========================================
// REDIRECCIÓN AL CARRITO (PAGO)
// ==========================================
const btnPayFinal = document.getElementById('btn-pago-final');

if (btnPayFinal) {
    btnPayFinal.addEventListener('click', (e) => {
        e.preventDefault(); // Evitamos cualquier comportamiento extraño
        
        console.log("Intentando ir a la página de pago...");

        if (carrito.length === 0) {
            alert("⚠️ Wizard, tu carrito está vacío. ¡Elige un artefacto primero!");
            return;
        }

        // Intenta redirigir. Asegúrate de que el nombre del archivo sea idéntico.
        window.location.href = 'carrito.html'; 
    });
}

// Función para dibujar los productos dentro del Sidebar
function renderizarCarrito() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    
    if (!cartItemsContainer) return;

    // Limpiamos el contenedor
    cartItemsContainer.innerHTML = '';

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío.</p>';
        totalPriceElement.innerText = '$0.00';
        return;
    }

    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio * item.cantidad;
        
        // Creamos el HTML de cada producto
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px;">
                <div class="item-info">
                    <p>${item.nombre}</p>
                    <span>${item.cantidad} x $${item.precio.toFixed(2)}</span>
                </div>
                <button class="remove-item" onclick="eliminarDelCarrito(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
    });

    totalPriceElement.innerText = `$${total.toFixed(2)}`;
}

// Función global para borrar un item (pégala fuera de los IF)
window.eliminarDelCarrito = (index) => {
    carrito.splice(index, 1);
    localStorage.setItem('carrito_wizards', JSON.stringify(carrito));
    actualizarContadorMenu();
    renderizarCarrito();
};

// Modifica el evento de abrir el carrito para que renderice
if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderizarCarrito(); // <--- Llamamos a la función aquí
        cartSidebar.classList.add('active');
    });
}

// Cargar carrito desde LocalStorage o empezar vacío
let carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];

// Función para actualizar el número "0" en el menú
function actualizarContadorMenu() {
    const contador = document.querySelector('.cart-count');
    if (contador) {
        const totalItems = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
        contador.innerText = totalItems;
    }
}

// Escuchar clics en los iconos de la cesta (🛒)
document.addEventListener('click', (e) => {
    // Buscamos si el clic fue en el icono de la cesta o su contenedor
    const btnAdd = e.target.closest('.add-cart');
    
    if (btnAdd) {
        const card = btnAdd.closest('.card-products');
        
        const producto = {
            id: card.dataset.id,
            nombre: card.dataset.name,
            precio: parseFloat(card.dataset.price),
            imagen: card.querySelector('img').src,
            cantidad: 1
        };

        // Verificar si ya existe para sumar cantidad
        const existe = carrito.findIndex(p => p.id === producto.id);

        if (existe !== -1) {
            carrito[existe].cantidad++;
        } else {
            carrito.push(producto);
        }

        // Guardar y Actualizar
        localStorage.setItem('carrito_wizards', JSON.stringify(carrito));
        actualizarContadorMenu();
        
        // Pequeño feedback visual
        alert(`¡${producto.nombre} añadido al carrito!`);
    }
});

// Control del Sidebar (Abrir/Cerrar)
if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
        // Aquí podrías llamar a una función para dibujar los items en el sidebar
    });
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
}

// Ejecutar al cargar la página para que el contador no se borre al refrescar
actualizarContadorMenu();

// ==========================================
// 7. SLIDER DE IMÁGENES
// ==========================================
const slider = document.querySelector('.slider');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const navDots = document.querySelectorAll('.slider-nav a');

if (slider) {
    // Botón Siguiente
    btnNext?.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollAmount = slider.clientWidth;
        if (slider.scrollLeft + scrollAmount >= slider.scrollWidth) {
            slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    });

    // Botón Anterior
    btnPrev?.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollAmount = slider.clientWidth;
        if (slider.scrollLeft <= 0) {
            slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' });
        } else {
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    });

    // Puntos de navegación (Dots)
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = dot.getAttribute('data-index');
            slider.scrollTo({
                left: slider.clientWidth * index,
                behavior: 'smooth'
            });
        });
    });

    // Brillo de puntos al hacer scroll
    slider.addEventListener('scroll', () => {
        const scrollIndex = Math.round(slider.scrollLeft / slider.clientWidth);
        navDots.forEach((dot, index) => {
            dot.style.opacity = index === scrollIndex ? '1' : '0.5';
            dot.style.backgroundColor = index === scrollIndex ? '#00F3FF' : '#444';
        });
    });
}

// ==========================================
// 8. FORMULARIO DE CONTACTO (CONTADOR)
// ==========================================
const textarea = document.getElementById('mensaje');
const countDisplay = document.querySelector('.char-count');

if (textarea && countDisplay) {
    textarea.addEventListener('input', () => {
        const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        countDisplay.innerText = `${wordCount} / 200 palabras`;
        countDisplay.style.color = wordCount > 200 ? "#FF0000" : "#8338EC";
    });
}

// ==========================================
// 9. LÓGICA DE LA PÁGINA DE CHECKOUT (carrito.html)
// ==========================================

function renderizarPaginaCarrito() {
    const contenedor = document.getElementById('lista-compra');
    const subtotalDisplay = document.getElementById('subtotal-final');
    const totalDisplay = document.getElementById('total-final');

    
    // Si no estamos en la página de carrito, no hacemos nada
    if (!contenedor) return;

    const carritoGuardado = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
    contenedor.innerHTML = '';
    let acumulado = 0;

    if (carritoGuardado.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio-feedback">
                <p class="mensaje-vacio">Tu inventario arcano está vacío.</p>
                <a href="inicio.html" class="btn-arcano-vacio">Explorar la Tienda</a>
            </div>
                `;
        subtotalDisplay.innerText = "$0.00";
        totalDisplay.innerText = "$0.00";
        return;
    }
    // Dentro de tu IF de carrito vacío:
    

    carritoGuardado.forEach((item, index) => {
        const subtotalItem = item.precio * item.cantidad;
        acumulado += subtotalItem;
            contenedor.innerHTML += `
                <div class="item-checkout">
                    <div class="item-lado-izquierdo">
                        <img src="${item.imagen}" alt="${item.nombre}" class="img-cart">
                        <div class="item-detalles">
                            <h4 class="nombre-producto">${item.nombre}</h4>
                            <p class="precio-producto">$${subtotalItem.toFixed(2)}</p>
                        </div>
                    </div>
                    <button onclick="eliminarDelCheckout(${index})" class="btn-quitar-solo">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
    });

    subtotalDisplay.innerText = `$${acumulado.toFixed(2)}`;
    totalDisplay.innerText = `$${acumulado.toFixed(2)}`;
}

// Función global para eliminar desde el checkout
window.eliminarDelCheckout = (index) => {
    let tempCarrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
    tempCarrito.splice(index, 1);
    localStorage.setItem('carrito_wizards', JSON.stringify(tempCarrito));
    
    // Recargamos ambas partes
    renderizarPaginaCarrito();
    // Si tienes la función de actualizar el contador del header, la llamamos:
    if(typeof actualizarContadorMenu === 'function') actualizarContadorMenu();
};

// Ejecutamos al cargar el documento
document.addEventListener('DOMContentLoaded', renderizarPaginaCarrito);

// ==========================================
// 10. VALIDACIÓN DE SESIÓN + TICKET ARCANO (FINAL)
// ==========================================
const btnFinalizarReal = document.querySelector('.btn-confirmar-compra');

if (btnFinalizarReal) {
    // Clonamos para limpiar eventos previos y evitar duplicados
    const btnLimpio = btnFinalizarReal.cloneNode(true);
    btnFinalizarReal.replaceWith(btnLimpio);

    btnLimpio.addEventListener('click', async () => {
        const usuarioLogueado = localStorage.getItem('nombre_usuario');

        // 1. Bloqueo si no hay sesión
        if (!usuarioLogueado) {
            alert("✨ ¡Alto ahí, Wizard! Necesitas identificarte para procesar este pedido.");
            const wrapper = document.querySelector('.wrapper');
            if (wrapper) {
                wrapper.classList.add('active-popup');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return; 
        }

        // 2. Verificación de carrito
        const carritoFinal = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
        if (carritoFinal.length === 0) {
            alert("⚠️ No puedes procesar un carrito vacío.");
            return;
        }

        // 3. Simulación de procesamiento (Efecto de carga)
        btnLimpio.innerText = "CANALIZANDO ENERGÍA...";
        btnLimpio.style.backgroundColor = "#8338EC"; // Cambia a violeta mientras carga
        btnLimpio.disabled = true;

        const totalVenta = carritoFinal.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);


        // 4. Mostrar el Ticket después de 1.5 segundos
        setTimeout(() => {
            // Referencias al HTML del ticket que ya tienes en tu index
            const ticketOverlay = document.getElementById('ticketConfirmacion');
            const ordenTxt = document.getElementById('numeroPedido');
            const montoTxt = document.getElementById('montoTotalTicket');

            if (ticketOverlay && ordenTxt && montoTxt) {
                // Inyectamos los datos reales
                ordenTxt.innerText = `ORDEN: #${numOrden}`;
                montoTxt.innerText = `$${totalVenta.toFixed(2)}`;
                
                // Agregamos un detalle extra: quién compró (opcional)
                const pInfo = ticketOverlay.querySelector('p');
                if(pInfo) pInfo.innerHTML = `Wizard: ${usuarioLogueado}<br>Tu orden ha sido procesada en la red.`;

                // Mostramos el ticket
                ticketOverlay.style.display = 'flex';
            } else {
                // Fallback por si el HTML no carga
                alert(`¡Compra Exitosa, ${usuarioLogueado}! Orden: ${numOrden}`);
                localStorage.removeItem('carrito_wizards');
                window.location.href = "inicio.html";
            }
        }, 1500);
    });
}

// Función global para el botón de cerrar que está en tu HTML
window.cerrarTicket = function() {
    const ticket = document.getElementById('ticketConfirmacion');
    if (ticket) {
        ticket.style.display = 'none';
        // Limpiamos el carrito y volvemos al inicio al cerrar
        localStorage.removeItem('carrito_wizards');
        window.location.href = "inicio.html";
    }
};

const openFilters = document.getElementById('open-filters');
const closeFilters = document.getElementById('close-filters');
const filterSidebar = document.getElementById('filter-sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

if(openFilters) {
    openFilters.addEventListener('click', () => {
        filterSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    });
}

if(closeFilters) {
    closeFilters.addEventListener('click', () => {
        filterSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

// Cerrar al hacer clic fuera (en el overlay)
sidebarOverlay.addEventListener('click', () => {
    filterSidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.card-products');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Manejo de clase activa en botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            products.forEach(product => {
                // Si es "all", muestra todo. Si no, busca la clase específica
                if (filterValue === 'all' || product.classList.contains(filterValue)) {
                    product.style.display = 'grid'; // Usamos grid para que respete tu diseño
                    product.style.opacity = '1';
                } else {
                    product.style.display = 'none';
                    product.style.opacity = '0';
                }
            });
        });
    });
});

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
            const img = prod.querySelector('img').src; // Recuperamos la imagen

            if (name.toLowerCase().includes(value)) {
                found = true;
                const item = document.createElement('div');
                item.classList.add('result-item');
                
                // Volvemos a poner la imagen y el nombre juntos
                item.innerHTML = `
                    <img src="${img}" style="width: 40px; height: 40px; border-radius: 5px; object-fit: cover;">
                    <span>${name}</span>
                `;
                
                // Acción al hacer clic
                item.onclick = () => {
                    prod.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Efecto visual en la tarjeta destino
                    prod.style.outline = '2px solid #8338EC'; 
                    setTimeout(() => { prod.style.outline = 'none'; }, 2000);
                    
                    resultsDropdown.style.display = 'none';
                    searchInput.value = '';
                };
                
                resultsDropdown.appendChild(item);
            }
        });
        resultsDropdown.style.display = found ? 'block' : 'none';
    } else {
        resultsDropdown.style.display = 'none';
    }
});

// Cerrar al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-item')) {
        resultsDropdown.style.display = 'none';
    }
});
/**
 * WIZARDS OF TOMORROW - CORE SCRIPT V2 (CONECTADO)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. CONFIGURACIÓN DE ESTADO (Ahora lee la realidad)
    const nombreEnMemoria = localStorage.getItem('nombre_usuario');
    let isUserLoggedIn = nombreEnMemoria !== null; 

    // 2. ELEMENTOS DEL DOM
    const vistaInvitado = document.getElementById('logged-out-view');
    const vistaMago = document.getElementById('logged-in-view');
    const labelNombre = document.querySelector('.user-name'); // El label del nombre
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDropdown = document.getElementById('userDropdown');
    const wrapper = document.querySelector('.wrapper'); // Tu contenedor de Pop-up
    
    const searchInput = document.querySelector('.search-input');
    const resultsDropdown = document.getElementById('search-results');
    const allProducts = document.querySelectorAll('.card-products');

    // 3. FUNCIÓN: ACTUALIZAR INTERFAZ SEGÚN SESIÓN
    function actualizarInterfaz() {
        if (isUserLoggedIn) {
            if(vistaInvitado) vistaInvitado.style.display = 'none';
            if(vistaMago) vistaMago.style.display = 'flex';
            if(labelNombre) {
                labelNombre.innerText = nombreEnMemoria;
                labelNombre.style.color = "#8338EC"; // Tu verde neón
            }
        } else {
            if(vistaInvitado) vistaInvitado.style.display = 'flex';
            if(vistaMago) vistaMago.style.display = 'none';
        }
    }
    actualizarInterfaz();

    // 4. LÓGICA DEL BUSCADOR (Se mantiene tu lógica que funciona)
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const value = searchInput.value.toLowerCase().trim();
            resultsDropdown.innerHTML = ''; 

            if (value.length > 0) {
                let found = false;
                allProducts.forEach(prod => {
                    const name = prod.getAttribute('data-name');
                    const img = prod.querySelector('img').src;

                    if (name.toLowerCase().includes(value)) {
                        found = true;
                        const item = document.createElement('div');
                        item.classList.add('result-item');
                        item.innerHTML = `
                            <img src="${img}" style="width: 40px; height: 40px; border-radius: 5px; object-fit: cover;">
                            <span>${name}</span>
                        `;
                        
                        item.onclick = () => {
                            prod.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            prod.style.outline = '2px solid #8338EC'; 
                            setTimeout(() => { prod.style.outline = 'none'; }, 2000);
                            resultsDropdown.style.display = 'none';
                            searchInput.value = '';
                        };
                        resultsDropdown.appendChild(item);
                    }
                });
                resultsDropdown.style.display = found ? 'block' : 'none';
            } else {
                resultsDropdown.style.display = 'none';
            }
        });
    }

    // 5. LÓGICA DE PRODUCTOS (WISHLIST Y SHARE)
    allProducts.forEach(product => {
        const wishlistBtn = product.querySelector('.wishlist-btn');
        const shareBtn = product.querySelector('.share-btn');
        const productName = product.getAttribute('data-name');

        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                if (!isUserLoggedIn) {
                    alert("✨ Solo los magos registrados pueden guardar deseos. ¡Inicia sesión!");
                    if(wrapper) wrapper.classList.add('active-popup'); 
                } else {
                    const icon = wishlistBtn.querySelector('i');
                    icon.classList.toggle('fa-regular');
                    icon.classList.toggle('fa-solid');
                    icon.style.color = icon.classList.contains('fa-solid') ? '#8338EC' : '';
                }
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                const productUrl = window.location.href;
                if (navigator.share) {
                    navigator.share({
                        title: productName,
                        text: `¡Mira esta joya en Wizards of Tomorrow: ${productName}!`,
                        url: productUrl,
                    }).catch(console.error);
                } else {
                    navigator.clipboard.writeText(`${productUrl} - Mira: ${productName}`);
                    alert("🔗 ¡Enlace copiado al portapapeles!");
                }
            });
        }
    });

    // 6. EVENTOS DE CLIC (LOGIN Y DROPDOWN)
    if (vistaInvitado) {
        vistaInvitado.addEventListener('click', (e) => {
            e.preventDefault();
            if(wrapper) wrapper.classList.add('active-popup');
        });
    }

    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (userDropdown && !userDropdown.contains(e.target) && e.target !== userProfileBtn) {
            userDropdown.classList.remove('active');
        }
        if (resultsDropdown && !e.target.closest('.search-input')) {
            resultsDropdown.style.display = 'none';
        }
    });

    // CERRAR SESIÓN (LOGOUT REAL)
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("¿Estás seguro de que quieres abandonar la sesión, Wizard?")) {
                localStorage.removeItem('nombre_usuario');
                isUserLoggedIn = false;
                window.location.href = "inicio.html"; // Redirección limpia
            }
        });
    }
});

// ==========================================
// LÓGICA DE WISHLIST (MEMORIA Y RENDER)
// ==========================================

// 1. Cargar lista desde localStorage al iniciar
let wishlist = JSON.parse(localStorage.getItem('user_wishlist')) || [];

// 2. Función para pintar los productos en 'listwish.html'
function renderWishlist() {
    const wishlistGrid = document.getElementById('wishlist-grid');
    const emptyMsg = document.getElementById('empty-msg');
    
    if (!wishlistGrid) return; // Si no existe el contenedor, no hace nada

    if (wishlist.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        wishlistGrid.innerHTML = '';
    } else {
        if (emptyMsg) emptyMsg.style.display = 'none';
        wishlistGrid.innerHTML = wishlist.map(prod => `
            <div class="wish-card">
                <div class="wish-img">
                    <img src="${prod.img}" alt="${prod.name}">
                    <button class="remove-wish" data-id="${prod.id}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="wish-details">
                    <h4 class="clash-font" style="color: #fff;">${prod.name}</h4>
                    <span class="price-tag" style="color: #8338EC;">$${prod.price}</span>
                    <button class="add-to-cart-wish">Añadir al Carrito</button>
                </div>
            </div>
        `).join('');
    }
}

// 3. Función para que los corazones del Inicio reflejen lo guardado
function syncWishlistIcons() {
    document.querySelectorAll('.card-products').forEach(card => {
        const id = card.dataset.id;
        const icon = card.querySelector('.wishlist-btn i');
        if (icon && wishlist.some(item => item.id === id)) {
            icon.classList.replace('fa-regular', 'fa-solid');
            icon.parentElement.style.color = "#8338EC"; // Verde Neón
        }
    });
}

// 4. Escuchador de clics (Añadir/Quitar/Borrar)
document.addEventListener('click', (e) => {
    // CLICK EN CORAZÓN (Inicio)
    const wishBtn = e.target.closest('.wishlist-btn');
    if (wishBtn) {
        const card = wishBtn.closest('.card-products');
        const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: card.dataset.price,
            img: card.querySelector('img').src
        };

        const index = wishlist.findIndex(item => item.id === product.id);
        const icon = wishBtn.querySelector('i');

        if (index === -1) {
            wishlist.push(product);
            icon.classList.replace('fa-regular', 'fa-solid');
            wishBtn.style.color = "#8338EC";
        } else {
            wishlist.splice(index, 1);
            icon.classList.replace('fa-solid', 'fa-regular');
            wishBtn.style.color = "";
        }
        localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
    }

    // CLICK EN LA X (Página Wishlist)
    const removeBtn = e.target.closest('.remove-wish');
    if (removeBtn) {
        const id = removeBtn.dataset.id;
        wishlist = wishlist.filter(item => item.id !== id);
        localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
        renderWishlist(); // Actualiza la vista sin recargar
    }
});

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();
    syncWishlistIcons();
});

// ==========================================
// LÓGICA DE CALIFICACIÓN (ESTRELLAS)
// ==========================================
// --- LÓGICA DE ESTRELLAS WT ---
let ratings = JSON.parse(localStorage.getItem('user_ratings')) || {};

function syncEstrellas() {
    // Buscamos todas las tarjetas de producto
    document.querySelectorAll('.card-products').forEach(card => {
        const id = card.dataset.id;
        const savedRating = ratings[id];
        
        if (savedRating) {
            const stars = card.querySelectorAll('.star i');
            actualizarVistaEstrellas(stars, savedRating);
        }
    });
}

function actualizarVistaEstrellas(iconos, valor) {
    iconos.forEach((s, index) => {
        // Si el índice es menor al valor calificado, se rellena
        if (index < valor) {
            s.classList.replace('fa-regular', 'fa-solid');
            s.style.color = "#fff200"; // Tu Azul Eléctrico
        } else {
            s.classList.replace('fa-solid', 'fa-regular');
            s.style.color = "#000000"; // Tu color base de estrellas
        }
    });
}

// Escuchador global de clics para eficiencia
document.addEventListener('click', (e) => {
    // Detectamos si el clic fue en un icono i dentro de .star
    const starIcon = e.target.closest('.star i');
    
    if (starIcon) {
        const card = starIcon.closest('.card-products');
        const container = starIcon.parentElement;
        const productId = card.dataset.id;
        
        // Obtenemos el valor del data-value (asegúrate que sean 1, 2, 3, 4, 5)
        const val = parseInt(starIcon.getAttribute('data-value'));

        // Guardar en memoria
        ratings[productId] = val;
        localStorage.setItem('user_ratings', JSON.stringify(ratings));

        // Actualizar visualmente esa tarjeta específica
        const allStars = container.querySelectorAll('i');
        actualizarVistaEstrellas(allStars, val);
        
        console.log(`Producto ${productId} calificado con ${val} estrellas`);
    }
});

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', syncEstrellas);

// --- SISTEMA DE CALIFICACIÓN PERSISTENTE ---

function aplicarCalificaciones() {
    document.querySelectorAll('.card-products').forEach(card => {
        const productId = card.dataset.id;
        const savedValue = ratings[productId];
        
        if (savedValue) {
            const stars = card.querySelectorAll('.star i');
            actualizarEstrellas(stars, savedValue);
        }
    });
}

function actualizarEstrellas(iconos, valor) {
    iconos.forEach((star, index) => {
        if (index < valor) {
            // Activa: Estrella rellena y tu color Electric Blue
            star.classList.replace('fa-regular', 'fa-solid');
            star.style.color = "#f2ff00"; 
        } else {
            // Inactiva: Estrella de borde y color gris/dorado base
            star.classList.replace('fa-solid', 'fa-regular');
            star.style.color = "#000000"; 
        }
    });
}

// Escuchar los clics en las estrellas
document.addEventListener('click', (e) => {
    const starClicked = e.target.closest('.star i');
    if (starClicked) {
        const card = starClicked.closest('.card-products');
        const container = starClicked.parentElement;
        const id = card.dataset.id;
        const value = parseInt(starClicked.getAttribute('data-value'));

        // Guardar en localStorage
        ratings[id] = value;
        localStorage.setItem('user_ratings', JSON.stringify(ratings));

        // Reflejar cambio visual
        const allStars = container.querySelectorAll('i');
        actualizarEstrellas(allStars, value);
    }
});

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', aplicarCalificaciones);

/*contador contactanos*/
const messageArea = document.getElementById('message');
const charCount = document.querySelector('.char-count');

if (messageArea && charCount) {
    messageArea.addEventListener('input', () => {
        const length = messageArea.value.length;
        charCount.textContent = `${length}/200 caracteres`; // Cambié a 300 porque así está en tu HTML
        
        // Si se acerca al límite, ponerlo en neón verde
        charCount.style.color = length > 250 ? "#8338EC" : "#555";
    });
}

// Definimos la URL de mensajes basada en la que ya tienes
const URL_MENSAJES = "https://69af4b16c8b37f499837d734.mockapi.io/api/v1/mensajes";

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Detenemos la recarga de página

        const btn = contactForm.querySelector('.btn');
        
        // Recolectamos los datos de la "Carta de Contacto"
        const infoMensaje = {
            nombre: contactForm.querySelector('input[type="name"]').value,
            correo: contactForm.querySelector('input[type="email"]').value,
            mensaje: document.getElementById('message').value,
            enviadoEl: new Date().toLocaleString() // Para que sepas cuándo te escribieron
        };

        try {
            // Estética Neón: Cambiamos el botón mientras "viaja" el dato
            btn.innerText = 'TRANSMITIENDO...';
            btn.style.boxShadow = "0 0 15px #0080ff"; // Tu Electric Blue

            // ENVIAR A MOCKAPI
            const respuesta = await fetch(URL_MENSAJES, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(infoMensaje)
            });

            if (respuesta.ok) {
                // ÉXITO TOTAL
                btn.innerText = 'TU MENSAJE HA SIDO ENVIADO CORRECTAMENTE';
                btn.style.background = "#ff0000"; // Tu Verde Neón
                
                // Limpiamos y reseteamos después de 2 segundos
                setTimeout(() => {
                    contactForm.reset();
                    btn.innerText = 'ENVIAR';
                    btn.style.background = "";
                    btn.style.boxShadow = "";
                }, 2000);
            }

        } catch (error) {
            console.error("Error en la conexión mágica:", error);
            btn.innerText = 'FALLO EN LA SEÑAL';
            btn.style.background = "#ff0000";
        }
    });
}

/*pedidos */

async function finalizarCompraArcana() {
    const carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
    if (carrito.length === 0) return alert("El inventario está vacío.");

    // 1. Obtenemos el nombre del cliente (puedes jalarlo de un input o usar uno real)
    const nombreCliente = "Mago_Supremo_WT"; // Cámbialo por la lógica de tu login

    const total = carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * (item.cantidad || 1)), 0);

    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let idAleatorio = '';
    for (let i = 0; i < 6; i++) {
        idAleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    const numOrdenConEstilo = `WOT-2026-${idAleatorio}`;

    // 2. Mapeamos el carrito para que MockAPI guarde los nombres
    const listaProductos = carrito.map(p => ({
        nombre: p.nombre,
        cantidad: p.cantidad || 1,
        precio: p.precio
    }));

    const pedido = {
        numeroPedido: numOrdenConEstilo,
        cliente: nombreCliente, // AHORA SÍ SE ENVÍA EL NOMBRE
        total: total,
        items: listaProductos,  // AHORA SÍ SE ENVÍAN LOS PRODUCTOS
        fecha: new Date().toISOString()
    };

    try {
        const respuesta = await fetch('https://69af4b16c8b37f499837d734.mockapi.io/api/v1/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });

        if (respuesta.ok) {
            localStorage.removeItem('carrito_wizards');
            // Pasamos también el nombre del cliente al ticket
            mostrarTicketVisual(numOrdenConEstilo, total, nombreCliente);
        } else {
            alert("Error en MockAPI: " + respuesta.status);
        }
    } catch (error) {
        alert("Fallo crítico: " + error.message);
    }
}

function mostrarTicketVisual(numero, total, cliente) {
    const modal = document.getElementById('ticketConfirmacion');
    const txtNumero = document.getElementById('numeroPedido');
    const txtTotal = document.getElementById('montoTotalTicket');
    const txtCliente = document.getElementById('nombreClienteTicket'); // Asegúrate de tener este ID en tu HTML

    if (modal) {
        if (txtNumero) txtNumero.innerText = numero;
        if (txtTotal) txtTotal.innerText = `$${total.toFixed(2)}`;
        if (txtCliente) txtCliente.innerText = `Hechicero: ${cliente}`;
        
        modal.style.display = 'flex';
    }
}