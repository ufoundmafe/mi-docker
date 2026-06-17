# 1. ¿Sobre qué base cocinamos?
FROM node:18

# 2. ¿En qué oficina vamos a trabajar dentro del contenedor?
WORKDIR /app

# 3. Traer la lista de ingredientes (dependencias)
COPY package*.json ./

# 4. Instalar los ingredientes
RUN npm install

# 5. Traer el resto de la cocina (tu código fuente)
COPY . .

# 6. Abrir una ventana para que nos vean desde afuera
EXPOSE 3000

# 7. El comando para encender la estufa
CMD ["npm", "start"]

 
