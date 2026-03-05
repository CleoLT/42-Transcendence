#!/bin/sh
set -e

CERT_DIR=/certs

echo "[user-service] Waiting for certificates..."
while [ ! -f "$CERT_DIR/ca.crt" ] || \
      [ ! -f "$CERT_DIR/user-service.crt" ] || \
      [ ! -f "$CERT_DIR/user-service.key" ]; do
  sleep 1
done

#echo "[user-service] Certificates ready. Waiting for DB..."
#until nc -z user-db 3306; do
#  echo "[user-service] Waiting for user-db..."
#  sleep 1
#done

echo "[user-service] Starting service."
exec node src/server.js