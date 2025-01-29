# Étape 1 : Builder pour compiler Tailwind CSS
FROM node:16 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer Tailwind CSS
RUN npm install tailwindcss postcss autoprefixer

# Copier les fichiers source
COPY . .

# Générer la configuration Tailwind CSS
RUN npx tailwindcss init -p

# Compiler Tailwind CSS
RUN npm run build

# Étape 2 : Serveur Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers statiques compilés
COPY --from=builder /app/public /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]