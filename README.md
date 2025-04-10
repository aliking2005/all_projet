# Fullstack Project

![CI/CD](https://github.com/votre-utilisateur/votre-repo/workflows/CI/CD/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table des matières
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Contributions](#-contributions)

## 🏗️ Structure du projet
.
├── backend/
│ ├── src/
│ ├── tests/
│ ├── Dockerfile
│ └── package.json
├── frontend/
│ ├── public/
│ ├── src/
│ ├── Dockerfile
│ └── package.json
├── .github/
│ └── workflows/
│ └── ci.yml
├── docker-compose.yml
└── README.md

Copy

##  Installation

### Prérequis
- Docker 20.10+
- Node.js 18+
- npm 9+

```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/votre-repo.git
cd votre-repo
 Configuration
Backend
Créez .env dans backend/ :

env
Copy
PORT=5000
DB_PATH=./db/database.sqlite
JWT_SECRET=votre_secret_jwt
Utilisation
Développement
bash
Copy
# Backend
cd backend
npm install
npm run dev

# Frontend (nouveau terminal)
cd frontend
npm install
npm start
Production
bash
Copy
docker-compose up --build