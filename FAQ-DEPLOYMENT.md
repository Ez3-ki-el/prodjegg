# ❓ FAQ - Déploiement Render.com

## 📦 Questions Générales

### Q: Combien coûte le déploiement sur Render.com ?

**R:** Deux options :
- **Gratuit** : 0$/mois pendant 90 jours, puis 7$/mois pour PostgreSQL uniquement. Service s'endort après 15 min.
- **Starter** : 7$/mois (service toujours actif + PostgreSQL inclus)

### Q: Mon code restera-t-il privé ?

**R:** Oui ! Vous pouvez garder votre repository GitHub privé. Render accède uniquement via OAuth.

### Q: Puis-je déployer ailleurs que Render.com ?

**R:** Absolument ! Le `Dockerfile` fonctionne sur :
- **Azure Container Apps**
- **AWS ECS/Fargate**
- **Google Cloud Run**
- **DigitalOcean App Platform**
- **Heroku**
- N'importe quelle plateforme supportant Docker

---

## 🔧 Questions Techniques

### Q: Pourquoi utiliser Docker plutôt qu'un déploiement direct .NET ?

**R:** Plusieurs avantages :
- ✅ Frontend et Backend dans **une seule image**
- ✅ **Reproductible** (fonctionne partout)
- ✅ **Optimisé** avec multi-stage builds
- ✅ **Portable** entre plateformes
- ✅ Plus **simple** à maintenir

### Q: Qu'est-ce qu'un multi-stage build ?

**R:** Le Dockerfile construit en 3 étapes :
1. **Stage 1** : Build Angular (Node.js)
2. **Stage 2** : Build .NET (SDK)
3. **Stage 3** : Image finale légère (Runtime uniquement)

Résultat : Image finale **beaucoup plus petite** (~200 MB vs 1+ GB)

### Q: Le frontend et le backend sont-ils séparés en production ?

**R:** Non ! En production :
- Frontend Angular est **compilé** et placé dans `/wwwroot/`
- Backend .NET **sert les fichiers statiques**
- **Un seul service** → Plus simple, moins cher

### Q: Comment fonctionne le routing en production ?

**R:** Le backend a une règle `MapFallbackToFile("index.html")` qui :
- Routes `/api/*` → API Controllers
- Toutes les autres routes → `index.html` (Angular routing)

---

## 🗄️ Base de Données

### Q: Dois-je créer la base manuellement ?

**R:** Non ! Le fichier `render.yaml` crée automatiquement :
- Une instance PostgreSQL
- La base de données `prodjeggDB`
- La connexion entre backend et DB

### Q: Les migrations sont-elles automatiques ?

**R:** Oui ! Au démarrage, le backend exécute :
```csharp
db.Database.Migrate(); // Applique les migrations
await DbSeeder.SeedData(db); // Seed les données initiales
```

### Q: Que se passe-t-il si je change mon modèle ?

**R:** En local :
```bash
cd Prodjegg.Data
dotnet ef migrations add NomDeLaMigration --startup-project ../Prodjegg.ApiService
```

Puis push sur GitHub → Render redéploie et applique automatiquement.

### Q: Puis-je accéder directement à PostgreSQL ?

**R:** Oui ! Dans Render Dashboard :
- Allez dans votre database
- Section **"Connect"**
- Utilisez `psql` ou un client GUI (pgAdmin, DBeaver)

---

## 🔐 Sécurité

### Q: La clé JWT est-elle sécurisée ?

**R:** Oui ! Le `render.yaml` spécifie :
```yaml
- key: Jwt__Key
  generateValue: true  # Génère automatiquement une clé aléatoire
```

Render crée une clé **unique de 64+ caractères**.

### Q: Comment changer le mot de passe admin ?

**R:** Deux méthodes :

**Via le backoffice :**
1. Connectez-vous avec `admin` / `admin123`
2. Allez dans Paramètres → Changer mot de passe

**Via l'API :**
```bash
POST /api/auth/change-password
{
  "currentPassword": "admin123",
  "newPassword": "VotreNouveauMDP"
}
```

### Q: HTTPS est-il activé ?

**R:** Oui ! Render fournit **automatiquement** :
- Certificat SSL gratuit (Let's Encrypt)
- Renouvellement automatique
- Force HTTPS

---

## 📸 Upload d'Images

### Q: Où sont stockées les images ?

**R:** Dans `/wwwroot/uploads/` à l'intérieur du conteneur.

⚠️ **Important** : Les fichiers sont **éphémères** sur Render gratuit !

### Q: Les images disparaissent-elles au redéploiement ?

**R:** **Oui** sur Render (conteneur éphémère). Solutions :

**Option 1 : Stockage cloud externe (Recommandé)**
- **Cloudinary** (gratuit 25 GB)
- **AWS S3** / **Azure Blob**
- **Imgur API**

**Option 2 : Volume persistant Render**
- Disponible sur plans payants
- Configure un volume dans `render.yaml`

**Pour le moment** : Les images de seed restent (compilées dans l'image Docker).

### Q: Comment implémenter Cloudinary ?

**R:** Modifier `UploadController.cs` :
```csharp
// Au lieu de sauver localement
var cloudinary = new Cloudinary(config);
var uploadResult = await cloudinary.UploadAsync(uploadParams);
return uploadResult.SecureUrl; // URL permanente
```

---

## 🚀 Déploiement

### Q: Combien de temps prend le premier déploiement ?

**R:** Environ **5-10 minutes** :
- Build Angular : ~2-3 min
- Build .NET : ~1-2 min
- Docker : ~1-2 min
- Déploiement : ~1-2 min

### Q: Les déploiements suivants sont-ils plus rapides ?

**R:** Oui ! Docker utilise le **cache de layers**. Temps réduit à **2-5 minutes**.

### Q: Le site est inaccessible pendant le déploiement ?

**R:** **Sur plan gratuit** : Oui, quelques secondes de downtime.  
**Sur plan Starter** : Non, déploiement **zero-downtime**.

### Q: Comment annuler un déploiement ?

**R:** Dans Render Dashboard :
- Allez dans votre service
- Cliquez sur **"Rollback"**
- Sélectionnez le déploiement précédent

---

## ⚡ Performance

### Q: Pourquoi le premier accès est-il lent ?

**R:** **Sur plan gratuit uniquement** :
- Service s'endort après **15 minutes** d'inactivité
- Premier accès = réveil (~30-60 secondes)
- **Solution** : Plan Starter (7$/mois) → toujours actif

### Q: Comment éviter que le service s'endorme ?

**R:** Trois options :
1. **Plan Starter** (7$/mois) → toujours actif
2. **Cron job externe** → ping `/health` toutes les 14 min
3. **UptimeRobot** (gratuit) → monitor toutes les 5 min

### Q: Le site est-il lent en général ?

**R:** Non ! Avec le plan Starter :
- Temps de réponse API : **< 100 ms**
- Frontend servi depuis CDN : **< 50 ms**
- Base de données : **< 20 ms**

---

## 🛠️ Dépannage

### Q: Le build Docker échoue localement

**R:** Vérifiez :
```bash
# 1. Docker Desktop est-il lancé ?
docker version

# 2. Testez le build
docker build -t test .

# 3. Consultez les logs d'erreur
```

Erreurs courantes :
- **Node modules** : `npm install` dans ClientApp
- **Ports** : Fermez les apps sur port 8080

### Q: Erreur "Cannot connect to database"

**R:** Vérifiez dans Render :
- Database est bien créée
- Variable `ConnectionStrings__DefaultConnection` existe
- Database est dans la **même région** que le service

### Q: Les images ne s'affichent pas

**R:** Causes possibles :
1. Chemin incorrect → Vérifier `/wwwroot/uploads/`
2. Permissions → Vérifier dans Dockerfile
3. Images uploadées avant redéploiement → Utiliser Cloudinary

### Q: Erreur 401 sur toutes les routes admin

**R:** Problème JWT :
1. Vérifier que `Jwt__Key` est configuré
2. Vérifier que le token est bien envoyé dans les headers
3. Effacer le localStorage et se reconnecter

---

## 💡 Optimisations

### Q: Comment réduire la taille de l'image Docker ?

**R:** Déjà optimisé ! Le Dockerfile utilise :
- Multi-stage builds
- Images Alpine (plus petites)
- `.dockerignore` (exclusions)

Taille finale : **~200-250 MB**

### Q: Comment accélérer le build ?

**R:** Le build utilise déjà :
- Cache de layers Docker
- `npm ci` (plus rapide que `npm install`)
- Build de production optimisé

### Q: Comment activer la compression ?

**R:** Ajoutez dans `Program.cs` :
```csharp
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
});
```

---

## 🌐 Domaine Personnalisé

### Q: Puis-je utiliser mon propre domaine ?

**R:** Oui ! Dans Render :
1. Settings → Custom Domains
2. Ajoutez `www.votresite.com`
3. Configurez un CNAME chez votre registrar :
   ```
   CNAME www votre-app.onrender.com
   ```
4. Render génère automatiquement un certificat SSL

### Q: Mon domaine personnalisé est-il gratuit ?

**R:** Oui ! Aucun frais supplémentaire sur Render.

---

## 📊 Monitoring

### Q: Comment voir les logs en production ?

**R:** Dans Render Dashboard :
- Votre service → **Logs**
- Logs en temps réel
- Filtrage par niveau (Info, Warning, Error)

### Q: Comment configurer des alertes ?

**R:** Render peut envoyer des notifications par :
- Email
- Slack
- Webhook

Configuration : Settings → Notifications

### Q: Existe-t-il un dashboard de métriques ?

**R:** Oui ! Render affiche :
- CPU Usage
- Memory Usage
- Request Count
- Response Time
- Bandwidth

---

## 💰 Coûts & Facturation

### Q: Qu'est-ce qui est facturé exactement ?

**R:** 
- **Web Service** : 7$/mois (Starter) ou gratuit
- **PostgreSQL** : 7$/mois (après 90 jours gratuits)
- **Bandwidth** : Illimité sur tous les plans
- **Domaine personnalisé** : Gratuit
- **SSL** : Gratuit

### Q: Puis-je changer de plan plus tard ?

**R:** Oui ! Upgrade/Downgrade à tout moment dans Settings.

### Q: Y a-t-il des frais cachés ?

**R:** Non ! Tarification transparente. Seuls coûts possibles :
- Stockage externe (Cloudinary, S3, etc.)
- Services tiers (SendGrid, Twilio, etc.)

---

## 🔄 CI/CD

### Q: Le déploiement automatique est-il activé par défaut ?

**R:** Oui ! Chaque push sur `main` → redéploiement automatique.

### Q: Puis-je désactiver l'auto-deploy ?

**R:** Oui ! Settings → Auto-Deploy → **Off**

### Q: Puis-je déployer depuis une autre branche ?

**R:** Oui ! Settings → Branch → Changez de `main` vers votre branche.

### Q: Comment tester avant de déployer ?

**R:** Deux approches :
1. **Localement** : `test-docker.bat`
2. **Preview Deployments** : Créez une Pull Request → Render crée un environnement temporaire

---

## 📞 Support

### Q: Où obtenir de l'aide ?

**R:** Plusieurs ressources :
- 📖 [Documentation Render](https://render.com/docs)
- 💬 [Forum Communauté](https://community.render.com)
- 📧 Support email (plans payants)
- 🐛 [GitHub Issues](https://github.com/VOTRE_REPO/issues)

### Q: Le support est-il gratuit ?

**R:** 
- **Plan gratuit** : Forum communauté uniquement
- **Plan Starter** : Email support inclus
- **Plans supérieurs** : Support prioritaire

---

## 📚 Ressources Supplémentaires

- [Guide complet](./DEPLOYMENT.md)
- [Guide rapide](./RENDER-QUICKSTART.md)
- [Checklist](./DEPLOYMENT-CHECKLIST.md)
- [Commandes](./COMMANDS-CHEATSHEET.md)

---

**Dernière mise à jour :** $(date)  
**Version :** 1.0.0

Une question non listée ? Ouvrez une [issue GitHub](https://github.com/VOTRE_USERNAME/prodjegg/issues) !
