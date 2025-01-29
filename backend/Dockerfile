# Utiliser une image Node.js officielle
FROM node:16

# Créer un répertoire pour l'application
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application
CMD ["node", "src/app.js"]