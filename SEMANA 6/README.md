# SportyStyle - Tienda Deportiva

SportyStyle es una aplicación web de tienda deportiva que permite a los usuarios explorar productos, agregarlos a un carrito de compras, autenticarse mediante Auth0 y simular un proceso de compra con validación de datos. El sistema utiliza Session Storage para mantener el carrito durante la sesión del usuario.

---

# Características principales

- Autenticación de usuarios con Auth0  
- Catálogo de productos por categorías  
- Carrito de compras dinámico  
- Persistencia de datos con Session Storage  
- Simulación de proceso de pago y envío  
- Validaciones de formulario  
- Pantalla de confirmación de compra  
- Gestión de sesión activa del usuario  

---

# Estructura del proyecto
/proyecto
│── index.html
│── app.js
│── style.css
└── assets/
├── camisetas
├── pantalones
└── accesorios

---

# Autenticación con Auth0

Este proyecto utiliza Auth0 para gestionar el inicio y cierre de sesión de los usuarios.

## Flujo de autenticación:

1. El usuario hace clic en "Iniciar sesión".  
2. Es redirigido a Auth0 mediante `loginWithRedirect()`.  
3. Ingresa sus credenciales.  
4. Auth0 valida la identidad del usuario.  
5. El usuario regresa a la aplicación.  
6. Se ejecuta `handleRedirectCallback()` para procesar la respuesta.  
7. Se verifica la sesión con `isAuthenticated()`.  

## Resultado:
- Usuario autenticado: se muestra su nombre y acceso completo a la tienda.  
- Usuario no autenticado: solo puede iniciar sesión.  

---

# Catálogo de productos

Los productos se organizan en tres categorías:

- Camisetas deportivas  
- Pantalones deportivos  
- Accesorios de deporte  

Cada producto contiene:
- Imagen  
- Nombre  
- Descripción  
- Precio  
- Categoría  

Los productos se renderizan dinámicamente desde un array de objetos en JavaScript.

---

# Carrito de compras

## Proceso de selección:

1. El usuario hace clic en "Agregar al carrito".  
2. Se identifica el producto seleccionado.  
3. Se verifica si ya existe en el carrito:  
   - Si existe, aumenta la cantidad.  
   - Si no existe, se agrega como nuevo producto.  
4. El carrito se actualiza en pantalla.  

## Información del carrito:

- Nombre del producto  
- Cantidad  
- Precio unitario  
- Total por producto  
- Total general de la compra  

---

# Session Storage

El carrito se almacena en Session Storage:

    sessionStorage.setItem("carrito", JSON.stringify(carrito))

Esto permite:
- Mantener los productos durante la sesión del navegador
- Conservar datos al recargar la página
- Eliminar los datos al cerrar la pestaña o sesión

---

# Proceso de pago y validaciones

El usuario completa un formulario con:

- Nombre completo
- Correo electrónico
- Teléfono
- Dirección
- Validaciones:
    - Correo electrónico: formato válido (ejemplo: usuario@dominio.com)
    - Teléfono: solo números (8 a 15 dígitos)
    - Campos obligatorios: no pueden estar vacíos

---

# Confirmación de compra

Después de validar los datos:

- Se muestra una pantalla de confirmación
- Se listan los productos comprados
- Se muestra el total
- Se agradece al usuario por su compra

---

# Mantenimiento de sesión activa

La sesión se mantiene mediante Auth0 SDK.

Funcionamiento:
Al iniciar la app se ejecuta initAuth()
Se verifica si el usuario está autenticado con:
    auth0Client.isAuthenticated()

Si existe sesión:
- Se obtiene el usuario con getUser()
- Se muestra su nombre en la interfaz
- Se mantiene la sesión activa
- Persistencia:

Auth0 mantiene la sesión automáticamente en el navegador mientras no expire.

---

# Cierre de sesión

Al cerrar sesión:

    auth0Client.logout({
    logoutParams: { returnTo: window.location.origin }
    });

Se realiza:
- Eliminación de sesión en Auth0
- Limpieza de Session Storage
- Reinicio del estado de la aplicación

---

# Conclusión

El proyecto integra autenticación segura con Auth0 y un sistema de carrito de compras basado en Session Storage, permitiendo una experiencia de usuario fluida, persistente durante la sesión y con simulación completa de compra y envío.