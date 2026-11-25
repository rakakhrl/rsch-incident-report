#!/bin/sh
# Entry point untuk container Docker Avicenna Incident Report.
# Mengganti variabel ${PORT} pada template konfigurasi nginx sebelum menjalankan nginx.
# PORT default ke 3000 jika tidak disetel.

set -e

TEMPLATE="/etc/nginx/conf.d/default.conf.template"
TARGET="/etc/nginx/conf.d/default.conf"

if [ -f "$TEMPLATE" ]; then
    # Substitusi variabel lingkungan (${PORT}) ke dalam konfigurasi nginx
    envsubst '${PORT}' < "$TEMPLATE" > "$TARGET"
    echo "[entrypoint] Konfigurasi nginx ditulis ke $TARGET (PORT=${PORT:-3000})"
else
    echo "[entrypoint] Template $TEMPLATE tidak ditemukan, menggunakan konfigurasi default nginx"
fi

# Jalankan nginx di foreground
exec nginx -g 'daemon off;'
