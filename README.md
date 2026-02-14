
# Port de Plaisance Russell — API + Frontend (EJS)

Application Express/MongoDB avec authentification JWT (cookie httpOnly), documentation Swagger et pages EJS pour gérer **catways**, **réservations** et **utilisateurs**.

## 🚀 Démarrage rapide

```bash
# 1) Cloner le dépôt puis
cp .env.example .env
# Éditer .env (MONGODB_URI, JWT_SECRET, identifiants admin)

npm install

# 2) Lancer MongoDB en local si nécessaire (ou utiliser MongoDB Atlas)

# 3) Importer les données d'exemple + créer un admin
npm run seed

# 4) Démarrer le serveur
npm run dev
# → http://localhost:$PORT (par défaut 3000)
```

**Comptes de test**: définis par `ADMIN_*` dans `.env` lors du seed.

## 🔐 Authentification
- `POST /login` (`email`, `password`) → crée un cookie `token` (JWT) httpOnly
- `GET /logout` → supprime le cookie
- Toutes les routes `/users`, `/catways`, `/catways/:id/reservations` exigent l'authentification

## 📚 Documentation API (Swagger)
- Disponible à `GET /docs`

## 🧭 Pages (EJS)
- `/` Accueil + formulaire de connexion + lien vers Docs
- `/dashboard` Tableau de bord (nom/email, date du jour, réservations en cours)
- `/catways-page` CRUD basique côté UI
- `/reservations-page` CRUD basique côté UI
- `/users-page` CRUD basique côté UI

## 🧱 Modèles
- **User**: `username`, `email` (unique), `password` (hashé)
- **Catway**: `catwayNumber` (unique), `catwayType` (`long|short`), `catwayState`
- **Reservation**: `catwayNumber`, `clientName`, `boatName`, `startDate`, `endDate`

### Règles de validation
- Email unique, mot de passe ≥ 8 caractères
- `catwayType` ∈ {`long`,`short`}
- Réservations: `startDate < endDate`, **pas de chevauchement** pour un même `catwayNumber`, et catway existant
- Modification de catway: **seulement** `catwayState` est modifiable

## 🌐 Routes principales
### Catways
- `GET /catways`
- `GET /catways/:id`
- `POST /catways`
- `PUT /catways/:id`
- `DELETE /catways/:id`

### Réservations (sous-ressource de catways)
- `GET /catways/:id/reservations`
- `GET /catways/:id/reservations/:idReservation`
- `POST /catways/:id/reservations`
- `PUT /catways/:id/reservations/:idReservation`
- `DELETE /catways/:id/reservations/:idReservation`

> NB: Quelques alias ont été ajoutés pour tolérer les petites incohérences de l'énoncé.

### Utilisateurs
- `GET /users`
- `GET /users/:email`
- `POST /users`
- `PUT /users/:email`
- `DELETE /users/:email`

### Auth
- `POST /login`
- `GET /logout`

## 🧪 Import via mongoimport (optionnel)
Vous pouvez aussi utiliser les fichiers `data/*.json` avec `mongoimport` :

```bash
mongoimport --jsonArray --db port_russell --collection catways --file data/catways.json
mongoimport --jsonArray --db port_russell --collection reservations --file data/reservations.json
```

## 🐳 Docker (optionnel)
### Dockerfile (service web) & docker-compose (avec MongoDB)

```bash
docker compose up --build -d
# App: http://localhost:3000   Mongo: mongodb://mongo:27017/port_russell
```

## ☁️ Déploiement (exemple Render + MongoDB Atlas)
1. Créez un cluster **MongoDB Atlas** → récupérez l'URI
2. Sur **Render**: nouveau *Web Service* depuis votre dépôt
3. Variables d'env: `PORT`, `MONGODB_URI`, `JWT_SECRET`
4. Commande de démarrage: `npm start`

## 📝 Licence
MIT
```
