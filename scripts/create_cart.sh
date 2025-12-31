#!/bin/bash

BASE_URL="http://localhost:3000"
SCRIPT_DIR="$(dirname "$0")"

if [[ ! -f "$SCRIPT_DIR/buyer_token.txt" ]]; then
    echo "ERROR: buyer_token.txt not found."
    exit 1
fi

BUYER_TOKEN=$(cat "$SCRIPT_DIR/buyer_token.txt")
BUYER_ID=$(cat "$SCRIPT_DIR/buyer_id.txt")
ITEM_ID=$(cat "$SCRIPT_DIR/item_id.txt")

echo "--- Adding to Cart ---"
echo "Buyer: $BUYER_ID"
echo "Item: $ITEM_ID"

# POST /cart/add
response=$(curl -s -X POST "$BASE_URL/cart/add" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $BUYER_TOKEN" \
    -d "{
        \"userId\": \"$BUYER_ID\",
        \"itemId\": \"$ITEM_ID\",
        \"quantity\": 1
    }")

echo "Add to Cart Response: $response"

echo "--- Verifying Cart ---"
# GET /cart/:userId
cart_response=$(curl -s -X GET "$BASE_URL/cart/$BUYER_ID" \
    -H "Authorization: Bearer $BUYER_TOKEN")

echo "Cart Content: $cart_response"
