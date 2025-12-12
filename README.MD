## 💻 CloudSell Backend — Roadmap 

### 🏁 Sprint 1: Setup Inicial y Base del Proyecto

**Objetivo:** Establecer la arquitectura base y el entorno de desarrollo.

* [x] Configuración de entorno (pnpm, Docker, variables de entorno)
* [x] Estructura de carpetas siguiendo DDD (Domain-Driven Design)
* [x] Configuración de Fastify y punto de entrada (`src/index.ts`)
* [x] Configuración de logging (ej. pino)
* [ ] Integración inicial de Prisma ORM y conexión a PostgreSQL
* [x] Primeros tests de salud (endpoint `/health`)
---

### 🔒 Sprint 2: Seguridad, Autenticación y Perfiles de Usuario

**Objetivo:** Implementar el registro, autenticación segura y la diferenciación de roles (Comprador/Vendedor).

* [x] Entidad `User` con campo **`role`** (Comprador/Vendedor).
* [x] Implementación de **Registro** y **Autenticación segura** (JWT, contraseñas hasheadas con scrypt).
* [x] Rutas de **autenticación** públicas (`/auth/register`, `/auth/login`).
* [x] Middleware para **Autenticación** y **Autorización** basado en roles.
* [x] Tests unitarios para autenticación, servicios y use-cases.
* [x] Rutas de usuarios protegidas con middleware de autenticación.
* [x] Documentación completa (AUTHENTICATION.md, QUICK_START.md).
---

### 🛍️ Sprint 3: Módulo de Vendedores y Gestión de Artículos

**Objetivo:** Implementar la gestión de productos y stock, exclusiva para vendedores.

* [x] Entidad `Item` con relación al `User` (Vendedor).
* [x] Casos de uso del Vendedor (CRUD) para **crear, editar y eliminar los diferentes artículos**.
* [x] **Gestión de Stock**: Campo `stockQuantity` en `Product` y Casos de uso para actualizar el stock.
* [ ] Rutas Fastify para obtener los 3 productos con mejores valoraciones.
* [x] Rutas Fastify para la gestión de productos, protegidas por el rol `Vendedor`.
* [x] Tests unitarios para la gestión de productos por parte del vendedor.
---

### 🔎 Sprint 4: Módulo de Catálogo, Búsqueda y Lista de Deseos

**Objetivo:** Implementar la visualización y las herramientas de búsqueda para los compradores.

* [x] Entidad `Category` y su relación con `Product`.
* [x] **Visualización del Catálogo Completo** de artículos del marketplace (endpoint `GET /items`).
* [x] Implementar **búsqueda básica** sobre los artículos del catálogo (búsqueda por `name` y `id`).
* [x] Filtros avanzados (por categoría, rango de precio, paginación) - implementados con query params.
* [x] Entidad `Wishlist` y funcionalidad para **añadir artículos a una lista personalizada de deseos** (rutas protegidas para BUYER).
* [x] Tests unitarios e integración para catálogo, filtros y wishlist (6 test suites, 54 tests ✅).
---

### 🛒 Sprint 5: Módulo de Carrito de la Compra y Creación de Pedidos

**Objetivo:** Gestionar el carrito y crear la estructura inicial del pedido.

* [ ] Entidad `Cart` asociada al `Comprador` y `CartItem` (Producto + Cantidad).
* [ ] Casos de uso del Carrito: agregar/quitar productos, con opción de **ajustar las unidades del mismo producto**.
* [ ] Entidad `Order` (Pedido) y `OrderItem` (detalle de la compra).
* [ ] Caso de uso para **crear un `Order`** a partir del `Cart` (Inicio de la revisión del pedido).
* [ ] Rutas Fastify para el carrito y la creación inicial del pedido.
---

### 💳 Sprint 6: Módulo de Pago y Gestión de Pedidos/Stock

**Objetivo:** Finalizar el proceso de compra e implementar la gestión de pedidos y la actualización automática de inventario.

* [ ] **Proceso de Compra**: Lógica de **confirmación de detalles y realización del pago** (simulado).
* [ ] **Actualización Automática de Stock**: Implementar la lógica para gestionar la cantidad del stock con **actualizaciones automáticas tras una venta**.
* [ ] **Listado de Pedidos (Comprador)**: Acceder a un listado de los pedidos que ha creado el usuario.
* [ ] Casos de uso para actualizar el estado de los pedidos.
---

### 📊 Sprint 7: Notificaciones y Reportes

**Objetivo:** Implementar las funcionalidades de notificación e información para el vendedor y el comprador.

* [ ] Implementar la lógica para que el comprador pueda **recibir actualizaciones sobre el estado de los pedidos** (simulación de envío).
* [ ] Lógica para generar **notificaciones automáticas sobre las ventas** de los diversos productos para el vendedor.
* [ ] Casos de uso para **obtener acceso a estadísticas y reportes detallados sobre las ventas** para el vendedor.
* [ ] *Opcional:* Stubs para las consideraciones adicionales (Notificaciones Push/SMS, Integración con RRSS).
---

### 🧪 Sprint 8: Pruebas Finales, Optimización y Despliegue

**Objetivo:** Garantizar la calidad, el rendimiento y la preparación para la exposición en internet.

* [ ] Cobertura de tests completa (Jest + Supertest).
* [ ] Refactor, optimización de queries y performance.
* [ ] Documentación de endpoints y arquitectura.
* [ ] Configuración final de imágenes Docker y scripts de despliegue para el servidor con contenedores (OCI, PostgreSQL, Proxy Reverso).
