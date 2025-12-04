# 🔐 Autenticación API - Documentación

## Endpoints de Autenticación

Todas las rutas de autenticación están bajo el prefijo `/auth`.

### 1. Registro de Usuario

**Endpoint:** `PUT /auth/register`

**Descripción:** Registra un nuevo usuario en el sistema.

**Headers:**
```
Content-Type: application/json
```

**Body (request):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "MySecurePassword123",
  "role": "buyer"  // Opcional: "buyer" (por defecto) o "seller"
}
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "role": "buyer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `422 Unprocessable Entity`: Datos inválidos (email, contraseña muy corta, etc.)
- `409 Conflict`: Email ya registrado

---

### 2. Iniciar Sesión

**Endpoint:** `POST /auth/login`

**Descripción:** Autentica un usuario existente y devuelve un token JWT.

**Headers:**
```
Content-Type: application/json
```

**Body (request):**
```json
{
  "email": "juan@example.com",
  "password": "MySecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "role": "buyer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `401 Unauthorized`: Email o contraseña incorrectos

---

## Usar Token en Requests Autenticados

Una vez obtenido el token, úsalo en el header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo con curl:**
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Estructura del Token JWT

El token contiene la siguiente información:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "juan@example.com",
  "role": "buyer",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Nota:** El token expira en 24 horas por defecto.

---

## Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=24h
```

**Variables disponibles:**
- `JWT_SECRET`: Clave secreta para firmar tokens (cambiar en producción)
- `JWT_EXPIRY`: Tiempo de expiración del token (ej: "24h", "7d", 3600 segundos)

---

## Roles y Autorización

### Roles Disponibles:
- **buyer**: Comprador (rol por defecto)
- **seller**: Vendedor

### Middleware de Autorización

Para proteger una ruta con un rol específico:

```typescript
import { authenticateMiddleware, authorizeRole } from "@users/infrastructure/auth.middleware";
import { UserRole } from "@users/domain/user.entity";

fastify.post("/admin/items", 
  { 
    onRequest: [authenticateMiddleware, authorizeRole([UserRole.SELLER])] 
  }, 
  handler
);
```

---

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | OK - Login exitoso |
| 201 | Created - Usuario registrado |
| 401 | Unauthorized - Token inválido o expirado |
| 409 | Conflict - Email ya registrado |
| 422 | Unprocessable Entity - Datos inválidos |
| 500 | Internal Server Error |

---

## Ejemplo Completo con Node.js

```javascript
// Registro
const registerRes = await fetch('http://localhost:3000/auth/register', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'MySecurePassword123',
    role: 'buyer'
  })
});

const registerData = await registerRes.json();
console.log('Token:', registerData.token);

// Usar token en request autenticado
const authRes = await fetch('http://localhost:3000/users', {
  headers: {
    'Authorization': `Bearer ${registerData.token}`
  }
});

const users = await authRes.json();
console.log('Usuarios:', users);
```

---

## Validaciones

### Registro:
- ✅ Nombre no vacío
- ✅ Email válido
- ✅ Contraseña mínimo 6 caracteres
- ✅ Email único en el sistema

### Login:
- ✅ Email debe existir
- ✅ Contraseña debe coincidir

---

## Seguridad

### Contraseñas:
- Se hashean usando **scrypt** (algoritmo nativo de Node.js)
- Cada contraseña tiene su propio salt aleatorio
- Las contraseñas nunca se almacenan en texto plano

### Tokens JWT:
- Firmados con una clave secreta
- Incluyen información del usuario (id, email, rol)
- Expiran automáticamente (por defecto 24h)
- Se validan en cada request autenticado

---

## Próximas Mejoras

- [ ] Refresh tokens
- [ ] Two-factor authentication (2FA)
- [ ] Email verification
- [ ] Password reset
- [ ] Rate limiting en login
- [ ] Auditoría de accesos
