## 💻 CloudSell Backend — Roadmap 

### 🏁 Sprint 1: Setup Inicial y Base del Proyecto

**Objetivo:** Establecer la arquitectura base y el entorno de desarrollo.

* [ ] Configuración de entorno (pnpm, Docker, variables de entorno)
* [ ] Estructura de carpetas siguiendo DDD (Domain-Driven Design)
* [ ] Configuración de Fastify y punto de entrada (`src/index.ts`)
* [ ] Configuración de logging (ej. pino)
* [ ] Integración inicial de Prisma ORM y conexión a PostgreSQL
* [ ] Primeros tests de salud (endpoint `/health`)

---

### 🔒 Sprint 2: Seguridad, Autenticación y Perfiles de Usuario

**Objetivo:** Implementar el registro, autenticación segura [cite: 18] y la diferenciación de roles (Comprador/Vendedor).

* [ ] Entidad `User` con campo **`role`** (Comprador/Vendedor).
* [ ] Implementación de **Registro** y **Autenticación segura** (JWT, bcrypt para contraseñas)[cite: 18].
* [ ] Rutas de **gestión de datos personales** para la correcta gestión de datos personales[cite: 19].
* [ ] Middleware para **Autenticación** y **Autorización** basado en roles.
* [ ] Tests unitarios y de integración para autenticación y gestión de usuarios.

---

### 🛍️ Sprint 3: Módulo de Vendedores y Gestión de Artículos

**Objetivo:** Implementar la gestión de productos y stock, exclusiva para vendedores.

* [ ] Entidad `Product` con relación al `User` (Vendedor).
* [ ] Casos de uso del Vendedor (CRUD) para **crear, editar y eliminar los diferentes artículos**[cite: 29].
* [ ] **Gestión de Stock**: Campo `stockQuantity` en `Product` y Casos de uso para actualizar el stock[cite: 30].
* [ ] Rutas Fastify para la gestión de productos, protegidas por el rol `Vendedor`.
* [ ] Tests unitarios y de integración para la gestión de productos por parte del vendedor.

---

### 🔎 Sprint 4: Módulo de Catálogo, Búsqueda y Lista de Deseos

**Objetivo:** Implementar la visualización y las herramientas de búsqueda para los compradores.

* [ ] Entidad `Category` y su relación con `Product`.
* [ ] **Visualización del Catálogo Completo** de artículos del marketplace[cite: 20].
* [ ] Implementar **filtrado y búsqueda sobre los artículos del catálogo**[cite: 21].
* [ ] Entidad `Wishlist` y funcionalidad para **añadir artículos a una lista personalizada de deseos**[cite: 22].
* [ ] Tests unitarios y de integración para catálogo y filtros.

---

### 🛒 Sprint 5: Módulo de Carrito de la Compra y Creación de Pedidos

**Objetivo:** Gestionar el carrito y crear la estructura inicial del pedido.

* [ ] Entidad `Cart` asociada al `Comprador` y `CartItem` (Producto + Cantidad).
* [ ] Casos de uso del Carrito: agregar/quitar productos, con opción de **ajustar las unidades del mismo producto**[cite: 23].
* [ ] Entidad `Order` (Pedido) y `OrderItem` (detalle de la compra).
* [ ] Caso de uso para **crear un `Order`** a partir del `Cart` (Inicio de la revisión del pedido)[cite: 24].
* [ ] Rutas Fastify para el carrito y la creación inicial del pedido.

---

### 💳 Sprint 6: Módulo de Pago y Gestión de Pedidos/Stock

**Objetivo:** Finalizar el proceso de compra e implementar la gestión de pedidos y la actualización automática de inventario.

* [ ] **Proceso de Compra**: Lógica de **confirmación de detalles y realización del pago** (simulado)[cite: 24].
* [ ] **Actualización Automática de Stock**: Implementar la lógica para gestionar la cantidad del stock con **actualizaciones automáticas tras una venta**[cite: 30].
* [ ] **Listado de Pedidos (Comprador)**: Acceder a un listado de los pedidos que ha creado el usuario[cite: 25].
* [ ] Casos de uso para actualizar el estado de los pedidos.

---

### 📊 Sprint 7: Notificaciones y Reportes

**Objetivo:** Implementar las funcionalidades de notificación e información para el vendedor y el comprador.

* [ ] Implementar la lógica para que el comprador pueda **recibir actualizaciones sobre el estado de los pedidos** (simulación de envío)[cite: 26].
* [ ] Lógica para generar **notificaciones automáticas sobre las ventas** de los diversos productos para el vendedor[cite: 31].
* [ ] Casos de uso para **obtener acceso a estadísticas y reportes detallados sobre las ventas** para el vendedor[cite: 32].
* [ ] *Opcional:* Stubs para las consideraciones adicionales (Notificaciones Push/SMS, Integración con RRSS)[cite: 37, 38].

---

### 🧪 Sprint 8: Pruebas Finales, Optimización y Despliegue

**Objetivo:** Garantizar la calidad, el rendimiento y la preparación para la exposición en internet.

* [ ] Cobertura de tests completa (Jest + Supertest).
* [ ] Refactor, optimización de queries y performance.
* [ ] Documentación de endpoints y arquitectura.
* [ ] Configuración final de imágenes Docker y scripts de despliegue para el servidor con contenedores (OCI, PostgreSQL, Proxy Reverso)[cite: 33, 34, 35].