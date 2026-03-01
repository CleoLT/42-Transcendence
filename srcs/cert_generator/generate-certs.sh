#!/bin/sh

CERT_DIR=/certs
mkdir -p $CERT_DIR

if [ ! -f "$CERT_DIR/ca.key" ]; then
  echo "Generating internal CA..."

  openssl genrsa -out $CERT_DIR/ca.key 4096
  openssl req -x509 -new -nodes \
    -key $CERT_DIR/ca.key \
    -sha256 -days 365 \
    -subj "/CN=blossom-clash-ca" \
    -out $CERT_DIR/ca.crt
fi

generate_cert() {
  NAME=$1

  if [ ! -f "$CERT_DIR/$NAME.key" ]; then
    echo "Generating certificate for $NAME..."

    openssl genrsa -out $CERT_DIR/$NAME.key 2048

    openssl req -new \
      -key $CERT_DIR/$NAME.key \
      -subj "/CN=$NAME" \
      -out $CERT_DIR/$NAME.csr

    openssl x509 -req \
      -in $CERT_DIR/$NAME.csr \
      -CA $CERT_DIR/ca.crt \
      -CAkey $CERT_DIR/ca.key \
      -CAcreateserial \
      -out $CERT_DIR/$NAME.crt \
      -days 365 -sha256
  fi
}

generate_cert api_gateway
generate_cert user-service
generate_cert auth-service
generate_cert nginx_front
