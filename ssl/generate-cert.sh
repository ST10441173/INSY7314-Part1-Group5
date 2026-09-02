#!/bin/sh
# Regenerates the local, self-signed SSL certificate used to run the
# API over HTTPS in development. This is NOT a certificate for
# production use — it exists purely so the API can be served over
# https://localhost during development and for the Part 1 demo video.
#
# Usage: sh ssl/generate-cert.sh
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem \
  -subj "/C=ZA/ST=Gauteng/L=Johannesburg/O=HustleHub/OU=Dev/CN=localhost"
echo "Generated ssl/key.pem and ssl/cert.pem"
