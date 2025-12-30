#!/bin/bash

BASE_URL="http://localhost:3000"
SCRIPT_DIR="$(dirname "$0")"

# --- Functions ---

register_user() {
    local name=$1
    local email=$2
    local password=$3
    local role=$4
    local image="https://example.com/avatar.jpg"

    echo "Attempting to register $role ($email)..." >&2
    response=$(curl -s -X PUT "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"$name\",
            \"email\": \"$email\",
            \"password\": \"$password\",
            \"image\": \"$image\",
            \"role\": \"$role\",
            \"sellerLocation\": \"Test Location\",
            \"sellerDescription\": \"Test Description\",
            \"sellerResponseTime\": \"1h\"
        }")
    
    echo "$response"
}

login_user() {
    local email=$1
    local password=$2

    echo "Logging in ($email)..." >&2
    curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$email\",
            \"password\": \"$password\"
        }"
}

get_token() {
    echo "$1" | jq -r '.token // empty'
}

get_id() {
    echo "$1" | jq -r '.id // empty'
}

# --- Execution ---

# 1. Setup Seller
TIMESTAMP=$(date +%s)
SELLER_EMAIL="seller_${TIMESTAMP}@example.com"
SELLER_PASS="password123"
SELLER_NAME="Seller User"

echo "--- Setup Seller ---"
response=$(register_user "$SELLER_NAME" "$SELLER_EMAIL" "$SELLER_PASS" "seller")
seller_token=$(get_token "$response")
seller_id=$(get_id "$response")

# If no token, maybe user exists, try login
if [[ -z "$seller_token" ]]; then
    echo "Registration didn't return a token. Trying login..."
    response=$(login_user "$SELLER_EMAIL" "$SELLER_PASS")
    seller_token=$(get_token "$response")
    seller_id=$(get_id "$response")
fi

if [[ -z "$seller_token" ]]; then
    echo "ERROR: Could not get Seller token."
    echo "Last response: $response"
    exit 1
fi

echo "Seller ID: $seller_id"
echo "$seller_token" > "$SCRIPT_DIR/seller_token.txt"
echo "$seller_id" > "$SCRIPT_DIR/seller_id.txt"

# 2. Setup Buyer
BUYER_EMAIL="buyer_${TIMESTAMP}@example.com"
BUYER_PASS="password123"
BUYER_NAME="Buyer User"

echo "--- Setup Buyer ---"
response=$(register_user "$BUYER_NAME" "$BUYER_EMAIL" "$BUYER_PASS" "buyer")
buyer_token=$(get_token "$response")
buyer_id=$(get_id "$response")

# ... rest remains same but logic is consistent
if [[ -z "$buyer_token" ]]; then
    echo "Registration didn't return a token. Trying login..."
    response=$(login_user "$BUYER_EMAIL" "$BUYER_PASS")
    buyer_token=$(get_token "$response")
    buyer_id=$(get_id "$response")
fi

if [[ -z "$buyer_token" ]]; then
    echo "ERROR: Could not get Buyer token."
    echo "Last response: $response"
    exit 1
fi

echo "Buyer ID: $buyer_id"
echo "$buyer_token" > "$SCRIPT_DIR/buyer_token.txt"
echo "$buyer_id" > "$SCRIPT_DIR/buyer_id.txt"

echo "Users setup complete."
