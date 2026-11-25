# ===================================================================
# Dockerfile — Avicenna Incident Report (Frontend SPA)
# Multi-stage: build (Node) -> serve (nginx)
# Port default 3000, dapat diubah melalui variabel lingkungan PORT.
# ===================================================================

# ---------------------------------------------------------------
# Stage 1: Build frontend dengan Vite
# ---------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Argumen build untuk variabel Vite (disediakan saat `docker build` / docker-compose)
ARG VITE_API_BASE_URL
ARG VITE_API_BASE_URL_MOBILE2
ARG VITE_API_ACCESS_KEY
ARG VITE_API_ENC_METHOD
ARG VITE_API_ACCESSKEY
ARG VITE_API_ACCESSKEY_WHISTLEBLOWING
ARG VITE_API_SCI_ACCESSKEY
ARG VITE_SECRET_KEY
ARG VITE_CAPTCHA_URL
ARG VITE_CAPTCHA_VERIFY_URL

# Tulis berkas .env untuk waktu build (Vite membaca berkas ini saat `npm run build`)
RUN printf 'VITE_API_BASE_URL=%s\n' "${VITE_API_BASE_URL}" > .env && \
    printf 'VITE_API_BASE_URL_MOBILE2=%s\n' "${VITE_API_BASE_URL_MOBILE2}" >> .env && \
    printf 'VITE_API_ACCESS_KEY=%s\n' "${VITE_API_ACCESS_KEY}" >> .env && \
    printf 'VITE_API_ENC_METHOD=%s\n' "${VITE_API_ENC_METHOD}" >> .env && \
    printf 'VITE_API_ACCESSKEY=%s\n' "${VITE_API_ACCESSKEY}" >> .env && \
    printf 'VITE_API_ACCESSKEY_WHISTLEBLOWING=%s\n' "${VITE_API_ACCESSKEY_WHISTLEBLOWING}" >> .env && \
    printf 'VITE_API_SCI_ACCESSKEY=%s\n' "${VITE_API_SCI_ACCESSKEY}" >> .env && \
    printf 'VITE_SECRET_KEY=%s\n' "${VITE_SECRET_KEY}" >> .env && \
    printf 'VITE_CAPTCHA_URL=%s\n' "${VITE_CAPTCHA_URL}" >> .env && \
    printf 'VITE_CAPTCHA_VERIFY_URL=%s\n' "${VITE_CAPTCHA_VERIFY_URL}" >> .env

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------------------------------------------------------------
# Stage 2: Serve hasil build dengan nginx
# ---------------------------------------------------------------
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

# Salin aset hasil build
COPY --from=builder /app/dist ./

# Salin template konfigurasi nginx (port disubstitusi pada runtime)
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Instal envsubst untuk substitusi variabel lingkungan pada entrypoint
RUN apk add --no-cache gettext

# Salin skrip entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Port default (dapat diimpor melalui variabel lingkungan PORT saat runtime)
ENV PORT=3000
EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
