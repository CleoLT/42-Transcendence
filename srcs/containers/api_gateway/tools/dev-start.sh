#!/bin/sh
set -e

CERT_DIR=/certs

echo "[api_gateway] Waiting for certificates..."
while [ ! -f "$CERT_DIR/ca.crt" ] || \
      [ ! -f "$CERT_DIR/api_gateway.crt" ] || \
      [ ! -f "$CERT_DIR/api_gateway.key" ]; do
  sleep 1
done

echo "[api_gateway] Dependencies ready. Starting service."
exec npx nodemon index.js