#!/bin/sh
set -e

CERT_DIR=/certs

echo "[auth-service] Waiting for certificates..."
while [ ! -f "$CERT_DIR/ca.crt" ] || \
      [ ! -f "$CERT_DIR/auth-service.crt" ] || \
      [ ! -f "$CERT_DIR/auth-service.key" ]; do
  sleep 1
done

echo "[auth-service] Certificates ready. Starting service (dev mode)."
exec npx nodemon server.js

# npx nodemon ensures it uses the locally installed devDependency without needing global install.