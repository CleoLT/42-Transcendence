#!/bin/sh
set -e

CERT_DIR=/certs

echo "[api_gateway] Waiting for certificates..."
while [ ! -f "$CERT_DIR/ca.crt" ] || \
      [ ! -f "$CERT_DIR/api_gateway.crt" ] || \
      [ ! -f "$CERT_DIR/api_gateway.key" ]; do
  sleep 1
done

#for svc in auth-service user-service; do
#  until nc -z $svc 3000; do
#    echo "[api_gateway] Waiting for $svc..."
#    sleep 1
#  done
#done

echo "[api_gateway] Dependencies ready. Starting service."
exec node index.js