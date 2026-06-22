document.addEventListener('DOMContentLoaded', () => {
    const contenedorLista = document.querySelector('.lista-compra');
    const totalElement = document.querySelector('.total-destacado');
    const subtotalElement = document.getElementById('subtotal-pago');

    function renderizarCheckout() {
        let carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
        
        if (!contenedorLista) return;

        if (carrito.length === 0) {
            contenedorLista.innerHTML = `
                <div class="carrito-vacio-feedback">
                    <i class="fa-solid fa-wand-sparkles"></i>
                    <p class="mensaje-vacio">Tu caldero está vacío, mago.</p>
                    <a href="index.html" class="btn-arcano-vacio">Volver a la tienda</a>
                </div>
            `;
            actualizarTotales(0);
            return;
        }

        contenedorLista.innerHTML = '';
        let sumaSubtotal = 0;

        carrito.forEach((item, index) => {
            const subtotalItem = item.precio * item.cantidad;
            sumaSubtotal += subtotalItem;

            // Usamos tu estructura CSS: .item-checkout, .item-lado-izquierdo, etc.
            contenedorLista.innerHTML += `
                <div class="item-checkout">
                    <div class="item-lado-izquierdo">
                        <img src="${item.imagen}" alt="${item.nombre}" class="img-cart">
                        <div class="item-detalles">
                            <h3 class="nombre-producto">${item.nombre}</h3>
                            <p class="precio-producto">${item.cantidad} x $${item.precio.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <div class="item-acciones">
                        <div class="item-quantity">
                            <button class="qty-btn" onclick="cambiarCantidadCheckout(${index}, -1)">-</button>
                            <input type="text" value="${item.cantidad}" readonly>
                            <button class="qty-btn" onclick="cambiarCantidadCheckout(${index}, 1)">+</button>
                        </div>
                        <button class="remove-item" onclick="eliminarDelCarrito(${index})">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        actualizarTotales(sumaSubtotal);
    }

    function actualizarTotales(subtotal) {
        if (subtotalElement) subtotalElement.innerText = `$${subtotal.toFixed(2)}`;
        if (totalElement) totalElement.innerText = `$${subtotal.toFixed(2)}`;
    }

    // Función para cambiar cantidades desde el checkout
    window.cambiarCantidadCheckout = (index, cambio) => {
        let carrito = JSON.parse(localStorage.getItem('carrito_wizards')) || [];
        if (carrito[index]) {
            carrito[index].cantidad += cambio;
            
            if (carrito[index].cantidad <= 0) {
                carrito.splice(index, 1);
            }
            
            localStorage.setItem('carrito_wizards', JSON.stringify(carrito));
            renderizarCheckout();
            if (typeof renderizarSidebar === 'function') renderizarSidebar();
        }
    };

    renderizarCheckout();
});