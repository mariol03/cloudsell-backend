# 🚀 Guía de Inicio Rápido - Autenticación

## Iniciando el Servidor

### Opción 1: Desarrollo
```bash
pnpm run dev
```

### Opción 2: Producción
```bash
pnpm run build
pnpm start
```

El servidor estará disponible en: `http://localhost:3001`

---

## Primeros Pasos

### 1. Crear archivo `.env`
```bash
cp .env.example .env
```

### 2. Registrar un Usuario

```bash
curl -X PUT http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Nombre",
    "email": "mi@email.com",
    "password": "Contraseña123",
    "role": "buyer"
  }'
```

**Respuesta:**
```json
{
  "id": "uuid-aquí",
  "name": "Mi Nombre",
  "email": "mi@email.com",
  "role": "buyer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Guardar el Token

Copia el valor de `token` de la respuesta anterior.

### 4. Usar el Token en Requests

```bash
curl -X GET http://localhost:3001/users \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
```

---

## Probando Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mi@email.com",
    "password": "Contraseña123"
  }'
```

### Obtener todos los Usuarios (requiere autenticación)
```bash
curl -X GET http://localhost:3001/users \
  -H "Authorization: Bearer <TOKEN>"
```

### Crear Usuario (requiere autenticación - rol admin)
```bash
curl -X PUT http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "name": "Otro Usuario",
    "email": "otro@email.com",
    "password": "Contraseña456",
    "role": "seller"
  }'
```

---

## Script Automatizado de Prueba

```bash
# Hacer el script ejecutable (primera vez)
chmod +x test-auth.sh

# Ejecutar pruebas
./test-auth.sh
```

---

## Errores Comunes

### `401 Unauthorized - Token no proporcionado`
Asegúrate de incluir el header: `Authorization: Bearer <TOKEN>`

### `409 Conflict - Email ya registrado`
El email ya existe. Usa otro email o haz login.

### `422 Unprocessable Entity - Todos los campos son obligatorios`
Verifica que `name`, `email` y `password` sean proporcionados.

### `401 Unauthorized - Email o contraseña inválidos`
Verifica que email y contraseña sean correctos.

---

## Estructura de Directorios Importantes

```
src/
├── contexts/
│   ├── users/
│   │   ├── domain/        # Entidades y lógica de negocio
│   │   ├── application/   # Use cases
│   │   └── infrastructure/ # Controllers, routes, servicios
│   ├── items/             # Módulo de items
│   └── shared/            # Código compartido
└── apps/
    └── fastify-app.ts     # Configuración de Fastify
```

---

## Variables de Entorno Disponibles

```env
# Puerto de la aplicación
BACKEND_PORT=3000
FASTIFY_PORT=3001

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=24h
```

---

## Siguientes Pasos

1. ✅ Autenticación completada
2. 📋 Próximo: Proteger rutas de usuarios con middleware
3. 🛍️ Luego: Integrar autenticación en módulo de items
4. 🔄 Después: Refresh tokens
5. 📧 Finalmente: Email verification

---

## Documentación Completa

- [AUTHENTICATION.md](./AUTHENTICATION.md) - Documentación detallada de API
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Resumen técnico
- [README.MD](./README.MD) - Roadmap del proyecto

---

## Comandos Útiles

```bash
# Build
pnpm run build

# Desarrollo
pnpm run dev

# Linting
pnpm run lint

# Linting con fix
pnpm run lint:fix

# Pruebas
pnpm run test

# Ver estructura
tree -L 2 -I 'node_modules|dist'
```

---

**¡Listo para comenzar! 🎉**
