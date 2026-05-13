# 🚀 Guide de Déploiement sur Render.com

## 📋 Prérequis

- ✅ Compte GitHub (gratuit)
- ✅ Compte Render.com (gratuit)
- ✅ Git installé localement

---

## 🔧 Étape 1 : Préparer le repository GitHub

### 1.1 Initialiser Git (si ce n'est pas déjà fait)

```bash
git init
git add .
git commit -m "Initial commit - Ready for Render deployment"
```

### 1.2 Créer un repository sur GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur **"New repository"**
3. Nom : `prodjegg` (ou le nom de votre choix)
4. **Laissez PRIVÉ** si vous voulez garder le code confidentiel
5. **Ne cochez PAS** "Initialize with README"
6. Cliquez sur **"Create repository"**

### 1.3 Pousser le code vers GitHub

```bash
git remote add origin https://github.com/VOTRE_USERNAME/prodjegg.git
git branch -M main
git push -u origin main
```

---

## 🌐 Étape 2 : Déployer sur Render.com

### 2.1 Créer un compte Render.com

1. Allez sur [render.com](https://render.com)
2. Cliquez sur **"Get Started"**
3. Connectez-vous avec votre compte **GitHub**

### 2.2 Connecter le repository

1. Dans le Dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"Blueprint"**
3. Connectez votre repository GitHub **`prodjegg`**
4. Render va détecter automatiquement le fichier `render.yaml`
5. Cliquez sur **"Apply"**

### 2.3 Configuration automatique

Render va créer automatiquement :
- ✅ Un **Web Service** (backend + frontend)
- ✅ Une **Base de données PostgreSQL**
- ✅ Les **variables d'environnement** sécurisées

---

## ⚙️ Étape 3 : Configurer les variables d'environnement

### 3.1 Accéder aux paramètres

1. Dans le Dashboard, cliquez sur votre service **"prodjegg"**
2. Allez dans **"Environment"**

### 3.2 Vérifier les variables

Render devrait avoir configuré automatiquement :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `ASPNETCORE_ENVIRONMENT` | `Production` | Mode production |
| `Database__Provider` | `Postgres` | Type de base de données |
| `ConnectionStrings__DefaultConnection` | *Auto* | Connection string PostgreSQL |
| `Jwt__Key` | *Généré* | Clé JWT sécurisée |
| `Jwt__Issuer` | `ProdjeggApi` | Issuer JWT |
| `Jwt__Audience` | `ProdjeggClient` | Audience JWT |
| `ASPNETCORE_URLS` | `http://+:8080` | Port d'écoute |

⚠️ **Important :** Si `Jwt__Key` n'est pas généré automatiquement, créez-en un :
```bash
# Générer une clé aléatoire de 64 caractères
openssl rand -base64 48
```

---

## 🚀 Étape 4 : Premier déploiement

### 4.1 Lancer le build

1. Render commence automatiquement le build
2. Cela prend **5-10 minutes** la première fois
3. Vous pouvez suivre les logs en direct dans l'interface

### 4.2 Étapes du build

Le build va :
1. ✅ Builder le frontend Angular (`npm run build`)
2. ✅ Builder le backend .NET 8 (`dotnet publish`)
3. ✅ Créer l'image Docker
4. ✅ Déployer l'application
5. ✅ Appliquer les migrations de base de données

### 4.3 Vérifier le déploiement

Une fois terminé, Render vous donnera une URL :
```
https://prodjegg.onrender.com
```

---

## 🔐 Étape 5 : Premier accès

### 5.1 Accéder au site

Ouvrez votre URL Render : `https://votre-app.onrender.com`

### 5.2 Se connecter au backoffice

URL : `https://votre-app.onrender.com/admin/login`

**Identifiants par défaut :**
- Username : `admin`
- Password : `admin123`

⚠️ **IMPORTANT :** Changez immédiatement le mot de passe admin !

---

## 📊 Étape 6 : Surveiller l'application

### 6.1 Logs

- Dans le Dashboard Render, cliquez sur **"Logs"**
- Vous verrez les logs en temps réel

### 6.2 Métriques

- **CPU Usage**
- **Memory Usage**
- **Request Count**
- **Response Time**

### 6.3 Health Check

Render vérifie automatiquement `/health` toutes les 30 secondes.

---

## 🔄 Étape 7 : Déploiements futurs

### 7.1 Déploiement automatique

Chaque fois que vous poussez sur `main`, Render redéploie automatiquement :

```bash
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin main
```

### 7.2 Déploiement manuel

Dans le Dashboard :
1. Cliquez sur **"Manual Deploy"**
2. Sélectionnez **"Deploy latest commit"**

---

## 💰 Plans et Coûts

### Plan Gratuit (0$/mois)
- ✅ 750 heures/mois (service web)
- ✅ PostgreSQL 1 GB (90 jours gratuits, puis 7$/mois)
- ⚠️ Service s'endort après 15 min d'inactivité
- ⚠️ Redémarrage lent (~30-60 secondes)

### Plan Starter (7$/mois)
- ✅ Service toujours actif
- ✅ PostgreSQL inclus
- ✅ Pas de temps d'arrêt
- ✅ Support email

---

## 🛠️ Dépannage

### Problème : Le build échoue

**Solutions :**
1. Vérifiez les logs dans Render
2. Testez le build localement :
   ```bash
   docker build -t prodjegg .
   docker run -p 8080:8080 prodjegg
   ```

### Problème : Erreur de base de données

**Solutions :**
1. Vérifiez que la variable `ConnectionStrings__DefaultConnection` est bien configurée
2. Regardez les logs pour voir les erreurs de migration

### Problème : Le site est lent au premier accès

**Normal sur le plan gratuit :**
- Le service s'endort après 15 min d'inactivité
- Premier accès = réveil du service (~30-60s)
- Solution : Passer au plan Starter (7$/mois)

---

## 🔒 Sécurité en Production

### Checklist de sécurité :

- [ ] ✅ Changer le mot de passe admin
- [ ] ✅ Utiliser une clé JWT forte (générée automatiquement)
- [ ] ✅ Ne JAMAIS commiter les secrets dans Git
- [ ] ✅ Activer HTTPS (activé par défaut sur Render)
- [ ] ✅ Configurer un domaine personnalisé (optionnel)

---

## 🌍 Domaine personnalisé (Optionnel)

### Ajouter votre propre domaine

1. Dans Render, allez dans **"Settings"** > **"Custom Domains"**
2. Ajoutez votre domaine : `www.votresite.com`
3. Configurez les DNS chez votre registrar :
   ```
   CNAME www votreapp.onrender.com
   ```
4. Render génère automatiquement un certificat SSL

---

## 📞 Support

### Ressources utiles :

- 📖 [Documentation Render](https://render.com/docs)
- 💬 [Forum Communauté](https://community.render.com)
- 📧 Support email (plan Starter)

---

## ✅ Checklist finale

Avant de mettre en ligne :

- [ ] ✅ Code poussé sur GitHub
- [ ] ✅ Service créé sur Render
- [ ] ✅ Variables d'environnement configurées
- [ ] ✅ Build réussi
- [ ] ✅ Base de données connectée
- [ ] ✅ Migrations appliquées
- [ ] ✅ Site accessible
- [ ] ✅ Connexion admin fonctionne
- [ ] ✅ Mot de passe admin changé
- [ ] ✅ Upload d'images testé

---

## 🎉 Félicitations !

Votre application est maintenant **en ligne et accessible au monde entier** ! 🚀

URL de votre site : `https://votre-app.onrender.com`
