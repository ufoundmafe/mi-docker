FROM node:20-alpine

# Instalar dependencias necesarias del sistema operativo (incluyendo OpenSSL)
RUN apk add --no-cache openssl libc6-compat

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

# Forzar la generación con la versión clásica (Prisma 5)
RUN npx prisma@5 generate

# Compilar la aplicación Next.js
RUN pnpm build

# Exponer el puerto por defecto de Next.js
EXPOSE 3000

CMD pnpm start
