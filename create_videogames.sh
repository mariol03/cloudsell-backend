#!/bin/bash

# Configuración
BASE_URL="http://localhost:3000"
EMAIL="vendedor_auto@videojuegos.com"
PASSWORD="PasswordSegura123"

echo "---------------------------------------------------"
echo "1. REGISTRANDO USUARIO VENDEDOR..."
echo "---------------------------------------------------"

curl -s -X 'PUT' \
  "$BASE_URL/auth/register" \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d "{
  \"name\": \"GameMaster Auto\",
  \"email\": \"$EMAIL\",
  \"password\": \"$PASSWORD\",
  \"image\": \"https://cdn-icons-png.flaticon.com/512/1995/1995515.png\",
  \"role\": \"seller\",
  \"sellerLocation\": \"Madrid, España\",
  \"sellerDescription\": \"Tienda automática.\",
  \"sellerResponseTime\": \"Inmediato\"
}"

echo -e "\n\n---------------------------------------------------"
echo "2. HACIENDO LOGIN PARA OBTENER TOKEN..."
echo "---------------------------------------------------"

# Guardamos la respuesta del login en una variable
LOGIN_RESPONSE=$(curl -s -X 'POST' \
  "$BASE_URL/auth/login" \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d "{
  \"email\": \"$EMAIL\",
  \"password\": \"$PASSWORD\"
}")

# Extraemos el token y el ID usando jq
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.id')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Error: No se pudo obtener el token. Revisa si el usuario ya existe o hay error en el servidor."
  echo "Respuesta del servidor: $LOGIN_RESPONSE"
  exit 1
fi

echo ">> Token obtenido: ${TOKEN:0:20}..." # Solo mostramos el principio para no saturar
echo ">> User ID obtenido: $USER_ID"

echo -e "\n---------------------------------------------------"
echo "3. CREANDO VIDEOJUEGOS..."
echo "---------------------------------------------------"

# Función para crear items y no repetir el código curl
create_item() {
  curl -s -o /dev/null -w "Creado: %{http_code}\n" -X 'PUT' \
    "$BASE_URL/items/" \
    -H 'accept: application/json' \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -d "$1"
}

echo "Subiendo: Zelda Breath of the Wild..."
create_item "{
  \"name\": \"The Legend of Zelda: Breath of the Wild\",
  \"description\": \"Una aventura de mundo abierto.\",
  \"price\": 59.99,
  \"image\": \"https://img-eshop.cdn.nintendo.net/i/7c8f2e897c9e025649f97d4c9d5e1f92497bd6217bd442d6de8de17c46142e78.jpg\",
  \"stock\": 25,
  \"userId\": \"$USER_ID\"
}"

echo "Subiendo: God of War Ragnarök..."
create_item "{
  \"name\": \"God of War Ragnarök\",
  \"description\": \"Kratos y Atreus viajan a los Nueve Reinos.\",
  \"price\": 69.99,
  \"image\": \"https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png\",
  \"stock\": 15,
  \"userId\": \"$USER_ID\"
}"

echo "Subiendo: Elden Ring..."
create_item "{
  \"name\": \"Elden Ring\",
  \"description\": \"Un vasto mundo desarrollado por FromSoftware.\",
  \"price\": 59.90,
  \"image\": \"https://static.bandainamcoent.eu/high/elden-ring/elden-ring/00-page-setup/elden-ring-new-header-mobile.jpg\",
  \"stock\": 40,
  \"userId\": \"$USER_ID\"
}"

echo "Subiendo: Super Mario Odyssey..."
create_item "{
  \"name\": \"Super Mario Odyssey\",
  \"description\": \"Aventura masiva en 3D.\",
  \"price\": 45.50,
  \"image\": \"https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_4/H2x1_NSwitch_SuperMarioOdyssey.jpg\",
  \"stock\": 100,
  \"userId\": \"$USER_ID\"
}"

echo "Subiendo: Cyberpunk 2077..."
create_item "{
  \"name\": \"Cyberpunk 2077\",
  \"description\": \"Acción en Night City.\",
  \"price\": 29.99,
  \"image\": \"https://images.wallpapersden.com/image/download/cyberpunk-2077-hd-poster_bWxsZ2aUmZqaraWkpJRmbmdlrWZlbWU.jpg\",
  \"stock\": 12,
  \"userId\": \"$USER_ID\"
}"

echo -e "\n---------------------------------------------------"
echo "¡PROCESO COMPLETADO!"
echo "---------------------------------------------------"