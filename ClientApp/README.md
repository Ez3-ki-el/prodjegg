# 🎬 Prodjegg - Portfolio Dynamique avec Angular et .NET 8

Application complète de portfolio dynamique avec backoffice d'administration.

## ✅ Ce qui a été créé

### **Backend (.NET 8 + PostgreSQL)**
- ✅ API REST complète avec 10 contrôleurs
- ✅ Authentification JWT
- ✅ Upload d'images
- ✅ Entity Framework Core avec PostgreSQL
- ✅ Migrations automatiques
- ✅ Seed data avec contenu initial

### **Frontend (Angular 17)**
- ✅ Page publique dynamique (reproduction de ton HTML)
- ✅ Backoffice avec login sécurisé
- ✅ Dashboard admin
- ✅ Services TypeScript pour toutes les API
- ✅ Guards et interceptors pour l'authentification
- ✅ Proxy configuré pour le développement

---

## 🚀 Installation et démarrage

### 1. Prérequis
- .NET 8 SDK
- Node.js (v18+)
- Docker Desktop (pour PostgreSQL)

### 2. Installation du Frontend Angular

```bash
# Aller dans le dossier ClientApp
cd ClientApp

# Installer les dépendances npm
npm install
```

### 3. Copier les assets CSS/JS/Images

**Copiez les fichiers suivants depuis `Prodjegg.ApiService/wwwroot/` vers `ClientApp/src/assets/` :**

```
Prodjegg.ApiService/wwwroot/assets/css/styles.css    → ClientApp/src/assets/css/styles.css
Prodjegg.ApiService/wwwroot/assets/js/script.js      → ClientApp/src/assets/js/script.js
Prodjegg.ApiService/wwwroot/assets/images/           → ClientApp/src/assets/images/
```

**Commande PowerShell pour copier automatiquement :**

```powershell
# Depuis la racine de la solution
xcopy "Prodjegg.ApiService\wwwroot\assets" "ClientApp\src\assets" /E /I /Y
```

### 4. Démarrer le Backend

```bash
# Depuis la racine de la solution
dotnet run --project Prodjegg.AppHost
```

Cela va :
- ✅ Démarrer PostgreSQL dans Docker
- ✅ Appliquer les migrations
- ✅ Seed les données initiales
- ✅ Démarrer l'API sur `https://localhost:XXXX`

### 5. Démarrer le Frontend Angular

```bash
# Dans un autre terminal, depuis ClientApp
npm start
```

L'application sera disponible sur : **http://localhost:4200**

---

## 🔑 Connexion Admin

Une fois l'application lancée :

1. Allez sur http://localhost:4200/admin/login
2. Utilisez les credentials par défaut :
   - **Username:** `admin`
   - **Password:** `admin123`

---

## 📁 Structure du projet

```
Prodjegg/
├── Prodjegg.AppHost/              # Orchestration Aspire
├── Prodjegg.ApiService/           # API Backend .NET 8
│   ├── Controllers/               # Contrôleurs API
│   ├── DTOs/                      # Data Transfer Objects
│   ├── Services/                  # Services métier
│   ├── Data/                      # DbSeeder
│   └── wwwroot/                   # Assets statiques + uploads
├── Prodjegg.Data/                 # Modèles et DbContext
│   ├── Models/                    # Entités EF Core
│   ├── Db/                        # AppDb context
│   └── Migrations/                # Migrations EF
└── ClientApp/                     # Frontend Angular
    ├── src/
    │   ├── app/
    │   │   ├── models/            # Models TypeScript
    │   │   ├── services/          # Services API
    │   │   ├── guards/            # Route guards
    │   │   ├── interceptors/      # HTTP interceptors
    │   │   ├── public/            # Pages publiques
    │   │   │   └── home/          # Page d'accueil
    │   │   └── admin/             # Backoffice
    │   │       ├── login/         # Page login
    │   │       ├── dashboard/     # Dashboard admin
    │   │       └── admin-layout/  # Layout admin
    │   └── assets/                # CSS, JS, images
    └── package.json
```

---

## 📊 Fonctionnalités

### Page Publique
- ✅ Hero section dynamique avec nom, titre, description, photo
- ✅ About section avec 3 paragraphes éditables
- ✅ Services cards (icônes + descriptions)
- ✅ Portfolio filtrable par catégorie
- ✅ Testimonials clients avec notes
- ✅ Stats animées
- ✅ Skills avec barres de progression
- ✅ Call-to-action avec email/téléphone
- ✅ Réseaux sociaux dynamiques

### Backoffice Admin
- ✅ Login sécurisé avec JWT
- ✅ Dashboard avec statistiques
- ✅ Interface pour éditer toutes les sections
- ✅ Upload d'images
- ✅ Gestion CRUD complète

---

## 🛠️ Développement

### Modifier le contenu

Toutes les données sont dans PostgreSQL. Pour modifier :

1. Connectez-vous au backoffice : http://localhost:4200/admin/login
2. Utilisez l'interface pour modifier chaque section
3. Les changements sont instantanés sur la page publique

### Tester l'API avec Swagger

Une fois le backend lancé :
- Ouvrez le dashboard Aspire
- Cliquez sur l'endpoint Swagger de `apiservice`
- URL : `https://localhost:XXXX/swagger`

### Ajouter de nouvelles sections

1. Créez le modèle dans `Prodjegg.Data/Models/`
2. Ajoutez-le au `AppDb.cs`
3. Créez la migration : `dotnet ef migrations add NomMigration`
4. Créez le contrôleur dans `Prodjegg.ApiService/Controllers/`
5. Créez le service Angular dans `ClientApp/src/app/services/`
6. Ajoutez le composant admin correspondant

---

## 📝 API Endpoints

### Publics (sans authentification)
```
GET /api/hero
GET /api/about
GET /api/services
GET /api/portfolio?category=VIDEO%20EDITING
GET /api/testimonials
GET /api/stats
GET /api/skills
GET /api/cta
```

### Authentification
```
POST /api/auth/login
POST /api/auth/register
```

### Admin (nécessite Bearer token)
```
PUT /api/hero
PUT /api/about
POST/PUT/DELETE /api/services/{id}
POST/PUT/DELETE /api/portfolio/{id}
POST/PUT/DELETE /api/testimonials/{id}
POST/PUT/DELETE /api/stats/{id}
POST/PUT/DELETE /api/skills/{id}
PUT /api/cta

POST /api/upload/image?folder=portfolio
DELETE /api/upload/image?path=/uploads/...
```

---

## 🎨 Personnalisation

### Changer les couleurs
Modifiez `ClientApp/src/assets/css/styles.css`

### Changer le logo
Remplacez `ClientApp/src/assets/images/prodjegg-BAVqhQUU.png`

### Modifier les credentials admin
Dans `Prodjegg.ApiService/Data/DbSeeder.cs`, changez :
```csharp
Username = "admin",
Password = "admin123"  // ← Changez ici
```

---

## 🚀 Déploiement en production

### Backend
```bash
dotnet publish Prodjegg.ApiService -c Release
```

### Frontend
```bash
cd ClientApp
npm run build
```

Les fichiers buildés seront dans `ClientApp/dist/`

---

## 🔒 Sécurité

⚠️ **Important pour la production :**

1. Changez la clé JWT dans `appsettings.json`
2. Utilisez BCrypt au lieu de SHA256 pour les passwords
3. Activez HTTPS
4. Configurez CORS correctement
5. Utilisez des variables d'environnement pour les secrets

---

## 📞 Support

Pour toute question sur l'architecture ou les modifications :
- Consultez le code commenté
- Vérifiez les logs dans le dashboard Aspire
- Testez les endpoints avec Swagger

---

## ✅ Prochaines étapes recommandées

1. **Copiez les assets** de wwwroot vers ClientApp/src/assets
2. **Lancez le backend** : `dotnet run --project Prodjegg.AppHost`
3. **Installez npm** : `cd ClientApp && npm install`
4. **Lancez Angular** : `npm start`
5. **Connectez-vous** au backoffice : http://localhost:4200/admin/login
6. **Personnalisez** le contenu depuis l'admin

---

**🎬 Votre portfolio dynamique est prêt ! Bon développement !**
