document.addEventListener("DOMContentLoaded", async () => {

    // ===============================
    // VARIABLES
    // ===============================
    const productos = [
        {
            id: 1,
            categoria: "Camisetas deportivas",
            nombre: "Jersey Pro Fit",
            descripcion: "Ligera y transpirable.",
            precio: 25000,
            img: "assets/camiseta1.jpg"
        },
        {
            id: 2,
            categoria: "Camisetas deportivas",
            nombre: "Camiseta Dry Tech",
            descripcion: "Secado rápido para entrenamiento.",
            precio: 22000,
            img: "assets/camiseta2.jpg"
        },
        {
            id: 3,
            categoria: "Camisetas deportivas",
            nombre: "Top Running",
            descripcion: "Ideal para running.",
            precio: 20000,
            img: "assets/camiseta3.jpg"
        },

        {
            id: 4,
            categoria: "Pantalones deportivos",
            nombre: "Jogger Sport",
            descripcion: "Comodidad ideal.",
            precio: 40000,
            img: "assets/pantalon1.jpg"
        },
        {
            id: 5,
            categoria: "Pantalones deportivos",
            nombre: "Short Training",
            descripcion: "Ligero y flexible.",
            precio: 18000,
            img: "assets/pantalon2.jpg"
        },
        {
            id: 6,
            categoria: "Pantalones deportivos",
            nombre: "Leggings Fit",
            descripcion: "Ajuste perfecto.",
            precio: 30000,
            img: "assets/pantalon3.jpg"
        },

        {
            id: 7,
            categoria: "Accesorios de deporte",
            nombre: "Mat de Yoga",
            descripcion: "Antideslizante.",
            precio: 15000,
            img: "assets/accesorio1.jpg"
        },
        {
            id: 8,
            categoria: "Accesorios de deporte",
            nombre: "Botella Fitness",
            descripcion: "Mantiene la hidratación.",
            precio: 12000,
            img: "assets/accesorio2.jpg"
        },
        {
            id: 9,
            categoria: "Accesorios de deporte",
            nombre: "Guantes Gym",
            descripcion: "Mejor agarre.",
            precio: 10000,
            img: "assets/accesorio3.jpg"
        }
    ];

    let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
    let isLoggedIn = false;
    let auth0Client = null;

    // ===============================
    // UTILIDADES UI
    // ===============================
    function setStatus(tipo, texto) {
        document.getElementById("status-dot").className = "status-dot " + tipo;
        document.getElementById("status-text").textContent = texto;
    }

    function mostrarToast(mensaje) {
        const toast = document.getElementById("toast");

        toast.textContent = mensaje;
        toast.classList.remove("hidden");

        // Forzar animación
        setTimeout(() => {
            toast.classList.add("show");
        }, 10);

        // Ocultar después
        setTimeout(() => {
            toast.classList.remove("show");

            setTimeout(() => {
                toast.classList.add("hidden");
            }, 300);
        }, 2000);
    }

    function cambiarTab(tabId) {
        document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

        document.getElementById(tabId).classList.add("active");

        const btn = document.querySelector(`.tab-btn[onclick*="${tabId}"]`);
        if (btn) btn.classList.add("active");
    }

    // ===============================
    // CARRITO
    // ===============================
    function guardarCarrito() {
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function agregarAlCarrito(id) {
        const p = productos.find(x => x.id === id);
        const item = carrito.find(x => x.id === id);

        item ? item.cantidad++ : carrito.push({ ...p, cantidad: 1 });

        guardarCarrito();
        renderCarrito();
        mostrarToast("Producto agregado");
    }

    function eliminarProducto(id) {
        carrito = carrito.filter(p => p.id !== id);
        guardarCarrito();
        renderCarrito();
    }

    window.agregarAlCarrito = agregarAlCarrito;
    window.eliminarProducto = eliminarProducto;

    // ===============================
    // RENDER
    // ===============================
function renderProductos() {
    const contenedor = document.getElementById("lista-productos");

    // Obtener categorías únicas
    const categorias = [...new Set(productos.map(p => p.categoria))];

    let html = "";

    categorias.forEach(cat => {
        html += `
            <div class="categoria-section">
                <h3 class="categoria-titulo">${cat}</h3>
                <div class="product-grid">
        `;

        productos
            .filter(p => p.categoria === cat)
            .forEach(p => {
                html += `
                    <div class="producto-card">
                        <img src="${p.img}" onerror="this.src='https://picsum.photos/200'" />
                        <h3>${p.nombre}</h3>
                        <p>${p.descripcion}</p>
                        <strong>$${p.precio}</strong>
                        <button onclick="agregarAlCarrito(${p.id})">
                            Agregar al carrito
                        </button>
                    </div>
                `;
            });

        html += `
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}

    function renderCarrito() {
        const cont = document.getElementById("detalle-carrito");
        const totalEl = document.getElementById("total-precio");

        cont.innerHTML = "";

        if (carrito.length === 0) {
            cont.innerHTML = "<p class='empty-msg'>Tu carrito está vacío</p>";
            totalEl.textContent = "0";
            return;
        }

        let total = 0;

        carrito.forEach(p => {
            total += p.precio * p.cantidad;

            cont.innerHTML += `
                <div class="item-carrito">
                    <span>${p.nombre} x${p.cantidad}</span>
                    <span>$${p.precio * p.cantidad}</span>
                    <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                </div>
            `;
        });

        totalEl.textContent = total;
    }

    // ===============================
    // COMPRA
    // ===============================
    function mostrarConfirmacion(nombre) {
        const modal = document.getElementById("mensaje-confirmacion");
        const detalle = document.getElementById("detalle-pedido-final");

        let html = `<p>Gracias por tu compra, <strong>${nombre}</strong></p>`;
        let total = 0;

        carrito.forEach(p => {
            html += `<div>${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}</div>`;
            total += p.precio * p.cantidad;
        });

        html += `<hr><h3>Total: $${total}</h3>`;

        detalle.innerHTML = html;
        modal.classList.remove("hidden");
    }

    function iniciarNuevaCompra() {
        document.getElementById("mensaje-confirmacion").classList.add("hidden");

        carrito = [];
        guardarCarrito();
        renderCarrito();

        cambiarTab("productos-tab");
    }

    window.iniciarNuevaCompra = iniciarNuevaCompra;

    // ===============================
    // FORMULARIO
    // ===============================
    document.getElementById("form-pago").addEventListener("submit", (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            mostrarToast("Debes iniciar sesión");
            return;
        }

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const direccion = document.getElementById("direccion").value.trim();

        const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telOK = /^[0-9]{8,15}$/;

        if (!nombre || !direccion) {
            mostrarToast("Completa todos los campos");
            return;
        }

        if (!emailOK.test(correo)) {
            mostrarToast("Correo inválido");
            return;
        }

        if (!telOK.test(telefono)) {
            mostrarToast("Teléfono inválido");
            return;
        }

        // AQUÍ SÍ FINALIZA
        mostrarConfirmacion(nombre);

        carrito = [];
        guardarCarrito();
        renderCarrito();
    });

    // ===============================
    // AUTH0
    // ===============================
    async function initAuth() {
        auth0Client = await auth0.createAuth0Client({
            domain: "dev-claudiaqh.us.auth0.com",
            clientId: "7EwWcDKSUjVMwnjIsXtUW9UdFNZyj7Id",
            authorizationParams: { redirect_uri: window.location.origin }
        });

        if (window.location.search.includes("code=")) {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, "/");
        }

        const isAuth = await auth0Client.isAuthenticated();

        if (isAuth) {
            isLoggedIn = true;

            const user = await auth0Client.getUser();

            document.getElementById("logged-out-view").style.display = "none";
            document.getElementById("logged-in-view").style.display = "block";

            document.getElementById("user-greet").textContent = "Bienvenido, " + user.name;
            document.getElementById("user-name-header").textContent = "Hola, " + user.name;

            setStatus("online", "Sesión activa");

        } else {
            setStatus("offline", "No autenticado");
        }

        document.getElementById("auth-loading").style.display = "none";
    }

    document.getElementById("btn-login").onclick = async () => {
        await auth0Client.loginWithRedirect();
    };

    document.getElementById("btn-logout").onclick = async () => {
        sessionStorage.clear();
        carrito = [];
        renderCarrito();

        await auth0Client.logout({
            logoutParams: { returnTo: window.location.origin }
        });
    };

    // ===============================
    // INIT
    // ===============================
    renderProductos();
    renderCarrito();
    await initAuth();

});