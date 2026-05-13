# ✅ CHECKLIST DE DÉPLOIEMENT RENDER.COM

## 📦 AVANT DE COMMENCER

### Prérequis
- [ ] Docker Desktop installé (optionnel, pour tester)
- [ ] Git installé
- [ ] Compte GitHub créé
- [ ] Compte Render.com créé (avec connexion GitHub)

---

## 🧪 TESTS LOCAUX

### 1. Vérifier que tout fonctionne en local
- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Connexion au backoffice fonctionne (`admin` / `admin123`)
- [ ] Upload d'images fonctionne
- [ ] Base de données se crée correctement

### 2. Tester le build de production (optionnel)
```bash
# Frontend
cd ClientApp
npm run build -- --configuration production
cd ..

# Backend
dotnet build -c Release Prodjegg.ApiService
```

### 3. Tester le build Docker (optionnel mais recommandé)
```bash
# Méthode 1 : Avec le script
test-docker.bat

# Méthode 2 : Manuellement
docker build -t prodjegg:test .
docker run -p 8080:8080 -e Database__Provider=Sqlite -e Jwt__Key=TestKey1234 prodjegg:test
```

**Vérifications Docker :**
- [ ] Build réussi sans erreur
- [ ] Application accessible sur http://localhost:8080
- [ ] Connexion backoffice fonctionne
- [ ] Images servies correctement

```bash
# Nettoyer après
cleanup-docker.bat
```

---

## 📤 PRÉPARATION GITHUB

### 1. Vérifier les fichiers de déploiement
- [ ] `Dockerfile` existe
- [ ] `render.yaml` existe
- [ ] `.dockerignore` existe
- [ ] `appsettings.Production.json` existe
- [ ] `.gitignore` configuré correctement

### 2. Vérifier qu'aucun secret n'est committé
- [ ] ❌ Pas de mots de passe en clair
- [ ] ❌ Pas de clés JWT en clair (sauf exemple)
- [ ] ❌ Pas de fichiers `appsettings.Development.json`
- [ ] ❌ Pas de fichiers `.db` ou `uploads/`

### 3. Créer le repository GitHub
```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - Ready for Render"

# Créer le repo sur GitHub puis :
git remote add origin https://github.com/VOTRE_USERNAME/prodjegg.git
git branch -M main
git push -u origin main
```

**Vérifications GitHub :**
- [ ] Repository créé
- [ ] Code poussé avec succès
- [ ] Fichiers `Dockerfile` et `render.yaml` visibles
- [ ] Pas de secrets dans le code

---

## 🌐 DÉPLOIEMENT RENDER.COM

### 1. Créer le service

**Dans Render.com :**
- [ ] Connecté avec compte GitHub
- [ ] Cliqué sur **"New +"** → **"Blueprint"**
- [ ] Repository `prodjegg` sélectionné
- [ ] Fichier `render.yaml` détecté automatiquement
- [ ] Cliqué sur **"Apply"**

### 2. Vérifier la configuration automatique

**Services créés :**
- [ ] Web Service `prodjegg` créé
- [ ] Database `prodjegg-db` (PostgreSQL) créée

**Variables d'environnement :**
- [ ] `ASPNETCORE_ENVIRONMENT` = `Production`
- [ ] `Database__Provider` = `Postgres`
- [ ] `ConnectionStrings__DefaultConnection` = *Auto-configuré*
- [ ] `Jwt__Key` = *Généré automatiquement* (64 caractères min)
- [ ] `Jwt__Issuer` = `ProdjeggApi`
- [ ] `Jwt__Audience` = `ProdjeggClient`
- [ ] `ASPNETCORE_URLS` = `http://+:8080`

### 3. Lancer le premier build

**Étapes du build (5-10 minutes) :**
- [ ] Build Frontend Angular (~2-3 min)
- [ ] Build Backend .NET (~1-2 min)
- [ ] Création image Docker (~1-2 min)
- [ ] Déploiement (~1-2 min)
- [ ] Migrations base de données appliquées

**Vérifier les logs pendant le build :**
- [ ] Pas d'erreurs de build Angular
- [ ] Pas d'erreurs de build .NET
- [ ] Pas d'erreurs Docker
- [ ] Health check réussi

---

## ✅ POST-DÉPLOIEMENT

### 1. Vérifier que l'application fonctionne

**Tests de base :**
- [ ] URL Render accessible (`https://votre-app.onrender.com`)
- [ ] Page d'accueil se charge
- [ ] Images s'affichent
- [ ] CSS appliqué correctement

**Tests du backoffice :**
- [ ] URL backoffice accessible (`https://votre-app.onrender.com/admin/login`)
- [ ] Connexion avec `admin` / `admin123` fonctionne
- [ ] Dashboard s'affiche
- [ ] Toutes les sections du menu accessibles

**Tests CRUD :**
- [ ] Édition Hero section fonctionne
- [ ] Upload d'image fonctionne
- [ ] Création d'un service fonctionne
- [ ] Modification d'un portfolio item fonctionne
- [ ] Suppression d'un élément fonctionne

### 2. Sécurité post-déploiement

**IMPORTANT - À faire immédiatement :**
- [ ] ⚠️ Changer le mot de passe admin
- [ ] ⚠️ Vérifier que la clé JWT est sécurisée (64+ caractères)
- [ ] ⚠️ Tester la déconnexion
- [ ] ⚠️ Vérifier que les routes admin sont protégées

### 3. Performance et monitoring

**Dans le Dashboard Render :**
- [ ] Vérifier les métriques (CPU, Memory)
- [ ] Consulter les logs
- [ ] Health check au vert (`/health`)
- [ ] Pas d'erreurs dans les logs

---

## 🔄 DÉPLOIEMENTS FUTURS

### Configuration du déploiement automatique

**Déploiement auto activé par défaut :**
- [ ] Push sur `main` → redéploiement automatique
- [ ] Notifications email configurées

**Pour désactiver (optionnel) :**
- Settings → Auto-Deploy → Off

### Workflow de développement

```bash
# Faire des modifications
git add .
git commit -m "Description des changements"
git push origin main

# Render redéploie automatiquement
```

**Vérifier après chaque déploiement :**
- [ ] Build réussi
- [ ] Application accessible
- [ ] Fonctionnalités testées

---

## 🛠️ DÉPANNAGE

### Le build échoue

**Actions :**
- [ ] Consulter les logs complets dans Render
- [ ] Tester le build Docker localement
- [ ] Vérifier les versions de packages
- [ ] Vérifier que tous les fichiers sont bien dans Git

### Erreur de base de données

**Actions :**
- [ ] Vérifier la variable `ConnectionStrings__DefaultConnection`
- [ ] Consulter les logs de migration
- [ ] Vérifier que PostgreSQL est bien créé
- [ ] Tester la connexion dans les logs

### Images ne s'affichent pas

**Actions :**
- [ ] Vérifier le chemin `/wwwroot/uploads/`
- [ ] Vérifier les permissions de fichiers
- [ ] Re-uploader une image de test
- [ ] Consulter les logs d'upload

### Application lente au premier accès

**Normal sur plan gratuit :**
- [ ] Service s'endort après 15 min
- [ ] Premier accès = réveil (~30-60s)
- [ ] Solution : Plan Starter (7$/mois)

---

## 🎉 FÉLICITATIONS !

### Si tout est coché, votre application est :

- ✅ **En ligne** sur https://votre-app.onrender.com
- ✅ **Sécurisée** avec HTTPS automatique
- ✅ **Fonctionnelle** avec backoffice complet
- ✅ **Prête** pour le monde entier !

---

## 📞 RESSOURCES UTILES

- 📖 [Documentation Render](https://render.com/docs)
- 💬 [Forum Communauté](https://community.render.com)
- 📧 [Support](https://render.com/support)
- 🚀 [Guide complet](./DEPLOYMENT.md)

---

**Date de déploiement :** __/__/____  
**URL de production :** https://_______________.onrender.com  
**Notes :** 

________________________________________
________________________________________
________________________________________
