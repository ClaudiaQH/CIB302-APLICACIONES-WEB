// ===============================
// PRODUCTOS
// ===============================
const productos = [
    { id: 1, categoria: "Camisetas deportivas", nombre: "Jersey Pro Fit", descripcion: "Ligera y transpirable.", precio: 25000, img: "https://via.placeholder.com/200" },
    { id: 2, categoria: "Pantalones deportivos", nombre: "Jogger Sport", descripcion: "Comodidad ideal.", precio: 40000, img: "https://via.placeholder.com/200" },
    { id: 3, categoria: "Accesorios de deporte", nombre: "Mat de Yoga", descripcion: "Antideslizante.", precio: 15000, img: "https://via.placeholder.com/200" }
];

let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
let isLoggedIn = false;
let auth0Client = null;

// ===============================
// FUNCIONES DEL CARRITO
// ===============================
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const item = carrito.find(p => p.id === id);
    item ? item.cantidad++ : carrito.push({ ...producto, cantidad: 1 });
    
    guardarCarrito();
    renderCarrito();
    alert(`${producto.nombre} agregado!`);
}

function guardarCarrito() {
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
}

function renderProductos() {
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = productos.map(p => `
        <div class="producto-card">
            <img src="${p.img}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <small>${p.categoria}</small>
            <p>${p.descripcion}</p>
            <strong>$${p.precio}</strong>
            <button onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
        </div>
    `).join("");
}

function renderCarrito() {
    const contenedor = document.getElementById("detalle-carrito");
    const total = document.getElementById("total-precio");
    if (carrito.length === 0) {
        contenedor.innerHTML = "<p class='empty-msg'>Tu carrito está vacío</p>";
        total.textContent = "0";
        return;
    }
    contenedor.innerHTML = carrito.map(p => `
        <div class="item-carrito">
            <span>${p.nombre} x${p.cantidad}</span>
            <span>$${p.precio * p.cantidad}</span>
        </div>
    `).join("");
    total.textContent = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
}

// ===============================
// AUTH0: CONFIGURACIÓN Y LÓGICA
// ===============================
async function initAuth() {
    try {
        auth0Client = await createAuth0Client({
            domain: "dev-claudiaqh.us.auth0.com",
            client_id: "7EwWcDKSUjVMwnjIsXtUW9UdFNZyj7Id",
            authorizationParams: {
                redirect_uri: window.location.origin
            }
        });

        // Manejar el regreso del login (Query params)
        const query = window.location.search;
        if (query.includes("code=") && query.includes("state=")) {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, "/");
        }

        updateAuthUI();
    } catch (err) {
        console.error("Error inicializando Auth0:", err);
    }
}

async function updateAuthUI() {
    const isAuthenticated = await auth0Client.isAuthenticated();
    if (isAuthenticated) {
        isLoggedIn = true;
        const user = await auth0Client.getUser();
        document.getElementById("logged-out-view").style.display = "none";
        document.getElementById("logged-in-view").style.display = "block";
        document.getElementById("user-greet").innerText = `Bienvenido, ${user.name}`;
        document.getElementById("nav-cuenta-btn").innerText = "Mi Cuenta ✅";
    }
}

document.getElementById("btn-login").addEventListener("click", async () => {
    if (auth0Client) await auth0Client.loginWithRedirect();
});

document.getElementById("btn-logout").addEventListener("click", async () => {
    sessionStorage.clear();
    await auth0Client.logout({ logoutParams: { returnTo: window.location.origin } });
});

// ===============================
// PROCESO DE PAGO
// ===============================
document.getElementById("form-pago").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
        alert("Debes iniciar sesión para finalizar la compra.");
        // Activar pestaña de sesión manualmente
        const btnSesion = document.querySelector('button[onclick*="sesion-tab"]');
        openTab({ currentTarget: btnSesion }, "sesion-tab");
        return;
    }

    const email = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) || !/^[0-9]+$/.test(telefono)) {
        alert("Por favor revisa que el correo sea válido y el teléfono solo contenga números.");
        return;
    }

    const modal = document.getElementById("mensaje-confirmacion");
    const detalle = document.getElementById("detalle-pedido-final");
    detalle.innerHTML = carrito.map(p => `<p>${p.nombre} (x${p.cantidad}) - $${p.precio * p.cantidad}</p>`).join("");
    modal.classList.remove("hidden");
    
    carrito = [];
    guardarCarrito();
    renderCarrito();
});

// INICIALIZACIÓN GLOBAL
window.onload = async () => {
    renderProductos();
    renderCarrito();
    await initAuth();
};