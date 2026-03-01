#!/bin/sh
set -e

CERT_DIR=/certs

echo "[nginx_front] Waiting for certificates..."
while [ ! -f "$CERT_DIR/nginx_front.crt" ] || \
      [ ! -f "$CERT_DIR/nginx_front.key" ]; do
  sleep 1
done

echo "[nginx_front] Certificates ready."

until nc -z api_gateway 3000; do
  echo "[nginx_front] Waiting for api_gateway..."
  sleep 1
done

echo "[nginx_front] api_gateway ready. Starting vite in dev mode"
exec npm run dev -- --host