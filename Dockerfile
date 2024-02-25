# Usa una imagen de Node.js como base
FROM node:14

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el código fuente de la aplicación al directorio de trabajo
COPY . .

# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación cuando se inicie el contenedor
CMD ["node", "pingServer.js"]
