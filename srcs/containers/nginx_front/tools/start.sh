#!/bin/sh
set -e

CERT_DIR=/certs

echo "[nginx_front] Waiting for certificates..."
while [ ! -f "$CERT_DIR/ca.crt" ] || \
      [ ! -f "$CERT_DIR/nginx_front.crt" ] || \
      [ ! -f "$CERT_DIR/nginx_front.key" ]; do
  sleep 1
done

echo "[nginx_front] Certificates ready. Starting nginx."
exec nginx -g "daemon off;"