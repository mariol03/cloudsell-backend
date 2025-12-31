#!/bin/bash

BASE_URL="http://localhost:3000"
SCRIPT_DIR="$(dirname "$0")"

if [[ ! -f "$SCRIPT_DIR/buyer_token.txt" ]]; then
    echo "ERROR: buyer_token.txt not found."
    exit 1
fi

BUYER_TOKEN=$(cat "$SCRIPT_DIR/buyer_token.txt")
BUYER_ID=$(cat "$SCRIPT_DIR/buyer_id.txt")

echo "--- Creating Order ---"
echo "Buyer: $BUYER_ID"

# POST /orders/
response=$(curl -s -X POST "$BASE_URL/orders/" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $BUYER_TOKEN" \
    -d "{
        \"userId\": \"$BUYER_ID\"
    }")

order_id=$(echo "$response" | jq -r '.id // empty')

echo "Order Response: $response"

if [[ -z "$order_id" ]]; then
    echo "ERROR: Could not create order."
    exit 1
fi

echo "Order ID: $order_id"
