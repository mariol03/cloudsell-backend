#!/bin/bash

# Script de prueba para la API de autenticación

BASE_URL="http://localhost:3001"

echo "🧪 Iniciando pruebas de autenticación...\n"

# 1. Test de Health Check
echo "1️⃣  Verificando Health Check..."
curl -X GET "$BASE_URL/health" 2>/dev/null | jq .
echo "\n"

# 2. Test de Registro
echo "2️⃣  Probando Registro de Usuario..."
REGISTER_RESPONSE=$(curl -X PUT "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123",
    "role": "buyer"
  }' 2>/dev/null)

echo "$REGISTER_RESPONSE" | jq .
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token // empty')
USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.id // empty')

echo "\n"

# 3. Test de Login
echo "3️⃣  Probando Login..."
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }' 2>/dev/null | jq .

echo "\n"

# 4. Test de credenciales inválidas
echo "4️⃣  Probando Login con contraseña inválida..."
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }' 2>/dev/null | jq .

echo "\n"

# 5. Test de registro duplicado
echo "5️⃣  Probando Registro con email duplicado..."
curl -X PUT "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "email": "test@example.com",
    "password": "AnotherPassword123",
    "role": "seller"
  }' 2>/dev/null | jq .

echo "\n"

# 6. Test de registro con datos inválidos
echo "6️⃣  Probando Registro con contraseña muy corta..."
curl -X PUT "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid User",
    "email": "invalid@example.com",
    "password": "123"
  }' 2>/dev/null | jq .

echo "\n"

if [ -z "$TOKEN" ]; then
  echo "⚠️  No se pudo obtener un token. Algunos tests se omitirán."
else
  echo "✅ Token obtenido: ${TOKEN:0:50}...\n"
  
  # 7. Test de obtener usuarios (requiere autenticación)
  echo "7️⃣  Probando acceso autenticado (GET /users)..."
  curl -X GET "$BASE_URL/users" \
    -H "Authorization: Bearer $TOKEN" 2>/dev/null | jq .
  
  echo "\n"
  
  # 8. Test sin token
  echo "8️⃣  Probando acceso sin token..."
  curl -X GET "$BASE_URL/users" 2>/dev/null | jq .
fi

echo "\n✨ Pruebas completadas!"
