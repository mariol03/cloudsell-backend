#!/bin/bash

BASE_URL="http://localhost:3000"
SCRIPT_DIR="$(dirname "$0")"

echo "--- Creating Category ---"

response=$(curl -s -X PUT "$BASE_URL/categories/" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Electronics",
        "description": "Gadgets and devices"
    }')

cat_id=$(echo "$response" | jq -r '.id // empty')

echo "Category Response: $response"

if [[ -z "$cat_id" ]]; then
    # Try fetching existing category if create failed (e.g. 409 conflict, though PUT usually upserts or specific logic)
    # However, if it failed without ID, we can try to search by name.
    echo "Creation failed or no ID returned. Attempting to fetch existing..."
    # Assuming endpoint GET /categories returns array
    # Logic to find id by name "Electronics"
    list_response=$(curl -s "$BASE_URL/categories/")
    # Select from array where name is Electronics OR description is Electronics
    cat_id=$(echo "$list_response" | jq -r '.[] | select(.name == "Electronics" or .description == "Electronics") | .id' | head -n 1)
fi

if [[ -z "$cat_id" ]]; then
    echo "ERROR: Could not get Category ID."
    exit 1
fi

echo "Category ID: $cat_id"
echo "$cat_id" > "$SCRIPT_DIR/category_id.txt"
