#!/bin/bash

BASE_URL="http://localhost:3000"
SCRIPT_DIR="$(dirname "$0")"

if [[ ! -f "$SCRIPT_DIR/seller_token.txt" ]]; then
    echo "ERROR: seller_token.txt not found. Run setup_users.sh first."
    exit 1
fi

SELLER_TOKEN=$(cat "$SCRIPT_DIR/seller_token.txt")
SELLER_ID=$(cat "$SCRIPT_DIR/seller_id.txt")
CATEGORY_ID=$(cat "$SCRIPT_DIR/category_id.txt")

echo "--- Creating Item ---"
echo "Seller: $SELLER_ID"
echo "Category: $CATEGORY_ID"

response=$(curl -s -X PUT "$BASE_URL/items/" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $SELLER_TOKEN" \
    -d "{
        \"name\": \"Smartphone X\",
        \"description\": \"Flagship phone\",
        \"price\": 999,
        \"stock\": 10,
        \"image\": \"https://example.com/phone.jpg\",
        \"userId\": \"$SELLER_ID\",
        \"categories\": [\"$CATEGORY_ID\"]
    }")

item_id=$(echo "$response" | jq -r '.id // empty')

echo "Item Response: $response"

if [[ -z "$item_id" ]]; then
    echo "ERROR: Could not create item."
    exit 1
fi

echo "Item ID: $item_id"
echo "$item_id" > "$SCRIPT_DIR/item_id.txt"
