document.addEventListener('DOMContentLoaded', () => {
    // 1. CARGA DE DATOS Y SELECTORES
    let carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
    const cartSidebar = document.getElementById('cart-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    const cartCountLabel = document.querySelector('.cart-count');

    /* ============================================================
        A. CONTROL DE LA SIDEBAR (ABRIR / CERRAR)
    ============================================================ */
    const cartLink = document.querySelector('.cart-link'); 
    const closeCartBtn = document.querySelector('.close-cart');

    function toggleSidebar() {
        cartSidebar.classList.toggle('active');
        if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
    }

    if (cartLink) cartLink.addEventListener('click', (e) => { e.preventDefault(); toggleSidebar(); });
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    /* ============================================================
        B. LÓGICA DEL CONTADOR DE CANTIDAD (PÁGINA PRODUCTO)
    ============================================================ */

    /* ============================================================
        C. AÑADIR AL CARRITO (3 ESCENARIOS)
    ============================================================ */
    
    document.addEventListener('click', (e) => {
        // 1. Desde las Cards de la Home (.add-cart)
        if (e.target.closest('.add-cart')) {
            const card = e.target.closest('.card-products');
            capturarYAgregar(card, 1);
        }

        // 2. Desde Sugerencias (.add-cart-btn)
        if (e.target.closest('.add-cart-btn')) {
            const card = e.target.closest('.recomend-card'); // Ajusta si la clase padre es otra
            capturarYAgregar(card, 1);
        }

        // 3. Desde el Botón Principal con Contador (.btn-buy)
        if (e.target.closest('.btn-buy')) {
            const container = document.querySelector('.container-product-info'); // El contenedor de tu página de producto
            const cantidad = parseInt(inputQty.value) || 1;
            
            // Para la página de producto, sacamos los datos de los IDs o clases específicas
            const producto = {
                id: container.dataset.id || "prod-main", 
                nombre: container.querySelector('.product-title').innerText,
                precio: parseFloat(container.querySelector('.product-price').innerText.replace('$', '')),
                imagen: document.getElementById('current-main-img').src,
                cantidad: cantidad
            };
            
            agregarAlCarrito(producto);
        }
    });

    function capturarYAgregar(elemento, cantidad) {
        const producto = {
            id: elemento.dataset.id,
            nombre: elemento.dataset.name,
            precio: parseFloat(elemento.dataset.price),
            imagen: elemento.querySelector('img').src,
            cantidad: cantidad
        };
        
        // Regla: si el carrito está vacío, abrimos la sidebar
        const abrirAlFinal = carrito.length === 0;
        agregarAlCarrito(producto);
        if (abrirAlFinal) toggleSidebar();
    }

    function agregarAlCarrito(nuevoProd) {
        const index = carrito.findIndex(item => item.id === nuevoProd.id);
        if (index !== -1) {
            carrito[index].cantidad += nuevoProd.cantidad;
        } else {
            carrito.push(nuevoProd);
        }
        guardarYActualizar();
    }

    /* ============================================================
        D. PERSISTENCIA Y RENDERIZADO
    ============================================================ */
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
                    </div>
                `;
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
        E. REDIRECCIÓN AL PAGO
    ============================================================ */

(function() {
    // Usamos querySelector con un punto (.) para indicar que buscamos una CLASE
    const btnPay = document.querySelector('.btn-pay');

    if (btnPay) {
        // Aseguramos que aparezca la manito al pasar el mouse
        btnPay.style.cursor = 'pointer';

        btnPay.onclick = function(e) {
            e.preventDefault();
            console.log("Iniciando secuencia de pago...");

            // Recuperamos los datos del localStorage justo ahora
            const datos = localStorage.getItem('carrito_wizards');
            const contenidoCarrito = datos ? JSON.parse(datos) : [];

            if (contenidoCarrito.length === 0) {
                alert("⚠️ ¡Mago! Tu caldero está vacío. No puedes ir al checkout sin objetos.");
            } else {
                console.log("Redirigiendo a carrito.html");
                window.location.href = 'carrito.html';
            }
        };
    } else {
        console.error("No se encontró ningún elemento con la clase '.btn-pay'");
    }
})();

    /* ============================================================
        F. eliminar productos
    ============================================================ */




    renderizarSidebar();
});

    /* ============================================================
        G. Contador y agregar al carrito
    ============================================================ */

    document.addEventListener('DOMContentLoaded', () => {
    const btnMinus = document.querySelector('.qty-btn-m');
    const btnPlus = document.querySelector('.qty-btn-\\+'); // El \\ escapa el símbolo +
    const inputQty = document.getElementById('main-qty');
    const btnBuy = document.querySelector('.btn-buy');

    /* --- Lógica del Contador --- */
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

    /* --- Lógica de Añadir al Carrito --- */
    if (btnBuy) {
        btnBuy.onclick = () => {
            // Buscamos el contenedor que tiene los datos
            const container = document.querySelector('.container-product-info');
            
            // Si el contenedor no tiene los datos, el hechizo falla
            if (!container) return console.error("No se encontró container-product-info");

            const producto = {
                id: container.dataset.id,
                nombre: container.dataset.name,
                precio: parseFloat(container.dataset.price),
                // Asumimos que la imagen principal tiene este ID
                imagen: document.getElementById('current-main-img')?.src || '',
                cantidad: parseInt(inputQty.value) || 1
            };

            agregarAlBaul(producto);
        };
    }

    function agregarAlBaul(nuevoProd) {
        let carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
        
        // ¿Ya existe el producto?
        const index = carrito.findIndex(item => item.id === nuevoProd.id);

        if (index !== -1) {
            // Si existe, sumamos la nueva cantidad
            carrito[index].cantidad += nuevoProd.cantidad;
        } else {
            // Si es nuevo, lo empujamos al array
            carrito.push(nuevoProd);
        }

        // Guardamos y damos feedback
        localStorage.setItem('carrito_wizards', JSON.stringify(carrito));
        
        // Opcional: Abrir la sidebar automáticamente para mostrar que se añadió
        const sidebar = document.getElementById('cart-sidebar');
        if (sidebar) sidebar.classList.add('active');
        
        // Si tienes una función para refrescar la sidebar, llámala aquí
        if (typeof renderizarSidebar === 'function') renderizarSidebar();
        
        alert(`¡${nuevoProd.nombre} añadido al caldero!`);
    }
});