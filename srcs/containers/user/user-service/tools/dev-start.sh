#!/bin/sh
set -e

if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ]; then
  echo "Required environment variables not set"
  exit 1
fi

CERT_DIR=/certs

echo "[user-service] Waiting for certificates..."
while [ ! -f "$CERT_DIR/ca.crt" ] || \
      [ ! -f "$CERT_DIR/user-service.crt" ] || \
      [ ! -f "$CERT_DIR/user-service.key" ]; do
  sleep 1
done

echo "[user-service] Starting service (dev mode)."
exec npx nodemon src/server.js