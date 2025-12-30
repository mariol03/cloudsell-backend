#!/bin/bash

SCRIPT_DIR="$(dirname "$0")"

# Make executable just in case
chmod +x "$SCRIPT_DIR"/*.sh

echo "=== STARTING VERIFICATION FLOW ==="

"$SCRIPT_DIR/setup_users.sh"
echo ""

"$SCRIPT_DIR/create_category.sh"
echo ""

"$SCRIPT_DIR/create_item.sh"
echo ""

"$SCRIPT_DIR/create_cart.sh"
echo ""

"$SCRIPT_DIR/create_order.sh"
echo ""

echo "=== VERIFICATION COMPLETE ==="
